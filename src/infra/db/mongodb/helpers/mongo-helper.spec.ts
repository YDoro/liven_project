import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  test('should be connected', async () => {
    await sut.connect(process.env.MONGO_URL) 
    expect(sut.client).toBeTruthy()
  })
  test('should not be connected', async () => {
    await sut.disconnect()
    expect(sut.client).toBeNull()

  })
})