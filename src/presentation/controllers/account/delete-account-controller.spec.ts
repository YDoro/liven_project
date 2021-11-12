import { DeleteAccount } from '../../../domain/usecases/delete-account'
import { Validation } from '../protocols/validation'
import { DeleteAccountController } from './delete-account-controller'

interface SutTypes{
    sut: DeleteAccountController,
    validationStub:Validation,
    deleteAccountStub:DeleteAccount
}

const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | Promise<Error> {
      return new Promise(resolve => resolve(new Error('any_error')))
    }
  }
  return new ValidationStub()
}
const makeDeleteAccount = ():DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    delete (accountId: string, password: string, hashedPassword: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new DeleteAccountStub()
}

const makeSUT = ():SutTypes => {
  const validationStub = makeValidation()
  const deleteAccountStub = makeDeleteAccount()
  const sut = new DeleteAccountController(validationStub, deleteAccountStub)
  return { sut, deleteAccountStub, validationStub }
}

describe('delete account', () => {
  test('should return 400 on validation fail', async () => {
    const { sut } = makeSUT()
    const response = await sut.handle({ body: { password: 'any_password' } })
    expect(response.statusCode).toBe(400)
  })

  test('should call DeleteAccount if validation pass', async () => {
    const { sut, validationStub, deleteAccountStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockResolvedValueOnce(undefined)
    const deleteSpy = jest.spyOn(deleteAccountStub, 'delete')

    await sut.handle({ body: { password: 'any_password', middleware: { user: { id: 'any_id', password: 'hashed_password' } } } })
    expect(deleteSpy).toHaveBeenCalledWith('any_id', 'any_password', 'hashed_password')
  })

  test('should return 500 on throw', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockRejectedValueOnce(new Error())
    const response = await sut.handle({ body: { password: 'any_password', middleware: { user: { id: 'any_id', password: 'hashed_password' } } } })
    expect(response.statusCode).toBe(500)
  })

  test('should return 401 on deleteAccount false', async () => {
    const { sut, validationStub, deleteAccountStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockResolvedValueOnce(undefined)
    jest.spyOn(deleteAccountStub, 'delete').mockResolvedValueOnce(false)
    const response = await sut.handle({ body: { password: 'any_password', middleware: { user: { id: 'any_id', password: 'hashed_password' } } } })

    expect(response.statusCode).toBe(401)
  })
})
