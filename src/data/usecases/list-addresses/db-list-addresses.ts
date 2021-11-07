import { AddressModel } from '../../../domain/models/address'
import { ListAddresses } from '../../../domain/usecases/list-addresses'
import { ListAddressesRepository } from '../../protocols/db/address/list-addresses-repository'

export class DbListAddresses implements ListAddresses {
  constructor (
        private readonly listAddressesRepository: ListAddressesRepository
  ) {}

  async list (accountId: string): Promise<AddressModel[]> {
    const addresses = await this.listAddressesRepository.list(accountId)
    return addresses
  }
}
