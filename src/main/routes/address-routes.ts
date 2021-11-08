import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddAddressController } from '../factories/controllers/add-address/add-address-controller-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  router.post('/address', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeAddAddressController()))
}
