import { AddressModel } from '../../../domain/models/address'
import { UpdateAddress, UpdateAddressModel } from '../../../domain/usecases/update-address'
import { UpdateAddressRepository } from '../../protocols/db/address/update-address-repositoy'

export class DbUpdateAddress implements UpdateAddress {
  constructor (
        private readonly updateAddressRepository:UpdateAddressRepository
  ) {}

  async update (accountId: string, addressName: string, update: UpdateAddressModel): Promise<AddressModel> {
    return await this.updateAddressRepository.updateByName(accountId, addressName, update)
  }
}
