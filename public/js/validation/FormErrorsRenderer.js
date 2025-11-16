import { IS_ELEMENT_RENDERER_BASE_INSTANCE } from '../abstracts/validation/ElementRendererBase.js'
import { IS_INPUT_ERRORS_INSTANCE } from './InputErrors.js'

class FormErrorsRenderer {
  constructor(elementRenderer) {
    if (
      !elementRenderer ||
      !elementRenderer[IS_ELEMENT_RENDERER_BASE_INSTANCE]
    ) {
      throw new TypeError(
        'You need to pass an isntance of ElementRendererBase to constructor'
      )
    }
    this.elementRenderer = elementRenderer
  }

  render(inputErrorsArray) {
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

    for (let inputErrors of inputErrorsArray) {
      const input = inputErrors.input
      const errors = inputErrors.errors
      const errorMsg = errors.join(', ')

      const options = {
        tagName: 'div',
        style: {
          color: 'red',
          fontSize: '16px',
        },
      }
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
