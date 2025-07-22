import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import pathUtils from '../../../utils/pathUtils'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

vi.mock('url', () => {
  return {
    fileURLToPath: vi.fn((fileUrl) => {
      return 'path'
    }),
  }
})

vi.mock('path', () => {
  return {
    dirname: vi.fn((path) => {
      return 'dirPath'
    }),
  }
})

describe('pathUtils.getDirnamePathFromUrl()', () => {
  it('it should call fileURLToPath() with first parameter argument', () => {
    const importMetaUrl = 'url'

    pathUtils.getDirnamePathFromUrl(importMetaUrl)

    expect(fileURLToPath).toBeCalledWith(importMetaUrl)
  })
  it('given fileURLToPath returns a predetermined value, it should call dirname() with that value', () => {
    const importMetaUrl = 'url'

    pathUtils.getDirnamePathFromUrl(importMetaUrl)

    expect(dirname).toBeCalledWith('path')
  })
  it('given dirname() returns a predetermined value, it should return that value', () => {
    const importMetaUrl = 'url'

    const res = pathUtils.getDirnamePathFromUrl(importMetaUrl)

    expect(res).toBe('dirPath')
  })
  it('should throw an error if you pass the first parameter a number', () => {
    const importMetaUrl = 1

    const fn = () => {
      pathUtils.getDirnamePathFromUrl(importMetaUrl)
    }

    expect(fn).toThrow('First parameter must be of string data type')
  })
})
