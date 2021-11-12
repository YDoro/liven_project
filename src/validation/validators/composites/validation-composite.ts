import { Validation } from '../../../presentation/controllers/protocols/validation'
/**
 * this class is a composite of validators
 * is a validator that receive an array of validators and then performs each validation
 */
export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) { }

  async validate (input: any): Promise<Error> {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) {
        if (error instanceof Promise) {
          return await error
        }
        return error
      }
    }
  }
}
