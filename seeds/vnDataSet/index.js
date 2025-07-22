import vnDataSet from './vnDataSet.js'
import path from 'path'
import pathUtils from '../../utils/pathUtils.js'
const __dirname = pathUtils.getDirnamePathFromUrl(import.meta.url)

vnDataSet
  .createJsonFile(path.join(__dirname, '../', 'vnDataSet.json'))
  .then(() => {
    console.log('successful')
  })
