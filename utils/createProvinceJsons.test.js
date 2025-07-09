import { describe, it, expect, vi } from 'vitest'
import * as province from './createProvinceJsons'
import fs from 'fs'

vi.mock('fs', () => {
  return {
    default: {
      promises: {
        appendFile: vi.fn(),
      },
    },
  }
})

describe('fetchProvince()', () => {
  it('when passed province code parameter, data returned should have code, name and district properties', async () => {
    const code = 'SG'

    const data = await province.fetchProvince(code)

    expect(data.code).toBe('SG')
    expect(data.name).toBeDefined()
    expect(data.district).toBeDefined()
  })
  it('should throw an error if parameter passed is not of string data type', async () => {
    const code = 3

    await expect(province.fetchProvince(code)).rejects.toThrow(
      /(First parameter must be of string data type)/
    )
  })
})

describe('createProvinceJsons()', () => {
  it('given an array of province codes, it should call fs.appendFile() array.length number of times', async () => {
    const codes = ['SG', 'HN']

    await province.createProvinceJsons(codes)

    expect(fs.promises.appendFile).toBeCalledTimes(codes.length)
  })
  it('should call fetchProvince() the same number of times as the items of the codes array parameter  you pass to it', async () => {
    const codes = ['SG', 'HN']

    const fetchProvinceSpy = vi.spyOn(province, 'fetchProvince')

    await province.createProvinceJsons(codes)

    expect(fetchProvinceSpy).toBeCalledTimes(codes.length)
  })
})
