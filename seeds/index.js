import setupDB from '../config/setupDB.js'
import seedHelpers from './seedHelpers.js'
import dbUtils from '../utils/dbUtils.js'
async function seedBookstore(numberOfStores = 30) {
  if (typeof numberOfStores !== 'number') {
    throw new TypeError(
      'First parameter should be a positive number that is not zero'
    )
  }
  if (numberOfStores < 0) {
    throw new TypeError(
      'First parameter should be a positive number that is not zero'
    )
  }
  const MONGO_URI = 'mongodb://127.0.0.1:27017/bookstoreDiscovery'
  try {
    await setupDB.connect(MONGO_URI)
  } catch (error) {
    throw new Error('Failed to connect to database')
  }

  await dbUtils.clearCollection('Bookstore')

  for (let i = 0; i < numberOfStores; i++) {
    try {
      await seedHelpers.genBookstoreDoc()
    } catch (error) {
      await setupDB.close()
      console.log(error)

      throw new Error(
        "There's an error generating bookstore document and saving it to the database server"
      )
    }
  }

  await setupDB.close()
}

const NUMBER_OF_BOOKSTORES = 16

seedBookstore(NUMBER_OF_BOOKSTORES)

export default seedBookstore
