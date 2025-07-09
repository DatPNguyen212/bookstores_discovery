import mongoose from 'mongoose'

const bookstoreSchema = new mongoose.Schema({
  name: String,
  location: String,
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
  openTime: {
    type: Number,
    enum: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ],
  },
  closeTime: {
    type: Number,
    enum: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ],
  },
})
