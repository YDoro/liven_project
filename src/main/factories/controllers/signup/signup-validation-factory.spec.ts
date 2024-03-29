import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { CompareFieldsValidaiton } from '../../../../validation/validators/compare-fields-validation'
import { ValidationComposite } from '../../../../validation/validators/composites/validation-composite'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { makeSignUpValidation } from './signup-validation-factory'
jest.mock('../../../../validation/validators/composites/validation-composite')

describe('SignUpValidation factory', () => {
  test('Should call ValidationCompossite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidaiton('password', 'passwordConfirm'))
    validations.push(new EmailValidation('email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
