import { Validation } from "../../presentation/controllers/protocols/validation";
import { InvalidParamError } from "../../presentation/errors/invalid-param-error";

export class EmailValidation implements Validation {
    constructor (private readonly fieldName: string) { }
  
    validate (input: any): Error {
      if (! /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(input[this.fieldName])) {
        return new InvalidParamError(this.fieldName)
      }
      return null
    }
  }
  