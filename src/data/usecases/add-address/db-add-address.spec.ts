import { AccountModel } from '../../../domain/models/account'
import { AddressModel } from '../../../domain/models/address'
import { AddAddressRepository } from '../../protocols/db/address/add-address-repository'
import { DbAddAddress } from './db-add-address'
interface SutTypes {
    sut:DbAddAddress,
    addAddressRepositoryStub:AddAddressRepository
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
  postalcode: '12345678',
  main: true
})
const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
  addresses: [makeFakeAddress()]
})
const makeAddAddressRepository = ():AddAddressRepository => {
  class AddAddressRepositoryStub implements AddAddressRepository {
    async add (accountData: AddressModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAddressRepositoryStub()
}

const makeSUT = ():SutTypes => {
  const addAddressRepositoryStub = makeAddAddressRepository()
  const sut = new DbAddAddress(addAddressRepositoryStub)
  return { addAddressRepositoryStub, sut }
}

describe('db add address', () => {
  test('should call addAddressRepository with right params', async () => {
    const { addAddressRepositoryStub, sut } = makeSUT()
    const addSpy = jest.spyOn(addAddressRepositoryStub, 'add')
    sut.add(makeFakeAddress(), 'any_id')
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddress(), 'any_id')
  })
})
