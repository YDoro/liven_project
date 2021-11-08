import { UpdateAccount, UpdateAccountModel } from '../../../domain/usecases/update-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { UpdateAccountRepository } from '../../protocols/db/account/update-account-repository'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
        private readonly updateAccountRepository:UpdateAccountRepository,
        private readonly hasher:Hasher
  ) {}

  async update (address: UpdateAccountModel, accountId: string): Promise<boolean> {
    await this.updateAccountRepository.update(address, accountId)
    return new Promise(resolve => resolve(true))
  }
}
