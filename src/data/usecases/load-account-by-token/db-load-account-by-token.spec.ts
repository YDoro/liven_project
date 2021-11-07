import { Decrypter } from '../../protocols/criptography/decrypter'
import {DbLoadAccountByToken} from './db-load-account-by-token'
interface SutTupes{
    sut : DbLoadAccountByToken,
    decrypterStub: Decrypter
}

const makeDecrypter = ():Decrypter=>{
    class DecrypterStub implements Decrypter{
        async decrypt(value: string): Promise<string> {
            return new Promise(resolve=>resolve('any_value'))
        }
    }
    return new DecrypterStub()
}
const makeSUT = ():SutTupes=>{
    const decrypterStub = makeDecrypter()
    const sut =  new DbLoadAccountByToken(decrypterStub)
    return { sut, decrypterStub}
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
})