import { Validation } from '../../../../presentation/controllers/protocols/validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { UniqueAddressNameValidation } from '../../../../validation/validators/unique-address-name-validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { makeDbListAddresses } from '../../usecases/list-addresses/db-list-addresses-factory'

export const makeAddAddressValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'postalcode', 'street', 'number', 'neigborhood', 'city', 'state', 'country']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const uniqueName = new UniqueAddressNameValidation(makeDbListAddresses())

  validations.push(uniqueName)

  return new ValidationComposite(validations)
}
