export class UniqueParamError extends Error {
  constructor (paramName: string, paramValue:any) {
    super(`Unique param Error: ${paramName} , ${paramValue}`)
    this.name = 'UniqueParamError'
  }
}
