import { ListAddressesRepository } from '../../data/protocols/db/address/list-addresses-repository'
import { AddressModel } from '../../domain/models/address'
import { UniqueParamError } from '../../presentation/errors/unique-param-error'
import { UniqueAddressNameValidation } from './unique-address-name-validation'
interface SutTypes{
    sut:UniqueAddressNameValidation,
    listAddressesRepositoryStub:ListAddressesRepository
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

const makeFakeRequest = () => ({
  ...makeFakeAddress(),
  middleware: {
    accountId: 'any_account_id'
  }
})

const makeListAddressRepository = ():ListAddressesRepository => {
  class ListAddressesRepositoryStub implements ListAddressesRepository {
    async list (accountId: string): Promise<AddressModel[]> {
      return new Promise(resolve => resolve([makeFakeAddress()]))
    }
  }
  return new ListAddressesRepositoryStub()
}
const makeSUT = ():SutTypes => {
  const listAddressesRepositoryStub = makeListAddressRepository()
  const sut = new UniqueAddressNameValidation(listAddressesRepositoryStub)
  return { listAddressesRepositoryStub, sut }
}
describe('unique address name validation ', () => {
  test('should return an uniqueParamError if address found values', async () => {
    const { sut } = makeSUT()
    const error = await sut.validate(makeFakeRequest())
    expect(error).toBeInstanceOf(UniqueParamError)
  })
  test('should return nothing if address not returned', async () => {
    const { sut, listAddressesRepositoryStub } = makeSUT()
    jest.spyOn(listAddressesRepositoryStub, 'list').mockResolvedValueOnce(undefined)
    const error = await sut.validate(makeFakeRequest())
    expect(error).toBeUndefined()
  })
  test('should return nothing if other addresses returned', async () => {
    const { sut, listAddressesRepositoryStub } = makeSUT()
    jest.spyOn(listAddressesRepositoryStub, 'list').mockResolvedValueOnce([{ ...makeFakeAddress(), name: 'other_name' }])
    const error = await sut.validate(makeFakeRequest())
    expect(error).toBeUndefined()
  })
})
