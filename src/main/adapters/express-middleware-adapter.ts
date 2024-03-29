import { NextFunction, Request, Response } from 'express'
import { HttpRequest } from '../../presentation/controllers/protocols/http'
import { Middleware } from '../../presentation/controllers/protocols/middleware'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      if (!req.body.middleware) {
        req.body.middleware = {}
      }
      Object.assign(req.body.middleware, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
