import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../app.js'

describe('Integration tests for routes', () => {
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
    it('response.text should contain `<h1>Index page</h1>`', async () => {
      const route = '/bookstores'

      const response = await request(app).get(route)

      expect(response.text).toContain('<h1>Index page</h1>')
    })
  })

  describe('GET /bookstores/new', () => {
    it('response.text should contain <h1>Create bookstore</h1>', async () => {
      const route = '/bookstores/new'

      const response = await request(app).get(route)

      expect(response.text).toContain('<h1>Create bookstore</h1>')
    })
  })
})
