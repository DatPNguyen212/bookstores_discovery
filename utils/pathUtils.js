import { fileURLToPath } from 'url'
import { dirname } from 'path'
const pathUtils = {
  getDirnamePathFromUrl(importMetaUrl) {
    if (typeof importMetaUrl !== 'string') {
      throw new TypeError('First parameter must be of string data type')
    }
    const filePath = fileURLToPath(importMetaUrl)
    const __dirname = dirname(filePath)
    return __dirname
  },
}

export default pathUtils
