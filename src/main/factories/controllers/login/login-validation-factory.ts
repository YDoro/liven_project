import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/composites/validation-composite'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email'))
  return new ValidationComposite(validations)
}
