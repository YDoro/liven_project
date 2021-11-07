import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
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
    const promise = sut.add(makeFakeAddress(), 'any_id')
    expect(promise).rejects.toThrowError('failed on update user address: any_id')
  })
})
