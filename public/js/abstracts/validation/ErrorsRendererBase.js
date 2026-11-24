const IS_ERRORS_RENDERER_BASE_INSTANCE = Symbol(
  "ErrorsRendererBase/is-instance",
);
class ErrorsRendererBase {
  constructor() {
    if (new.target === ErrorsRendererBase) {
      throw new Error("You cannot directly instantiate ErrorsRendererBase");
    }
    this[IS_ERRORS_RENDERER_BASE_INSTANCE] = true;
  }

  render() {
    throw new Error("render() needs to be implemented in subclass");
  }
}

export default ErrorsRendererBase;
export { IS_ERRORS_RENDERER_BASE_INSTANCE };
