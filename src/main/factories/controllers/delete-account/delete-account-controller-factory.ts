import { DeleteAccountController } from '../../../../presentation/controllers/delete-account-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { makeDbDeleteAccount } from '../../usecases/delete-account/db-delete-account-factory'

export const makeDeleteAccountController = ():Controller => {
  return new DeleteAccountController(new RequiredFieldValidation('password'), makeDbDeleteAccount())
}
