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
import catchError from '../../utils/catchError.js'
import ExpressError from '../../utils/ExpressError.js'

const ObjectId = mongoose.Types.ObjectId

describe('Integration tests for routes', () => {
  let testConnection
  let Bookstore
  let app

  beforeEach(async () => {
    testConnection = await testDBUtils.connect()
    Bookstore = testConnection.model('Bookstore', models.Bookstore.schema)

    vi.stubGlobal('connection', testConnection)

    app = createApp(connection, bookstoreCtrl)
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
    it('response.text should contain <h1>Error</h1>', async () => {
      const route = '/abc'

      const response = await request(app).get(route)

      expect(response.text).toContain('<h1>Error</h1>')
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

    it('given renderIndexPage handler throws an error, response.text should contain error message and status"', async () => {
      let error
      const renderIndexPageSpy = vi
        .spyOn(bookstoreCtrl, 'renderIndexPage')
        .mockImplementation(
          vi.fn(() => {
            return catchError(async (req, res, next) => {
              error = new ExpressError('error', 500)
              throw error
            })
          })
        )

      app = createApp(connection, bookstoreCtrl)
      const route = '/bookstores'

      const response = await request(app).get(route)

      expect(response.text).toContain(error.message)
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
    it('when you send GET /bookstores/invalidId, response.text should contain correct error message and status', async () => {
      const route = '/bookstores/invalidId'

      const response = await request(app).get(route)

      expect(response.text).toContain('404')
      expect(response.text).toContain('Invalid ID in URL')
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
          _id: new ObjectId(),
          name: 'bookstoreName',
          address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
          description: 'test',
          genres: ['fantasy', 'science'],
          images: 'url',
          openDays: ['Monday', 'Tuesday'],
        },
      }

      const response = await request(app).post('/bookstores').send(data)

      expect(response.status).toBe(302)
      expect(response.headers.location).toBe(
        `/bookstores/${data.bookstore._id}`
      )
    })
  })
})
