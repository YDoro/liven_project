/* eslint-disable no-useless-constructor */
import { AddAccount } from '../../../domain/usecases/add-account'
import { Authentication } from '../../../domain/usecases/authentication'
import { EmailAlreadyInUseError } from '../../errors/email-already-in-use-error'
import { badRequest, created, forbidden, serverError } from '../../helpers/http/http-helper'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Validation } from '../protocols/validation'

export class SignUpController implements Controller {
  constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) return forbidden(new EmailAlreadyInUseError())

      const accessToken = await this.authentication.auth({ email, password })
      return created({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
