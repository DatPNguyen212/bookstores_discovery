import mongoose from 'mongoose'

const setupDB = {
  async connect(uri) {
    if (typeof uri !== 'string') {
      throw new TypeError('First parameter must be string data type')
    }
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close()
    }
    try {
      await mongoose.connect(uri)
      console.log('Successfully connected to database')
    } catch (error) {
      console.log('Error connecting to the database')
    }
  },

  async close() {
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close()
    } else {
      console.log('There must be a connection in order to close it')
    }
  },
}

export default setupDB
