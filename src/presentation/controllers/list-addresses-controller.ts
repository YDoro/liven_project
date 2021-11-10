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
        name: httpRequest.params.name || httpRequest.query.name,
        street: httpRequest.params.street || httpRequest.query.street,
        number: httpRequest.params.number || httpRequest.query.number,
        complement: httpRequest.params.complement || httpRequest.query.complement,
        landmark: httpRequest.params.landmark || httpRequest.query.landmark,
        city: httpRequest.params.city || httpRequest.query.city,
        state: httpRequest.params.state || httpRequest.query.state,
        country: httpRequest.params.country || httpRequest.query.country,
        neigborhood: httpRequest.params.neigborhood || httpRequest.query.neigborhood,
        postalcode: httpRequest.params.postalcode || httpRequest.query.postalcode
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
