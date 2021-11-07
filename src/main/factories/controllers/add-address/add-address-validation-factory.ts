import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeAddAddressDbValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'postalcode', 'street', 'number', 'neigborhood', 'city', 'state', 'country']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
