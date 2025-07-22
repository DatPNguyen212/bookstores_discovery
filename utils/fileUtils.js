import { fileURLToPath } from 'url'
import { dirname } from 'path'
const fileUtils = {
  getCurrentFileUrl() {
    return import.meta.url
  },
  getDirname() {
    const fileUrl = this.getCurrentFileUrl()
    const filePath = fileURLToPath(fileUrl)
    const __dirname = dirname(filePath)
    return __dirname
  },
}

export default fileUtils
