import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import OptionsJoiSchema, {
  IS_OPTIONS_JOI_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/OptionsJoiSchema.js'
import Joi from 'joi'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/joi/SchemaAdataperBase.js'

describe('OptionsJoiSchema', () => {
  it('should instantiate with correct options schema and have property that check instanceof OptionsJoiSchema', () => {
    const result = new OptionsJoiSchema()

    const expectedSchema = Joi.object({
      tagName: Joi.string(),
      class: Joi.string(),
      id: Joi.string(),
      style: Joi.object().pattern(Joi.string(), Joi.string()),
    })

    expect(result.schema.describe()).toEqual(expectedSchema.describe())
    expect(result[IS_OPTIONS_JOI_SCHEMA_INSTANCE]).toBe(true)
  })
  describe('optionsJoiSchema.validate()', () => {
    let optionsJoiSchema
    beforeEach(() => {
      optionsJoiSchema = new OptionsJoiSchema()
    })
    it('when you pass a number, it should return an error from Joi', () => {
      const obj = 3

      const result = optionsJoiSchema.validate(obj)

      expect(Joi.isError(result)).toBe(true)
    })

    it('when you pass a plain obj that does not satisfy schema, it should return an error from Joi', () => {
      const obj = {
        tagName: 3,
      }

      const result = optionsJoiSchema.validate(obj)

      expect(Joi.isError(result)).toBe(true)
    })

    it('when you pass an options obj that does satisfy the options schema, it should return null', () => {
      const options = {
        tagName: 'div',
        class: 'testClass',
        id: 'testId',
        style: {
          color: 'red',
          fontSize: 'black',
        },
      }

      const result = optionsJoiSchema.validate(options)

      expect(result).toBeNull()
    })
  })
})
