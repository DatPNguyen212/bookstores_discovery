import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import GroupValidator from '../../../../../public/js/validation/GroupValidator.js'
import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputErrorFactoryBase.js'
import InputErrorFactory from '../../../../../public/js/validation/InputErrorFactory.js'
import { Window } from 'happy-dom'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('GroupValidator', () => {
  it('when you pass a non instance of InputErrorFactoryBase to constructor, it should throw an error', () => {
    const inputErrorFactory = 3

    const fn = () => {
      new GroupValidator(undefined)
    }

    expect(fn).toThrow(
      'You need to pass an instanceof InputErrorFactoryBase to first parameter'
    )
  })
  it("when you don't pass any argument to constructor, it should throw an error", () => {
    const fn = () => {
      new GroupValidator()
    }

    expect(fn).toThrow(
      'You need to pass an instanceof InputErrorFactoryBase to first parameter'
    )
  })

  describe('groupValidator.required()', () => {
    let groupValidator
    let inputErrorFactory
    beforeEach(() => {
      document.body.innerHTML = ''
      inputErrorFactory = new InputErrorFactory()
      groupValidator = new GroupValidator(inputErrorFactory)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })
  })
})
