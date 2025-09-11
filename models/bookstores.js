import mongoose from 'mongoose'

const bookstoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 500,
    required: true,
  },
  genres: [
    {
      type: String,
      required: true,
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
  images: {
    type: String,
    required: true,
  },
  openDays: [
    {
      type: String,
      required: true,
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
