import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import setupDB from '../../../config/setupDB.js'
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

describe('setupDB.close()', () => {
  let connectionPropertyGetSpy

  beforeEach(() => {
    connectionPropertyGetSpy = vi.spyOn(mongoose, 'connection', 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('if mongoose.connection.readyState is 1, it should call mongoose.connection.close()', async () => {
    connectionPropertyGetSpy.mockReturnValue({
      readyState: 1,
      close: vi.fn(),
    })

    await setupDB.close()

    expect(mongoose.connection.close).toBeCalled()
  })

  it('if mongoose.connection.readyState is 0, it should log a message', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    connectionPropertyGetSpy.mockReturnValue({
      readyState: 0,
      close: vi.fn(),
    })

    await setupDB.close()

    expect(console.log).toBeCalledWith(
      'There must be a connection in order to close it'
    )
  })
  it('if mongoose.connection.readyState is 2, it should log a message', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    connectionPropertyGetSpy.mockReturnValue({
      readyState: 2,
      close: vi.fn(),
    })

    await setupDB.close()

    expect(console.log).toBeCalledWith(
      'There must be a connection in order to close it'
    )
  })
  it('if mongoose.connection.readyState is 3, it should log a message', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    connectionPropertyGetSpy.mockReturnValue({
      readyState: 3,
      close: vi.fn(),
    })

    await setupDB.close()

    expect(console.log).toBeCalledWith(
      'There must be a connection in order to close it'
    )
  })
  it('if mongoose.connection.readyState is 4, it should log a message', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    connectionPropertyGetSpy.mockReturnValue({
      readyState: 3,
      close: vi.fn(),
    })

    await setupDB.close()

    expect(console.log).toBeCalledWith(
      'There must be a connection in order to close it'
    )
  })
})
