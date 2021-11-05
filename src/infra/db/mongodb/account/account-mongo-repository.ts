import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository{

    private accountCollection = 'accounts'

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection(this.accountCollection)
        const result = await accountCollection.findOne({_id:(await accountCollection.insertOne(accountData)).insertedId})
        return MongoHelper.map(result)
    }

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        return account && MongoHelper.map(account)
      }

}