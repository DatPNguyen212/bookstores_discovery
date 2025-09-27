class FormValidator {
  constructor(form, validators, domUtils) {
    const controllers = form.elements

    this['bookstore[genres]'] = []
    this['bookstore[openDays]'] = []

    for (let controller of controllers) {
      if (controller.type === 'checkbox') {
        this[controller.name].push(controller)
      } else {
        this[controller.name] = controller
      }
    }
    this.validators = validators
    this.domUtils = domUtils
    this.form
  }

  isValidForm() {
    const nameError = this.validators.isValidStoreName(
      this['bookstore[name]'].value
    )
    const addressError = this.validators.isValidStoreName(
      this['bookstore[address]'].value
    )
    const descriptionError = this.validators.isValidDescription(
      this['bookstore[description]'].value
    )

    const genresError = this.validators.isCheckedOnce(this['bookstore[genres]'])

    const openDaysError = this.validators.isCheckedOnce(
      this['bookstore[openDays]']
    )

    if (!nameError.result) {
      this.displayError(this['bookstore[name]'], nameError.errorMsg)
    } else if (!addressError.result) {
      this.displayError(this['bookstore[address]'], addressError.errorMsg)
    } else if (!descriptionError.result) {
      this.displayError(
        this['bookstore[description]'],
        descriptionError.errorMsg
      )
    } else if (!genresError.result) {
      this.displayError(this['bookstore[genres]'], genresError.errorMsg)
    } else if (!openDaysError.result) {
      this.displayError(this['bookstore[openDays]'], openDaysError.errorMsg)
    } else {
      return true
    }
  }

  displayError(inputs, message) {
    const errorElements = document.querySelectorAll('.error')

    for (let errorElement of errorElements) {
      errorElement.remove()
    }
    const newErrorElement = this.domUtils.createElement('div', {
      color: 'red',
    })
    newErrorElement.classList.add('error')
    newErrorElement.textContent = message

    if (!inputs.length) {
      inputs.after(newErrorElement)
    } else {
      const lastInput = inputs[inputs.length - 1]

      lastInput.parentElement.parentElement.after(newErrorElement)
    }
  }
}

export default FormValidator
