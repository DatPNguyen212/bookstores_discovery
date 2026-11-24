// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import InputRules from "../../../../../public/js/validation/InputRules.js";
import InputRulesFactory from "../../../../../public/js/validation/InputRulesFactory.js";
import objectUtils from "../../../../../utils/objectUtils.js";
import { IS_INPUT_RULES_FACTORY_BASE_INSTANCE } from "../../../../../public/js/abstracts/validation/InputRulesFactoryBase.js";

vi.mock("../../../../../public/js/validation/InputRules.js", () => {
  return {
    default: vi.fn(function () {}),
  };
});

import { Window } from "happy-dom";
const window = new Window();
const document = window.document;

vi.stubGlobal("document", document);

describe("InputRulesFactory", () => {
  it("when you instantiate constructor, it should have a property that checks if instance is instanceof InputRulesFactoryBase", () => {
    const inputRulesFactory = new InputRulesFactory();

    expect(inputRulesFactory[IS_INPUT_RULES_FACTORY_BASE_INSTANCE]).toBe(true);
  });
  describe("inputRulesFactory.create()", () => {
    let inputRulesFactory;
    beforeEach(() => {
      document.body.innerHTML = "";
      inputRulesFactory = new InputRulesFactory();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("when you pass an input element, it should return an obj which is instanceof InputRules", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");

      const inputRules = inputRulesFactory.create(input);

      expect(inputRules).instanceOf(InputRules);
    });

    it("when you pass an input element, it should call InputRules with that input element", () => {
      document.body.innerHTML = `<input type = "text">`;
      const input = document.querySelector("input");

      const inputRules = inputRulesFactory.create(input);

      expect(InputRules).toBeCalledWith(input);
    });
    it("when you pass a non input element, it should throw an error", () => {
      const input = 3;

      const fn = () => {
        const inputRules = inputRulesFactory.create(input);
      };

      expect(fn).toThrow(
        "You need to pass an input element to first parameter",
      );
    });
  });
});
