import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
const testDBUtils = {
  async connect() {
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close()
    }

    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  },
  async deleteAllCollections(connection) {
    const modelsKeys = Object.keys(connection.models)

    for (let key of modelsKeys) {
      await connection.models[key].deleteMany({})
    }
  },
}

export default testDBUtils
