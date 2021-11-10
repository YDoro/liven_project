import { ListAddresses } from '../../domain/usecases/list-addresses'
import { badRequest, ok, serverError } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class ListAddressesController implements Controller {
  constructor (
        private readonly validation:Validation,
        private readonly listAddress:ListAddresses
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const searchFields = {
        name: httpRequest.params.name || httpRequest.query.name || undefined,
        street: httpRequest.params.street || httpRequest.query.street || undefined,
        number: httpRequest.params.number || httpRequest.query.number || undefined,
        complement: httpRequest.params.complement || httpRequest.query.complement || undefined,
        landmark: httpRequest.params.landmark || httpRequest.query.landmark || undefined,
        city: httpRequest.params.city || httpRequest.query.city || undefined,
        state: httpRequest.params.state || httpRequest.query.state || undefined,
        country: httpRequest.params.country || httpRequest.query.country || undefined,
        neigborhood: httpRequest.params.neigborhood || httpRequest.query.neigborhood || undefined,
        postalcode: httpRequest.params.postalcode || httpRequest.query.postalcode || undefined
      }

      Object.keys(searchFields).forEach(key => (searchFields[key] === undefined) && delete searchFields[key])

      const hasErrors = await this.validation.validate(searchFields)

      if (hasErrors) return badRequest(hasErrors)

      return new Promise(resolve => resolve(ok([])))
    } catch (e) {
      return serverError(e)
    }
  }
}
