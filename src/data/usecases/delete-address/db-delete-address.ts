import { DeleteAddress } from '../../../domain/usecases/delete-address'
import { DeleteAddressRepository } from '../../protocols/db/address/delete-address-repository'

export class DbDeleteAddress implements DeleteAddress {
  constructor (
        private readonly deleteAddressRepository: DeleteAddressRepository
  ) {}

  async delete (accountId: string, addressName: string): Promise<boolean> {
    return await this.deleteAddressRepository.deleteByName(accountId, addressName)
  }
}
