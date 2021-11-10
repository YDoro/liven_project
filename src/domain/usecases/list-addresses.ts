import { AddressModel } from '../models/address'

export interface ListAddresses{
    list (accountId: string, query?:any):Promise<Array<AddressModel>>
}
