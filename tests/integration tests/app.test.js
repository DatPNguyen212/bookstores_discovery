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
    it('response.text should contain <h1>Unfamiliar Route</h1>', async () => {
      const route = '/abc'

      const response = await request(app).get(route)

      expect(response.text).toContain('<h1>Unfamiliar Route</h1>')
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
  })
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

  describe('GET /bookstores/new', () => {
    it('response.text should contain <h1>Create bookstore</h1>', async () => {
      const route = '/bookstores/new'

      const response = await request(app).get(route)

      expect(response.text).toContain('<h1>Create bookstore</h1>')
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
    it('when you send GET /bookstores/invalidId, response status should be 500 internal error  ', async () => {
      const route = '/bookstores/invalidId'

      const response = await request(app).get(route)

      expect(response.status).toBe(500)
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
})
