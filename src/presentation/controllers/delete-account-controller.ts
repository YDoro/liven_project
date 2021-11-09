import { DeleteAccount } from '../../domain/usecases/delete-account'
import { badRequest, notModified, ok, serverError } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class DeleteAccountController implements Controller {
  constructor (
        private readonly validation:Validation,
        private readonly deleteAccount:DeleteAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const err = await this.validation.validate(httpRequest.body)
      if (err) {
        return badRequest(err)
      }
      const { password, id } = httpRequest.body.middleware.user
      const passwordGiven = httpRequest.body.password

      const deleted = await this.deleteAccount.delete(id, passwordGiven, password)

      if (deleted) {
        return ok()
      }
      return notModified()
    } catch (err) {
      return serverError(err)
    }
  }
}
