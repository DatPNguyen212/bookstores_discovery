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

vi.mock('../../../config/setupDB.js', () => {
  return {
    default: {
      connect: vi.fn(async (uri) => {}),
      close: vi.fn(async () => {}),
    },
  }
})

describe('seedBookstore()', () => {
  it('it should call setupDB.connect() with local mongo service uri', async () => {
    const localUri = 'mongodb://127.0.0.1:27017/bookstoreDiscovery'
    const setupDBConnectSpy = vi.spyOn(setupDB, 'connect')

    await seedBookstore()

    expect(setupDBConnectSpy).toBeCalledWith(localUri)
  })
})
