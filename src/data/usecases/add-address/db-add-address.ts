import { AccountModel } from '../../../domain/models/account'
import { AddressModel } from '../../../domain/models/address'
import { AddAddress } from '../../../domain/usecases/add-address'
import { AddAddressRepository } from '../../protocols/db/address/add-address-repository'

export class DbAddAddress implements AddAddress {
  constructor (private readonly addAddressRepository:AddAddressRepository) {}
  async add (address: AddressModel, accountId:string): Promise<AccountModel> {
    return await this.addAddressRepository.add(address, accountId)
  }
}
