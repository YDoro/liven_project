export const flattenObject = (obj:any):any => {
  const toReturn = {}

  for (const i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue

    if ((typeof obj[i]) === 'object' && obj[i] !== null) {
      const flatObject = flattenObject(obj[i])
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue
        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = obj[i]
    }
  }
  return toReturn
}
