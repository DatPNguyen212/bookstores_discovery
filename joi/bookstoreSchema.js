import Joi from 'joi'

const bookstoreJoiSchema = Joi.object({
  bookstore: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().max(500).required(),
    genres: Joi.array()
      .items(
        Joi.string()
          .valid(
            'fantasy',
            'science',
            'fiction',
            'romance',
            'mystery',
            'thriller',
            'historical',
            'horror',
            'non-fiction'
          )
          .required()
      )
      .required(),
    images: Joi.string().required(),
    openDays: Joi.array()
      .items(
        Joi.string()
          .valid(
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          )
          .required()
      )
      .required(),
  }),
})

export default bookstoreJoiSchema
