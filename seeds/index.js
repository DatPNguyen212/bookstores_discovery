import setupDB from '../config/setupDB'
import seedHelpers from './seedHelpers'
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
  await setupDB.connect(MONGO_URI)

  for (let i = 0; i < numberOfStores; i++) {}
}

export default seedBookstore
