import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
const testDBUtils = {
  connection: null,
  mongoMemoryServer: null,

  async connect() {
    await this.closeDB()
    const memoryServer = await MongoMemoryServer.create()
    const uri = memoryServer.getUri()
    const testDBConnection = mongoose.createConnection(uri)
    this.connection = testDBConnection
    this.mongoMemoryServer = memoryServer

    try {
      await testDBConnection.asPromise()
      console.log('Successfully connected to mongo memory server')
    } catch (error) {
      if (this.mongoMemoryServer) {
        await this.mongoMemoryServer.stop()
      }
      this.connection = null
      this.mongoMemoryServer = null
      console.log(error)
      throw new Error('Failed to connect to mongo memory server')
    }

    return testDBConnection
  },
  async clearDB() {
    if (!this.connection) {
      throw new Error('Connection not established')
    }

    if (this.connection.readyState === 1) {
      const models = this.connection.models
      const modelsKeys = Object.keys(models)

      for (let modelKey of modelsKeys) {
        await models[modelKey].deleteMany({})
      }
    } else {
      throw new Error(
        'Not connected to mongo memory server, so cannot clear database'
      )
    }
  },
  async closeDB() {
    if (this.connection) {
      if (
        this.connection.readyState !== 0 &&
        this.connection.readyState !== 3
      ) {
        await this.connection.dropDatabase()
        await this.connection.close()
        this.connection = null
      }
    } else {
      console.log('Connection not established yet')
    }

    if (this.mongoMemoryServer) {
      await this.mongoMemoryServer.stop()
      this.mongoMemoryServer = null
    } else {
      console.log('Mongo Memory Server not created yet')
    }
  },
}

export default testDBUtils
