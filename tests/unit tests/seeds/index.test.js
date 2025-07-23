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

  beforeEach(() => {
    genObjForBookstoreClassSpy = vi.spyOn(
      seedHelpers,
      'genObjForBookstoreClass'
    )

    setupDBConnectSpy = vi.spyOn(setupDB, 'connect')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('it should call setupDB.connect() with local mongo service uri', async () => {
    const localUri = 'mongodb://127.0.0.1:27017/bookstoreDiscovery'

    await seedBookstore()

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
})
