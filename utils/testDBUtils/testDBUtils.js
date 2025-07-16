import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import objectUtils from '../objectUtils'
const testDBUtils = {
  async connect() {
    const memoryServer = await MongoMemoryServer.create()
    const uri = memoryServer.getUri()
    const testDBConnection = mongoose.createConnection(uri)
    await testDBConnection.asPromise()
    console.log('Successfully connected to mongo memory server')
    return testDBConnection
  },
  async clearDB(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter must be a plain object')
    }
    const models = connection.models
    const modelsKeys = Object.keys(models)

    for (let modelKey of modelsKeys) {
      await models[modelKey].deleteMany({})
    }
  },
  async closeDB(connection, mongoMemoryServer) {
    await connection.dropDatabase()
    await mongoMemoryServer.stop()
  },
}

export default testDBUtils
