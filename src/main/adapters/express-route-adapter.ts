import { Request, Response } from 'express'
import { Controller } from '../../presentation/controllers/protocols/controller'
import { HttpRequest } from '../../presentation/controllers/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      params: req.params,
      query: req.query,
      body: req.body
    }

    if (req.params[0]) {
      const params = {}
      const data = req.params[0].split('/')
      data.forEach((value, index) => {
        if (index === 0 || index % 2 === 0) {
          params[value] = ''
        } else {
          params[data[index - 1]] = value
        }
      })
      httpRequest.params = params
    }

    const httpResponse = await controller.handle(httpRequest)
    httpResponse.body?.message
      ? res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
      : res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
