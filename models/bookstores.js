import mongoose from 'mongoose'

const bookstoreSchema = new mongoose.Schema({
  name: String,
  address: String,
  description: {
    type: String,
    maxLength: 500,
  },
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

export default bookstoreSchema
