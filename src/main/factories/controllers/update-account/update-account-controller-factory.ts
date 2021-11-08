import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { UpdateAccountController } from '../../../../presentation/controllers/update-account-controller'
import { makeDbUpdateAccount } from '../../usecases/update-account/db-update-account-factory'
import { makeUpdateAccountValidation } from './update-account-validation-factory'

export const makeUpdateAccountController = (): Controller => {
  return new UpdateAccountController(makeDbUpdateAccount(), makeUpdateAccountValidation())
}
