import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidatorConfigSchema, {
  IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import CreateTextOptsSchema from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import Joi from 'joi'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
import SchemaAdapterBase from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'

describe('ValidatorConfigSchema', () => {
  it('when when you pass valid CreateTextOptsSchema instance to constructor, new instance should store correct properties and their values', () => {
    const createTextOptsSchema = new CreateTextOptsSchema()

    const result = new ValidatorConfigSchema(createTextOptsSchema)

    const expectedSchema = Joi.object({
      asyncUrl: Joi.object({
        isEmailUnique: Joi.string(),
      }),
      errors: createTextOptsSchema.schema,
    })

    expect(result.schema.describe()).toEqual(expectedSchema.describe())
    expect(result[IS_SCHEMA_ADAPTER_BASE_INSTANCE]).toBe(true)
    expect(result[IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE]).toBe(true)
    expect(result.name).toBe('config')
  })

  it('when you pass a non instance of CreateTextOptsSchema, it should throw an error', () => {
    const createTextOptsSchema = { test: '123' }

    const fn = () => {
      new ValidatorConfigSchema(createTextOptsSchema)
    }
    expect(fn).toThrow(
      'You need to pass instance of SchemaAdapterBase to 1st parameter'
    )
  })

  it('when you pass instance of a mock subclass of SchemaAdapterBase, it should throw an error', () => {
    class SubclassMock extends SchemaAdapterBase {
      constructor() {
        super()
      }
    }

    const createTextOptsSchema = new SubclassMock()

    const fn = () => {
      new ValidatorConfigSchema(createTextOptsSchema)
    }
    expect(fn).toThrow(
      'You need to pass instance of SchemaAdapterBase to 1st parameter'
    )
  })

  it("when you don't pass any value to 1st param, it should throw an error", () => {
    const fn = () => {
      new ValidatorConfigSchema()
    }
    expect(fn).toThrow(
      'You need to pass instance of SchemaAdapterBase to 1st parameter'
    )
  })

  describe('validatorConfigSchema.validate()', () => {
    let validatorConfigSchema
    let createTextOptsSchema
    beforeEach(() => {
      createTextOptsSchema = new CreateTextOptsSchema()

      validatorConfigSchema = new ValidatorConfigSchema(createTextOptsSchema)
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
