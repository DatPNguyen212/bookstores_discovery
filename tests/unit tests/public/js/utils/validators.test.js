// @vitest-environment happy-dom
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest'
import validators from '../../../../../public/js/utils/validators.js'
import randomString from 'randomstring'
import { Window } from 'happy-dom'
import pathUtils from '../../../../../utils/pathUtils.js'
import fs from 'fs'
import path from 'path'

const __dirname = pathUtils.getDirnamePathFromUrl(import.meta.url)

const htmlTestDocPath = path.join(__dirname, './', 'validators.test.html')

const htmlDocContent = fs.readFileSync(htmlTestDocPath).toString()

const window = new Window()
const document = window.document

document.write(htmlDocContent)

vi.stubGlobal('document', document)

describe('validators.isValidStoreName()', () => {
  it('when you pass valid bookstore name where string is not empty and is less and upto 100 characters, it should return obj that signifies success', () => {
    const name = randomString.generate(100)

    const result = validators.isValidStoreName(name)

    expect(result).toEqual({
      result: true,
      errorMsg: null,
    })
  })
  it('when you pass an empty string, it should return obj that signifies error', () => {
    const name = ''

    const result = validators.isValidStoreName(name)

    expect(result).toEqual({
      result: false,
      errorMsg: 'Name field must not be empty',
    })
  })
  it('when you pass a string that is more than 100 characters, it should return obj that signifies error', () => {
    const name = randomString.generate(101)

    const result = validators.isValidStoreName(name)

    expect(result).toEqual({
      result: false,
      errorMsg: 'Name must be less than or equal to 100 characters',
    })
  })

  it('when you pass a non string, it should throw correct error', () => {
    const name = 3

    const fn = () => {
      validators.isValidStoreName(name)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
})

describe('validators.isValidAddress()', () => {
  it('when you pass a valid address where it is not an empty string and is less and upto 255 characters, it should return obj that signifies success', () => {
    const address = randomString.generate(255)

    const result = validators.isValidAddress(address)

    expect(result).toEqual({
      result: true,
      errorMsg: null,
    })
  })
  it('when you pass string that is more than 255 characters, it should return obj that signifies error', () => {
    const address = randomString.generate(256)

    const result = validators.isValidAddress(address)

    expect(result).toEqual({
      result: false,
      errorMsg: 'Address field must not be more than 255 characters',
    })
  })
  it('when you pass string that is empty, it should return obj that signifies error', () => {
    const address = ''

    const result = validators.isValidAddress(address)

    expect(result).toEqual({
      result: false,
      errorMsg: 'Address field must not be empty',
    })
  })

  it('when you pass a non string, it should throw correct error', () => {
    const address = 3

    const fn = () => {
      validators.isValidAddress(address)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
})

describe('validators.isValidDescription()', () => {
  it('when you pass a string that is more than 500 characters, it should return obj that signifies error', () => {
    const description = randomString.generate(501)

    const result = validators.isValidDescription(description)

    expect(result).toEqual({
      result: false,
      errorMsg: 'Description must not be more than 500 characters',
    })
  })
  it('when you pass an empty string, it should return obj that signifies error', () => {
    const description = ''

    const result = validators.isValidDescription(description)

    expect(result).toEqual({
      result: false,
      errorMsg: 'Description must not be empty',
    })
  })

  it('when you pass string that is not empty and is less and upto 500 characters, it should return obj that signifies success', () => {
    const description = randomString.generate(500)

    const result = validators.isValidDescription(description)

    expect(result).toEqual({
      result: true,
      errorMsg: null,
    })
  })

  it('when you pass a non string, it should throw correct error', () => {
    const description = 3

    const fn = () => {
      validators.isValidDescription(description)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
})

describe('validators.isCheckedOnce()', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.write(htmlDocContent)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass HTML collection of input checkboxes where none of them are checked, it should return obj that signifies error', () => {
    const inputs = document.querySelectorAll('input')

    console.log(inputs)
    console.log(document.body.innerHTML)

    const result = validators.isCheckedOnce(inputs)

    expect(result).toEqual({
      result: false,
      errorMsg: 'You must select atleast one checkbox',
    })
  })

  it('when you pass HTML collection of input checkboxes where atleast one of them is checked, it should return obj that signifies success', () => {
    const input = document.querySelector('input')
    input.checked = true
    const inputs = document.querySelectorAll('input')

    const result = validators.isCheckedOnce(inputs)

    expect(result).toEqual({
      result: true,
      errorMsg: null,
    })
  })
})
