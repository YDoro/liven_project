import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository{
    private accountCollection = 'accounts'

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection(this.accountCollection)
        const result = await accountCollection.findOne({_id:(await accountCollection.insertOne(accountData)).insertedId})
        return MongoHelper.map(result)
    }

}