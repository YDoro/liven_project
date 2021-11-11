import { DbDeleteAddress } from '../../../../data/usecases/delete-address/db-delete-address'
import { DeleteAddress } from '../../../../domain/usecases/delete-address'
import { AddressMongoRepository } from '../../../../infra/db/mongodb/address/address-mongo-repository'

export const makeDbDleteAddress = ():DeleteAddress => {
  return new DbDeleteAddress(new AddressMongoRepository())
}
