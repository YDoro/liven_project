import { Express, Router } from 'express'
import addressRoutes from '../routes/address-routes'
import loginRoutes from '../routes/login-routes'
/**
 * this function passes the express router to routes functions
 *
 */
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  loginRoutes(router)
  addressRoutes(router)
}
