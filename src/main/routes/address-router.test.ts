import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { AccountMongoRepository } from '../../infra/db/mongodb/account/account-mongo-repository'

let accountCollection: Collection
describe('Login Routes', () => {
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
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
        .expect(201)
        // add address
      const response = await request(app).post('/api/address').set('x-access-token', token.body.accessToken)
        .send({
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
      expect(response.statusCode).toBe(201)
    })

    test('Should return status 400 on address with duplicated address', async () => {
      // register
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
        .expect(201)
        // add address
      await request(app).post('/api/address').set('x-access-token', token.body.accessToken)
        .send({
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
        // try to add the same address
      const response = await request(app).post('/api/address').set('x-access-token', token.body.accessToken)
        .send({
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
      expect(response.statusCode).toBe(400)
    })
  })
})
