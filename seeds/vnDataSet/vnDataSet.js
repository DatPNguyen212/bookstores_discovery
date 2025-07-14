import axios from 'axios'
import fs from 'fs'

const vnDataSet = {
  async getAllCodes() {
    const res = await axios.get(
      'https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/Index.json'
    )

    const data = res.data

    let codes = []

    const keys = Object.keys(data)

    for (let key of keys) {
      codes.push(data[key].code)
    }

    return codes
  },

  async fetchProvince(code) {
    const url = `https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/${code}.json`

    const response = await axios.get(url)
    const provinceData = response.data

    return provinceData
  },

  async getAllProvinces(codes) {
    let provinces = []
    for (let code of codes) {
      const province = await this.fetchProvince(code)
      provinces.push(province)
    }
    return provinces
  },

  async createJsonFile(path) {
    const codes = await this.getAllCodes()

    const provinces = await this.getAllProvinces(codes)

    const provincesJson = JSON.stringify(provinces)

    await fs.promises.writeFile(path, provincesJson)
  },
}

export default vnDataSet
