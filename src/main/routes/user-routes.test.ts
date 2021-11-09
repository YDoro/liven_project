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

  describe('update user', () => {
    test('Should return status 200 on update user', async () => {
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
      const response = await request(app).patch('/api/user').set('x-access-token', token.body.accessToken).send({
        name: 'yan doro'
      })
      expect(response.status).toBe(200)
    })
    test('Should return status 403 on unauthenticated update user', async () => {
      const response = await request(app).patch('/api/user').set('x-access-token', 'any_invalid_token').send({
        name: 'yan doro'
      })
      expect(response.status).toBe(403)
    })
    test('Should return status 304 on void update user', async () => {
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
      const response = await request(app).patch('/api/user').set('x-access-token', token.body.accessToken).send({
        name: 'yan'
      })
      expect(response.status).toBe(304)
    })
  })

  describe('delete user', () => {
    test('Should return status 200 on delete user', async () => {
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })

      const response = await request(app).delete('/api/user').send({ password: 'some_password' }).set('x-access-token', token.body.accessToken)
      expect(response.status).toBe(200)
    })

    test('Should return status 401 on delete user but wrong pass', async () => {
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })

      const response = await request(app).delete('/api/user').send({ password: 'wrong_password' }).set('x-access-token', token.body.accessToken)
      expect(response.status).toBe(401)
    })

    test('Should return status 403 on unauthenticated update user', async () => {
      const response = await request(app).delete('/api/user').send({ password: 'any_password' }).set('x-access-token', 'any_invalid_token')
      expect(response.status).toBe(403)
    })

    test('Should return status 400 on void update user without pass', async () => {
      const token = await request(app).post('/api/user')
        .send({
          name: 'yan',
          password: 'some_password',
          passwordConfirm: 'some_password',
          email: 'some_email@mail.com'
        })
      const response = await request(app).delete('/api/user').set('x-access-token', token.body.accessToken)
      expect(response.status).toBe(400)
    })
  })
})
