import { UpdateAccount } from '../../domain/usecases/update-account'
import { badRequest, notModified, ok, serverError } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class UpdateAccountController implements Controller {
  constructor (
        private readonly updateAccount: UpdateAccount,
        private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const accountId = httpRequest.body.middleware.accountId

      const updated = await this.updateAccount.update({ name, email, password }, accountId)
      if (updated) return ok()
      return notModified()
    } catch (e) {
      return serverError(e)
    }
  }
}
