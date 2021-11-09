import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeDeleteAccountController } from '../factories/controllers/delete-account/delete-account-controller-factory'
import { GetUserController } from '../factories/controllers/get-user/get-user-controller'
import { makeUpdateAccountController } from '../factories/controllers/update-account/update-account-controller-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  router.get('/user', adaptMiddleware(makeAuthMiddleware(true)), adaptRoute(new GetUserController()))
  router.patch('/user', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeUpdateAccountController()))
  router.delete('/user', adaptMiddleware(makeAuthMiddleware(true)), adaptRoute(makeDeleteAccountController()))
}
