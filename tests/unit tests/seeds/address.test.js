import { vi, describe, it, expect } from 'vitest'
import Address from '../../../seeds/address'

describe('new Address()', () => {
  it('when pass an object that contains Address compoenents, it should return an object which contains homeNum, street, district and city properties', () => {
    const obj = {
      homeNum: '3',
      street: 'Ba Thang Hai',
      district: '10',
      city: 'Ho Chi Minh',
    }

    const res = new Address(obj)

    expect(res).toHaveProperty('homeNum')
    expect(res).toHaveProperty('street')
    expect(res).toHaveProperty('district')
    expect(res).toHaveProperty('city')
  })

  it('when passed an object where ANY of its propertes is NOT string data type, it should throw an error', () => {
    const invalidObjMocks = [
      {
        homeNum: false,
        street: 'Ba Thang Hai',
        district: '10',
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: true,
        district: '10',
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: 'Ba Thang Hai',
        district: true,
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: 'Ba Thang Hai',
        district: '10',
        city: true,
      },
    ]

    invalidObjMocks.forEach((obj) => {
      const fn = () => {
        new Address(obj)
      }

      expect(fn).toThrow(
        'All properties inside the object passed to class constructor should of of string data type'
      )
    })
  })
})

describe('testing Address class instance methods', () => {
  const obj = {
    homeNum: '3',
    street: 'Ba Thang Hai',
    district: '10',
    city: 'Ho Chi Minh',
  }
  describe('getFullStr()', () => {
    it('should return the correct address format: homeNum, street, district, city', () => {
      const addressObj = new Address(obj)

      const addressStr = addressObj.getFullStr()

      expect(addressStr).toBe(
        '3, Ba Thang Hai Street, 10 District, Ho Chi Minh City'
      )
    })
  })

  describe('getStreet()', () => {
    it('should return Address class instance street property value with the word Street added at the end', () => {
      const addressObj = new Address(obj)

      const res = addressObj.getStreet()

      expect(res).toBe('Ba Thang Hai Street')
    })
  })

  describe('getDistrict()', () => {
    it('should return Address class instance district property value with the word District added at the beginning', () => {
      const addressObj = new Address(obj)

      const res = addressObj.getDistrict()

      expect(res).toBe('10 District')
    })
  })

  describe('getCity()', () => {
    it('should return Address class instance city property value with the word City added at the end', () => {
      const addressObj = new Address(obj)

      const res = addressObj.getCity()

      expect(res).toBe('Ho Chi Minh City')
    })
  })
})
