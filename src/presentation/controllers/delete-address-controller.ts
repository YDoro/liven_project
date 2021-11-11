import { DeleteAddress } from '../../domain/usecases/delete-address'
import { badRequest, notModified, ok, serverError } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class DeleteAddressController implements Controller {
  constructor (
      private readonly deleteAddress:DeleteAddress,
      private readonly validation:Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = await this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const accountId = httpRequest.body.middleware.accountId
      const name = httpRequest.body.name
      const deleted = await this.deleteAddress.delete(accountId, name)
      if (deleted) {
        return ok()
      }
      return notModified()
    } catch (e) {
      return serverError(e)
    }
  }
}
