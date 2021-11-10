import { AddressModel } from '../../../../domain/models/address'

export interface ListAddressesRepository{
    list(accountId:string, query?:any):Promise<Array<AddressModel>>
}
