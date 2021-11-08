import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { NumericFieldValidation } from './numeric-field-validation'

describe('numeric field validation', () => {
  test('should return an invalid param error on non numeric field given', () => {
    const sut = new NumericFieldValidation('cpf')
    const error = sut.validate({ cpf: 'invalid_number' })
    expect(error).toEqual(new InvalidParamError('cpf'))
  })
  test('should return an invalid param error on oversized field given', () => {
    const sut = new NumericFieldValidation('cpf', 5)
    const error = sut.validate({ cpf: '123456' })
    expect(error).toEqual(new InvalidParamError('cpf'))
  })
})
