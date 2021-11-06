import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import {AuthMiddleware} from './auth-middleware'

describe('auth middleware',()=>{
    test('should return 403 if no authentication is provided',async ()=>{
        const sut = new AuthMiddleware()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })
})