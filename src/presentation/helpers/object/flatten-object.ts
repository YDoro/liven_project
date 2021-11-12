export const flattenObject = (obj:any):any => {
  const toReturn = {}

  for (const i in obj) {
    if ((typeof obj[i]) === 'object' && obj[i] !== null) {
      const flatObject = flattenObject(obj[i])
      for (const x in flatObject) {
        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = obj[i]
    }
  }
  return toReturn
}
