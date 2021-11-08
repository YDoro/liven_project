import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { GetUserController } from '../factories/controllers/get-user/get-user-controller'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  router.get('/user', adaptMiddleware(makeAuthMiddleware(true)), adaptRoute(new GetUserController()))
}
