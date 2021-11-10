import { ListAddresses } from '../../domain/usecases/list-addresses'
import { ok, serverError } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'

export class ListAddressesController implements Controller {
  constructor (
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

      const accountId = httpRequest.body.middleware.accountId
      const result = await this.listAddress.list(accountId, searchFields)
      return ok(result)
    } catch (e) {
      return serverError(e)
    }
  }
}
