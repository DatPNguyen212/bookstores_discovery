import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import seedHelpers from '../../../seeds/seedHelpers.js'
import fs from 'fs'
import arrayUtils from '../../../utils/arrayUtils.js'
import numberUtils from '../../../utils/numberUtils.js'
import names from '../../../seeds/names.js'
import path from 'path'
import pathUtils from '../../../utils/pathUtils.js'
import models from '../../../models/index.js'

vi.mock('../../../utils/pathUtils.js', () => {
  return {
    default: {
      getDirnamePathFromUrl: vi.fn((url) => {
        return 'path'
      }),
    },
  }
})

const vnDataSetJsonMock = `[
  {
    "code": "SG",
    "name": "Ho Chi Minh",
    "district": [
      {
        "name": "Binh Chanh",
        "pre": "Huyen",
        "ward": [{ "name": "An Phu Tay" }],
        "street": ["1"]
      }
    ]
  },
  {
    "code": "HN",
    "name": "Ha Noi",
    "district": [
      {
        "name": "Ba Dinh",
        "pre": "Huyen",
        "ward": [{ "name": "Cong Vi" }],
        "street": ["10"]
      }
    ]
  },
  {
    "code": "DDN",
    "name": "Da Nang",
    "district": [
      {
        "name": "Cam Le",
        "pre": "Huyen",
        "ward": [{ "name": "Hoa An" }],
        "street": ["10"]
      }
    ]
  }
]`

vi.mock('fs', () => {
  return {
    default: {
      promises: {
        readFile: vi.fn(async () => {
          return vnDataSetJsonMock
        }),
      },
    },
  }
})

describe('seedHelpers.generateRandName()', () => {
  let mathRandomSpy

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('given Math.random() returns 0, it should take the 0 index item in each of the 2 array arguments and return concatenated string with space between of them', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0
      })
    )
    const firstNames = ['a', 'b', 'c']
    const lastNames = ['a', 'b', 'c']

    // act
    const res = seedHelpers.generateRandName(firstNames, lastNames)
    // assert

    expect(res).toBe('a a')
  })

  it('given Math.random() returns 0.999, it should take the last index item in each of the 2 array arguments and return the concatenated string with space between of them', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.999
      })
    )
    const firstNames = ['a', 'b', 'c']
    const lastNames = ['a', 'b', 'c']
    // act
    const res = seedHelpers.generateRandName(firstNames, lastNames)
    // assert
    expect(res).toBe('c c')
  })

  it('given Math.random() returns 0.6 and the length of the 2 array arguments is 3, it should return a concatenated string with space between of the 2nd index item of the 2 array parameters', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.6
      })
    )
    const firstNames = ['a', 'b', 'c']
    const lastNames = ['a', 'b', 'c']
    // act
    const res = seedHelpers.generateRandName(firstNames, lastNames)
    // assert
    expect(res).toBe('b b')
  })

  it('should throw an error if first parameter is not an array', () => {
    const firstNames = 'a'
    const lastNames = ['b']

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow('First and second parameters must be an array')
  })

  it('should throw an error if second parameter is not an array', () => {
    const firstNames = ['a']
    const lastNames = 'b'

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow('First and second parameters must be an array')
  })

  it('should throw an error if first array argument contains contains atleast one item that is NOT of string data type', () => {
    const firstNames = ['a', 2, 'b']
    const lastNames = ['b']

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow(
      'First parameter array must only contain string data type'
    )
  })
  it('should throw an error if second array argument contains contains atleast one item that is NOT of string data type', () => {
    const firstNames = ['a']
    const lastNames = ['a', 2, 'b']

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow(
      'Second parameter array must only contain string data type'
    )
  })
})

describe('seedHelpers.generateRandAddress()', () => {
  let mathRandomSpy

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('given Math.random() returns 0 and a mocked vnDataSet.json content when read, when a path to vnDataSet json file is passed to it, it should return a deterministc address full string based on the vnDataSet json file', async () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0
      })
    )
    const filePath = 'path'

    await expect(seedHelpers.generateRandAddress(filePath)).resolves.toBe(
      '0, 1 Street, Binh Chanh District, Ho Chi Minh City'
    )
  })

  it('given Math.random() returns 0.999 and a mocked vnDataSet,json content when read, when a path to vnDataSet json file is passed to it, it should return a deterministic address full string based on the vnDataSet json file', async () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.999
      })
    )

    const filePath = 'path'

    await expect(seedHelpers.generateRandAddress(filePath)).resolves.toBe(
      '300, 10 Street, Cam Le District, Da Nang City'
    )
  })

  it('given Math.random() returns 0.6 and a mocked vnDataSet,json content when read, when a path to vnDataSet json file is passed to it, it should return a deterministic address full string based on the vnDataSet json file', async () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.6
      })
    )

    const filePath = 'path'

    await expect(seedHelpers.generateRandAddress(filePath)).resolves.toBe(
      '180, 10 Street, Ba Dinh District, Ha Noi City'
    )
  })

  it('should throw an error if the first parameter is not string data type', async () => {
    const filePath = 3

    await expect(seedHelpers.generateRandAddress(filePath)).rejects.toThrow(
      'First parameter should be of string data type'
    )
  })
})

describe('seedHelpers.generateBookstoreObj()', () => {
  let generateRandNameSpy
  let generateRandAddressSpy

  beforeEach(() => {
    generateRandNameSpy = vi
      .spyOn(seedHelpers, 'generateRandName')
      .mockReturnValue('John Wick')
    generateRandAddressSpy = vi
      .spyOn(seedHelpers, 'generateRandAddress')
      .mockReturnValue('3, Ba Thang Hai Street, 10 District, Ho Chi Minh City')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a predictable obj', () => {})
})

describe('seedHelpers.generateRandGenre()', () => {
  let getRandItemSpy

  beforeEach(() => {
    getRandItemSpy = vi.spyOn(arrayUtils, 'getRandItem')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when you pass an array to it, it should call arrayUtils.getRandomItem() with the array you passed', () => {
    const genres = ['fiction', 'fantasy']

    const res = seedHelpers.generateRandGenre(genres)

    expect(getRandItemSpy).toBeCalledWith(genres)
  })

  it('given arrayUtils.generateRandItem() return first item in your array argument, it should return that same value', () => {
    const genres = ['fiction', 'fantasy']

    getRandItemSpy.mockReturnValue(genres[0])

    const res = seedHelpers.generateRandGenre(genres)

    expect(res).toBe('fiction')
  })
  it('should throw an error if first parameter argument is not an array of strings', () => {
    const genres = [1, 2, 3]

    const fn = () => {
      seedHelpers.generateRandGenre(genres)
    }

    expect(fn).toThrow('First parameter must be an array of strings')
  })
})

describe('seedHelpers.generateOpenDays()', () => {
  let generateArraySpy
  let mathRandomSpy
  let generateRandNumSpy

  beforeEach(() => {
    generateArraySpy = vi.spyOn(arrayUtils, 'generateArray')
    mathRandomSpy = vi.spyOn(Math, 'random')
    generateRandNumSpy = vi.spyOn(numberUtils, 'generateRandNum')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should call numberUtils.generateRandNum() with 1 and 7 as arguments', () => {
    const min = 1
    const max = 7

    const res = seedHelpers.generateOpenDays()

    expect(generateRandNumSpy).toBeCalledWith(min, max)
  })
  it('given Math.random() returns 0, it should call arrayUtils.generateArray() with correct option object', () => {
    mathRandomSpy.mockReturnValue(0)
    const option = {
      numberItems: 1,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      uniqueItems: true,
    }

    const res = seedHelpers.generateOpenDays()

    expect(generateArraySpy).toBeCalledWith(option)
  })
  it('given Math.random() returns predetermined values every time it is called such that numberUtils.generateRandNum() returns 3, it should return a predictable array of open days', () => {
    mathRandomSpy.mockReturnValueOnce(0.3)
    mathRandomSpy.mockReturnValueOnce(0)
    mathRandomSpy.mockReturnValueOnce(0.6)
    mathRandomSpy.mockReturnValueOnce(0.9)

    const res = seedHelpers.generateOpenDays()

    expect(res).toEqual(['Monday', 'Friday', 'Sunday'])
  })
})

describe('seedHelpers.genObjForBookstoreClass', () => {
  let generateRandNameSpy
  let generateRandAddressSpy
  let generateRandGenreSpy
  let generateOpenDaysSpy
  let moduleFileUrlSpy
  let pathJoinSpy

  beforeEach(() => {
    generateRandNameSpy = vi.spyOn(seedHelpers, 'generateRandName')
    generateRandAddressSpy = vi.spyOn(seedHelpers, 'generateRandAddress')
    generateRandGenreSpy = vi.spyOn(seedHelpers, 'generateRandGenre')
    generateOpenDaysSpy = vi.spyOn(seedHelpers, 'generateOpenDays')
    moduleFileUrlSpy = vi.spyOn(seedHelpers, 'moduleFileUrl', 'get')
    pathJoinSpy = vi.spyOn(path, 'join')
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should call seedHelpers.generateRandName() with firstNames and lastNames from names module', async () => {
    const firstNames = names.firstNames
    const lastNames = names.lastNames

    await seedHelpers.genObjForBookstoreClass()

    expect(generateRandNameSpy).toBeCalledWith(firstNames, lastNames)
  })
  it('given seedHelpers.moduleFileUrl returns a mocked value, it should call pathUtils.getDirnamePathFromUrl() with that value', async () => {
    moduleFileUrlSpy.mockReturnValue('url')

    await seedHelpers.genObjForBookstoreClass()

    expect(pathUtils.getDirnamePathFromUrl).toBeCalledWith('url')
  })
  it("given pathUtils.getDirnamePathFromUrl()'s return value is mocked, it should call path.join() with that mocked return value, and other values to form correct path to vnDataSet.json", async () => {
    //pathUtils is vi.mock() above already, and .getDirnamePathFromUrl() mock return value is "path";

    await seedHelpers.genObjForBookstoreClass()

    expect(pathJoinSpy).toBeCalledWith('path', './', 'vnDataSet.json')
  })

  it('should call seedHelpers.generateRandAddress() with file path to vnDataSet.json file', async () => {
    const JSON_PATH = path.join(
      pathUtils.getDirnamePathFromUrl(seedHelpers.moduleFileUrl),
      './',
      'vnDataSet.json'
    )

    await seedHelpers.genObjForBookstoreClass()

    expect(generateRandAddressSpy).toBeCalledWith(JSON_PATH)
  })
  it('should call seedHelpers.generateRandGenres() with the correct predefined array of genres', async () => {
    const GENRES = [
      'fantasy',
      'science',
      'fiction',
      'romance',
      'mystery',
      'thriller',
      'historical',
      'fiction',
      'horror',
      'non-fiction',
    ]

    await seedHelpers.genObjForBookstoreClass()

    expect(generateRandGenreSpy).toBeCalledWith(GENRES)
  })
  it('should call seedHelpers.generateOpenDays()', async () => {
    await seedHelpers.genObjForBookstoreClass()

    expect(generateOpenDaysSpy).toBeCalled()
  })
  it('should return an object which contains all the properties of a Bookstore model', async () => {
    const res = await seedHelpers.genObjForBookstoreClass()

    expect(res).toHaveProperty('name')
    expect(res).toHaveProperty('address')
    expect(res).toHaveProperty('description')
    expect(res).toHaveProperty('genres')
    expect(res).toHaveProperty('images')
    expect(res).toHaveProperty('openDays')
  })
  it('should return an obj where description property is of a predetermined value', async () => {
    const DESCRIPTION =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper suscipit scelerisque. Etiam nec tortor id odio facilisis sodales id a justo. Proin porta, turpis eget sodales mattis, est mauris.'

    const res = await seedHelpers.genObjForBookstoreClass()

    expect(res.description).toBe(DESCRIPTION)
  })
  it('should return an obj where images property is of a predetermined value', async () => {
    const IMG_LINK = 'https://picsum.photos/800/300'

    const res = await seedHelpers.genObjForBookstoreClass()

    expect(res.images).toBe(IMG_LINK)
  })
  it("given seedHelpers methods' return values are mocked, it should return an object whose properties' values are predictable", async () => {
    generateRandNameSpy.mockReturnValue('name')
    generateRandAddressSpy.mockReturnValue('address')
    generateRandGenreSpy.mockReturnValue(['fantasy', 'fiction'])
    generateOpenDaysSpy.mockReturnValue(['Monday', 'Tuesday'])
    const DESCRIPTION =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper suscipit scelerisque. Etiam nec tortor id odio facilisis sodales id a justo. Proin porta, turpis eget sodales mattis, est mauris.'

    const IMG_LINK = 'https://picsum.photos/800/300'

    const res = await seedHelpers.genObjForBookstoreClass()

    expect(res).toEqual({
      name: 'name',
      address: 'address',
      genres: ['fantasy', 'fiction'],
      openDays: ['Monday', 'Tuesday'],
      description: DESCRIPTION,
      images: IMG_LINK,
    })
  })
})

describe('seedHelpers.genBookstoreDoc()', () => {
  let genObjForBookstoreClassSpy
  let modelsBookstoreSpy
  beforeEach(() => {
    genObjForBookstoreClassSpy = vi
      .spyOn(seedHelpers, 'genObjForBookstoreClass')
      .mockImplementation(vi.fn(() => {}))
    modelsBookstoreSpy = vi.spyOn(models, 'bookstore', 'get').mockReturnValue({
      ModelClass: {
        create: vi.fn((obj) => {}),
      },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should call seedHelpers.genObjForBookstoreClass()', async () => {
    await seedHelpers.genBookstoreDoc()

    expect(genObjForBookstoreClassSpy).toBeCalled()
  })
  it('given genObjForBookstoreClass returns a mocked obj, it should call models.bookstore.create() with that mocked obj', async () => {
    const objMock = {
      testing: 'test',
    }
    genObjForBookstoreClassSpy.mockReturnValue(objMock)

    await seedHelpers.genBookstoreDoc()

    expect(models.bookstore.ModelClass.create).toBeCalledWith(objMock)
  })
})
