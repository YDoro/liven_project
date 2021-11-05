import { HttpResponse } from '../../controllers/protocols/http'
import { ServerError } from '../../errors/http/server-error'

export const created = (data:any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
