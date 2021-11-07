import { AddressModel } from '../../../../domain/models/address'

export interface ListAddressesRepository{
    list(accountId:string):Promise<Array<AddressModel>>
}
