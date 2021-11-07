import { Middleware } from '../../../presentation/controllers/protocols/middleware'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../usecases/load-accounnt-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = ():Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken())
}
