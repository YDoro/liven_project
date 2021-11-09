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
})
