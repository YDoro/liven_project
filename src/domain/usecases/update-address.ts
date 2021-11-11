import { AddressModel } from '../models/address'

export interface UpdateAddressModel {
    name?: string,
    postalcode?: string,
    street?: string,
    number?: string,
    complement?: string,
    landmark?: string,
    neigborhood?:string,
    city?: string,
    state?: string,
    country?: string,
}
export interface UpdateAddress{
    update(accountId:string, addressName:string, update:UpdateAddressModel):Promise<AddressModel>
}
