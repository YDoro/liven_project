import { AccountModel } from '../../../../domain/models/account'
import { AddressModel } from '../../../../domain/models/address'

export interface AddAddressRepository{
    add (address: AddressModel, userId:string): Promise<AccountModel>
}
