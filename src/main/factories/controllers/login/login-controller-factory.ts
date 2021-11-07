import { LoginController } from '../../../../presentation/controllers/login-controller'
import { Controller } from '../../../../presentation/controllers/protocols/controller'
import { makeDbAuthentication } from '../../usecases/validation/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  return new LoginController(makeDbAuthentication(), makeLoginValidation())
}
