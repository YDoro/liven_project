import { AddAddressController } from '../../../../presentation/controllers/add-address-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbAddAddress } from '../../usecases/add-address/db-add-address-factory'
import { makeAddAddressDbValidation } from './add-address-validation-factory'

export const makeAddAddressController = ():Controller => {
  return new AddAddressController(makeDbAddAddress(), makeAddAddressDbValidation())
}
