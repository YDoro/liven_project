import { AccountModel } from '../../domain/models/account'
import { AddressModel } from '../../domain/models/address'
import { AddAddress } from '../../domain/usecases/add-address'
import { AddAddressController } from './add-address-controller'
import { HttpRequest } from './protocols/http'
import { Validation } from './protocols/validation'

interface SutTypes{
    addAddressStub: AddAddress,
    validationStub: Validation,
    sut:AddAddressController
}
const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
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

const makeAddAddress = ():AddAddress => {
  class AddAddressStub implements AddAddress {
    async add (address: AddressModel, accountId: string): Promise<AccountModel> {
      return new Promise(resolve => resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password',
        addresses: [makeFakeAddress()]
      }))
    }
  }
  return new AddAddressStub()
}

const makeSUT = ():SutTypes => {
  const addAddressStub = makeAddAddress()
  const validationStub = makeValidation()
  const sut = new AddAddressController(addAddressStub, validationStub)
  return { addAddressStub, sut, validationStub }
}

const makeFakeRequest = ():HttpRequest => ({
  body: {
    accountId: 'valid_id', ...makeFakeAddress()
  }
})
describe('add address controller', () => {
  test('should return 200 on success', async () => {
    const { sut } = makeSUT()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(200)
  })
  test('should return 400 on validation error', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
  })
})
