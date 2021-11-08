import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { NumericFieldValidation } from './numeric-field-validation'

describe('numeric field validation', () => {
  test('should return an invalid param error on non numeric field given', () => {
    const sut = new NumericFieldValidation('cpf')
    const error = sut.validate({ cpf: 'invalid_number' })
    expect(error).toEqual(new InvalidParamError('cpf'))
  })
})
