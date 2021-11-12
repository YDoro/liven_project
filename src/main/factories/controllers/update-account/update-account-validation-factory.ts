import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { MapFieldValidation, OptionalFieldValidationComposite } from '../../../../validation/validators/composites/optional-field-composite-validation'

export const makeUpdateAccountValidation = (): Validation => {
  const validations: MapFieldValidation[] = []
  validations.push({ field: 'email', validation: new EmailValidation('email') })
  return new OptionalFieldValidationComposite(validations)
}
