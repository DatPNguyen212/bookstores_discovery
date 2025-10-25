const objectUtils = {
  isPlainObject(value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null
  },
}

export default objectUtils
