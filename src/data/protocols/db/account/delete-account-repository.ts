export interface DeleteAccountRepository{
    deleteById(accountId:string):Promise<boolean>
}
