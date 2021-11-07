import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { EmailValidation } from './email-validation'

interface SutTypes{
  sut: EmailValidation
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidation('email')
  return {
    sut
  }
}

describe('email validation', () => {
  test('should return an error if email is invalid', () => {
    const { sut } = makeSut()
    const error = sut.validate({ email: 'invalid_emailmail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should return null if email is valid', () => {
    const { sut } = makeSut()
    const error = sut.validate({ email: 'valid_email@mail.com' })
    expect(error).toBeNull()
  })
})
