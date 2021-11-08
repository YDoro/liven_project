import { Validation } from '../../presentation/controllers/protocols/validation'
import { InvalidParamError } from '../../presentation/errors/invalid-param-error'

export class NumericFieldValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly maxSize?:number) {}

  validate (input: any): Error | Promise<Error> {
    const asNum = Number(input[this.fieldName])
    if (isNaN(asNum)) {
      return new InvalidParamError(this.fieldName)
    }
    if (this.maxSize && asNum.toString().length > this.maxSize) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
