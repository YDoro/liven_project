import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { DeleteAccountRepository } from '../../protocols/db/account/delete-account-repository'
import { DbDeleteAccount } from './db-delete-account'

interface SutTypes{
    sut:DbDeleteAccount,
    hashComparerStub:HashComparer,
    deleteAccountRepositoryStub:DeleteAccountRepository
}

const makeHasherComparer = ():HashComparer => {
  class HashComparerStub implements HashComparer {
    compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeDeleteAccountRepository = ():DeleteAccountRepository => {
  class DeleteAccountRepositoryStub implements DeleteAccountRepository {
    deleteById (accountId: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new DeleteAccountRepositoryStub()
}
const makeSUT = ():SutTypes => {
  const hashComparerStub = makeHasherComparer()
  const deleteAccountRepositoryStub = makeDeleteAccountRepository()
  const sut = new DbDeleteAccount(hashComparerStub, deleteAccountRepositoryStub)
  return { deleteAccountRepositoryStub, hashComparerStub, sut }
}
describe('db delete account', () => {
  test('should call hasherComparer with the password', async () => {
    const { sut, hashComparerStub } = makeSUT()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.delete('any_id', 'any_password', 'hashed_password')
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('should call deleteAccountRepository if hasherComparer returns true', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSUT()
    const deleteByIdSpy = jest.spyOn(deleteAccountRepositoryStub, 'deleteById')
    await sut.delete('any_id', 'any_password', 'hashed_password')
    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('should not call deleteAccountRepository if hasherComparer returns false', async () => {
    const { sut, deleteAccountRepositoryStub, hashComparerStub } = makeSUT()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const deleteByIdSpy = jest.spyOn(deleteAccountRepositoryStub, 'deleteById')
    await sut.delete('any_id', 'any_password', 'hashed_password')
    expect(deleteByIdSpy).not.toHaveBeenCalled()
  })
  test('should return false if hasherComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSUT()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const deleted = await sut.delete('any_id', 'any_password', 'hashed_password')
    expect(deleted).toBe(false)
  })
  test('should return true if deleteAccountRepository returns true', async () => {
    const { sut } = makeSUT()
    const deleted = await sut.delete('any_id', 'any_password', 'hashed_password')
    expect(deleted).toBe(true)
  })
  test('should return false if deleteAccountRepository returns false', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSUT()
    jest.spyOn(deleteAccountRepositoryStub, 'deleteById').mockResolvedValueOnce(false)
    const deleted = await sut.delete('any_id', 'any_password', 'hashed_password')
    expect(deleted).toBe(false)
  })
  test('should return throw if deleteAccountRepository throws', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSUT()
    jest.spyOn(deleteAccountRepositoryStub, 'deleteById').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.delete('any_id', 'any_password', 'hashed_password')
    expect(promise).rejects.toThrowError('any_error')
  })
  test('should return throw if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSUT()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.delete('any_id', 'any_password', 'hashed_password')
    expect(promise).rejects.toThrowError('any_error')
  })
})
