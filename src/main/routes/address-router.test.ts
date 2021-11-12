import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { AccountMongoRepository } from '../../infra/db/mongodb/account/account-mongo-repository'

let accountCollection: Collection

const makeAccount = async ():Promise<any> => {
  return await request(app).post('/api/user')
    .send({
      name: 'yan',
      password: 'some_password',
      passwordConfirm: 'some_password',
      email: 'some_email@mail.com'
    })
}
const makeFakeAddress = () => ({
  name: 'any_name',
  street: 'any_street',
  number: 'any_number',
  complement: 'any_complement',
  landmark: 'any_landmark',
  city: 'any_city',
  state: 'any_state',
  country: 'any_country',
  neigborhood: 'any_neighborhood',
  postalcode: '12345678'
})
describe('address Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    await accountCollection.deleteMany({})
  })
  describe('POST /address', () => {
    test('Should return status 201 on address', async () => {
      // register
      const token = await makeAccount()
      // add address
      const response = await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())
      expect(response.statusCode).toBe(201)
    })

    test('Should return status 400 on address with duplicated address', async () => {
      // register
      const token = await makeAccount()
      // add address
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())
      // try to add the same address
      const response = await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())
      expect(response.statusCode).toBe(400)
    })
  })
  describe('GET /address/', () => {
    test('Should return status 200 on list all addresses', async () => {
      // register
      const token = await makeAccount()

      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())

      const response = await request(app).get('/api/address').set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(200)
    })

    test('Should return only one address', async () => {
      // register
      const token = await makeAccount()
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send({ ...makeFakeAddress(), name: 'other_name' })

      const response = await request(app).get('/api/address?name=other_name').set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(1)
    })
    test('Should return only two address', async () => {
      // register
      const token = await makeAccount()

      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send({ ...makeFakeAddress(), name: 'other_name' })

      const response = await request(app).get('/api/address/postalcode/' + (makeFakeAddress().postalcode)).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(2)
    })
  })

  describe('DELETE /address/', () => {
    test('Should return status 200 delete addresses', async () => {
      // register
      const token = await makeAccount()

      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())

      const response = await request(app).delete('/api/address').send({ name: 'any_name' }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(200)
    })

    test('Should return status 400 delete addresses', async () => {
      // register
      const token = await makeAccount()

      const response = await request(app).delete('/api/address').send({ otherField: 'any_name' }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(400)
    })

    test('Should return status 304 delete addresses', async () => {
      // register
      const token = await makeAccount()

      const response = await request(app).delete('/api/address').send({ name: 'any_name' }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(304)
    })
  })

  describe('PATCH /address/', () => {
    test('Should return status 200 update addresses', async () => {
      // register
      const token = await makeAccount()

      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())

      const response = await request(app).patch('/api/address').send({ name: 'any_name', update: { name: 'other_name' } }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(200)
    })

    test('Should return status 400 update addresses', async () => {
      // register
      const token = await makeAccount()

      const response = await request(app).patch('/api/address').send({ update: { name: 'other_name' } }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(400)
    })

    test('Should return status 400 update addresses with name already found in database', async () => {
      // register
      const token = await makeAccount()
      // add address
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())

      const response = await request(app).patch('/api/address').send({ name: 'any_name', update: { name: 'any_name' } }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        error: 'Unique param Error: name , any_name'
      })
    })

    test('Should return status 400 update addresses with invalid param format', async () => {
      // register
      const token = await makeAccount()
      // add address
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())

      const response = await request(app).patch('/api/address').send({ name: 'any_name', update: { postalcode: 'wrong_postal_code' } }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        error: 'Invalid param: update.postalcode'
      })
    })

    test('Should return status 400 update addresses with required field empty', async () => {
      // register
      const token = await makeAccount()
      // add address
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken).send(makeFakeAddress())

      const response = await request(app).patch('/api/address').send({ name: 'any_name', update: { name: '' } }).set('x-access-token', token.body.accessToken)

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing param: update.name'
      })
    })
  })
})
