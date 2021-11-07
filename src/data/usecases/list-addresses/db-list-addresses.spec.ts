import { AddressModel } from '../../../domain/models/address'
import { ListAddressesRepository } from '../../protocols/db/address/list-addresses-repository'
import { DbListAddresses } from './db-list-addresses'
interface SutTypes{
    sut: DbListAddresses,
    listAddressesRepositoryStub: ListAddressesRepository
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

const makeListAddresRepository = ():ListAddressesRepository => {
  class ListAddressesRepositoryStub implements ListAddressesRepository {
    list (accountId: string): Promise<AddressModel[]> {
      return new Promise(resolve => resolve([makeFakeAddress()]))
    }
  }
  return new ListAddressesRepositoryStub()
}

const makeSUT = ():SutTypes => {
  const listAddressesRepositoryStub = makeListAddresRepository()
  const sut = new DbListAddresses(listAddressesRepositoryStub)
  return { listAddressesRepositoryStub, sut }
}
describe('db list addresses', () => {
  test('should call ListAddressesRepository with the right values', async () => {
    const { sut, listAddressesRepositoryStub } = makeSUT()
    const listSpy = jest.spyOn(listAddressesRepositoryStub, 'list')
    await sut.list('any_account_id')
    expect(listSpy).toHaveBeenCalledWith('any_account_id')
  })
  test('should return an array on success', async () => {
    const { sut } = makeSUT()
    const addresses = await sut.list('any_account_id')
    expect(addresses).toBeInstanceOf(Array)
    expect(addresses[0]).toBeDefined()
    expect(addresses[0].name).toEqual('any_name')
  })
})
