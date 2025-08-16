import mongoose from 'mongoose'

const setupDB = {
  async connect(uri) {
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
}

export default setupDB
