import { DeleteAddress } from '../../../domain/usecases/delete-address'
import { DeleteAddressController } from './delete-address-controller'
import { HttpRequest } from '../protocols/http'
import { Validation } from '../protocols/validation'

const makeDeleteAddress = ():DeleteAddress => {
  class DeleteAddressStub implements DeleteAddress {
    delete (accountId: string, addressName: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new DeleteAddressStub()
}
const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeSut = () => {
  const deleteAddressStub = makeDeleteAddress()
  const validation = makeValidation()
  const sut = new DeleteAddressController(deleteAddressStub, validation)
  return { sut, deleteAddressStub, validation }
}
const makeRequest = ():HttpRequest => ({
  body: {
    name: 'any_address',
    middleware: {
      accountId: 'any_id'
    }
  }
})
describe('delete address controller', () => {
  test('should call delete address with the right values', async () => {
    const { sut, deleteAddressStub } = makeSut()
    const deleteSpy = jest.spyOn(deleteAddressStub, 'delete')
    await sut.handle(makeRequest())
    expect(deleteSpy).toHaveBeenCalledWith('any_id', 'any_address')
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response.statusCode).toBe(200)
  })
  test('should return 400 on validation fail', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockResolvedValueOnce(new Error())
    const response = await sut.handle(makeRequest())
    expect(response.statusCode).toBe(400)
  })
  test('should return 304 on delete fail', async () => {
    const { sut, deleteAddressStub } = makeSut()
    jest.spyOn(deleteAddressStub, 'delete').mockResolvedValueOnce(false)
    const response = await sut.handle(makeRequest())
    expect(response.statusCode).toBe(304)
  })
  test('should return 500 on delete error', async () => {
    const { sut, deleteAddressStub } = makeSut()
    jest.spyOn(deleteAddressStub, 'delete').mockRejectedValueOnce(new Error())
    const response = await sut.handle(makeRequest())
    expect(response.statusCode).toBe(500)
  })
})
