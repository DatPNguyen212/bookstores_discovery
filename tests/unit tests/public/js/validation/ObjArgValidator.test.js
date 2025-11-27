import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ObjArgValidator, {
  IS_OBJ_ARG_VALIDATOR_INSTANCE,
} from '../../../../../public/js/validation/ObjArgValidator.js'
import CreateTextOptsSchema from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import ValidatorConfigSchema from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import SchemaAdapterBase, {
  IS_SCHEMA_ADAPTER_BASE_INSTANCE,
} from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
import Joi from 'joi'

describe('ObjArgValidator', () => {
  class SchemaAdapterMock extends SchemaAdapterBase {
    constructor() {
      super()
    }
  }
  let schemaAdapterMock
  beforeEach(() => {
    schemaAdapterMock = new SchemaAdapterMock()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a non instance of SchemaAdapterBase, it should throw an error', () => {
    schemaAdapterMock = 3

    const fn = () => {
      new ObjArgValidator(schemaAdapterMock)
    }

    expect(fn).toThrow('You need to pass intsance of SchemaAdapterBase')
  })

  it("when you don't pass any value, it should throw an error", () => {
    const fn = () => {
      new ObjArgValidator()
    }

    expect(fn).toThrow('You need to pass intsance of SchemaAdapterBase')
  })

  it('when you pass an array that contains atleast 1 non instance of SchemaAdapterBase, it should throw an error', () => {
    const schemaAdapters = [1, schemaAdapterMock]

    const fn = () => {
      new ObjArgValidator(schemaAdapters)
    }

    expect(fn).toThrow(
      'Your array items need to be ALL isntances of SchemaAdapterBase'
    )
  })

  it('when you pass an array that contains atleast 1 undefined item, it should throw an error', () => {
    schemaAdapterMock = undefined
    const schemaAdapters = [1, schemaAdapterMock]

    const fn = () => {
      new ObjArgValidator(schemaAdapters)
    }

    expect(fn).toThrow(
      'Your array items need to be ALL isntances of SchemaAdapterBase'
    )
  })

  it('given a SchemaAdapterMock extends from SchemaAdapterBase, when you pass its instance to constructor, new instance should store it in property whose key is that schemaAdapterMock.paramName and value is schemaAdapterMock.schema, and it should have property that checks instance of constructor', () => {
    const paramName = 'options'
    const schemaMock = Joi.object({
      tagName: Joi.string(),
    })
    class SchemaAdapterMock extends SchemaAdapterBase {
      constructor() {
        super()
        this.paramName = paramName
        this.schema = schemaMock
      }
    }

    const schemaAdapterMock = new SchemaAdapterMock()

    const result = new ObjArgValidator(schemaAdapterMock)

    expect(result[schemaAdapterMock.paramName]).toEqual(
      schemaAdapterMock.schema
    )
    expect(result[IS_OBJ_ARG_VALIDATOR_INSTANCE]).toBe(true)
  })

  it('given 2 different mock classes with different paramName instance property values extended from SchemaAdapterBase, when you pass an array of instances of those 2 mock classes, the new instance should contain 2 properties whose keys are the .propertyName value of the respective mock class, and value is the the respective mock class schema property value, and it should have property that checks instance of constructor', () => {
    const paramName1 = 'option'
    const schema1 = Joi.object({
      tagName: Joi.string(),
    })

    class SchemaAdapterMock1 extends SchemaAdapterBase {
      constructor() {
        super()
        this.paramName = paramName1
        this.schema = schema1
      }
    }

    const paramName2 = 'config'
    const schema2 = Joi.object({
      tagName: Joi.string(),
    })

    class SchemaAdapterMock2 extends SchemaAdapterBase {
      constructor() {
        super()
        this.paramName = paramName2
        this.schema = schema2
      }
    }

    const schemaAdapterMock1 = new SchemaAdapterMock1()

    const schemaAdapterMock2 = new SchemaAdapterMock2()

    const schemaAdapters = [schemaAdapterMock1, schemaAdapterMock2]

    const result = new ObjArgValidator(schemaAdapters)

    expect(result[paramName1]).toEqual(schemaAdapterMock1.schema)
    expect(result[paramName2]).toEqual(schemaAdapterMock2.schema)
    expect(result[IS_OBJ_ARG_VALIDATOR_INSTANCE]).toBe(true)
  })

  it('given 3 different mock classes where 2 of them has THE SAME paramName instance property values extended from SchemaAdapterBase, when you pass an array of instances of those 2 mock classes to constructor, it should throw an error', () => {
    const paramName = 'option'
    const schema1 = Joi.object({
      tagName: Joi.string(),
    })

    class SchemaAdapterMock1 extends SchemaAdapterBase {
      constructor() {
        super()
        this.paramName = paramName
        this.schema = schema1
      }
    }

    const schema2 = Joi.object({
      tagName: Joi.string(),
    })

    class SchemaAdapterMock2 extends SchemaAdapterBase {
      constructor() {
        super()
        this.paramName = paramName
        this.schema = schema2
      }
    }

    const paramName3 = 'test'
    const schema3 = Joi.object({
      tagName: Joi.string(),
    })

    class SchemaAdapterMock3 extends SchemaAdapterBase {
      constructor() {
        super()
        this.paramName = paramName3
        this.schema = schema3
      }
    }

    const schemaAdapterMock1 = new SchemaAdapterMock1()

    const schemaAdapterMock2 = new SchemaAdapterMock2()

    const schemaAdapterMock3 = new SchemaAdapterMock3()

    const schemaAdapters = [
      schemaAdapterMock1,
      schemaAdapterMock2,
      schemaAdapterMock3,
    ]

    const fn = () => {
      new ObjArgValidator(schemaAdapters)
    }

    expect(fn).toThrow(
      'There are SchemaAdapterBase instances with the same .paramName value. Each SchemaAdapterBase instance in the array needs to have unique .paramName value'
    )
  })
})
