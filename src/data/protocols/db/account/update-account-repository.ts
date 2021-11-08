import { UpdateAccountModel } from '../../../../domain/usecases/update-account'

export interface UpdateAccountRepository{
    update(data:UpdateAccountModel, id:string):Promise<boolean>
}
