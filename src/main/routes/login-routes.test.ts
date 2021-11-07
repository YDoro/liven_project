import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

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
  describe('POST /user', () => {
    test('Should return status 201 on user', async () => {
      await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
        .expect(201)
    })
  })
  describe('POST user/login', () => {
    test('Should return status 200 on login', async () => {
      const password = await hash('some_password', 12)
      await accountCollection.insertOne({
        name: 'yan',
        password,
        passwordConfirm: 'some_password',
        email: 'some_email@mail.com'
      })
      await request(app).post('/api/user/login')
        .send({
          email: 'some_email@mail.com',
          password: 'some_password'
        })
        .expect(200)
    })
    test('Should return status 401  on login', async () => {
      await request(app).post('/api/user/login')
        .send({
          email: 'some_email@mail.com',
          password: 'wrong_password'
        })
        .expect(401)
    })
  })
})
