import { Validation } from '../../presentation/controllers/protocols/validation'
import { InvalidParamError } from '../../presentation/errors/invalid-param-error'

export class NumericFieldValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly size?:string) {}

  validate (input: any): Error | Promise<Error> {
    const asNum = Number(input[this.fieldName])
    if (isNaN(asNum)) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
