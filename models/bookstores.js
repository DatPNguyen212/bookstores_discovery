import mongoose from 'mongoose'

const bookstoreSchema = new mongoose.Schema({
  name: String,
  address: String,
  description: String,
  genres: [
    {
      type: String,
      enum: [
        'fantasy',
        'science',
        'fiction',
        'romance',
        'mystery',
        'thriller',
        'historical',
        'fiction',
        'horror',
        'non-fiction',
      ],
    },
  ],
  images: String,
  openDays: [
    {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
    },
  ],
})

const Bookstore = mongoose.model('Bookstore', bookstoreSchema)

export { bookstoreSchema, Bookstore }
