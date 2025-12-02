import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidationSchema from '../../../../../public/js/validation/ValidationSchema.js'
import { IS_VALIDATION_SCHEMA_INSTANCE } from '../../../../../public/js/validation/ValidationSchema.js'

describe('new ValidationSchema()', () => {
  it('if you pass an object which contains names of inputs and their schemas, it should return an obj with those same properties and their values AND a prpoerty that checks instanceof', () => {
    const schemaDef = {
      title: {
        required: true,
        maxLength: 3,
      },
      description: {
        required: true,
      },
    }

    const validationSchema = new ValidationSchema(schemaDef)

    expect(validationSchema.title.required).toBe(true)
    expect(validationSchema.title.maxLength).toBe(3)
    expect(validationSchema.description.required).toBe(true)
    expect(validationSchema[IS_VALIDATION_SCHEMA_INSTANCE]).toBe(true)
  })

  it('when you pass a non plain obj data type to constructor, it should throw an error', () => {
    const schemaDef = 3

    const fn = () => {
      new ValidationSchema(schemaDef)
    }

    expect(fn).toThrow('You need to pass a plain object to 1st parameter')
  })
  it('when you pass an empty plain obj to constructor, it should throw an error', () => {
    const schemaDef = {}

    const fn = () => {
      new ValidationSchema(schemaDef)
    }

    expect(fn).toThrow(
      'You need to pass a plain object that is NOT empty in 1st parameter'
    )
  })
})
