import { Collection } from 'mongodb'
import { AddressModel } from '../../../../domain/models/address'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddressMongoRepository } from './address-mongo-repository'

let accountCollection: Collection

const makeSut = (): AddressMongoRepository => {
  return new AddressMongoRepository()
}

const makeFakeAddress = ():AddressModel => ({
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

const makeFakeAccount = () => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

describe('address mongo repository', () => {
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
  test('should throw on account not found', async () => {
    const sut = makeSut()
    const promise = sut.add(makeFakeAddress(), '618822b3994c80366c7c2856')
    expect(promise).rejects.toThrowError('failed on update user address: 618822b3994c80366c7c2856')
  })
  test('should return an account on success', async () => {
    const id = (await accountCollection.insertOne(makeFakeAccount())).insertedId.toString()
    const sut = makeSut()
    const account = await sut.add(makeFakeAddress(), id)
    expect(account).toEqual({ ...makeFakeAccount(), id: id.toString(), addresses: [makeFakeAddress()] })
  })

  test('should return undefined on list if account.addresses is undefined', async () => {
    const id = (await accountCollection.insertOne(makeFakeAccount())).insertedId.toString()
    const sut = makeSut()
    const addresses = await sut.list(id)
    expect(addresses).toEqual([])
  })

  test('should return an account on list success', async () => {
    const id = (await accountCollection.insertOne(makeFakeAccount())).insertedId.toString()
    const sut = makeSut()
    await sut.add(makeFakeAddress(), id)
    const addresses = await sut.list(id)
    expect(addresses).toEqual([makeFakeAddress()])
  })

  test('should return an account on list success with query', async () => {
    const id = (await accountCollection.insertOne(makeFakeAccount())).insertedId.toString()
    const sut = makeSut()
    const anotherAddress = makeFakeAddress()
    anotherAddress.name = 'other_name'
    await sut.add(makeFakeAddress(), id)
    await sut.add(anotherAddress, id)

    const addresses = await sut.list(id, { name: 'any_name' })
    expect(addresses).toEqual([makeFakeAddress()])
  })

  test('should delete address by name', async () => {
    const id = (await accountCollection.insertOne(makeFakeAccount())).insertedId.toString()
    const sut = makeSut()

    await sut.add(makeFakeAddress(), id)

    await sut.deleteByName(id, 'any_name')
    const addresses = await sut.list(id)
    expect(addresses).toEqual([])
  })

  test('should return an account on updateByname success with query', async () => {
    const id = (await accountCollection.insertOne(makeFakeAccount())).insertedId.toString()
    const sut = makeSut()
    const anotherAddress = makeFakeAddress()
    anotherAddress.name = 'other_name'
    await sut.add(makeFakeAddress(), id)
    await sut.add(anotherAddress, id)

    const address = await sut.updateByName(id, 'any_name', { name: 'other_name' })
    expect(address.name).toEqual('other_name')
  })
})
