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
        'sci-fi',
        'romance',
        'mystery',
        'thriller',
        'historial fiction',
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
        'Sundday',
      ],
    },
  ],
})

const Bookstore = mongoose.model('Bookstore', bookstoreSchema)

export default Bookstore
