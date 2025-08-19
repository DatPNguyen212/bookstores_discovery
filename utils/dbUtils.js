import objectUtils from './objectUtils.js'

const dbUtils = {
  getModelClass(connection, modelName) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    if (typeof modelName !== 'string') {
      throw new TypeError('Second parameter should be of string data type')
    }

    const ModelClass = connection.models[modelName]

    if (!ModelClass) {
      throw new Error(
        "Wrong modelName or the ModelClass you're looking for doesn't exist"
      )
    }

    return ModelClass
  },

  async clearCollection(connection, modelName) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    if (typeof modelName !== 'string') {
      throw new TypeError('Second parameter should be of string data type')
    }

    const ModelClass = this.getModelClass(connection, modelName)

    await ModelClass.deleteMany({})
  },
}

export default dbUtils
