import { AddAddressController } from '../../../../presentation/controllers/add-address-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbAddAddress } from '../../usecases/add-address/db-add-address-factory'
import { makeAddAddressValidation } from './add-address-validation-factory'

export const makeAddAddressController = ():Controller => {
  return new AddAddressController(makeDbAddAddress(), makeAddAddressValidation())
}
