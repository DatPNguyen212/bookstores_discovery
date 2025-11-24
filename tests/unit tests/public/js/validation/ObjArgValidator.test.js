import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ObjArgValidator from '../../../../../public/js/validation/ObjArgValidator.js'
import CreateTextOptsSchema from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import ValidatorConfigSchema from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import SchemaAdapterBase, {
  IS_SCHEMA_ADAPTER_BASE_INSTANCE,
} from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'

describe('ObjArgValidator', () => {
  let schemaAdapterMock
  class SchemaAdapterMock extends SchemaAdapterBase {
    constructor() {
      super()
      this[IS_SCHEMA_ADAPTER_BASE_INSTANCE] = true
      this.name = 'test'
    }
  }

  beforeEach(() => {
    schemaAdapterMock = new SchemaAdapterMock()
  })

  it('when you pass a non instance of SchemaAdapterBase, it should throw an error', () => {
    const schemaAdapter = 3

    const fn = () => {
      new ObjArgValidator(schemaAdapter)
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
    const schemaAdapterMock = undefined
    const schemaAdapters = [1, schemaAdapterMock]

    const fn = () => {
      new ObjArgValidator(schemaAdapters)
    }

    expect(fn).toThrow(
      'Your array items need to be ALL isntances of SchemaAdapterBase'
    )
  })

  it('when you pass a single valid instance of SingleAdapterBase to constructor, new instance should store that schemaAdapter correctly', () => {
    const result = new ObjArgValidator(schemaAdapterMock)

    expect(result.schema).toEqual(schemaAdapterMock)
  })

  it('when you pass an array of instances of SchemaAdaptersBase, objArgValidator.schemas needs to store that array', () => {
    const schemaAdapter1 = new SchemaAdapterMock()
    const schemaAdapter2 = new SchemaAdapterMock()

    const schemaAdapters = [schemaAdapter1, schemaAdapter2]

    const result = new ObjArgValidator(schemaAdapters)

    expect(result.schemas).toEqual(schemaAdapters)
  })
})
