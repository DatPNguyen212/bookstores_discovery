import mongoose from 'mongoose'
import Bookstore from 'bookstores.js'

mongoose
  .connect('mongodb:127.0.0.1:27017/bookstoreDiscoveryDB')
  .then(() => {
    console.log('Successfully connected to mongoDB server')
  })
  .catch((error) => {
    console.log(error)
  })
