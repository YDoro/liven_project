/* eslint-disable no-useless-constructor */
import { AddAccount } from '../../domain/usecases/add-account'
import { badRequest, created, serverError } from '../helpers/http/http-helper'
import { Controller } from './protocols/controller'
import { HttpRequest, HttpResponse } from './protocols/http'
import { Validation } from './protocols/validation'

export class SignUpController implements Controller {
  constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
