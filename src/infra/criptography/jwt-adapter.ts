import jwt from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/criptography/decrypter';
import { Encrypter } from '../../data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter, Decrypter{
    constructor (private readonly secret: string ) { }
    async decrypt(token: string): Promise<any> {
        const value  = await jwt.verify(token,this.secret)
        return value
    }
    
    async encrypt(value: string): Promise<string> {
        const accessToken = await jwt.sign({ id: value }, this.secret)
        return accessToken
    }
    
}