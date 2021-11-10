import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddAddressController } from '../factories/controllers/add-address/add-address-controller-factory'
import { makeListAddressesController } from '../factories/controllers/list-addresses/list-addresses-controller-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  // listing address with and without slash
  router.get('/address', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeListAddressesController()))
  router.get('/address/*', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeListAddressesController()))
  router.post('/address', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeAddAddressController()))
}
