import { ObjectID } from 'bson'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('account mongo repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return null loadByEmail fails', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })
    expect(fakeAccount.accessToken).toBeFalsy()

    await sut.updateAccessToken(fakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({ _id: fakeAccount._id })

    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })

  test('should return an account on loadByToken success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne(
      {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })

    const account = await sut.loadByToken('any_token')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return null loadByToken fails', async () => {
    const sut = makeSut()

    const account = await sut.loadByToken('any_token')
    expect(account).toBeFalsy()
  })

  test('should update the account data on update success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const updateResponse = await sut.update({ name: 'other_name' }, res.insertedId.toString())

    const account = await accountCollection.findOne({ _id: res.insertedId })

    expect(account).toBeTruthy()
    expect(account.name).toEqual('other_name')
    expect(updateResponse).toBe(true)
  })

  test('should not update the account data on void update', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const updateResponse = await sut.update({}, res.insertedId.toString())
    const account = await accountCollection.findOne({ _id: res.insertedId })

    expect(account).toBeTruthy()
    expect(updateResponse).toBe(false)
  })

  test('should delete account by id', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const deleted = await sut.deleteById(res.insertedId.toString())
    const account = await accountCollection.findOne({ _id: res.insertedId })

    expect(account).toBeFalsy()
    expect(deleted).toBe(true)
  })

  test('should delete account by id', async () => {
    const sut = makeSut()
    const deleted = await sut.deleteById('618a8eb78fb75a72e87cf091')
    const account = await accountCollection.findOne({ _id: new ObjectID('618a8eb78fb75a72e87cf091') })

    expect(account).toBeFalsy()
    expect(deleted).toBe(true)
  })
})
