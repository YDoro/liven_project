export interface DeleteAddressRepository{
    deleteByName(accountId:string, addressName:string):Promise<boolean>
}
