import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { Encrypter } from "../../protocols/criptography/encrypter";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";

export class DbAuthentication implements Authentication{
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ){}

    async auth(authentication: AuthenticationModel): Promise<string> {
        //load account by email 
        const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
        if(account){
            //hash compare
            const isValid =  await this.hashComparer.compare(authentication.password, account.password)
            if(isValid){
                //generate token
                const token = await this.encrypter.encrypt(account.id)
                //update client token
                await this.updateAccessTokenRepository.updateAccessToken(account.id,token)
                
                return token;
            }
        }
        return null

    }

}