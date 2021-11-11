import { AddressModel } from '../../../../domain/models/address'

export interface UpdateAddressRepository{
    updateByName(accountId:string, addressName:string, update:any):Promise<AddressModel>
}
