import { bookstoreSchema, Bookstore } from './bookstores'

const models = {
  bookstore: {
    schema: bookstoreSchema,
    ModelClass: Bookstore,
  },
}

export default models
