class RulesExtractBase {
  constructor() {
    if (new.target === RulesExtractBase) {
      throw new Error('Cannot directly instantiate RulesExtractBase')
    }
  }

  required() {
    throw new Error('You need to implement required() in subclass')
  }

  maxLength() {
    throw new Error('You need to implement maxLength() in subclass')
  }
}

export default RulesExtractBase
