import numberUtils from '../utils/numberUtils.js'
import fs from 'fs'
import arrayUtils from '../utils/arrayUtils.js'
import Address from './address.js'
import names from './names.js'
import pathUtils from '../utils/pathUtils.js'
import path from 'path'
import models from '../models/index.js'
import objectUtils from '../utils/objectUtils.js'

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

  generateRandGenres(genres) {
    if (!Array.isArray(genres)) {
      throw new TypeError(
        'First param must be an array where each item is of string data type'
      )
    } else {
      for (let item of genres) {
        if (typeof item !== 'string') {
          throw new TypeError(
            'First param must be an array where each item is of string data type'
          )
        }
      }
    }
    const numberOfItems = numberUtils.generateRandNum(1, genres.length)
    let randGenresRes = []
    let randGenre
    let genresCopy = genres.map((item) => {
      return item
    })

    for (let i = 0; i < numberOfItems; i++) {
      randGenre = arrayUtils.getRandItem(genresCopy)
      const index = genresCopy.indexOf(randGenre)
      genresCopy.splice(index, 1)

      randGenresRes.push(randGenre)
    }

    return randGenresRes
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
      'horror',
      'non-fiction',
    ]

    console.log(JSON_PATH)

    const DESCRIPTION =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper suscipit scelerisque. Etiam nec tortor id odio facilisis sodales id a justo. Proin porta, turpis eget sodales mattis, est mauris.'

    const IMG_LINK = 'https://picsum.photos/800/600'

    const obj = {
      name: this.generateRandName(names.firstNames, names.lastNames),
      address: await this.generateRandAddress(JSON_PATH),
      description: DESCRIPTION,
      genres: this.generateRandGenres(GENRES),
      images: IMG_LINK,
      openDays: this.generateOpenDays(),
    }

    return obj
  },
  async genBookstoreDoc(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection obj')
    }
    const objForClass = await this.genObjForBookstoreClass()

    const Bookstore = models.Bookstore.getModelClass(connection)

    await Bookstore.create(objForClass)
  },
}

export default seedHelpers
