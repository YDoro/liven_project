import { DbAddAddress } from '../../../../data/usecases/add-address/db-add-address'
import { AddAddress } from '../../../../domain/usecases/add-address'
import { AddressMongoRepository } from '../../../../infra/db/mongodb/address/address-mongo-repository'

export const makeDbAddAddress = (): AddAddress => {
  const addAddressRepository = new AddressMongoRepository()
  return new DbAddAddress(addAddressRepository)
}
