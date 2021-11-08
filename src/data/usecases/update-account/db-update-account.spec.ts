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
    await sut.update({ name: 'new_name' }, 'any_id')
    expect(updateSpy).toHaveBeenCalledWith({ name: 'new_name' }, 'any_id')
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
  test('should throw if UpdateAccountRepository update throws', async () => {
    const { sut, updateAccountRepositoryStub } = makeSUT()
    jest.spyOn(updateAccountRepositoryStub, 'update').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.update({ password: 'new_password' }, 'any_id')
    expect(promise).rejects.toThrowError('any_error')
  })
  test('should call Hasher hash with the right values if password given', async () => {
    const { sut, hasherStub } = makeSUT()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.update({ password: 'new_password' }, 'any_id')
    expect(hashSpy).toHaveBeenCalledWith('new_password')
  })

  test('should not call Hasher hash with if password not given', async () => {
    const { sut, hasherStub } = makeSUT()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.update({ name: 'new_name' }, 'any_id')
    expect(hashSpy).not.toHaveBeenCalledWith('new_password')
  })

  test('should call Hasher and then call updateAccessTokenRepository if password given', async () => {
    const { sut, hasherStub, updateAccountRepositoryStub } = makeSUT()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'update')
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.update({ password: 'new_password' }, 'any_id')
    expect(hashSpy).toHaveBeenCalledWith('new_password')
    expect(updateSpy).toHaveBeenCalledWith({ password: 'hashed_password' }, 'any_id')
  })
  test('should not call updateAccessTokenRepository with null values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSUT()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'update')

    await sut.update({ password: undefined }, 'any_id')
    expect(updateSpy).toHaveBeenCalledWith({ }, 'any_id')
  })
  test('should throw if hahser hash throws', async () => {
    const { sut, hasherStub } = makeSUT()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.update({ password: 'new_password' }, 'any_id')
    expect(promise).rejects.toThrowError('any_error')
  })
})
