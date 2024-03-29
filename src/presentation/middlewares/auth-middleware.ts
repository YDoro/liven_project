import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { HttpRequest, HttpResponse } from '../controllers/protocols/http'
import { Middleware } from '../controllers/protocols/middleware'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken, private readonly returnFullUser?:boolean) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const user = await this.loadAccountByToken.load(accessToken)
        if (user) {
          if (this.returnFullUser) {
            return ok({ user })
          }
          return ok({ accountId: user.id })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (e) {
      return serverError(e)
    }
  }
}
