// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import SchemaParser from '../../../../../public/js/validation/SchemaParser.js'
import { Window } from 'happy-dom'
import ValidationSchema from '../../../../../public/js/validation/ValidationSchema.js'
import ValidationSchemaFactory from '../../../../../public/js/validation/ValidationSchemaFactory.js'
import InputRulesFactory from '../../../../../public/js/validation/InputRulesFactory.js'
import SchemaParser from '../../../../../public/js/validation/SchemaParser.js'
import FormInputExtracter from '../../../../../public/js/validation/FormInputExtracter.js'
import { IS_INPUT_EXTRACTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputExtracterBase.js'
import { IS_INPUT_RULES_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputRulesFactoryBase.js'
import { IS_INPUT_RULES_INSTANCE } from '../../../../../public/js/validation/InputRules.js'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

vi.stubGlobal('HTMLFormElement', window.HTMLFormElement)

describe('SchemaParser', () => {
  let schemaParser
  let inputExtracter
  let inputRulesFactory
  beforeEach(() => {
    document.body.innerHTML = ''
    inputExtracter = {
      [IS_INPUT_EXTRACTER_BASE_INSTANCE]: true,
      getFormInputs: vi.fn((form) => {
        return []
      }),
    }

    inputRulesFactory = {
      [IS_INPUT_RULES_FACTORY_BASE_INSTANCE]: true,
      create: vi.fn((input) => {
        return {
          input: input,
          rules: {},
          [IS_INPUT_RULES_INSTANCE]: true,
        }
      }),
    }
    schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when you pass a non instanceof InputExtracterBase to constructor, it should throw an error', () => {
    inputExtracter = 3

    const fn = () => {
      new SchemaParser(inputExtracter, inputRulesFactory)
    }

    expect(fn).toThrow(
      'First parmameter needs an instanceof InputExtracterBase'
    )
  })

  it('when you pass a non instanceof InputRulesFactory in 2nd param, it should throw an error', () => {
    const inputRulesFactory = 3

    const fn = () => {
      new SchemaParser(inputExtracter, inputRulesFactory)
    }

    expect(fn).toThrow(
      'Second parameter needs to be instanceof InputRulesFactoryBase'
    )
  })
  it('when you pass instance of InputExtracterBase to 1st param and instance of InputRulesFactory to 2nd param in constructor, the instance should store those dependencies in instance properties', () => {
    const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)

    expect(schemaParser.inputExtracter).toEqual(inputExtracter)
    expect(schemaParser.inputRulesFactory).toEqual(inputRulesFactory)
  })

  describe('schemaParser.parse()', () => {
    it("when you don't pass a form in 1st param, it should throw an error", () => {
      const form = 3
      const schema = new ValidationSchema({
        title: {
          required: true,
          maxLength: 3,
        },
      })

      const fn = () => {
        schemaParser.parse(form, schema)
      }

      expect(fn).toThrow('You need to pass a form element to first parameter')
    })
    it('when you pass a non ValidationSchema instance, it should throw an error', () => {
      const form = document.createElement('form')
      const validationSchema = 3

      const fn = () => {
        schemaParser.parse(form, validationSchema)
      }

      expect(fn).toThrow('You need to pass an instance of ValidationSchema')
    })
    it('given inputExtracter.getFormInputs() return a mocked array of an input, when you pass valid form and schema, it should call inputExtracter.getFormInputs with that form', () => {
      document.body.innerHTML = `<input type = "text" name = "title">`
      const input = document.querySelector(`[name="title"]`)

      inputExtracter.getFormInputs.mockReturnValue([input])

      const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)
      const form = document.createElement('form')
      const schema = new ValidationSchema({
        title: { requied: true, maxLength: 3 },
      })

      const result = schemaParser.parse(form, schema)

      expect(inputExtracter.getFormInputs).toBeCalledWith(form)
    })

    it('given inputExtracter.getFormInputs() returns an array of input elements where one of them whose name attribute value is not in the schema, it should throw an error', () => {
      document.body.innerHTML = `
      <form>
        <input type = "text" name = "title" required>
        <input type = "text" name = "description">
      </form>`
      const form = document.querySelector('form')
      const input = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="description"]`)
      const inputs = [input, input2]
      inputExtracter.getFormInputs.mockReturnValue(inputs)
      const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)
      const schema = new ValidationSchema({
        title: {
          required: true,
        },
        test: {
          required: true,
        },
      })

      const fn = () => {
        schemaParser.parse(form, schema)
      }

      expect(fn).toThrow('Cannot find input with name attribute of "test"')
    })

    it('given inputExtracter.getFormInputs is mocked to return an array of single inputs that are specified in a schema, when you pass valid form and that schema, it should return an array of correct InputRules instances', () => {
      document.body.innerHTML = `
      <form>
        <input type = "text" name = "title" required>
        <input type = "text" name = "description" required maxLength = "3">
      </form>`
      const form = document.querySelector('form')
      const input = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="description"]`)
      const inputs = [input, input2]
      inputExtracter.getFormInputs.mockReturnValue(inputs)
      const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)
      const schema = new ValidationSchema({
        title: {
          required: true,
        },
        description: {
          required: true,
          maxLength: 3,
        },
      })
      const inputRules = inputRulesFactory.create(input)
      inputRules.rules.required = true
      const inputRules2 = inputRulesFactory.create(input2)
      inputRules2.rules.required = true
      inputRules2.rules.maxLength = 3
      const inputRulesArray = [inputRules, inputRules2]

      const result = schemaParser.parse(form, schema)

      expect(result).toEqual(inputRulesArray)
    })

    it('given inputExtracter.getFormInputs() returns an array of group inputs that are specified in a schema, when you pass valid input and that schema, it should return an array of InputGroup instances which are the first group inputs of their respective group', () => {
      document.body.innerHTML = `
      <form>
        <input type = "checkbox" name = "title" value = "Library" required>
        <input type = "checkbox" name = "title" value = "Bookstore" required>
        
        <input type = "radio" name = "online" value = "true" required>
        <input type = "radio" name = "online" value = "false" required>
      </form>`
      const form = document.querySelector('form')
      const checkboxes = Array.from(form.elements.title)
      const radios = Array.from(form.elements.online)
      const inputs = [checkboxes, radios]
      inputExtracter.getFormInputs.mockReturnValue(inputs)
      const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)
      const schema = new ValidationSchema({
        title: {
          required: true,
        },
        online: {
          required: true,
        },
      })
      const firstCheckboxInputRules = inputRulesFactory.create(checkboxes[0])
      const firstRadioInputRules = inputRulesFactory.create(radios[0])
      firstCheckboxInputRules.rules.required = true
      firstRadioInputRules.rules.required = true
      const inputRulesArray = [firstCheckboxInputRules, firstRadioInputRules]

      const result = schemaParser.parse(form, schema)

      expect(result).toEqual(inputRulesArray)
    })
    it('given inputExtracter.getFormInputs() returns an array of single inputs and group inputs that are specified in a schema, when you pass a valid form and that schema, it should return an array of correct InputRules instances', () => {
      document.body.innerHTML = `
      <form>
        <input type = "text" name = "address" required>
        <input type = "text" name = "description" required maxLength = "3">
        
        <input type = "checkbox" name = "title" value = "Library" required>
        <input type = "checkbox" name = "title" value = "Bookstore" required>
        
        <input type = "radio" name = "online" value = "true" required>
        <input type = "radio" name = "online" value = "false" required>
      </form>`
      const form = document.querySelector('form')
      const inputText1 = document.querySelector(`[name="address"]`)
      const inputText2 = document.querySelector(`[name="description"]`)
      const checkboxes = Array.from(form.elements.title)
      const radios = Array.from(form.elements.online)
      const inputs = [inputText1, inputText2, checkboxes, radios]
      inputExtracter.getFormInputs.mockReturnValue(inputs)
      const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory)
      const schema = new ValidationSchema({
        address: {
          required: true,
        },
        description: {
          required: true,
          maxLength: 3,
        },
        title: {
          required: true,
        },
        online: {
          required: true,
        },
      })
      const inputText1InputRules = inputRulesFactory.create(inputText1)
      const inputText2InputRules = inputRulesFactory.create(inputText2)

      inputText1InputRules.rules.required = true
      inputText2InputRules.rules.required = true
      inputText2InputRules.rules.maxLength = 3

      const firstCheckboxInputRules = inputRulesFactory.create(checkboxes[0])
      const firstRadioInputRules = inputRulesFactory.create(radios[0])
      firstCheckboxInputRules.rules.required = true
      firstRadioInputRules.rules.required = true

      const inputRulesArray = [
        inputText1InputRules,
        inputText2InputRules,
        firstCheckboxInputRules,
        firstRadioInputRules,
      ]

      const result = schemaParser.parse(form, schema)

      expect(result).toEqual(inputRulesArray)
    })
  })
})
