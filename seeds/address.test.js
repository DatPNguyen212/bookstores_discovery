import { vi, describe, it, expect } from 'vitest'
import Address from './address.js'

describe('new Address()', () => {
  it('when pass an object that contains Address compoenents, it should return an object which contains homeNum, street, ward, district and city properties', () => {
    const obj = {
      homeNum: '3',
      street: 'Ba Thang Hai',
      ward: '3',
      district: '10',
      city: 'Ho Chi Minh',
    }

    const res = new Address(obj)

    expect(res).toHaveProperty('homeNum')
    expect(res).toHaveProperty('street')
    expect(res).toHaveProperty('ward')
    expect(res).toHaveProperty('district')
    expect(res).toHaveProperty('city')
  })

  it('when passed an object where ANY of its propertes is NOT string data type, it should throw an error', () => {
    const invalidObjMocks = [
      {
        homeNum: false,
        street: 'Ba Thang Hai',
        ward: '3',
        district: '10',
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: true,
        ward: '3',
        district: '10',
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: 'Ba Thang Hai',
        ward: true,
        district: '10',
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: 'Ba Thang Hai',
        ward: '3',
        district: true,
        city: 'Ho Chi Minh',
      },
      {
        homeNum: '3',
        street: 'Ba Thang Hai',
        ward: '3',
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
    ward: '3',
    district: '10',
    city: 'Ho Chi Minh',
  }
  describe('fullStr() getter', () => {
    it('should return the correct address format: homeNum, street, ward, district, city', () => {
      const addressObj = new Address(obj)

      const addressStr = addressObj.fullStr

      expect(addressStr).toBe(
        '3, Ba Thang Hai Street, Ward 3, District 10, Ho Chi Minh City'
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

  describe('getWard()', () => {
    it('should return Address class instance ward property value with the word Ward added at the beginning', () => {
      const addressObj = new Address(obj)

      const res = addressObj.getWard()

      expect(res).toBe('Ward 3')
    })
  })

  describe('getDistrict()', () => {
    it('should return Address class instance district property value with the word District added at the beginning', () => {
      const addressObj = new Address(obj)

      const res = addressObj.getDistrict()

      expect(res).toBe('District 10')
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
