import Joi from 'joi'
import customMsgs from './customMsgs.js'

const bookstoreJoiSchema = Joi.object({
  bookstore: Joi.object({
    name: Joi.string().required().messages(customMsgs),
    address: Joi.string().required().messages(customMsgs),
    description: Joi.string().max(500).required().messages(customMsgs),
    genres: Joi.array()
      .items(
        Joi.string()
          .label('genre item')
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
          .messages(customMsgs)
      )
      .min(1)
      .required()
      .messages(customMsgs),
    images: Joi.string().required().messages(customMsgs),
    openDays: Joi.array()
      .items(
        Joi.string()
          .label('day item')
          .valid(
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          )
          .messages(customMsgs)
      )
      .min(1)
      .required()
      .messages(customMsgs),
  }),
})

export default bookstoreJoiSchema
