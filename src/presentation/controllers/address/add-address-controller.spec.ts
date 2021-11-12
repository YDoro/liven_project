import { AccountModel } from '../../../domain/models/account'
import { AddressModel } from '../../../domain/models/address'
import { AddAddress } from '../../../domain/usecases/add-address'
import { AddAddressController } from './add-address-controller'
import { HttpRequest } from '../protocols/http'
import { Validation } from '../protocols/validation'

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
    middleware: { accountId: 'valid_id' },
    ...makeFakeAddress()
  }
})
describe('add address controller', () => {
  test('should return 201 on success', async () => {
    const { sut } = makeSUT()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(201)
    expect(response.body.addresses).toBeInstanceOf(Array)
    expect(response.body.addresses[0]).toBeDefined()
    expect(response.body.password).not.toBeDefined()
  })
  test('should call addAddressAdd with the right values', async () => {
    const { sut, addAddressStub } = makeSUT()
    const addSpy = jest.spyOn(addAddressStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddress(), 'valid_id')
  })
  test('should return 400 on validation error', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
  })

  test('should return 500 on addAddress throws', async () => {
    const { sut, addAddressStub } = makeSUT()
    jest.spyOn(addAddressStub, 'add').mockRejectedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(500)
  })
})
