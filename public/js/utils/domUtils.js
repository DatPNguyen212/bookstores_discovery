import objectUtils from './objectUtils.js'

const domUtils = {
  createElement(tagName, styleObj) {
    if (typeof tagName !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }

    if (!objectUtils.isPlainObject(styleObj)) {
      throw new TypeError('Second parameter should be a plain object')
    }

    const keys = Object.keys(styleObj)
    let newElement = document.createElement(tagName)

    for (let key of keys) {
      const newStyleValue = styleObj[key]
      newElement.style[key] = newStyleValue
    }

    return newElement
  },
}

export default domUtils
