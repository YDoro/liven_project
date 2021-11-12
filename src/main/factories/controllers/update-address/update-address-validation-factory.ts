import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { MapFieldValidation, OptionalFieldValidationComposite } from '../../../../validation/validators/optional-field-composite-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeUpdateAddressValidation = ():Validation => {
  const requiredFields = ['update.city', 'update.country', 'update.name', 'update.neigborhood', 'update.number', 'update.postalcode', 'update.state', 'update.street']
  const mapValidations:MapFieldValidation[] = []
  const validations = []

  requiredFields.forEach((field) => { mapValidations.push({ field, validation: new RequiredFieldValidation(field) }) })

  // TODO -  unique address name field validation refactor to receive field name
  // mapValidations.push({ field:'update.name', validation: new UniqueAddressNameValidation('update.name') })

  validations.push(new RequiredFieldValidation('name'))
  validations.push(new OptionalFieldValidationComposite(mapValidations))
  const validation = new ValidationComposite(validations)
  return validation
}
