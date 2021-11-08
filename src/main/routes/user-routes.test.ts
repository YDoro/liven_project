import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection
describe('user Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('get user', () => {
    test('Should return status 200 on get User', async () => {
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
      const response = await request(app).get('/api/user').set('x-access-token', token.body.accessToken)
      expect(response.status).toBe(200)
    })
    test('Should return status 403 on get User', async () => {
      const response = await request(app).get('/api/user').set('x-access-token', 'any_invalid_token')
      expect(response.status).toBe(403)
    })
  })
})
