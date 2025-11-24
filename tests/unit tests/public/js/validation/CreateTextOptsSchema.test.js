import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import CreateTextOptsSchema, {
  IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import Joi from 'joi'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'

describe('CreateTextOptsSchema', () => {
  it('should instantiate with correct properties and their values', () => {
    const result = new CreateTextOptsSchema()

    const expectedSchema = Joi.object({
      tagName: Joi.string(),
      class: Joi.string(),
      id: Joi.string(),
      style: Joi.object().pattern(Joi.string(), Joi.string()),
    })

    expect(result.schema.describe()).toEqual(expectedSchema.describe())
    expect(result[IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE]).toBe(true)
    expect(result.name).toBe('textElementOpts')
  })
  describe('createTextOptsSchema.validate()', () => {
    let createTextOptsSchema
    beforeEach(() => {
      createTextOptsSchema = new CreateTextOptsSchema()
    })
    it('when you pass a number, it should return an error from Joi', () => {
      const obj = 3

      const result = createTextOptsSchema.validate(obj)

      expect(Joi.isError(result)).toBe(true)
    })

    it('when you pass a plain obj that does not satisfy schema, it should return an error from Joi', () => {
      const obj = {
        tagName: 3,
      }

      const result = createTextOptsSchema.validate(obj)

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

      const result = createTextOptsSchema.validate(options)

      expect(result).toBeNull()
    })
  })
})
