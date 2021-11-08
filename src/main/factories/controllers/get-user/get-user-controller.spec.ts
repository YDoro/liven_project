import { GetUserController } from './get-user-controller'
describe('get user controller', () => {
  test('should return 200 on user found', async () => {
    const sut = new GetUserController()
    const response = await sut.handle({
      body: {
        middleware: {
          user: {
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
          }
        }
      }
    })

    expect(response.statusCode).toBe(200)
  })
  test('should return 401 on user not provided', async () => {
    const sut = new GetUserController()
    const response = await sut.handle({
      body: {
        middleware: {

        }
      }
    })
    expect(response.statusCode).toBe(500)
  })
})
