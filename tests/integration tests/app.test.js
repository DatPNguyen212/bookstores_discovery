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

describe('Integration tests for routes', () => {
  let testConnection
  let Bookstore
  let app

  beforeEach(async () => {
    testConnection = await testDBUtils.connect()
    Bookstore = testConnection.model('Bookstore', models.bookstore.schema)

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
    }, 10000)
  })
  it('given 2 populated mock bookstore documents, response.text should have the correct number of bookstore card componenets', async () => {
    const bookstoreObjMock1 = {
      name: 'john',
      address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
      genres: ['fantasy', 'fiction'],
      description: 'test',
      images: 'https://picsum.photos/800/600',
      openDays: ['Monday'],
    }
    const bookstoreObjMock2 = {
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
})
