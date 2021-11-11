import { AddressModel } from '../../../domain/models/address'
import { UpdateAddressRepository } from '../../protocols/db/address/update-address-repositoy'
import { DbUpdateAddress } from './db-update-address'

const makeFakeAddress = ():AddressModel => ({
  name: 'any_name',
  street: 'any_street',
  number: 'any_number',
  complement: 'any_complement',
  landmark: 'any_landmark',
  city: 'any_city',
  state: 'any_state',
  country: 'any_country',
  neigborhood: 'any_neighborhood',
  postalcode: '12345678'
})
const makeUpdateAddressRepository = ():UpdateAddressRepository => {
  class UpdateAddressRepositoryStub implements UpdateAddressRepository {
    updateByName (accountId: string, addressName: string, update: any): Promise<AddressModel> {
      return new Promise(resolve => resolve(makeFakeAddress()))
    }
  }
  return new UpdateAddressRepositoryStub()
}
const makeSut = () => {
  const updateAddressRepositorySutb = makeUpdateAddressRepository()
  const sut = new DbUpdateAddress(updateAddressRepositorySutb)
  return { sut, updateAddressRepositorySutb }
}

describe('db update address', () => {
  test('should call dbUpdateAddressRepository', async () => {
    const { sut, updateAddressRepositorySutb } = makeSut()
    const updateByNameSpy = jest.spyOn(updateAddressRepositorySutb, 'updateByName')
    await sut.update('any_id', 'any_address', { name: 'any_name' })
    expect(updateByNameSpy).toHaveBeenCalledWith('any_id', 'any_address', { name: 'any_name' })
  })
  test('should throw if dbUpdateAddressRepository throws', async () => {
    const { sut, updateAddressRepositorySutb } = makeSut()
    jest.spyOn(updateAddressRepositorySutb, 'updateByName').mockRejectedValueOnce(new Error())
    const promise = sut.update('any_id', 'any_address', { name: 'any_name' })
    expect(promise).rejects.toThrowError()
  })
  test('should return address o success', async () => {
    const { sut } = makeSut()
    const address = await sut.update('any_id', 'any_address', { name: 'any_name' })
    expect(address).toEqual(makeFakeAddress())
  })
})
