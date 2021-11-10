import { AddressModel } from '../../domain/models/address'
import { ListAddresses } from '../../domain/usecases/list-addresses'
import { Validation } from './protocols/validation'
import { ListAddressesController } from './list-addresses-controller'
import { HttpRequest } from './protocols/http'
interface SutTypes{
    sut:ListAddressesController,
    listAddressStub: ListAddresses,
    validationStub: Validation
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
const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | Promise<Error> {
      return new Promise(resolve => resolve(new Error('any_error')))
    }
  }
  return new ValidationStub()
}
const makeSUT = ():SutTypes => {
  const listAddressStub = makeListAddresses()
  const validationStub = makeValidation()
  const sut = new ListAddressesController(validationStub, listAddressStub)
  return { listAddressStub, validationStub, sut }
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
  test('should call validation with correct values', async () => {
    const { validationStub, sut } = makeSUT()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({ street: 'any_street', complement: 'any_complement' })
  })
  test('should return 400 if validation fails', async () => {
    const { sut } = makeSUT()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
  })
})
