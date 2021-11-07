import { AccountModel } from '../models/account'
import { AddressModel } from '../models/address'

export interface AddAddress {
    add (address: AddressModel, accountId:string): Promise<AccountModel>
  }
