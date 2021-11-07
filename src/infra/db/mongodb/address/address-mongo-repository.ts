import { MongoTransactionError, PushOperator, ObjectId } from 'mongodb'
import { AddAddressRepository } from '../../../../data/protocols/db/address/add-address-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddressModel } from '../../../../domain/models/address'
import { AccountMongoRepository } from '../account/account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class AddressMongoRepository implements AddAddressRepository {
  async add (address: AddressModel, userId: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection(AccountMongoRepository.accountCollection)
    const result = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { addresses: address } as PushOperator<AccountModel|Document> },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      throw new MongoTransactionError(`failed on update user address: ${userId}`)
    }

    return MongoHelper.map(result.value)
  }
}
