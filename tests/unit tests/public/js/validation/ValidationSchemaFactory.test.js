import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidationSchemaFactory from '../../../../../public/js/validation/ValidationSchemaFactory.js'
import ValidationSchema from '../../../../../public/js/validation/ValidationSchema.js'

describe('ValidationSchemaFactory', () => {
  let validationSchemaFactory
  beforeEach(() => {
    validationSchemaFactory = new ValidationSchemaFactory()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('validationSchemaFactory.create()', () => {
    it('when you pass an obj which contains properties, it should return an obj which is instanceof ValidationSchema and contains those properties', () => {
      const schemaDef = {
        required: true,
        maxLength: 3,
      }

      const result = validationSchemaFactory.create(schemaDef)

      expect(result).instanceOf(ValidationSchema)
      expect(result.required).toBe(true)
      expect(result.maxLength).toBe(3)
    })

    it('when you pass a value that is not plain obj, it should throw an error', () => {
      const schemaDef = 3

      const fn = () => {
        validationSchemaFactory.create(schemaDef)
      }

      expect(fn).toThrow(
        'You need to pass a non empty plain object to first parameter'
      )
    })

    it('when you pass a plain obj that is empty, it should throw an error', () => {
      const schemaDef = {}

      const fn = () => {
        validationSchemaFactory.create(schemaDef)
      }

      expect(fn).toThrow(
        'You need to pass a non empty plain object to first parameter'
      )
    })
  })
})
