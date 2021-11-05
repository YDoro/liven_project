import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { CompareFieldsValidaiton } from './compare-fields-validation'
const makeSut = (): CompareFieldsValidaiton => {
  return new CompareFieldsValidaiton('field', 'fieldTocompare')
}
describe('CompareFields Validation', () => {
  test('should return a InvalidParamError if validation Fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldTocompare: 'other_value' })
    expect(error).toEqual(new InvalidParamError('fieldTocompare'))
  })
  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldTocompare: 'any_value' })
    expect(error).toBeFalsy()
  })
})
