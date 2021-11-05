import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

}))
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toBeCalledWith('any_value', salt)
  })
  test('Should return a valid hash on hash  success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })
  test('Should throw if bcrypt hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(()=>{throw new Error('any error')})
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
