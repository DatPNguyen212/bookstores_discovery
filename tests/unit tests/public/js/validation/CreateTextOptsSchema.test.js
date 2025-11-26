import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import CreateTextOptsSchema, {
  IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import Joi from 'joi'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'

describe('CreateTextOptsSchema', () => {
  it('when you pass a non string value, it should throw an error', () => {
    const paramName = 3

    const fn = () => {
      new CreateTextOptsSchema(paramName)
    }

    expect(fn).toThrow('You need to pass string data type to first parameter')
  })

  it('when you pass a string, new instance should have paramName property with that string value, schema property with correct JOI schema and a property that checks instance of this constructor', () => {
    const paramName = 'options'

    const result = new CreateTextOptsSchema(paramName)

    const expectedSchema = Joi.object({
      tagName: Joi.string(),
      class: Joi.string(),
      id: Joi.string(),
      style: Joi.object().pattern(Joi.string(), Joi.string()),
    })

    expect(result.paramName).toBe(paramName)
    expect(result.schema.describe()).toEqual(expectedSchema.describe())
    expect(result[IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE]).toBe(true)
  })
  describe('createTextOptsSchema.validate()', () => {
    let paramName
    let createTextOptsSchema
    beforeEach(() => {
      paramName = 'options'
      createTextOptsSchema = new CreateTextOptsSchema(paramName)
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
