import vnDataSet from './vnDataSet.js'
import path from 'path'
import fileUtils from '../../utils/fileUtils'
const __dirname = fileUtils.getDirname()

vnDataSet
  .createJsonFile(path.join(__dirname, '../', 'vnDataSet.json'))
  .then(() => {
    console.log('successful')
  })
