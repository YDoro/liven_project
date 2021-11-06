import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Authentication, AuthenticationModel } from '../../domain/usecases/authentication'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'
import { forbidden, serverError } from '../helpers/http/http-helper'
import { HttpRequest } from './protocols/http'
import { Validation } from './protocols/validation'
import { SignUpController } from './signup-controller'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticatioStub: Authentication
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
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = ():SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const authenticatioStub = makeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub,authenticatioStub)
  return { addAccountStub, sut, validationStub ,authenticatioStub}
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

  test('should return 403 if add account returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUseError()))
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

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticatioStub } = makeSut()
    const authSpy = jest.spyOn(authenticatioStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: makeFakeRequest().body.email, password: makeFakeRequest().body.password })
  })

  test('Should should return 500 if Authentication throws', async () => {
    const { sut, authenticatioStub } = makeSut()
    jest.spyOn(authenticatioStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

})
