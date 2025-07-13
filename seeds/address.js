class Address {
  constructor(obj) {
    if (
      typeof obj.homeNum !== 'string' ||
      typeof obj.street !== 'string' ||
      typeof obj.ward !== 'string' ||
      typeof obj.district !== 'string' ||
      typeof obj.city !== 'string'
    ) {
      throw new TypeError(
        'All properties inside the object passed to class constructor should of of string data type'
      )
    }

    this.homeNum = obj.homeNum
    this.street = obj.street
    this.ward = obj.ward
    this.district = obj.district
    this.city = obj.city
  }

  get fullStr() {
    return `${
      this.homeNum
    }, ${this.getStreet()}, ${this.getWard()}, ${this.getDistrict()}, ${this.getCity()}`
  }

  getHomeNum() {
    return this.homeNum
  }

  getStreet() {
    return this.street + ' Street'
  }

  getWard() {
    return 'Ward ' + this.ward
  }

  getDistrict() {
    return 'District ' + this.district
  }

  getCity() {
    return this.city + ' City'
  }
}

export default Address
