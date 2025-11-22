import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidatorConfigSchema, {
  IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import OptionsJoiSchema from '../../../../../public/js/validation/OptionsJoiSchema.js'
import Joi from 'joi'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/joi/SchemaAdataperBase.js'
import SchemaAdapterBase from '../../../../../public/js/abstracts/joi/SchemaAdataperBase.js'

describe('ValidatorConfigSchema', () => {
  it('when when you pass OptionsJoiSchema instance to constructor, new instance should store correct validator config joi schema and property to check instance of SchemaAdapterBase and one that checks instance of itself', () => {
    const optionsJoiSchema = new OptionsJoiSchema()

    const result = new ValidatorConfigSchema(optionsJoiSchema)

    const expectedSchema = Joi.object({
      asyncUrl: Joi.object({
        isEmailUnique: Joi.string(),
      }),
      errors: optionsJoiSchema.schema,
    })

    expect(result.schema.describe()).toEqual(expectedSchema.describe())
    expect(result[IS_SCHEMA_ADAPTER_BASE_INSTANCE]).toBe(true)
    expect(result[IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE]).toBe(true)
  })

  it('when you pass a non instance of OptionsJoiSchema, it should throw an error', () => {
    const optionsSchema = { test: '123' }

    const fn = () => {
      new ValidatorConfigSchema(optionsSchema)
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

    const optionsSchema = new SubclassMock()

    const fn = () => {
      new ValidatorConfigSchema(optionsSchema)
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
    let optionsJoiSchema
    beforeEach(() => {
      optionsJoiSchema = new OptionsJoiSchema()

      validatorConfigSchema = new ValidatorConfigSchema(optionsJoiSchema)
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
