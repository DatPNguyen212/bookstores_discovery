import ElementRendererBase from '../../abstracts/services/dom/ElementRendererBase.js'
class ElementRenderer extends ElementRendererBase {
  constructor() {
    super()
  }

  static createTextElement(
    text,
    options = { tagName: 'div', style: { color: 'black', fontSize: '16px' } }
  ) {
    if (typeof text !== 'string') {
      throw new TypeError('First parameter needs to be of string data type')
    }
    if (options.tagName === undefined) {
      options.tagName = 'div'
    }

    if (options.style === undefined) {
      options.style = {
        color: 'black',
        fontSize: '16px',
      }
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
