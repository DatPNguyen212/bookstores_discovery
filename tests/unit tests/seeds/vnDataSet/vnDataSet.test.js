import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import vnDataSet from '../../../../seeds/vnDataSet/vnDataSet.js'
import axios from 'axios'

vi.mock('fs', () => {
  return {
    default: {
      promises: {
        writeFile: vi.fn(async (path, content) => {
          return Promise.resolve()
        }),
      },
    },
  }
})

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(async (path) => {
        return Promise.resolve()
      }),
    },
  }
})

describe('vnDataSet.getAllCodes()', () => {
  let axiosGetSpy

  beforeEach(() => {
    axiosGetSpy = vi.spyOn(axios, 'get').mockImplementation(
      vi.fn(async () => {
        return {
          data: {
            'Hồ Chí Minh': {
              code: 'SG',
              file_path: './data/SG.json',
            },
            'Hà Nội': {
              code: 'HN',
              file_path: './data/HN.json',
            },
          },
        }
      })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should call axios.get() with correct url API to get index of all provinces', async () => {
    // arrange

    const url =
      'https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/Index.json'
    // act
    await vnDataSet.getAllCodes()
    // assert
    expect(axiosGetSpy).toBeCalledWith(url)
  })
  it('should return an array of codes of all the provinces', async () => {
    // arrange
    // act
    const res = await vnDataSet.getAllCodes()
    // assert
    expect(res).toContain('SG')
    expect(res).toContain('HN')
  })
})

describe('vnDataSet.fetchProvince()', () => {
  let axiosGetSpy

  beforeEach(() => {
    axiosGetSpy = vi.spyOn(axios, 'get').mockImplementation(
      vi.fn(async (code) => {
        return {
          data: {
            name: 'Ho Chi Minh',
            code: 'SG',
            district: [],
          },
        }
      })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when pass a province code to fetchProvince(), it should return that province data object that has code, name, district, ', async () => {
    // arrange
    const code = 'SG'
    // act
    const province = await vnDataSet.fetchProvince(code)
    // assert
    expect(province).toHaveProperty('code')
    expect(province).toHaveProperty('name')
    expect(province).toHaveProperty('district')
  }),
    it('pass province code argument, it should call axios.get() with the API url that is interpolated with that code', async () => {
      // Arrange
      const code = 'SG'

      const url = `https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/${code}.json`
      // Act
      await vnDataSet.fetchProvince(code)
      // Assert
      expect(axiosGetSpy).toBeCalledWith(url)
    })
})

describe('vnDataSet.getAllProvinces()', () => {
  let axiosGetSpy
  const FETCH_PROVINCE_URL = `https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data`

  beforeEach(() => {
    axiosGetSpy = vi.spyOn(axios, 'get').mockImplementation(
      vi.fn(async (path) => {
        if (path === `${FETCH_PROVINCE_URL}/SG.json`) {
          return {
            data: {
              name: 'Ho Chi Minh',
              code: 'SG',
              district: [],
            },
          }
        } else if (path === `${FETCH_PROVINCE_URL}/HN.json`) {
          return {
            data: {
              name: 'Ha Noi',
              code: 'HN',
              district: [],
            },
          }
        }
      })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when you pass an array of province codes, it should return an array', async () => {
    // arrange
    const codes = ['SG', 'HN']
    // act
    const res = await vnDataSet.getAllProvinces(codes)
    // assert
    expect(res).toBeInstanceOf(Array)
  })

  it('when pass an array of province codes, it should return an array where each item has code, name, district properties', async () => {
    // arrange
    const codes = ['SG', 'HN']
    // act
    const res = await vnDataSet.getAllProvinces(codes)
    // assert
    for (let province of res) {
      expect(province).toHaveProperty('code')
      expect(province).toHaveProperty('name')
      expect(province).toHaveProperty('district')
    }
  })
})

describe('vnDataSet.createJsonFile()', () => {
  it('when passed a path argument, it should call fs.promises.writeFile() with path argument and JSON.stringify() of an array of provinces data', async () => {
    // arrange
    const path = 'path'
    const fetchProvinceSpy = vi
      .spyOn(vnDataSet, 'fetchProvince')
      .mockImplementation(
        vi.fn(async () => {
          return Promise.resolve({
            name: 'Ho Chi Minh',
            code: 'SG',
            district: [],
          })
        })
      )

    const getAllCodesSpy = vi
      .spyOn(vnDataSet, 'getAllCodes')
      .mockImplementation(
        vi.fn(async () => {
          return Promise.resolve(['SG', 'HN'])
        })
      )

    const getAllProvincesMockResolve = [
      { name: 'Ho Chi Minh', code: 'SG', district: [] },
      { name: 'Hanoi', code: 'HN', district: [] },
    ]

    const getAllProvinces = vi
      .spyOn(vnDataSet, 'getAllProvinces')
      .mockImplementation(
        vi.fn(async () => {
          return getAllProvincesMockResolve
        })
      )

    // act
    await vnDataSet.createJsonFile(path)
    // assert
    expect(fs.promises.writeFile).toBeCalledWith(
      path,
      JSON.stringify(getAllProvincesMockResolve)
    )

    vi.restoreAllMocks()
  })
})
