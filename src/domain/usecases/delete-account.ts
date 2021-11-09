export interface DeleteAccount{
    delete(accountId:string, password:string, hashedPassword:string):Promise<boolean>
}
