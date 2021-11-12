import { DeleteAddressController } from '../../../../presentation/controllers/address/delete-address-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { makeDbDleteAddress } from '../../usecases/delete-address/db-delete-address-factory'

export const makeDeleteAddressController = ():Controller => {
  return new DeleteAddressController(makeDbDleteAddress(), new RequiredFieldValidation('name'))
}
