import numberUtils from '../utils/numberUtils'
import fs from 'fs'
import arrayUtils from '../utils/arrayUtils'
import Address from './address'

const seedHelpers = {
  generateRandName(firstNames, lastNames) {
    if (!Array.isArray(firstNames) || !Array.isArray(lastNames)) {
      throw new TypeError('First and second parameters must be an array')
    }

    firstNames.forEach((name) => {
      if (typeof name !== 'string') {
        throw new TypeError(
          'First parameter array must only contain string data type'
        )
      }
    })
    lastNames.forEach((name) => {
      if (typeof name !== 'string') {
        throw new TypeError(
          'Second parameter array must only contain string data type'
        )
      }
    })

    const randFirstName =
      firstNames[numberUtils.generateRandNum(0, firstNames.length - 1)]
    const randLastName =
      lastNames[numberUtils.generateRandNum(0, lastNames.length - 1)]
    const fullName = [randFirstName, randLastName].join(' ')
    return fullName
  },

  async generateRandAddress(filePath) {
    const vnDataSet = JSON.parse(
      await fs.promises.readFile(filePath, {
        encoding: 'utf-8',
      })
    )

    const city = vnDataSet[numberUtils.generateRandNum(0, vnDataSet.length - 1)]
    const cityName = city.name

    const districts = city.district
    const district = arrayUtils.getRandItem(districts)
    const districtName = district.name

    const streets = district.street
    const streetName = arrayUtils.getRandItem(streets)

    const homeNum = numberUtils.generateRandNum(0, 300).toString()

    const address = new Address({
      city: cityName,
      district: districtName,
      street: streetName,
      homeNum: homeNum,
    })

    const addressString = address.getFullStr()

    return addressString
  },
}

export default seedHelpers
