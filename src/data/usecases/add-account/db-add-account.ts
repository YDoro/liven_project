import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account";
import { Hasher } from "../../protocols/criptography/hasher";
import { AddAccountRepository } from "../../protocols/db/account/add-account-repository";

export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
    ) {}

    async add(account: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.hasher.hash(account.password)
        return await this.addAccountRepository.add({...account,password:hashedPassword})
    }
}