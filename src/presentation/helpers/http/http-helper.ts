import { HttpResponse } from "../../controllers/protocols/http";
import { ServerError } from "../../errors/http/server-error";

export const serverError = (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack)
  })