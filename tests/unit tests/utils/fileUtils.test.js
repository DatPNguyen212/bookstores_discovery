import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import fileUtils from '../../../utils/fileUtils'
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

describe('fileUtils.getDirname()', () => {
  let getCurrentFileUrlSpy

  beforeEach(() => {
    getCurrentFileUrlSpy = vi.spyOn(fileUtils, 'getCurrentFileUrl')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call fileUtils.getCurrentFileUrl()', () => {
    fileUtils.getDirname()

    expect(getCurrentFileUrlSpy).toBeCalled()
  })
  it('given fileUtils.getCurrentFileUrl() returns a predetermined value, it should call fileURLToPath() with that value', () => {
    getCurrentFileUrlSpy.mockReturnValue('path')

    fileUtils.getDirname()

    expect(fileURLToPath).toBeCalledWith('path')
  })
  it('given fileURLToPath returns a predetermined value, it should call dirname() with that value', () => {
    fileUtils.getDirname()

    expect(dirname).toBeCalled()
  })
  it('given dirname() returns a predetermined value, it should return that value', () => {
    const res = fileUtils.getDirname()

    expect(res).toBe('dirPath')
  })
})
