import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { DbAddAccount } from './db-add-account'

interface SutTypes{
    sut:DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeSUT = ():SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub }
}
const makeFakeAccountData = ():AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeAddAccountRepository = ():AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeHasher = ():Hasher => {
  class HasherStub implements Hasher {
    hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

describe('db add account usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSUT()
    const haserSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAccountData())

    expect(haserSpy).toHaveBeenCalledWith(makeFakeAccountData().password)
  })

  test('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSUT()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error('any error'))

    const promise = sut.add(makeFakeAccountData())

    expect(promise).rejects.toThrowError('any error')
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSUT()
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSUT()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error('any addaccount error'))

    const promise = sut.add(makeFakeAccountData())

    expect(promise).rejects.toThrowError('any addaccount error')
  })
})
