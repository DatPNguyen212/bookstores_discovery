import lodash from 'lodash'

class FormInputExtracter {
  constructor(form) {
    if (form.tagName !== 'FORM') {
      throw new TypeError('You need to pass a form element as an argument')
    }

    this.form = form
  }

  getFormInputs() {
    const elements = this.form.elements
    let result = []

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]

      let isUnique = true

      if (
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.tagName === 'SELECT'
      ) {
        for (let j = 0; j < result.length; j++) {
          const itemInResult = result[j]
          const selectionElements = []

          if (!lodash.isArray(itemInResult)) {
            if (element.name === itemInResult.name) {
              isUnique = false

              selectionElements.push(result[j], element)

              result[j] = selectionElements
            }
          } else {
            if (itemInResult[0].name === element.name) {
              isUnique = false
              result[j].push(element)
            }
          }
        }

        if (isUnique === true) {
          result.push(element)
        }
      }
    }

    return result
  }

  getFormInputWrapper() {}
}

export default FormInputExtracter
