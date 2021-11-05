import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { HttpRequest } from './protocols/http'
import { Validation } from './protocols/validation'
import { SignUpController } from './signup-controller'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_pass',
    passwordConfirm: 'valid_pass'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_pass'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = ():SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub)
  return { addAccountStub, sut, validationStub }
}

describe('signup controller', () => {
  test('should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
     const addSypy = jest.spyOn(addAccountStub, 'add')

     await sut.handle(makeFakeRequest())
     expect(addSypy).toHaveBeenCalledWith({
      name:makeFakeRequest().body.name,
      email:makeFakeRequest().body.email,
      password:makeFakeRequest().body.password,
     })
  })

  test('should return 201 on success', async () => {
    const { sut } = makeSut()
     const response = await sut.handle(makeFakeRequest())
     expect(response.statusCode).toBe(201)
  })

  test('should return 400 on validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub,'validate').mockReturnValueOnce(new Error('invalid field: name'))
     const response = await sut.handle(makeFakeRequest())
     expect(response.statusCode).toBe(400)
  })

  test('should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
     jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error('any error'))
     const response = await sut.handle(makeFakeRequest())
     expect(response.statusCode).toBe(500)
  })

  test('should return 500 if validation throws', async () => {
    const { sut, validationStub } = makeSut()
     jest.spyOn(validationStub, 'validate').mockImplementationOnce(()=>{throw new Error('any error')})
     const response = await sut.handle(makeFakeRequest())
     expect(response.statusCode).toBe(500)
  })

})
