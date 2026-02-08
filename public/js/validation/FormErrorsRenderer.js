import { IS_ELEMENT_RENDERER_BASE_INSTANCE } from '../abstracts/validation/ElementRendererBase.js'
import { IS_INPUT_ERRORS_INSTANCE } from './InputErrors.js'
import objectUtils from '../utils/objectUtils.js'
import ErrorsRendererBase from '../abstracts/validation/ErrorsRendererBase.js'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../abstracts/validation/SchemaAdataperBase.js'
import { IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/ObjArgValidatorBase.js'

class FormErrorsRenderer extends ErrorsRendererBase {
  constructor(elementRenderer, objArgValidator) {
    super()
    if (!elementRenderer?.[IS_ELEMENT_RENDERER_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass an isntance of ElementRendererBase to constructor'
      )
    }

    if (!objArgValidator?.[IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of ObjArgValidatorBase to 2nd parameter'
      )
    }

    this.elementRenderer = elementRenderer
    this.objArgValidator = objArgValidator
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

    const { error } = this.objArgValidator.options.validate(options)

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

    const oldErrorElements = Array.from(
      document.querySelectorAll(`.${options.class}`)
    )

    for (let oldErrorElement of oldErrorElements) {
      oldErrorElement.remove()
    }

    for (let inputErrors of inputErrorsArray) {
      if (!inputErrors.isEmpty()) {
        const input = inputErrors.input
        const errors = inputErrors.errors
        const errorMsg = errors.join('')

        const newErrorElement = this.elementRenderer.createTextElement(
          errorMsg,
          options
        )

        const fieldset = input.closest('fieldset')

        fieldset.after(newErrorElement)
      }
    }
  }
}

export default FormErrorsRenderer
