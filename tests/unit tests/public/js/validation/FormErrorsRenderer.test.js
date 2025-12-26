// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FormErrorsRenderer from '../../../../../public/js/validation/FormErrorsRenderer.js'
import { Window } from 'happy-dom'
import ElementRenderer from '../../../../../public/js/validation/ElementRenderer.js'
import InputErrors from '../../../../../public/js/validation/InputErrors.js'
import { IS_ERRORS_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ErrorsRendererBase.js'
import CreateTextOptsSchema from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import SchemaAdapterBase from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
import ObjArgValidatorBase, {
  IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE,
} from '../../../../../public/js/abstracts/validation/ObjArgValidatorBase.js'
import e from 'express'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('FormErrorsRenderer', () => {
  let formErrorsRenderer
  let elementRenderer
  class ObjArgValidatorMock extends ObjArgValidatorBase {
    constructor() {
      super()
    }
  }

  let resultMock
  let objArgValidatorMock

  beforeEach(() => {
    document.body.innerHTML = ''

    objArgValidatorMock = new ObjArgValidatorMock()

    resultMock = {
      error: undefined,
    }
    objArgValidatorMock.options = {
      validate: vi.fn(function () {
        return resultMock
      }),
    }

    elementRenderer = new ElementRenderer(objArgValidatorMock)

    formErrorsRenderer = new FormErrorsRenderer(
      elementRenderer,
      objArgValidatorMock
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a non instance of ElementRendererBase, it should throw an error', () => {
    const elementRenderer = 3

    const fn = () => {
      new FormErrorsRenderer(elementRenderer)
    }

    expect(fn).toThrow(
      'You need to pass an isntance of ElementRendererBase to constructor'
    )
  })

  it('when you pass valid elementRenderer and objArgValidator to constructor, the instance should store those dependencies and have property that checks instance of ErrorsRendererBase', () => {
    const result = new FormErrorsRenderer(elementRenderer, objArgValidatorMock)

    expect(result.elementRenderer).toEqual(elementRenderer)
    expect(result.objArgValidator).toEqual(objArgValidatorMock)
    expect(result[IS_ERRORS_RENDERER_BASE_INSTANCE]).toBe(true)
  })

  it('when you pass a non instance of ObjArgValidatorBase to 2nd param of constructor, it should throw an error', () => {
    objArgValidatorMock = 3

    const fn = () => {
      new FormErrorsRenderer(elementRenderer, objArgValidatorMock)
    }

    expect(fn).toThrow(
      'You need to pass instance of ObjArgValidatorBase to 2nd parameter'
    )
  })

  describe('FormErrorsRenderer.render()', () => {
    it('when you pass a number to 1st param, it should throw an error', () => {
      const inputErrorsArray = 3

      const fn = () => {
        formErrorsRenderer.render()
      }

      expect(fn).toThrow('You need to pass an array of InputErrors instances')
    })

    it('when you pass an array where atleast 1 item is not InputErrors instance, it should throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text">
        </form>
      `
      const input = document.querySelector('input')
      const inputErrors = new InputErrors(input)
      const inputErrorsArray = [1, inputErrors]
      const options = {
        tagName: 'DIV',
        style: {
          color: 'black',
          fontSize: '16px',
        },
      }

      const fn = () => {
        formErrorsRenderer.render(inputErrorsArray, options)
      }

      expect(fn).toThrow('You need to pass an array of InputErrors instances')
    })

    it('given objArgValidator.options.validate() is mocked, when you pass inputErrorsArray and options, it should call objArgValidator.options.validate() with that options argument', () => {
      document.body.innerHTML = `
        <form>
          <fieldset>
            <input type = "text" name = "title" required>
          </fieldset>

          <fieldset>
            <input type = "text" name = "description" required>
          </fieldset>
        </form>
      `

      const input1 = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="description"]`)

      const inputErrors1 = new InputErrors(input1)
      inputErrors1.errors.push('test')
      const inputErrors2 = new InputErrors(input2)
      inputErrors2.errors.push('test')

      const inputErrorsArray = [inputErrors1, inputErrors2]

      const options = {
        tagName: 'div',
      }

      const result = formErrorsRenderer.render(inputErrorsArray, options)

      expect(objArgValidatorMock.options.validate).toBeCalledWith(options)
    })

    it('given objArgValidator.options.validate() is mocked to return an error, when you pass inputErrorsArray and options, it should throw that error', () => {
      const errorMock = new Error('test')
      resultMock = {
        error: errorMock,
      }

      const objArgValidator = new ObjArgValidatorMock()

      objArgValidator.options = {
        validate: vi.fn(() => {
          return resultMock
        }),
      }

      const formErrorsRenderer = new FormErrorsRenderer(
        elementRenderer,
        objArgValidator
      )

      document.body.innerHTML = `
        <form>
          <fieldset>
            <input type = "text" name = "title" required>
          </fieldset>

          <fieldset>
            <input type = "text" name = "description" required>
          </fieldset>
        </form>
      `

      const input1 = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="description"]`)

      const inputErrors1 = new InputErrors(input1)
      inputErrors1.errors.push('test')
      const inputErrors2 = new InputErrors(input2)
      inputErrors2.errors.push('test')

      const inputErrorsArray = [inputErrors1, inputErrors2]

      const options = {
        tagName: 'div',
      }

      const fn = () => {
        formErrorsRenderer.render(inputErrorsArray, options)
      }

      expect(fn).toThrowError(errorMock)
    })

    // it('when you pass a non plain obj to 2nd param, it should throw an error', () => {
    //   document.body.innerHTML = `
    //     <form>
    //       <input type = "text">
    //     </form>
    //   `
    //   const input = document.querySelector('input')
    //   const inputErrors = new InputErrors(input)
    //   const inputErrorsArray = [inputErrors]
    //   const options = 3

    //   const fn = () => {
    //     formErrorsRenderer.render(inputErrorsArray, options)
    //   }

    //   expect(fn).toThrow(
    //     'You need to pass a plain object with tagName and style properties to 2nd parameter'
    //   )
    // })

    // it('when you pass plain obj with missing tagName property, it should throw an error', () => {
    //   document.body.innerHTML = `
    //     <form>
    //       <input type = "text">
    //     </form>
    //   `
    //   const input = document.querySelector('input')
    //   const inputErrors = new InputErrors(input)
    //   const inputErrorsArray = [inputErrors]
    //   const options = {
    //     style: {
    //       color: 'black',
    //       fontSize: '16px',
    //     },
    //   }

    //   const fn = () => {
    //     formErrorsRenderer.render(inputErrorsArray, options)
    //   }

    //   expect(fn).toThrow(
    //     'You need to pass a plain object with tagName and style properties to 2nd parameter'
    //   )
    // })

    // it('when you pass plain obj with missing style property, it should throw an error', () => {
    //   document.body.innerHTML = `
    //     <form>
    //       <input type = "text">
    //     </form>
    //   `
    //   const input = document.querySelector('input')
    //   const inputErrors = new InputErrors(input)
    //   const inputErrorsArray = [inputErrors]
    //   const options = {
    //     tagName: 'div',
    //   }

    //   const fn = () => {
    //     formErrorsRenderer.render(inputErrorsArray, options)
    //   }

    //   expect(fn).toThrow(
    //     'You need to pass a plain object with tagName and style properties to 2nd parameter'
    //   )
    // })

    it('given a form with 2 fieldsets with an input in each of them, when you create an inputErrorsArray from those inputs with errors and pass it to 1st param and you pass a plain options obj in 2nd param, the errors should be correctly rendered according to what you specified in options obj', () => {
      document.body.innerHTML = `
        <form>
          <fieldset id = "fieldset1">
            <input type = "text" name = "title" required maxLength = "3">
          </fieldset>

          <fieldset id = "fieldset2">
            <input type = "checkbox" name = "genres" value = "fantasy" required>
          </fieldset>
        </form>
      `

      const fieldset1 = document.querySelector('#fieldset1')
      const fieldset2 = document.querySelector('#fieldset2')

      const input1 = document.querySelector(`[name="title"]`)
      const inputErrors1 = new InputErrors(input1)
      const requiredError = 'Field is required'
      const maxLengthError = 'Field exeeded maxLength'
      inputErrors1.errors.push(requiredError, maxLengthError)

      const input2 = document.querySelector(`[value="fantasy"]`)
      const inputErrors2 = new InputErrors(input2)
      const groupRequiredError = 'You must check atleast one item'
      inputErrors2.errors.push(groupRequiredError)

      const inputErrorsArray = [inputErrors1, inputErrors2]

      const options = {
        tagName: 'section',
        style: {
          color: 'purple',
          fontSize: '18px',
        },
      }

      const result = formErrorsRenderer.render(inputErrorsArray, options)

      expect(fieldset1.nextElementSibling.tagName).toBe(
        options.tagName.toUpperCase()
      )
      expect(fieldset1.nextElementSibling.innerText).toBe(
        inputErrors1.errors.join('')
      )
      expect(fieldset1.nextElementSibling.style.fontSize).toBe(
        options.style.fontSize
      )
      expect(fieldset1.nextElementSibling.style.color).toBe(options.style.color)

      expect(fieldset2.nextElementSibling.tagName).toBe(
        options.tagName.toUpperCase()
      )
      expect(fieldset2.nextElementSibling.innerText).toBe(
        inputErrors2.errors.join('')
      )
      expect(fieldset2.nextElementSibling.style.fontSize).toBe(
        options.style.fontSize
      )
      expect(fieldset2.nextElementSibling.style.color).toBe(options.style.color)
    })
  })
})
