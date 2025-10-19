// vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FormInputExtracter from '../../../../../public/js/utils/FormInputExtracter.js'
import { Window } from 'happy-dom'
import pathUtils from '../../../../../utils/pathUtils.js'
import fs from 'fs'
import path from 'path'

const __dirname = pathUtils.getDirnamePathFromUrl(import.meta.url)
const htmlDocPath = path.join(__dirname, './', 'FormInputExtracter.test.html')
const htmlDocContent = fs.readFileSync(htmlDocPath).toString()

const window = new Window()
const document = window.document

document.write(htmlDocContent)

vi.stubGlobal('document', document)

describe('FormInputExtracter(form)', () => {
  let formInputExtracter
  let form
  beforeEach(() => {
    document.innerHTML = ''
    document.write(htmlDocContent)
    form = document.querySelector('form')
    formInputExtracter = new FormInputExtracter(form)
  })

  describe('formInputExtracter.getFormInputs()', () => {
    it('should return an array of input elements in the form that has singular input types and group type inputs ', () => {
      const input1 = document.querySelector('[name="bookstore[name]"]')
      const input2 = document.querySelector('[name = "bookstore[description]"]')
      const checkbox1 = document.querySelector('[value="fantasy"]')
      const checkbox2 = document.querySelector('[value="science"]')
      const checkboxes = [checkbox1, checkbox2]
      const radio1 = document.querySelector('#trueBorrow')
      const radio2 = document.querySelector('#falseBorrow')
      const select = document.querySelector('.form-create__input--select')
      const radios = [radio1, radio2]

      const expectedResult = [input1, input2, checkboxes, radios, select]

      const result = formInputExtracter.getFormInputs()

      // console.log(checkboxes)
      console.log(result[0].name)
      console.log(result[1].name)
      console.log(result[2][0].value)
      console.log(result[2][1].value)
      console.log(result[3][0].value)
      console.log(result[3][1].value)
      console.log(result[4].value)
      // console.log(result)

      expect(result).toEqual(expectedResult)
    })

    it('when the form ony has singular input elements, it should return an array that contains those singular inputs', () => {
      document.open()
      const htmlDocContent =
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>FormInputExtracter</title></head><body><div class="form-create-wrapper"><form action="/bookstores" method="POST" class="form-create"><header class="form-create__header"><h1 class="form-create__title">Create bookstore</h1></header><div class="form-create__body"><fieldset class="form-create__input-wrapper"><label for="name" class="form-create__label">Name</label><input id="name" type="text" name="bookstore[name]" class="form-create__input" /></fieldset><fieldset class="form-create__input-wrapper"><label for="description" class="form-create__label" >Description</label ><textarea name="bookstore[description]" id="description" class="form-create__text-area" ></textarea></fieldset><fieldset class="form-create__fieldset"><legend class="form-create__legend">Is Online?</legend><div class="form-create__checkbox-grid"><select class="form-create__input--select" name="online"><option value="true" class="form-create__option">True</option><option value="false" class="form-create__option">False</option></select></div></fieldset></div><footer class="form-create__footer"><button type="submit" class="btn btn-submit">Submit</button></footer></form></div></body></html>'
      document.write(htmlDocContent)
      document.close()
      const form = document.querySelector('form')
      const formInputExtracter = new FormInputExtracter(form)

      const input1 = document.querySelector('[name="bookstore[name]"]')
      const input2 = document.querySelector('[name = "bookstore[description]"]')
      const input3 = document.querySelector('.form-create__input--select')
      const expectedResult = [input1, input2, input3]

      const result = formInputExtracter.getFormInputs()

      console.log(input1.name)
      console.log(input2.name)
      console.log(input3.name)

      expect(result).toEqual(expectedResult)
    })

    it('when form only has GROUP input elements, it should return an array which contains groups of those group inputs as nested arrays', () => {
      document.open()
      const htmlDocContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>FormInputExtracter</title></head><body><div class="form-create-wrapper"><form action="/bookstores" method="POST" class="form-create"><header class="form-create__header"><h1 class="form-create__title">Create bookstore</h1></header><div class="form-create__body"><fieldset class="form-create__fieldset"><legend class="form-create__legend">Genres</legend><div class="form-create__checkbox-grid"><div class="form-create__input-wrapper--checkbox"><input type="checkbox" name="bookstore[genres]" class="form-create__input--checkbox" id="fantasy" value="fantasy" /><label for="fantasy" class="form-create__label--inline" >fantasy</label ></div><div class="form-create__input-wrapper--checkbox"><input type="checkbox" name="bookstore[genres]" class="form-create__input--checkbox" id="science" value="science" /><label for="science" class="form-create__label--inline" >science</label ></div></div></fieldset><fieldset class="form-create__fieldset"><legend class="form-create__legend">Can Borrow?</legend><div class="form-create__checkbox-grid"><div class="form-create__input-wrapper--radio"><input type="radio" name="bookstore[borrow]" class="form-create__input--radio" id="trueBorrow" value="true" /><label for="trueBorrow" class="form-create__label--inline" >Can Borrow</label ></div><div class="form-create__input-wrapper--radio"><input type="radio" name="bookstore[borrow]" class="form-create__input--radio" id="falseBorrow" value="false" /><label for="falseBorrow" class="form-create__label--inline" >Can't Borrow</label ></div></div></fieldset></div><footer class="form-create__footer"><button type="submit" class="btn btn-submit">Submit</button></footer></form></div></body></html>`
      document.write(htmlDocContent)
      document.close()
      const form = document.querySelector('form')
      const formInputExtracter = new FormInputExtracter(form)

      const checkbox1 = document.querySelector('[value="fantasy"]')
      const checkbox2 = document.querySelector('[value="science"]')
      const checkboxes = [checkbox1, checkbox2]
      const radio1 = document.querySelector('#trueBorrow')
      const radio2 = document.querySelector('#falseBorrow')
      const radios = [radio1, radio2]
      const expectedResult = [checkboxes, radios]

      const result = formInputExtracter.getFormInputs()

      expect(result).toEqual(expectedResult)
    })

    it("if there's no input elements in form, it should return an empty array", () => {
      document.open()
      const htmlDocContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>FormInputExtracter</title></head><body><div class="form-create-wrapper"><form action="/bookstores" method="POST" class="form-create"><header class="form-create__header"><h1 class="form-create__title">Create bookstore</h1></header><div class="form-create__body"><fieldset class="form-create__fieldset"><legend class="form-create__legend">Genres</legend><div class="form-create__checkbox-grid"><div class="form-create__input-wrapper--checkbox"><label for="fantasy" class="form-create__label--inline" >fantasy</label ></div><div class="form-create__input-wrapper--checkbox"><label for="science" class="form-create__label--inline" >science</label ></div></div></fieldset><fieldset class="form-create__fieldset"><legend class="form-create__legend">Can Borrow?</legend><div class="form-create__checkbox-grid"><div class="form-create__input-wrapper--radio"><label for="trueBorrow" class="form-create__label--inline" >Can Borrow</label ></div><div class="form-create__input-wrapper--radio"><label for="falseBorrow" class="form-create__label--inline" >Can't Borrow</label ></div></div></fieldset></div><footer class="form-create__footer"><button type="submit" class="btn btn-submit">Submit</button></footer></form></div></body></html>`
      document.write(htmlDocContent)
      document.close()
      const form = document.querySelector('form')
      const formInputExtracter = new FormInputExtracter(form)

      const result = formInputExtracter.getFormInputs()

      expect(result.length).toBe(0)
    })
    it('when you pass a non form obj to class constructor, it should throw an error', () => {
      const form = 1

      const fn = () => {
        new FormInputExtracter(form)
      }

      expect(fn).toThrow('You need to pass a form element as an argument')
    })
  })
})
