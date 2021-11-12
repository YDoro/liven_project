import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { CompareFieldsValidaiton } from '../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/composites/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidaiton('password', 'passwordConfirm'))
  validations.push(new EmailValidation('email'))
  return new ValidationComposite(validations)
}
