class Address {
  constructor(obj) {
    if (
      typeof obj.homeNum !== 'string' ||
      typeof obj.street !== 'string' ||
      typeof obj.district !== 'string' ||
      typeof obj.city !== 'string'
    ) {
      throw new TypeError(
        'All properties inside the object passed to class constructor should of of string data type'
      )
    }

    this.homeNum = obj.homeNum
    this.street = obj.street
    this.district = obj.district
    this.city = obj.city
  }

  getFullStr() {
    return `${
      this.homeNum
    }, ${this.getStreet()}, ${this.getDistrict()}, ${this.getCity()}`
  }

  getHomeNum() {
    return this.homeNum
  }

  getStreet() {
    return this.street + ' Street'
  }

  getDistrict() {
    return this.district + ' District'
  }

  getCity() {
    return this.city + ' City'
  }
}

export default Address
