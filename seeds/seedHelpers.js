import numberUtils from '../utils/numberUtils'
import fs from 'fs'
import arrayUtils from '../utils/arrayUtils'
import Address from './address'
import names from './names'
import pathUtils from '../utils/pathUtils'
import path from 'path'
import models from '../models'

const seedHelpers = {
  moduleFileUrl: import.meta.url,
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
    if (typeof filePath !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }

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

  generateRandGenre(genres) {
    for (let genre of genres) {
      if (typeof genre !== 'string') {
        throw new TypeError('First parameter must be an array of strings')
      }
    }
    return arrayUtils.getRandItem(genres)
  },

  generateOpenDays() {
    const DAYS_OF_WEEK = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]

    const MIN = 1
    const MAX = 7

    const option = {
      numberItems: numberUtils.generateRandNum(MIN, MAX),
      enum: DAYS_OF_WEEK,
      uniqueItems: true,
    }

    const openDays = arrayUtils.generateArray(option)

    return openDays
  },
  async genObjForBookstoreClass() {
    const __dirname = pathUtils.getDirnamePathFromUrl(this.moduleFileUrl)
    const JSON_PATH = path.join(__dirname, './', 'vnDataSet.json')
    const GENRES = [
      'fantasy',
      'science',
      'fiction',
      'romance',
      'mystery',
      'thriller',
      'historical',
      'fiction',
      'horror',
      'non-fiction',
    ]

    const DESCRIPTION =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper suscipit scelerisque. Etiam nec tortor id odio facilisis sodales id a justo. Proin porta, turpis eget sodales mattis, est mauris.'

    const IMG_LINK = 'https://picsum.photos/800/300'

    const obj = {
      name: this.generateRandName(names.firstNames, names.lastNames),
      address: this.generateRandAddress(JSON_PATH),
      description: DESCRIPTION,
      genres: this.generateRandGenre(GENRES),
      images: IMG_LINK,
      openDays: this.generateOpenDays(),
    }

    return obj
  },
  async genBookstoreDoc() {
    const objForClass = await this.genObjForBookstoreClass()
    models.bookstore.ModelClass.create(objForClass)
  },
}

export default seedHelpers
