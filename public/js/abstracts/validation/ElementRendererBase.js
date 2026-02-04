const IS_ELEMENT_RENDERER_BASE_INSTANCE = Symbol(
  "ElementRendererBase/is-instance",
);
class ElementRendererBase {
  constructor() {
    if (new.target === ElementRendererBase) {
      throw new Error("ElementRendererBase cannot be instantiated directly");
    }
    this[IS_ELEMENT_RENDERER_BASE_INSTANCE] = true;
  }

  createTextElement() {
    throw new Error("createTextElement needs to be implemented in subclass");
  }
}

export default ElementRendererBase;
export { IS_ELEMENT_RENDERER_BASE_INSTANCE };
