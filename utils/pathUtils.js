import { fileURLToPath } from 'url'
import { dirname } from 'path'
const pathUtils = {
  getDirnamePathFromUrl(importMetaUrl) {
    const filePath = fileURLToPath(importMetaUrl)
    const __dirname = dirname(filePath)
    return __dirname
  },
}

export default pathUtils
