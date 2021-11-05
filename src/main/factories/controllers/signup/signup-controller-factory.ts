import { Controller } from "../../../../presentation/controllers/protocols/controller"
import { SignUpController } from "../../../../presentation/controllers/signup-controller"
import { makeSignUpValidation } from "./signup-validation-factory"
import { makeDbAddAccount } from "./usecases/add-account/db-add-account-factory"

export const makeSignUpController = (): Controller => {
  return new SignUpController(makeDbAddAccount(), makeSignUpValidation())
}
