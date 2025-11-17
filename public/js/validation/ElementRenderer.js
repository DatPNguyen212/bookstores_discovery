import ElementRendererBase from '../abstracts/validation/ElementRendererBase.js'
import objectUtils from '../utils/objectUtils.js'
class ElementRenderer extends ElementRendererBase {
  constructor() {
    super()
  }

  createTextElement(
    text,
    options = { tagName: 'div', style: { color: 'black', fontSize: '16px' } }
  ) {
    if (typeof text !== 'string') {
      throw new TypeError('First parameter needs to be of string data type')
    }

    if (
      !objectUtils.isPlainObject(options) ||
      !options.tagName ||
      !options.style
    ) {
      throw new TypeError(
        'You need to pass plain obj that contains tagName and style properties'
      )
    }

    const newElement = document.createElement(options.tagName)

    newElement.textContent = text
    newElement.classList.add(options.class)
    newElement.id = options.id

    const styleKeys = Object.keys(options.style)

    for (let styleKey of styleKeys) {
      if (newElement.style[styleKey] === undefined) {
        throw new TypeError(`${styleKey} is not a valid style property`)
      }
      newElement.style[styleKey] = options.style[styleKey]
    }

    return newElement
  }
}

export default ElementRenderer
