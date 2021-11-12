import { DbUpdateAddress } from '../../../../data/usecases/update-address/db-update-address'
import { AddressMongoRepository } from '../../../../infra/db/mongodb/address/address-mongo-repository'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { UpdateAddressController } from '../../../../presentation/controllers/update-address-controller'
import { makeUpdateAddressValidation } from './update-address-validation-factory'

export const makeUpdateAddressController = ():Controller => {
  return new UpdateAddressController(new DbUpdateAddress(new AddressMongoRepository()), makeUpdateAddressValidation())
}
