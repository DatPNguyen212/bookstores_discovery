import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest'
import seedBookstore from '../../../seeds/index.js'
import setupDB from '../../../config/setupDB.js'
import models from '../../../models/index.js'
import testDBUtils from '../../../utils/testDBUtils/testDBUtils.js'
import dbUtils from '../../../utils/dbUtils.js'
import seedHelpers from '../../../seeds/seedHelpers.js'

vi.mock('../../../config/setupDB.js', () => {
  return {
    default: {
      connect: vi.fn(async () => {
        return Promise.resolve()
      }),
      close: vi.fn(async () => {}),
    },
  }
})
vi.mock('../../../utils/dbUtils.js', () => {
  return {
    default: {
      clearCollection: vi.fn(async () => {}),
    },
  }
})

vi.mock('fs', () => {
  const vnDataSetJsonMock = JSON.stringify([
    {
      code: 'SG',
      name: 'Ho Chi Minh',
      district: [
        {
          name: 'Binh Chanh',
          pre: 'Huyen',
          ward: [{ name: 'An Phu Tay', pre: 'Xa' }],
          street: ['1'],
        },
      ],
    },
    {
      code: 'SG',
      name: 'Ho Chi Minh',
      district: [
        {
          name: 'Binh Chanh',
          pre: 'Huyen',
          ward: [{ name: 'An Phu Tay', pre: 'Xa' }],
          street: ['1'],
        },
      ],
    },
  ])
  return {
    default: {
      promises: {
        readFile: vi.fn(() => {
          return vnDataSetJsonMock
        }),
      },
    },
  }
})

describe('seedBookstore()', () => {
  let testConnection
  let Bookstore
  // let bookstoreModelClassSpy
  let setupDBConnectSpy

  beforeEach(async () => {
    testConnection = await testDBUtils.connect()
    setupDBConnectSpy = vi.spyOn(setupDB, 'connect').mockImplementation(
      vi.fn(async () => {
        return testConnection
      })
    )
    Bookstore = testConnection.model('Bookstore', models.bookstore.schema)
    // bookstoreModelClassSpy = vi
    //   .spyOn(models.bookstore, 'ModelClass', 'get')
    //   .mockReturnValue(Bookstore)
    // bookstoreModelClassSpy = vi
    //   .spyOn(models.bookstore, 'getModelClass')
    //   .mockImplementation(
    //     vi.fn(() => {
    //       return Bookstore
    //     })
    //   )
  })
  afterEach(async () => {
    await testDBUtils.clearDB()
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await testDBUtils.closeDB()
  })
  it('when you pass a positive number to it, it should create the that same number of documents in the DB', async () => {
    const numberOfStores = 3

    await seedBookstore(numberOfStores)

    const res = await Bookstore.find({})

    expect(res).toHaveLength(3)
  })
  it('given seedHelpers.genObjForBookstoreClass returns a predetermined obj, when pass 2, it should save 2 predictable documents to DB', async () => {
    const objMock = {
      name: 'John Wick',
      address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
      description: 'test',
      genres: ['fantasy'],
      images: 'test',
      openDays: ['Monday', 'Tuesday'],
    }
    const genObjForBookstoreClassSpy = vi
      .spyOn(seedHelpers, 'genObjForBookstoreClass')
      .mockReturnValue(objMock)
    const numberOfStores = 2

    await seedBookstore(numberOfStores)

    const res = await Bookstore.find({})
    console.log(res)

    expect(res[0]).toHaveProperty('name', 'John Wick')
    expect(res[0]).toHaveProperty(
      'address',
      '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City'
    )
    expect(res[0]).toHaveProperty('description', 'test')
    expect(res[0]).toHaveProperty('genres', ['fantasy'])
    expect(res[0]).toHaveProperty('images', 'test')
    expect(res[0]).toHaveProperty('openDays', ['Monday', 'Tuesday'])

    expect(res[1]).toHaveProperty('name', 'John Wick')
    expect(res[1]).toHaveProperty(
      'address',
      '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City'
    )
    expect(res[1]).toHaveProperty('description', 'test')
    expect(res[1]).toHaveProperty('genres', ['fantasy'])
    expect(res[1]).toHaveProperty('images', 'test')
    expect(res[1]).toHaveProperty('openDays', ['Monday', 'Tuesday'])
  })
})
