import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidatorConfigSchema, {
  IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import CreateTextOptsSchema from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import Joi from 'joi'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
import SchemaAdapterBase from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'

describe('ValidatorConfigSchema', () => {
  it('when when you pass valid paramName and CreateTextOptsSchema instance to constructor, new instance should store that paramName, correct validator config joi schema and property to check instance of SchemaAdapterBase and one that checks instance of itself', () => {
    const createTextOptsParamName = 'options'
    const createTextOptsSchema = new CreateTextOptsSchema(
      createTextOptsParamName
    )
    const validatorConfigParamName = 'config'

    const result = new ValidatorConfigSchema(
      validatorConfigParamName,
      createTextOptsSchema
    )

    const expectedSchema = Joi.object({
      asyncUrl: Joi.object({
        isEmailUnique: Joi.string(),
      }),
      errors: createTextOptsSchema.schema,
    })

    expect(result.paramName).toBe(validatorConfigParamName)
    expect(result.schema.describe()).toEqual(expectedSchema.describe())
    expect(result[IS_SCHEMA_ADAPTER_BASE_INSTANCE]).toBe(true)
    expect(result[IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE]).toBe(true)
  })

  it('when you pass a non instance of CreateTextOptsSchema to 2nd param, it should throw an error', () => {
    const paramName = 'config'
    const createTextOptsSchema = { test: '123' }

    const fn = () => {
      new ValidatorConfigSchema(paramName, createTextOptsSchema)
    }
    expect(fn).toThrow(
      'You need to pass instance of SchemaAdapterBase to 1st parameter'
    )
  })

  it('when you pass instance of a mock subclass of SchemaAdapterBase to 2nd param, it should throw an error', () => {
    class SubclassMock extends SchemaAdapterBase {
      constructor() {
        super()
      }
    }

    const createTextOptsSchema = new SubclassMock()
    const paramName = 'config'

    const fn = () => {
      new ValidatorConfigSchema(paramName, createTextOptsSchema)
    }
    expect(fn).toThrow(
      'You need to pass instance of SchemaAdapterBase to 1st parameter'
    )
  })

  it('when you pass a non string value to 1st param, it should throw an error', () => {
    const paramName = 3

    const createTextOptsParamName = 'options'
    const createTextOptsSchema = new CreateTextOptsSchema(
      createTextOptsParamName
    )

    const fn = () => {
      new ValidatorConfigSchema(paramName, createTextOptsSchema)
    }

    expect(fn).toThrow('You need to pass string data type to first parameter')
  })

  describe('validatorConfigSchema.validate()', () => {
    let validatorConfigSchema
    let createTextOptsSchema
    let createTextOptsParamName
    let validatorConfigParamName
    beforeEach(() => {
      createTextOptsParamName = 'options'

      createTextOptsSchema = new CreateTextOptsSchema(createTextOptsParamName)

      validatorConfigParamName = 'config'

      validatorConfigSchema = new ValidatorConfigSchema(
        validatorConfigParamName,
        createTextOptsSchema
      )
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('when you pass an obj that does not satisfy the schema stored in the instance, it should return an error', () => {
      const obj = 3

      const result = validatorConfigSchema.validate(obj)

      expect(Joi.isError(result)).toBe(true)
    })

    it('when you pass obj that satisfy the schema stored in instance state, it should return null', () => {
      const obj = {
        asyncUrl: {
          isEmailUnique: 'endpointUrl',
        },
        errors: {
          tagName: 'div',
          class: 'testClass',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        },
      }

      const result = validatorConfigSchema.validate(obj)

      expect(result).toBeNull()
    })
  })
})
