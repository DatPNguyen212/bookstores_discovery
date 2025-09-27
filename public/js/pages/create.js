import domUtils from '../utils/domUtils.js'
import validators from '../utils/validators.js'
import FormValidator from '../components/FormValidator.js'

const submitBtn = document.querySelector('.btn.btn-submit')
const form = document.querySelector('.form-create')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  let validationResult = false

  const formValidator = new FormValidator(form, validators, domUtils)

  validationResult = formValidator.isValidForm()

  if (validationResult) {
    form.submit()
  }
})
