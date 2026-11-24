// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FormSubmitChecker from '../../../../../public/js/validation/FormSubmitChecker.js'
import InputErrorsFactory from '../../../../../public/js/validation/InputErrorsFactory.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('formSubmitChecker.checkCanSubmit())', () => {
  let formSubmitChecker
  let inputErrorsFactory

  beforeEach(() => {
    document.body.innerHTML = ''
    formSubmitChecker = new FormSubmitChecker()
    inputErrorsFactory = new InputErrorsFactory()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a non array, it should throw correct TypeError message', () => {
    const array = 1

    const fn = () => {
      formSubmitChecker.checkCanSubmit(array)
    }

    expect(fn).toThrow(expect.any(TypeError))
    expect(fn).toThrow('You need to pass an inputErrorsArray')
  })

  it('when you pass an object, it should throw correct TypeError message', () => {
    const array = {}

    const fn = () => {
      formSubmitChecker.checkCanSubmit(array)
    }

    expect(fn).toThrow(expect.any(TypeError))
    expect(fn).toThrow('You need to pass an inputErrorsArray')
  })

  it('when you pass an array that is NOT an inputErrorsArray (even 1 item is not instance of InputErrors), it should throw correct TypeError message', () => {
    document.body.innerHTML = `
      <form>
        <input id = "input"></input>
      </form>
    `

    const input = document.getElementById('input')
    const inputErrors = inputErrorsFactory.create(input)

    const array = [1, inputErrors]

    const fn = () => {
      formSubmitChecker.checkCanSubmit(array)
    }

    expect(fn).toThrow(expect.any(TypeError))
    expect(fn).toThrow('You need to pass an inputErrorsArray')
  })

  it('when you pass an inputErrorsArray where each inputErrors.errors array all have null values, it should return true', () => {
    document.body.innerHTML = `
      <form>
        <input id = "input1"></input>
        <input id = "input2"></input>
      </form>
    `

    const input1 = document.getElementById('input1')
    const inputErrors1 = inputErrorsFactory.create(input1)
    inputErrors1.errors.push(null, null)

    const input2 = document.getElementById('input2')
    const inputErrors2 = inputErrorsFactory.create(input2)
    inputErrors2.errors.push(null, null)

    const inputErrorsArray = [inputErrors1, inputErrors2]

    const result = formSubmitChecker.checkCanSubmit(inputErrorsArray)

    expect(result).toBe(true)
  })

  it("whhen you pass an inputErrorsArray where there's an inputErrors that has ATLEAST 1 error msg in inputErrors.errors array, it should return false", () => {
    document.body.innerHTML = `
      <form>
        <input id = "input1"></input>
        <input id = "input2"></input>
      </form>
    `

    const input1 = document.getElementById('input1')
    const inputErrors1 = inputErrorsFactory.create(input1)
    inputErrors1.errors.push('error', null)

    const input2 = document.getElementById('input2')
    const inputErrors2 = inputErrorsFactory.create(input2)
    inputErrors2.errors.push(null, null)

    const inputErrorsArray = [inputErrors1, inputErrors2]

    const result = formSubmitChecker.checkCanSubmit(inputErrorsArray)

    expect(result).toBe(false)
  })
})
