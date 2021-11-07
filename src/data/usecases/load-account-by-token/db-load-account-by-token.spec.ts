import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
interface SutTupes{
    sut : DbLoadAccountByToken,
    decrypterStub: Decrypter,
    loadAccountByTokenRepositoryStub:LoadAccountByTokenRepository
}

const makeFakeAccount = ():AccountModel =>({
    id:'valid_id',
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'hashed_password'
})

const makeDecrypter = ():Decrypter=>{
    class DecrypterStub implements Decrypter{
        async decrypt(value: string): Promise<string> {
            return new Promise(resolve=>resolve('any_value'))
        }
    }
    return new DecrypterStub()
}
const makeLoadAccountByTokenRepository = ():LoadAccountByTokenRepository=>{
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository{
        async loadByToken(token:string):Promise<AccountModel> {
            return new Promise(resolve=>resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByTokenRepositoryStub()

}
const makeSUT = ():SutTupes=>{
    const decrypterStub = makeDecrypter()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const sut =  new DbLoadAccountByToken(decrypterStub,loadAccountByTokenRepositoryStub)
    return { sut, decrypterStub,loadAccountByTokenRepositoryStub}
}
describe('DbLoadAccountByToken usecase',()=>{
    test('should call decrypter with correct values',async () => {
        const {decrypterStub,sut} =makeSUT()
        const decryptSpy = jest.spyOn(decrypterStub,'decrypt')
        await sut.load('any_token')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    test('should return null if decrypter returns null',async () => {
        const {decrypterStub,sut} =makeSUT()
        jest.spyOn(decrypterStub,'decrypt').mockResolvedValueOnce(null)
        const account = await sut.load('any_token')
        expect(account).toBeNull()
    })

    test('should call loadAccountByTokenRepository with correct values',async () => {
        const {loadAccountByTokenRepositoryStub,sut} =makeSUT()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken')
        await sut.load('any_token')
                expect(loadByTokenSpy).toHaveBeenCalledWith('any_value')
    })

    test('should return null if loadAccountByTokenRepository returns null',async () => {
        const {loadAccountByTokenRepositoryStub,sut} =makeSUT()
        jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken').mockResolvedValueOnce(null)
        const account = await sut.load('any_token')
        expect(account).toBeNull()
    })
})