import { AddAddress } from '../../domain/usecases/add-address'
import { badRequest } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class AddAddressController implements Controller {
  constructor (
        private readonly addAddress: AddAddress,
        private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    const { name, postalcode, street, number, complement, landmark, neigborhood, city, state, country, accountId } = httpRequest.body
    this.addAddress.add({
      name,
      postalcode,
      street,
      number,
      complement,
      landmark,
      neigborhood,
      city,
      state,
      country
    }, accountId)
    return new Promise(resolve => resolve({ statusCode: 200, body: {} }))
  }
}
