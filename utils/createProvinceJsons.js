import axios from 'axios'
import fs from 'fs'
import * as province from './createProvinceJsons'

async function fetchProvince(code) {
  if (typeof code === 'string') {
    const res = await axios.get(
      `https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/${code}.json`
    )

    return res.data
  } else {
    throw new TypeError('First parameter must be of string data type')
  }
}

async function createProvinceJsons(codes) {
  for (let code of codes) {
    const result = await province.fetchProvince(code)
    await fs.promises.appendFile(`/seeds/${code}.json`, result)
  }
}

module.exports = { fetchProvince, createProvinceJsons }
