import { AddressModel } from './address'

export interface AccountModel {
    id: string
    name: string
    email: string
    password: string
    addresses?:Array<AddressModel>
}
