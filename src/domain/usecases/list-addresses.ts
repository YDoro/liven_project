import { AddressModel } from '../models/address'

export interface ListAddresses{
    list (accountId: string):Promise<Array<AddressModel>>
}
