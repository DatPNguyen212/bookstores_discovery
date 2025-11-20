import { IS_ELEMENT_RENDERER_BASE_INSTANCE } from '../abstracts/validation/ElementRendererBase.js'
import { IS_INPUT_ERRORS_INSTANCE } from './InputErrors.js'
import objectUtils from '../utils/objectUtils.js'
import ErrorsRendererBase from '../abstracts/validation/ErrorsRendererBase.js'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../abstracts/joi/SchemaAdataperBase.js'

class FormErrorsRenderer extends ErrorsRendererBase {
  constructor(elementRenderer, optionsSchema) {
    super()
    if (
      !elementRenderer ||
      !elementRenderer[IS_ELEMENT_RENDERER_BASE_INSTANCE]
    ) {
      throw new TypeError(
        'You need to pass an isntance of ElementRendererBase to constructor'
      )
    }

    if (!optionsSchema || !optionsSchema[IS_SCHEMA_ADAPTER_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass an instance of SchemaAdapterBase to 2nd parameter'
      )
    }
    this.elementRenderer = elementRenderer
    this.optionsSchema = optionsSchema
  }

  render(inputErrorsArray, options) {
    if (!Array.isArray(inputErrorsArray)) {
      throw new TypeError('You need to pass an array of InputErrors instances')
    } else {
      for (let inputErrors of inputErrorsArray) {
        if (!inputErrors[IS_INPUT_ERRORS_INSTANCE]) {
          throw new TypeError(
            'You need to pass an array of InputErrors instances'
          )
        }
      }
    }

    const error = this.optionsSchema.validate(options)

    if (error) {
      throw error
    }

    // if (
    //   !objectUtils.isPlainObject(options) ||
    //   !options.tagName ||
    //   !options.style
    // ) {
    //   throw new TypeError(
    //     'You need to pass a plain object with tagName and style properties to 2nd parameter'
    //   )
    // }

    for (let inputErrors of inputErrorsArray) {
      const input = inputErrors.input
      const errors = inputErrors.errors
      const errorMsg = errors.join(', ')

      const newErrorElement = this.elementRenderer.createTextElement(
        errorMsg,
        options
      )

      const fieldset = input.closest('fieldset')

      fieldset.after(newErrorElement)
    }
  }
}

export default FormErrorsRenderer
