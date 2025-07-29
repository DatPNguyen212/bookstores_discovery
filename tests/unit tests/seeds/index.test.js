import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest'
import seedBookstore from '../../../seeds/index'
import testDBUtils from '../../../utils/testDBUtils/testDBUtils'
import models from '../../../models'
import setupDB from '../../../config/setupDB'
import seedHelpers from '../../../seeds/seedHelpers'
import models from '../../../models'
import dbUtils from '../../../utils/dbUtils'

vi.mock('../../../config/setupDB.js', () => {
  return {
    default: {
      connect: vi.fn(async (uri) => {}),
      close: vi.fn(async () => {}),
    },
  }
})

describe('seedBookstore()', () => {
  let genObjForBookstoreClassSpy
  let setupDBConnectSpy
  let genBookstoreDocSpy
  let clearCollectionSpy

  beforeEach(() => {
    genObjForBookstoreClassSpy = vi
      .spyOn(seedHelpers, 'genObjForBookstoreClass')
      .mockImplementation(vi.fn(() => {}))

    setupDBConnectSpy = vi
      .spyOn(setupDB, 'connect')
      .mockImplementation(vi.fn(() => {}))

    genBookstoreDocSpy = vi
      .spyOn(seedHelpers, 'genBookstoreDoc')
      .mockImplementation(vi.fn(() => {}))

    clearCollectionSpy = vi
      .spyOn(dbUtils, 'clearCollection')
      .mockImplementation(vi.fn(() => {}))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a positive number, it should call setupDB.connect() with local mongo service uri', async () => {
    const localUri = 'mongodb://127.0.0.1:27017/bookstoreDiscovery'
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    expect(setupDBConnectSpy).toBeCalledWith(localUri)
  })

  it('when you pass a string, it should throw an error', async () => {
    const numberOfTimes = 'test'

    const fn = async () => {
      await seedBookstore(numberOfTimes)
    }

    await expect(fn).rejects.toThrow(
      'First parameter should be a positive number that is not zero'
    )
  })

  it('when you pass a negative number it should throw an error', async () => {
    const numberOfStores = -3

    const fn = async () => {
      await seedBookstore(numberOfStores)
    }

    await expect(fn).rejects.toThrow(
      'First parameter should be a positive number that is not zero'
    )
  })

  it('when you pass a positive number, it should call dbUtils.clearCollection(`Bookstore`)', async () => {
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    expect(clearCollectionSpy).toBeCalledWith('Bookstore')
  })

  it('when you pass a positive number, it should call seedHelpers.genBookstoreDoc() that same amount of number of times', async () => {
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    expect(genBookstoreDocSpy).toBeCalledTimes(numberOfStores)
  })
  it('should call setupDB.close()', async () => {
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    expect(setupDB.close).toBeCalled()
  })
  it('given seedHelpers.genBookstoreDoc() returns a promise reject, it should call setupDB.close()', async () => {
    genBookstoreDocSpy.mockImplementation(
      vi.fn(() => {
        return Promise.reject()
      })
    )
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    expect(setupDB.close).toBeCalled()
  })
  it('given seedHelpers.genBookstoreDoc() returns a promise reject, it should log an error message and the error thrown by genBookstoreDoc()', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(() => {}),
    })
    genBookstoreDocSpy.mockImplementation(
      vi.fn(() => {
        return Promise.reject('error')
      })
    )
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    expect(console.log).toBeCalledWith(
      "There's an error generating bookstore document and saving it to the database server",
      'error'
    )
  })
})
