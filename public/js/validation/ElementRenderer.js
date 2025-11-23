import ElementRendererBase from '../abstracts/validation/ElementRendererBase.js'
import objectUtils from '../utils/objectUtils.js'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../abstracts/validation/SchemaAdataperBase.js'
class ElementRenderer extends ElementRendererBase {
  constructor() {
    super()
  }

  createTextElement(text, options = {}) {
    if (typeof text !== 'string') {
      throw new TypeError('First parameter needs to be of string data type')
    }

    const defaultOptions = {
      tagName: 'div',
      class: '',
      id: '',
      style: {
        color: 'black',
        fontSize: '16px',
      },
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
    }

    finalOptions.style = {
      ...defaultOptions.style,
      ...options.style,
    }

    const newElement = document.createElement(finalOptions.tagName)

    newElement.innerText = text

    if (typeof finalOptions.class === 'string') {
      const classes = finalOptions.class.split(' ')
      newElement.classList.add(...classes)
    }

    if (typeof finalOptions.id === 'string') {
      newElement.id = finalOptions.id
    }

    const styleKeys = Object.keys(finalOptions.style)

    for (let styleKey of styleKeys) {
      if (newElement.style[styleKey] === undefined) {
        throw new TypeError(`${styleKey} is not a valid style property`)
      }
      newElement.style[styleKey] = finalOptions.style[styleKey]
    }

    return newElement
  }
}

export default ElementRenderer
