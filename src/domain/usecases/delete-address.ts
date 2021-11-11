export interface DeleteAddress{
    delete(accountId:string, addressName:string):Promise<boolean>
}
