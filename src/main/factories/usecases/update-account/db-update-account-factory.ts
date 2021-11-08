import { DbUpdateAccount } from '../../../../data/usecases/update-account/db-update-account'
import { UpdateAccount } from '../../../../domain/usecases/update-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbUpdateAccount = (): UpdateAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  return new DbUpdateAccount(new AccountMongoRepository(), hasher)
}
