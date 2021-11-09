import { DbDeleteAccount } from '../../../../data/usecases/delete-account/db-delete-account'
import { DeleteAccount } from '../../../../domain/usecases/delete-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbDeleteAccount = ():DeleteAccount => {
  return new DbDeleteAccount(new BcryptAdapter(12), new AccountMongoRepository())
}
