import mongoose from 'mongoose'
import objectUtils from '../utils/objectUtils'

const setupDB = {
  async connect(uri) {
    if (typeof uri !== 'string') {
      throw new TypeError('You must pass string data type to first parameter')
    }
    const connection = mongoose.createConnection(uri)

    try {
      await connection.asPromise()
      console.log('Successfully connected to DB')

      return connection
    } catch (error) {
      console.log(error)
      throw new Error('Failed to connect to DB')
    }
  },

  async close(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('You must pass a connection obj to first parameter')
    }
    if (connection.readyState !== 1) {
      console.log('There must be a connection before you can close it.')
      throw new Error('There must be a connection before you can close it.')
    }
    await connection.close()
  },
}

export default setupDB
