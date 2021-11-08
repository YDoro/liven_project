import { UpdateAccountModel } from '../../../domain/usecases/update-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { UpdateAccountRepository } from '../../protocols/db/account/update-account-repository'
import { DbUpdateAccount } from './db-update-account'
interface SutTypes{
    sut: DbUpdateAccount,
    updateAccountRepositoryStub:UpdateAccountRepository,
    hasherStub: Hasher
}

const makeUpdateAccountRepository = ():UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    update (data: UpdateAccountModel, id: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpdateAccountRepositoryStub()
}

const makeHasher = ():Hasher => {
  class HasherStub implements Hasher {
    hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeSUT = ():SutTypes => {
  const updateAccountRepositoryStub = makeUpdateAccountRepository()
  const hasherStub = makeHasher()
  const sut = new DbUpdateAccount(updateAccountRepositoryStub, hasherStub)
  return { hasherStub, sut, updateAccountRepositoryStub }
}

describe('update account db usecase', () => {
  test('should call UpdateAccountRepository update with the right values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSUT()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'update')
    await sut.update({ password: 'new_password' }, 'any_id')
    expect(updateSpy).toHaveBeenCalledWith({ password: 'new_password' }, 'any_id')
  })
  test('should return true if UpdateAccountRepository update returns true', async () => {
    const { sut } = makeSUT()
    const wasUpdated = await sut.update({ password: 'new_password' }, 'any_id')
    expect(wasUpdated).toBe(true)
  })
  test('should return false if UpdateAccountRepository update returns false', async () => {
    const { sut, updateAccountRepositoryStub } = makeSUT()
    jest.spyOn(updateAccountRepositoryStub, 'update').mockResolvedValueOnce(false)
    const wasUpdated = await sut.update({ password: 'new_password' }, 'any_id')
    expect(wasUpdated).toBe(false)
  })
  test('should return throw if UpdateAccountRepository update throws', async () => {
    const { sut, updateAccountRepositoryStub } = makeSUT()
    jest.spyOn(updateAccountRepositoryStub, 'update').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.update({ password: 'new_password' }, 'any_id')
    expect(promise).rejects.toThrowError('any_error')
  })
})
