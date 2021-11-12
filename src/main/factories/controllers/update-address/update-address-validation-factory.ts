import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { NumericFieldValidation } from '../../../../validation/validators/numeric-field-validation'
import { MapFieldValidation, OptionalFieldValidationComposite } from '../../../../validation/validators/composites/optional-field-composite-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { UniqueAddressNameValidation } from '../../../../validation/validators/unique-address-name-validation'
import { ValidationComposite } from '../../../../validation/validators/composites/validation-composite'
import { makeDbListAddresses } from '../../usecases/list-addresses/db-list-addresses-factory'

export const makeUpdateAddressValidation = ():Validation => {
  const requiredFields = ['update.city', 'update.country', 'update.name', 'update.neigborhood', 'update.number', 'update.postalcode', 'update.state', 'update.street']
  const mapValidations:MapFieldValidation[] = []
  const validations = []

  requiredFields.forEach((field) => { mapValidations.push({ field, validation: new RequiredFieldValidation(field) }) })

  validations.push(new RequiredFieldValidation('name'))
  validations.push(new OptionalFieldValidationComposite([
    ...mapValidations,
    { field: 'update.postalcode', validation: new NumericFieldValidation('update.postalcode', 8, 8) },
    { field: 'update.name', validation: new UniqueAddressNameValidation(makeDbListAddresses(), 'update.name', 'middleware.accountId') }
  ]))
  const validation = new ValidationComposite(validations)
  return validation
}
