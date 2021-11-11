import { AddressModel } from '../../domain/models/address'
import { UpdateAddressController } from './update-address-controller'
import { HttpRequest } from './protocols/http'
import { Validation } from './protocols/validation'
import { UpdateAddress, UpdateAddressModel } from '../../domain/usecases/update-address'

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

const makeUpdateAddress = ():UpdateAddress => {
  class UpdateAddressStub implements UpdateAddress {
    async update (accountId: string, addressName: string, update: UpdateAddressModel): Promise<AddressModel> {
      return new Promise(resolve => resolve(makeFakeAddress()))
    }
  }
  return new UpdateAddressStub()
}

const makeSUT = () => {
  const updateAddressStub = makeUpdateAddress()
  const validationStub = makeValidation()
  const sut = new UpdateAddressController(updateAddressStub, validationStub)
  return { updateAddressStub, sut, validationStub }
}

const makeFakeRequest = ():HttpRequest => ({
  body: {
    middleware: { accountId: 'valid_id' },
    name: 'any_name',
    update: { ...makeFakeAddress() }
  }
})
describe('add address controller', () => {
  test('should return 200 on success', async () => {
    const { sut } = makeSUT()
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(200)
  })
  test('should call updateAddress with the right values', async () => {
    const { sut, updateAddressStub } = makeSUT()
    const updateSpy = jest.spyOn(updateAddressStub, 'update')
    await sut.handle(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith('valid_id', 'any_name', makeFakeAddress())
  })
  test('should return 400 on validation error', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
  })

  test('should return 500 on updateAddress throws', async () => {
    const { sut, updateAddressStub } = makeSUT()
    jest.spyOn(updateAddressStub, 'update').mockRejectedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(500)
  })
})
