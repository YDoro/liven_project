import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { HttpRequest, HttpResponse } from '../../../../presentation/controllers/protocols/http'
import { ok, serverError } from '../../../../presentation/helpers/http/http-helper'

export class GetUserController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.body.middleware.user) {
      delete httpRequest.body.middleware.user.password
      return ok(httpRequest.body.middleware.user)
    }
    return serverError(new Error('user not provided by middleware'))
  }
}
