import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest'
import request from 'supertest'
import createApp from '../../app.js'
import * as cheerio from 'cheerio'
import testDBUtils from '../../utils/testDBUtils/testDBUtils.js'
import models from '../../models/index.js'

import setupDB from '../../config/setupDB.js'
import mongoose from 'mongoose'
import bookstoreCtrl from '../../controllers/bookstores.js'
import catchAsync from '../../utils/catchAsync.js'
import ExpressError from '../../utils/ExpressError.js'
import customMsgs from '../../joi/customMsgs.js'
import randomString from 'randomstring'

const ObjectId = mongoose.Types.ObjectId

describe('Integration tests for routes', () => {
  let testConnection
  let Bookstore
  let app

  beforeEach(async () => {
    testConnection = await testDBUtils.connect()
    Bookstore = testConnection.model('Bookstore', models.Bookstore.schema)

    vi.stubGlobal('connection', testConnection)

    app = createApp(connection)
  })

  afterEach(async () => {
    await testDBUtils.clearDB()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  afterAll(async () => {
    await testDBUtils.closeDB()
  })

  describe('GET /', () => {
    it('response.text should contain <h1>Homepage</h1>', async () => {
      const route = '/'

      const response = await request(app).get(route)

      expect(response.text).toContain('<h1>Homepage</h1>')
    })
  })

  describe('GET to routes that are NOT DEFINED/fallback route', () => {
    it('response.text should contain correct error message and status', async () => {
      const route = '/abc'
      const error = new ExpressError(
        'The URL is not recognized by the server',
        404
      )

      const response = await request(app).get(route)

      expect(response.text).toContain(error.message)
      expect(response.text).toContain(error.status)
    })
  })

  describe('GET /bookstores', () => {
    it('given a populated mock bookstore document, response.text should display the correct bookstore name, image, description, author of the document ', async () => {
      const bookstoreObjMock = {
        _id: new ObjectId(),
        name: 'john',
        address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
        genres: ['fantasy', 'fiction'],
        description: 'test',
        images: 'https://picsum.photos/800/600',
        openDays: ['Monday'],
      }
      const newBookstore = await Bookstore.create(bookstoreObjMock)
      const route = '/bookstores'
      console.log(newBookstore)

      const response = await request(app).get(route)

      const $ = cheerio.load(response.text)
      expect($('.card__title').text()).toBe(bookstoreObjMock.name)
      expect($('.card__description').text()).toBe(bookstoreObjMock.description)
      expect($('.card__img').attr('src')).toBe('https://picsum.photos/800/600')
      expect($('.btn.btn-show').attr('href')).toBe(
        `/bookstores/${bookstoreObjMock._id}`
      )
    }, 10000)
    it('given 2 populated mock bookstore documents, response.text should have the correct number of bookstore card componenets', async () => {
      const bookstoreObjMock1 = {
        _id: new ObjectId(),
        name: 'john',
        address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
        genres: ['fantasy', 'fiction'],
        description: 'test',
        images: 'https://picsum.photos/800/600',
        openDays: ['Monday'],
      }
      const bookstoreObjMock2 = {
        _id: new ObjectId(),
        name: 'john',
        address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
        genres: ['fantasy', 'fiction'],
        description: 'test',
        images: 'https://picsum.photos/800/600',
        openDays: ['Monday'],
      }
      await Bookstore.create(bookstoreObjMock1)
      await Bookstore.create(bookstoreObjMock2)
      const route = '/bookstores'

      const response = await request(app).get(route)
      const $ = cheerio.load(response.text)

      expect($('.card')).toHaveLength(2)
    }, 10000)

    it('given Bookstore.find() returns empty array, when you send GET /bookstores, response.text should contain correct error msg and status; response.status should be correct', async () => {
      const BookstoreModelMock = {
        find: vi.fn(async () => {
          return []
        }),
      }
      const connectionModelSpy = vi
        .spyOn(connection, 'model')
        .mockReturnValue(BookstoreModelMock)
      const route = '/bookstores'

      app = createApp(connection)

      const response = await request(app).get(route)

      expect(response.status).toBe(404)
      expect(response.text).toContain('No bookstores found')
      expect(response.text).toContain('404')
    })
    it('given Bookstore.find({}) throws an error, when you send GET /bookstores, response.text should contain correct error msg and status; response.status should be correct', async () => {
      const error = new ExpressError('error', 500)
      const BookstoreModelMock = {
        find: vi.fn(async () => {
          return Promise.reject(error)
        }),
      }
      const connectionModelSpy = vi
        .spyOn(connection, 'model')
        .mockReturnValue(BookstoreModelMock)

      app = createApp(connection)

      const response = await request(app).get('/bookstores')

      expect(response.text).toContain(error.message)
      expect(response.status).toBe(500)
      expect(response.text).toContain(error.status)
    })
  })

  describe('GET /bookstores/new', () => {
    // it('response.text should contain <h1>Create bookstore</h1>', async () => {
    //   const route = '/bookstores/new'

    //   const response = await request(app).get(route)

    //   expect(response.text).toContain('<h1>Create bookstore</h1>')
    // })
    it('when you send GET /bookstores/new, response.text should contain element with form-create class', async () => {
      const route = '/bookstores/new'

      const response = await request(app).get(route)
      const $ = cheerio.load(response.text)

      expect($('.form-create').length).not.toBe(0)
    })
  })

  describe('GET /bookstores/:id', () => {
    let bookstore = {}
    let newBookstore = {}

    beforeEach(async () => {
      bookstore = {
        _id: new ObjectId(),
        name: 'john',
        address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
        genres: ['fantasy', 'fiction'],
        description: 'test',
        images: 'https://picsum.photos/800/600',
        openDays: ['Monday'],
      }
      newBookstore = await Bookstore.create(bookstore)
    })

    afterEach(() => {
      newBookstore = {}
      bookstore = {}
      vi.restoreAllMocks()
    })
    it('when you send GET /bookstores/invalidId, response.text should contain correct error msg and status; response.status should be correct', async () => {
      const route = '/bookstores/invalidId'

      const response = await request(app).get(route)

      expect(response.text).toContain('404')
      expect(response.text).toContain('Invalid ID in URL')
      expect(response.status).toBe(404)
    })

    it('given a populated bookstore document, when you send GET /bookstores/validBookstoreId, server should render the correct HTML elements with correct bookstore info', async () => {
      const response = await request(app).get(`/bookstores/${bookstore._id}`)

      const $ = cheerio.load(response.text)

      expect($('.store-detail__title').text()).toBe(bookstore.name)

      expect($('.store-detail__address').text()).toBe(bookstore.address)

      const genreElements = $('.store-detail__genre')

      genreElements.each((i, element) => {
        const matchResult = bookstore.genres.find((genre) => {
          return genre === $(element).text()
        })
        expect(matchResult).toBeDefined()
      })

      expect($('.store-detail__description').text()).toBe(bookstore.description)

      expect($('.store-detail__img').attr('src')).toBe(bookstore.images)

      const openDayElements = $('store-detail__openDay')

      openDayElements.each((i, element) => {
        const matchResult = bookstore.openDays.find((openDay) => {
          return openDay === $(element).text()
        })

        expect(matchResult).toBeDefined()
      })
    })

    it('given Bookstore.findById(id) throws an error, when you send GET /bookstores/:id, response.text should contain correct error msg and status; response.text should be correct', async () => {
      const error = new ExpressError('error', 500)
      const BookstoreModelMock = {
        findById: vi.fn(async () => {
          return Promise.reject(error)
        }),
      }
      const connectionModelSpy = vi
        .spyOn(connection, 'model')
        .mockReturnValue(BookstoreModelMock)
      app = createApp(connection)

      const response = await request(app).get(`/bookstores/${bookstore._id}`)

      expect(response.text).toContain(error.message)
      expect(response.text).toContain(error.status)
      expect(response.status).toBe(500)
    })

    it('when you GET /bookstores/validId where there is no document of that id in db, response.text should contain correct error msg and status; response.status should be correct', async () => {
      const error = new ExpressError('Cannot find document with that ID', 404)
      const _id = new ObjectId()
      const route = `/bookstores/${_id}`

      const response = await request(app).get(route)

      expect(response.text).toContain(error.message)
      expect(response.text).toContain(error.status)
      expect(response.status).toBe(404)
    })
  })

  describe('POST /bookstores', () => {
    it('when you send POST /bookstores with mocked bookstore data, a bookstore doc with said data should be saved to the database', async () => {
      const data = {
        bookstore: {
          name: 'bookstoreName',
          address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
          description: 'test',
          genres: ['fantasy', 'science'],
          images: 'url',
          openDays: ['Monday', 'Tuesday'],
        },
      }

      const response = await request(app).post('/bookstores').send(data)
      const bookstoreRes = await Bookstore.findOne(data.bookstore)

      expect(bookstoreRes).not.toBe(null)
    }, 5000)
    it('when you send POST /bookstores with mocked bookstore data, it should redirect you to the show page of the created bookstore', async () => {
      const data = {
        bookstore: {
          name: 'bookstoreName',
          address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
          description: 'test',
          genres: ['fantasy', 'science'],
          images: 'url',
          openDays: ['Monday', 'Tuesday'],
        },
      }

      const response = await request(app).post('/bookstores').send(data)

      const bookstore = await Bookstore.findOne(data.bookstore)

      expect(response.status).toBe(302)
      expect(response.headers.location).toBe(`/bookstores/${bookstore._id}`)
    })
    it('when Bookstore.create() throws an error, when you send POST /bookstores with valid bookstore data, response.text should contain correct error msg and status; response.status should be correct', async () => {
      const data = {
        bookstore: {
          name: 'bookstoreName',
          address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
          description: 'test',
          genres: ['fantasy', 'science'],
          images: 'url',
          openDays: ['Monday', 'Tuesday'],
        },
      }
      const error = new ExpressError('error', 500)
      const BookstoreModelMock = {
        create: vi.fn(async () => {
          return Promise.reject(error)
        }),
      }
      const connectionModelSpy = vi
        .spyOn(connection, 'model')
        .mockReturnValue(BookstoreModelMock)
      app = createApp(connection)

      const response = await request(app).post('/bookstores').send(data)

      expect(response.text).toContain(error.message)
      expect(response.text).toContain(error.status)
      expect(response.status).toBe(500)
    })

    describe('Joi validation tests', () => {
      let data
      const sliceOfJoiLabelIndex = 11

      beforeEach(() => {
        data = {
          bookstore: {
            name: 'bookstoreName',
            address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
            description: 'test',
            genres: ['fantasy', 'science'],
            images: 'url',
            openDays: ['Monday', 'Tuesday'],
          },
        }
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })
      it('when you send POST /bookstores with req.body.bookstore.name that is NOT string data type, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.name = 3
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['string.base'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })
      it("when you send POST /bookstores with req.body.bookstore.name that doesn't exist, response.text should contain correct error msg and status; response.status should be correct", async () => {
        delete data.bookstore.name
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['any.required'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })
      it('when you send POST /bookstores with req.body.bookstore.name that is more than 100 characters, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.name = randomString.generate(101)
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain('400')
        expect(response.text).toContain(
          customMsgs['string.max'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })
      it('when you send POST /bookstores with req.body.bookstore.address that is not string data type, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.address = 3
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['string.base'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it("when you send POST /bookstores with req.body.bookstore.address that doesn't exist, response.text should contain correct error msg and status; response.status should be correct", async () => {
        delete data.bookstore.address
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['any.required'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.address that is more than 255 characters, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.address = randomString.generate(256)
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain('400')
        expect(response.text).toContain(
          customMsgs['string.max'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.description that is NOT string data type, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.description = 3
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['string.base'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.description string that is longer than 500 chara, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.description = randomString.generate(501)
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['string.max'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.description does not exist, response.text should contain correct error msg and status; response.status should be correct', async () => {
        delete data.bookstore.description
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['any.required'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.genres is NOT an array, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.genres = 3
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['array.base'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.genres does not exist, response.text should contain correct error msg and status; response.status should be correct', async () => {
        delete data.bookstore.genres
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['any.required'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.genres that have invalid items, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.genres = ['john', 'wick']
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain('can only have one of these values')
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.genres is an empty array, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.genres = []
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['array.min'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.images is NOT a string, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.images = 3
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['string.base'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.images does not exist, response.text should contain correct error msg and status; response.status should be correct', async () => {
        delete data.bookstore.images
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['any.required'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.openDays does not exist, response.text should contain correct error msg and status; response.status should be correct', async () => {
        delete data.bookstore.openDays
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['any.required'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.openDays is an empty array, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.openDays = []
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain(
          customMsgs['array.min'].slice(sliceOfJoiLabelIndex)
        )
        expect(response.status).toBe(400)
      })

      it('when you send POST /bookstores with req.body.bookstore.openDays has an invalid item, response.text should contain correct error msg and status; response.status should be correct', async () => {
        data.bookstore.openDays = ['john', 'Monday']
        const route = '/bookstores'

        const response = await request(app).post(route).send(data)

        expect(response.text).toContain(400)
        expect(response.text).toContain('can only have one of these values')
        expect(response.status).toBe(400)
      })
    })
  })
})
