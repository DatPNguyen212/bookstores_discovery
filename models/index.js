import bookstoreSchema from './bookstores.js'
import objectUtils from '../utils/objectUtils.js'

const models = {
  Bookstore: {
    schema: bookstoreSchema,
    getModelClass(connection) {
      if (!objectUtils.isPlainObject(connection)) {
        throw new TypeError('First parameter must be a connection obj')
      }
      return connection.model('Bookstore', this.schema)
    },
  },
}

export default models
