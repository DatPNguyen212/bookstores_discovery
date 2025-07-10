import axios from 'axios'
import fs from 'fs'
import * as vnDataSet from './vnDataSet'

async function getAllCodes() {
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
}

async function fetchProvince(code) {
  const url = `https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/${code}.json`

  const response = await axios.get(url)
  const provinceData = response.data

  return provinceData
}

async function getAllProvinces(codes) {
  let provinces = []
  for (let code of codes) {
    const province = await vnDataSet.fetchProvince(code)
    provinces.push(province)
  }
  return provinces
}

async function createJsonFile() {
  await fs.promises.appendFile()
}

export { createJsonFile, getAllProvinces, fetchProvince, getAllCodes }
