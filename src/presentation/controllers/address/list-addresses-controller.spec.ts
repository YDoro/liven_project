import { AddressModel } from '../../../domain/models/address'
import { ListAddresses } from '../../../domain/usecases/list-addresses'
import { ListAddressesController } from './list-addresses-controller'
import { HttpRequest } from '../protocols/http'
interface SutTypes{
    sut:ListAddressesController,
    listAddressStub: ListAddresses
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
const makeListAddresses = ():ListAddresses => {
  class ListAddressesStub implements ListAddresses {
    list (accountId: string, query?: any): Promise<AddressModel[]> {
      return new Promise(resolve => resolve([makeFakeAddress()]))
    }
  }
  return new ListAddressesStub()
}

const makeSUT = ():SutTypes => {
  const listAddressStub = makeListAddresses()
  const sut = new ListAddressesController(listAddressStub)
  return { listAddressStub, sut }
}

const makeFakeRequest = ():HttpRequest => ({
  body: {
    middleware: {
      accountId: 'any_id'
    }
  },
  params: {
    street: 'any_street'
  },
  query: {
    complement: 'any_complement'
  }
})
describe('list address controller', () => {
  test('should call listAddress if validation succeeds ', async () => {
    const { sut, listAddressStub } = makeSUT()
    const listSpy = jest.spyOn(listAddressStub, 'list')

    await sut.handle(makeFakeRequest())
    expect(listSpy).toHaveBeenCalledWith('any_id', { street: 'any_street', complement: 'any_complement' })
  })
  test('should return 200 if list address returns something', async () => {
    const { sut } = makeSUT()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([makeFakeAddress()])
  })
  test('should return 500 if list address throws', async () => {
    const { sut, listAddressStub } = makeSUT()
    jest.spyOn(listAddressStub, 'list').mockRejectedValueOnce(new Error())
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(500)
  })
})
