import { ObjectId } from 'bson'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { UpdateAccountRepository } from '../../../../data/protocols/db/account/update-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { UpdateAccountModel } from '../../../../domain/usecases/update-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, UpdateAccountRepository {
  async loadByToken (token: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    const account = await accountCollection.findOne({ accessToken: token })
    return account && MongoHelper.map(account)
  }

  public static readonly accountCollection = 'accounts'

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    const result = await accountCollection.findOne({ _id: (await accountCollection.insertOne(accountData)).insertedId })
    return MongoHelper.map(result)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    await accountCollection.updateOne(
      { _id: new ObjectId(id) }, {
        $set: { accessToken: token }
      })
  }

  async update (data: UpdateAccountModel, id: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    const updated = await accountCollection.updateOne(
      { _id: new ObjectId(id) }, {
        $set: data
      })
    return updated.modifiedCount > 0
  }
}
