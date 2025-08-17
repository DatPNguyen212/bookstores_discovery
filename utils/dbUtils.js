import objectUtils from './objectUtils.js'

const dbUtils = {
  getModelClass(connection, modelName) {
    if (typeof modelName !== 'string') {
      throw new TypeError('Second parameter should be of string data type')
    }

    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    return connection.models[modelName]
  },

  async clearCollection(connection, modelName) {
    if (typeof modelName !== 'string') {
      throw new TypeError('Second parameter should be of string data type')
    }

    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    const ModelClass = this.getModelClass(connection, modelName)

    await ModelClass.deleteMany({})
  },
}

export default dbUtils
