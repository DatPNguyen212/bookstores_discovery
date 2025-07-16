const objectUtils = {
  isPlainObject(value) {
    return typeof value === 'object' && !Array.isArray(value)
  },
}

export default objectUtils
