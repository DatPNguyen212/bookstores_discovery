import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import typeCheck from '../../../utils/typeCheck.js'
import { Window } from 'happy-dom'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLInputElement', window.HTMLInputElement)
vi.stubGlobal('HTMLTextAreaElement', window.HTMLTextAreaElement)
vi.stubGlobal('HTMLSelectElement', window.HTMLSelectElement)

describe('typeCheck', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  describe('typeCheck.isSingleInputType()', () => {
    let isInputElementSpy

    beforeEach(() => {
      isInputElementSpy = vi
        .spyOn(typeCheck, 'isInputElement')
        .mockReturnValue(true)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })
    it('given typeCheck.isInputElement() returns true, when you pass checkbox input, it should return false', () => {
      document.body.innerHTML = `<input type = "checkbox">`
      const input = document.querySelector('input')

      const result = typeCheck.isSingleInputType(input)

      expect(result).toBe(false)
    })

    it('given typeCheck.isInputElement() returns true, when you pass radio input, it should return false', () => {
      document.body.innerHTML = `<input type = "radio">`
      const input = document.querySelector('input')

      const result = typeCheck.isSingleInputType(input)

      expect(result).toBe(false)
    })

    it('given typeCheck.isInputElement() returns true, when you pass select element, it should return return true', () => {
      document.body.innerHTML = `<select></select>`
      const input = document.querySelector('select')

      const result = typeCheck.isSingleInputType(input)

      expect(result).toBe(true)
    })

    it('given typeCheck.isInputElement() returns true, when you pass textarea element, it should return true', () => {
      document.body.innerHTML = `<textarea></textarea>`
      const input = document.querySelector('textarea')

      const result = typeCheck.isSingleInputType(input)

      expect(result).toBe(true)
    })

    it('when you pass a value in the 1st param, it should call typeCheck.isInputElement() with that value', () => {
      const value = 3

      const result = typeCheck.isSingleInputType(value)

      expect(isInputElementSpy).toBeCalledWith(value)
    })

    it('given typeCheck.isInputElement() returns false, it should return false', () => {
      isInputElementSpy.mockReturnValue(false)
      document.body.innerHTML = `<form></form>`
      const form = document.querySelector('form')

      const result = typeCheck.isSingleInputType(form)

      expect(result).toBe(false)
    })
  })
})

describe('typeCheck.isInputElement()', () => {
  it('when you pass input element, it should return true', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const result = typeCheck.isInputElement(input)

    expect(result).toBe(true)
  })
  it('when you pass select element, it should return true', () => {
    document.body.innerHTML = `<select></select>`
    const input = document.querySelector('select')

    const result = typeCheck.isInputElement(input)

    expect(result).toBe(true)
  })
  it('when you pass textarea element, it should return true', () => {
    document.body.innerHTML = `<textarea></textarea>`
    const input = document.querySelector('textarea')

    const result = typeCheck.isInputElement(input)

    expect(result).toBe(true)
  })
  it('when you pass a non input element, it should return false', () => {
    document.body.innerHTML = '<form></form>'
    const form = document.querySelector('form')

    const result = typeCheck.isInputElement(form)

    expect(result).toBe(false)
  })
})
