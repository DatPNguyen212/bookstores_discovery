import Joi from 'joi'

const bookstoreJoiSchema = Joi.object({
  bookstore: Joi.object({
    name: Joi.string().required().messages({
      'string.base': '{{#label}} must be of string data type',
      'any.required': '{{#label}} is required',
    }),
    address: Joi.string().required().messages({
      'string.base': '{{#label}} must be of string data type',
      'any.required': '{{#label}} is required',
    }),
    description: Joi.string().max(500).required().messages({
      'string.base': '{{#label}} must be of string data type',
      'string.max': '{{#label}} must not be more than 500 characters',
      'any.required': '{{#label}} is required',
    }),
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
          .required()
          .messages({
            'string.base': '{{#label}} must be of string data type',
            'any.required': '{{#label}} is required',
            'any.only':
              '{{#label}} can only have one of these values: {{#valids}}',
          })
      )
      .required()
      .messages({
        'array.base': '{{#label}} must be of array data type',
        'any.required': '{{#label}} is required',
      }),
    images: Joi.string().required().messages({
      'string.base': '{{#label}} must be of string data type',
      'any.required': '{{#label}} is required',
    }),
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
          .required()
          .messages({
            'string.base': '{{#label}} must be of string data type',
            'any.required': '{{#label}} is required',
            'any.only':
              '{{#label}} can only have one of these values: {{#valids}}',
          })
      )
      .required()
      .messages({
        'array.base': '{{#label}} must be of array data type',
        'any.required': '{{#label}} is required',
      }),
  }),
})

export default bookstoreJoiSchema
