import vnDataSet from './vnDataSet.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

vnDataSet
  .createJsonFile(path.join(__dirname, '../', 'vnDataSet.json'))
  .then(() => {
    console.log('successful')
  })
