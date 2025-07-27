import mongoose from 'mongoose'
const dbUtils = {
  getModelClass(modelName) {
    if (typeof modelName !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    return mongoose.connection.models[modelName]
  },

  async clearCollection(modelName) {
    if (typeof modelName !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    const ModelClass = this.getModelClass(modelName)

    await ModelClass.deleteMany({})
  },
}

export default dbUtils
