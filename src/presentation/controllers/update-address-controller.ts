import { UpdateAddress } from '../../domain/usecases/update-address'
import { badRequest, ok, serverError } from '../helpers/http/http-helper'
import { flattenObject } from '../helpers/object/flatten-object'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class UpdateAddressController implements Controller {
  constructor (
        private readonly updateAddress: UpdateAddress,
       private readonly validation:Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(flattenObject(httpRequest.body))
      if (error) {
        return badRequest(error)
      }
      const accountId = httpRequest.body.middleware.accountId
      const addressName = httpRequest.body.name

      const { city, complement, country, landmark, name, neigborhood, number, postalcode, state, street } = httpRequest.body.update
      const update = { city, complement, country, landmark, name, neigborhood, number, postalcode, state, street }
      Object.keys(update).forEach(key => (update[key] === undefined) && delete update[key])
      const address = await this.updateAddress.update(accountId, addressName, update)
      return ok(address)
    } catch (e) {
      return serverError(e)
    }
  }
}
