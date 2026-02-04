import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import InputErrors from "../../../../../public/js/validation/InputErrors.js";
import typeCheck from "../../../../../public/js/utils/typeCheck.js";
import { IS_INPUT_ERRORS_INSTANCE } from "../../../../../public/js/validation/InputErrors.js";
import { Window } from "happy-dom";
const window = new Window();
const document = window.document;

vi.stubGlobal("document", document);

describe("InputErrors", () => {
  let isInputElementMock;
  beforeEach(() => {
    document.body.innerHTML = "";
    isInputElementMock = vi
      .spyOn(typeCheck, "isInputElement")
      .mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("when you pass input to constructor when instantiating, inputErrror should contain input property with value of that input, an errors property with empty array, and a symbol property to check instanceof", () => {
    document.body.innerHTML = `<input type = "text">`;
    const input = document.querySelector("input");

    const inputErrors = new InputErrors(input);

    expect(inputErrors.input).toEqual(input);
    expect(inputErrors.errors).toHaveLength(0);
    expect(inputErrors[IS_INPUT_ERRORS_INSTANCE]).toBe(true);
  });
  it("when you pass input element to constructor, it should call typeCheck.isInputElement() with that input", () => {
    document.body.innerHTML = `<input type = "text">`;
    const input = document.querySelector("input");

    const inputErrors = new InputErrors(input);

    expect(isInputElementMock).toBeCalledWith(input);
  });

  it("given isInputElementMock returns false, when you pass a non input element to constructor, it should throw an error", () => {
    isInputElementMock.mockReturnValue(false);
    const input = 3;

    const fn = () => {
      new InputErrors(input);
    };

    expect(fn).toThrow("You need to pass an input element to first parameter");
  });

  describe("inputErrors.addError()", () => {
    it("when you pass a string, inputErrors.errors should contain that string", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");
      const inputErrors = new InputErrors(input);
      const error = "test";

      inputErrors.addError(error);

      expect(inputErrors.errors).toContain(error);
    });

    it("if you don't pass a non stirng data type, it should throw an error", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");
      const inputErrors = new InputErrors(input);
      const error = 3;

      const fn = () => {
        inputErrors.addError(error);
      };

      expect(fn).toThrow("You need to pass a string to first parameter");
    });
  });

  describe("inputErrors.isEmpty()", () => {
    it("when all of inputErrors.errors array items are null, it should return true", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");
      const inputErrors = new InputErrors(input);
      inputErrors.errors.push(null);
      inputErrors.errors.push(null);

      const result = inputErrors.isEmpty();

      expect(result).toBe(true);
    });

    it("when NOT all of inputErrors.errors array items are null, it should return false", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");
      const inputErrors = new InputErrors(input);
      inputErrors.errors.push("test");
      inputErrors.errors.push(null);

      const result = inputErrors.isEmpty();

      expect(result).toBe(false);
    });
  });
});
