import { DeleteAccount } from '../../../domain/usecases/delete-account'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { DeleteAccountRepository } from '../../protocols/db/account/delete-account-repository'

export class DbDeleteAccount implements DeleteAccount {
  constructor (
        private readonly hasherComparer:HashComparer,
        private readonly deleteAccountRepository:DeleteAccountRepository
  ) {}

  async delete (accountId: string, password:string, hashedPassword:string): Promise<boolean> {
    if (await this.hasherComparer.compare(password, hashedPassword)) {
      return await this.deleteAccountRepository.deleteById(accountId)
    }
    return false
  }
}
