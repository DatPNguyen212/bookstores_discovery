class ElementRendererBase {
  constructor() {
    if (new.target === ElementRendererBase) {
      throw new Error('ElementRendererBase cannot be instantiated directly')
    }
  }

  createTextElement() {
    throw new Error('createTextElement needs to be implemented in subclass')
  }
}

export default ElementRendererBase
