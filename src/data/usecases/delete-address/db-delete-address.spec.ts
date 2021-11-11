import { DeleteAddressRepository } from '../../protocols/db/address/delete-address-repository'
import { DbDeleteAddress } from './db-delete-address'
interface SutTypes{
    sut:DbDeleteAddress,
    repositoryStub:DeleteAddressRepository
}
const makeRepository = ():DeleteAddressRepository => {
  class DeleteAddressRepositoryStub implements DeleteAddressRepository {
    async deleteByName (accountId: string, addressName: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new DeleteAddressRepositoryStub()
}
const makeSut = ():SutTypes => {
  const repositoryStub = makeRepository()
  const sut = new DbDeleteAddress(repositoryStub)
  return { repositoryStub, sut }
}
describe('delete address', () => {
  test('should call delete address repository', async () => {
    const { repositoryStub, sut } = makeSut()
    const deleteByNameSpy = jest.spyOn(repositoryStub, 'deleteByName')
    await sut.delete('any_account', 'any_name')
    expect(deleteByNameSpy).toHaveBeenCalledWith('any_account', 'any_name')
  })
  test('should return false if repository returns false', async () => {
    const { repositoryStub, sut } = makeSut()
    jest.spyOn(repositoryStub, 'deleteByName').mockResolvedValueOnce(false)
    const deleted = await sut.delete('any_account', 'any_name')
    expect(deleted).toBe(false)
  })
  test('should return true if repository returns true', async () => {
    const { sut } = makeSut()
    const deleted = await sut.delete('any_account', 'any_name')
    expect(deleted).toBe(true)
  })
  test('should throw if repository throws', async () => {
    const { repositoryStub, sut } = makeSut()
    jest.spyOn(repositoryStub, 'deleteByName').mockRejectedValueOnce(new Error('anyError'))
    const promise = sut.delete('any_account', 'any_name')
    expect(promise).rejects.toThrowError('anyError')
  })
})
