// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import InputErrorsFactory from "../../../../../public/js/validation/InputErrorsFactory.js";
import { IS_INPUT_ERRORS_INSTANCE } from "../../../../../public/js/validation/InputErrors.js";
import InputErrors from "../../../../../public/js/validation/InputErrors.js";
import typeCheck from "../../../../../public/js/utils/typeCheck.js";
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from "../../../../../public/js/abstracts/validation/InputErrorsFactoryBase.js";
import { Window } from "happy-dom";
const window = new Window();
const document = window.document;

vi.stubGlobal("document", document);

vi.mock("../../../../../public/js/validation/InputErrors.js", () => {
  const IS_INPUT_ERRORS_INSTANCE = Symbol("InputErrors/is-instance");

  const InputErrorsMock = vi.fn(function (input) {
    this.input = input;
    this.errors = null;
    this[IS_INPUT_ERRORS_INSTANCE] = true;
  });
  return {
    default: InputErrorsMock,
    IS_INPUT_ERRORS_INSTANCE,
  };
});

describe("InputErrorsFactory", () => {
  let inputErrorsFactory;
  let isInputElementSpy;
  beforeEach(() => {
    document.body.innerHTML = "";
    inputErrorsFactory = new InputErrorsFactory();
    isInputElementSpy = vi
      .spyOn(typeCheck, "isInputElement")
      .mockReturnValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("when you instantiate the constructor, the instance should have property to check instance of InputErrorsFactoryBase", () => {
    const inputErrorsFactory = new InputErrorsFactory();

    console.log(inputErrorsFactory[IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE]);
    expect(inputErrorsFactory[IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE]).toBe(
      true,
    );
  });

  describe("inputErrorsFactory.create()", () => {
    it("when you pass input, it should return instance of InputErrors", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");

      const inputErrors = inputErrorsFactory.create(input);

      expect(inputErrors[IS_INPUT_ERRORS_INSTANCE]).toBe(true);
    });
    it("when you pass input, it should call new InputErrors() with said input", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");

      const inputErrors = inputErrorsFactory.create(input);

      expect(InputErrors).toBeCalledWith(input);
    });

    it("when you pass input, it should call typeCheck.isInputElement() with that input", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");

      const inputErrors = inputErrorsFactory.create(input);

      expect(isInputElementSpy).toBeCalledWith(input);
    });

    it("given typeCheck.isInputElement() returns false, when you pass a non input element, it should throw an error", () => {
      isInputElementSpy.mockReturnValue(false);
      const input = 3;

      const fn = () => {
        inputErrorsFactory.create(input);
      };

      expect(fn).toThrow(
        "You need to pass an input element in first parameter",
      );
    });
  });
});
