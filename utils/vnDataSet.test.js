import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import * as vnDataSet from './vnDataSet'
import axios from 'axios'

vi.mock('fs', () => {
  return {
    default: {
      promises: {
        appendFile: vi.fn((data) => {}),
      },
    },
  }
})

describe('getAllCodes', () => {
  let axiosGetSpy

  beforeEach(() => {
    axiosGetSpy = vi.spyOn(axios, 'get')
  })

  afterEach(() => {
    axiosGetSpy.mockRestore()
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
    expect(res).toContain('DDN')
  })
})

describe('fetchProvince()', () => {
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

      const axiosGetSpy = vi.spyOn(axios, 'get')

      const url = `https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/${code}.json`
      // Act
      await vnDataSet.fetchProvince(code)
      // Assert
      expect(axiosGetSpy).toBeCalledWith(url)

      axiosGetSpy.mockRestore()
    })
})

describe('vnDataSet.getAllProvinces()', () => {
  let fetchProvinceSpy

  beforeEach(() => {
    fetchProvinceSpy = vi.spyOn(vnDataSet, 'fetchProvince').mockImplementation(
      vi.fn((codes) => {
        return {
          code: 'SG',
          name: 'Ho Chi Minh',
          district: [],
        }
      })
    )
  })
  afterEach(() => {
    fetchProvinceSpy.mockRestore()
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

  it('when you pass an array of province codes, it should call fetch(codes) the same number of times as code in codes', async () => {
    // arrange
    const codes = ['SG', 'HN']

    // act
    const res = await vnDataSet.getAllProvinces(codes)
    // assert

    for (let code of codes) {
      expect(fetchProvinceSpy).toBeCalledWith(code)
    }
    expect(fetchProvinceSpy).toBeCalledTimes(codes.length)
  })
})

describe('vnDataSet.createJsonFile()', () => {
  it('should call fs.promises.appendFile()', async () => {
    // arrange
    // act
    vnDataSet.createJsonFile()
    // assert
    expect(fs.promises.appendFile).toBeCalled()
  })
})
