import { DbListAddresses } from '../../../../data/usecases/list-addresses/db-list-addresses'
import { ListAddresses } from '../../../../domain/usecases/list-addresses'
import { AddressMongoRepository } from '../../../../infra/db/mongodb/address/address-mongo-repository'

export const makeDbListAddresses = (): ListAddresses => {
  const listAddresses = new AddressMongoRepository()
  return new DbListAddresses(listAddresses)
}
