import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection
describe('Login Routes', () => {
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
  describe('POST /signup', () => {
    test('Should return status 201 on signup', async () => {
      await request(app).post('/api/signup')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
        .expect(201)
    })
  })
})
