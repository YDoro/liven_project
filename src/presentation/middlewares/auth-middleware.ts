import { HttpRequest, HttpResponse } from "../controllers/protocols/http";
import { Middleware } from "../controllers/protocols/middleware";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http/http-helper";

export class AuthMiddleware implements Middleware{
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const error =new AccessDeniedError()
        return new Promise(resolve=>resolve(forbidden(error)))
    }
}