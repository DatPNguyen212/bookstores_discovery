import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import setupDB from '../../../config/setupDB'
import mongoose from 'mongoose'

vi.mock('mongoose', () => {
  return {
    default: {
      connect: vi.fn(async (uri) => {}),
      connection: {},
    },
  }
})

describe('setupDB.connect()', () => {
  let mongooseConnectSpy
  beforeEach(() => {
    mongooseConnectSpy = vi.spyOn(mongoose, 'connect')
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })
  it('when pass a URI string in the first parameter, it should call mongoose.connect() with that argument', async () => {
    const uri = 'uri'

    await setupDB.connect(uri)

    expect(mongoose.connect).toBeCalledWith(uri)
  })
  it('if connect to database uri successfully, it should log a success message', async () => {
    const uri = 'uri'

    mongooseConnectSpy.mockImplementation(
      vi.fn(async () => {
        return Promise.resolve()
      })
    )

    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    await setupDB.connect(uri)

    expect(console.log).toBeCalledWith('Successfully connected to database')
  })
  it('if connecto database uri is unsuccessful, it should throw an error', async () => {
    const uri = 'uri'

    mongooseConnectSpy.mockImplementation(
      vi.fn(async () => {
        return Promise.reject()
      })
    )

    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    await setupDB.connect(uri)

    expect(console.log).toBeCalledWith('Error connecting to the database')
  })
  it("if it's already connected to database, it should close the connection first", async () => {
    const uri = 'uri'
    const connectionSpy = vi
      .spyOn(mongoose, 'connection', 'get')
      .mockReturnValue({
        readyState: 1,
        close: vi.fn(async () => {}),
      })
    await setupDB.connect(uri)

    expect(mongoose.connection.close).toBeCalled()
  })
  it('if a number is passed to it, it should throw an error', async () => {
    const uri = 3

    const fn = async () => {
      await setupDB.connect(uri)
    }

    await expect(fn).rejects.toThrow('First parameter must be string data type')
  })
  it('if a boolean is passed to it, it should throw an error', async () => {
    const uri = true

    const fn = async () => {
      await setupDB.connect(uri)
    }

    await expect(fn).rejects.toThrow('First parameter must be string data type')
  })
  it('if a falsy value is passed to it, it should throw an error', async () => {
    const uri = NaN

    const fn = async () => {
      await setupDB.connect(uri)
    }

    await expect(fn).rejects.toThrow('First parameter must be string data type')
  })
})
