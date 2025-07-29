import { bookstoreSchema, Bookstore } from './bookstores.js'

const models = {
  bookstore: {
    schema: bookstoreSchema,
    ModelClass: Bookstore,
  },
}

export default models
