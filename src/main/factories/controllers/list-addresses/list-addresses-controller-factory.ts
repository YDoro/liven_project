import { ListAddressesController } from '../../../../presentation/controllers/address/list-addresses-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbListAddresses } from '../../usecases/list-addresses/db-list-addresses-factory'

export const makeListAddressesController = ():Controller => {
  return new ListAddressesController(makeDbListAddresses())
}
