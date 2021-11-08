import { UpdateAccount, UpdateAccountModel } from '../../../domain/usecases/update-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { UpdateAccountRepository } from '../../protocols/db/account/update-account-repository'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
        private readonly updateAccountRepository:UpdateAccountRepository,
        private readonly hasher:Hasher
  ) {}

  async update (address: UpdateAccountModel, accountId: string): Promise<boolean> {
    let password = address.password
    if (password) {
      password = await this.hasher.hash(address.password)
    }
    const fields = { ...address, password }
    Object.keys(fields).forEach(key => (fields[key] === undefined || fields[key] === null) && delete fields[key])

    return await this.updateAccountRepository.update(fields, accountId)
  }
}
