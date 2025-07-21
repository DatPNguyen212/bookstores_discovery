import setupDB from '../config/setupDB'

async function seedBookstore() {
  const MONGO_URI = 'mongodb://127.0.0.1:27017/bookstoreDiscovery'
  await setupDB.connect(MONGO_URI)
}

export default seedBookstore
