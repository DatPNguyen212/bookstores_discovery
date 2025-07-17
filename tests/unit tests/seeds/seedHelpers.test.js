import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import seedHelpers from '../../../seeds/seedHelpers'
import fs from 'fs'

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

  let fsReadFileSpy
  let mathRandomSpy

  beforeEach(() => {
    fsReadFileSpy = vi.spyOn(fs.promises, 'readFile').mockImplementation(
      vi.fn(async () => {
        return vnDataSetJsonMock
      })
    )

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
