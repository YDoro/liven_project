import { UpdateAccount, UpdateAccountModel } from '../../domain/usecases/update-account'
import { HttpRequest } from './protocols/http'
import { Validation } from './protocols/validation'
import { UpdateAccountController } from './update-account-controller'

interface SutTypes{
    validationStub:Validation,
    updateAccountStub:UpdateAccount,
    sut:UpdateAccountController
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeUpdateAccount = ():UpdateAccount => {
  class UpdateAccountStub implements UpdateAccount {
    async update (address: UpdateAccountModel, accountId: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpdateAccountStub()
}
const makeSUT = ():SutTypes => {
  const validationStub = makeValidation()
  const updateAccountStub = makeUpdateAccount()
  const sut = new UpdateAccountController(updateAccountStub, validationStub)
  return { sut, updateAccountStub, validationStub }
}
const makeFakeRequest = ():HttpRequest => ({
  body: {
    middleware: {
      accountId: 'any_id'
    },
    name: 'new_name'
  }
})
describe('update account controller', () => {
  test('should call validator and then UpdateAccount', async () => {
    const { sut, validationStub, updateAccountStub } = makeSUT()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const updateStub = jest.spyOn(updateAccountStub, 'update')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest().body)
    expect(updateStub).toHaveBeenCalledWith({ name: 'new_name' }, 'any_id')
  })
  test('should retrun 400 if validation fails', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockResolvedValueOnce(new Error('any_validation_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(400)
  })
  test('should retrun 304 if updateAccount fails', async () => {
    const { sut, updateAccountStub } = makeSUT()
    jest.spyOn(updateAccountStub, 'update').mockResolvedValueOnce(false)
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(304)
  })
  test('should retrun 500 if updateAccount throws', async () => {
    const { sut, updateAccountStub } = makeSUT()
    jest.spyOn(updateAccountStub, 'update').mockRejectedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(500)
  })
  test('should retrun 500 if validation throws', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockRejectedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(500)
  })
})
