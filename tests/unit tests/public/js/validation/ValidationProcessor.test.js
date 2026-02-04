// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ValidationProcessor from "../../../../../public/js/validation/ValidationProcessor.js";
import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from "../../../../../public/js/abstracts/validation/SingleValidatorBase.js";
import SingleValidator from "../../../../../public/js/validation/SingleValidator.js";
import InputErrorsFactory from "../../../../../public/js/validation/InputErrorsFactory.js";
import { Window } from "happy-dom";
import InputErrors from "../../../../../public/js/validation/InputErrors.js";
import GroupValidator from "../../../../../public/js/validation/GroupValidator.js";
import InputRules from "../../../../../public/js/validation/InputRules.js";
import SchemaParser from "../../../../../public/js/validation/SchemaParser.js";
import FormInputExtracter from "../../../../../public/js/validation/FormInputExtracter.js";
import InputRulesFactory from "../../../../../public/js/validation/InputRulesFactory.js";
import ValidationSchema from "../../../../../public/js/validation/ValidationSchema.js";
import { IS_GROUP_VALIDATOR_BASE_INSTANCE } from "../../../../../public/js/abstracts/validation/GroupValidatorBase.js";
import { IS_VALIDATION_PROCESSOR_BASE_INSTANCE } from "../../../../../public/js/abstracts/validation/ValidationProcessorBase.js";
const window = new Window();
const document = window.document;

vi.stubGlobal("document", document);
vi.stubGlobal("HTMLFormElement", window.HTMLFormElement);

describe("ValidationProcessor", () => {
  let singleValidator;
  let inputErrorsFactory;
  let groupValidator;
  let validationProcessor;
  beforeEach(() => {
    document.body.innerHTML = "";
    inputErrorsFactory = new InputErrorsFactory();
    singleValidator = new SingleValidator();
    groupValidator = new GroupValidator();
    validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator,
      inputErrorsFactory,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("when you pass a non instance of SingleValidatorBase, it should throw an error", () => {
    const singleValidator = 3;

    const fn = () => {
      new ValidationProcessor(
        singleValidator,
        groupValidator,
        inputErrorsFactory,
      );
    };

    expect(fn).toThrow(
      "You need to pass instance of SingleValidatorBase to first parameter",
    );
  });

  it("when you don't pass any value to first parameter, it should throw an error", () => {
    const fn = () => {
      new ValidationProcessor();
    };

    expect(fn).toThrow(
      "You need to pass instance of SingleValidatorBase to first parameter",
    );
  });

  it("when you pass a non instance of GroupValidatorBase in 2nd param, it should throw an error", () => {
    const groupValidator = 3;

    const fn = () => {
      new ValidationProcessor(
        singleValidator,
        groupValidator,
        inputErrorsFactory,
      );
    };

    expect(fn).toThrow(
      "You need to pass instance of GroupValidatorBase in 2nd parameter",
    );
  });

  it("when you pass valid singleValidator, groupValidator, and inputErrorsFactory to constructor, the instance must store those arguments as properties and it must have a property that checks instance of ValidationProcessorBase", () => {
    const validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator,
      inputErrorsFactory,
    );

    expect(validationProcessor.singleValidator).toEqual(singleValidator);
    expect(validationProcessor.groupValidator).toEqual(groupValidator);
    expect(validationProcessor.inputErrorsFactory).toEqual(inputErrorsFactory);
    expect(validationProcessor[IS_VALIDATION_PROCESSOR_BASE_INSTANCE]).toBe(
      true,
    );
  });

  it("when you pass a non instance of InputErrorsFactoryBase to 3rd param, it should throw an error", () => {
    const inputErrorsFactory = 3;

    const fn = () => {
      new ValidationProcessor(
        singleValidator,
        groupValidator,
        inputErrorsFactory,
      );
    };

    expect(fn).toThrow(
      "You need to pass instance of InputErrorsFactoryBase in 3rd parameter",
    );
  });

  describe("validationProcessor.validate()", () => {
    it("when you pass 3 to 1st parameter, it should throw an error", () => {
      const inputRulesArray = 3;

      const fn = () => {
        validationProcessor.validate(inputRulesArray);
      };

      expect(fn).toThrow(
        "You need to pass an array of instances of InputRules in 2nd parameter",
      );
    });

    it("when you pass an array where NOT all items are instances of InputRules to 1st param, it should throw an error", () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title">
        </form>
      `;
      const input = document.querySelector("input");
      const inputRules = new InputRules(input);
      const inputRulesArray = [1, inputRules];

      const fn = () => {
        validationProcessor.validate(inputRulesArray);
      };

      expect(fn).toThrow(
        "You need to pass an array of instances of InputRules in 2nd parameter",
      );
    });

    it("given singleValidator is mocked and passed to constructor, when you pass inputRulesArray of single inputs inputRules only with either required and maxLength rules, validationProcessor.validate() should call singleValidatorMock.required() and singleValidatorMock.maxLength() with correct input and correct rule values for that input passed to them", () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
          <input type = "text" name = "description" maxLength = "3">
        </form>
      `;
      const input1 = document.querySelector(`[name="title"]`);
      const input2 = document.querySelector(`[name="description"]`);
      const inputRules1 = new InputRules(input1);
      inputRules1.rules.required = true;
      const inputRules2 = new InputRules(input2);
      inputRules2.rules.maxLength = 3;
      const inputRulesArray = [inputRules1, inputRules2];
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      };
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidator,
        inputErrorsFactory,
      );

      // act
      const inputErrorsArray = validationProcessor.validate(inputRulesArray);

      expect(singleValidatorMock.required).toBeCalledWith(input1, true);
      expect(singleValidatorMock.maxLength).toBeCalledWith(input2, 3);
    });

    it("given each singleValidator methods is mocked to return an error msg and singleValidator is passed to constructor, when you pass inputRulesArray of singe inputs inputRules only with either required and maxLength rules, validationProcessor.validate() should return an array of those InputErrors instances where inputErrors.errors is an array of error msg", () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
          <input type = "text" name = "description" required maxLength = "3">
        </form>
      `;
      const input1 = document.querySelector(`[name="title"]`);
      const input2 = document.querySelector(`[name="description"]`);
      const inputRules1 = new InputRules(input1);
      inputRules1.rules.required = true;
      const inputRules2 = new InputRules(input2);
      inputRules2.rules.maxLength = 3;
      inputRules2.rules.required = true;
      const inputRulesArray = [inputRules1, inputRules2];

      const requiredError = "requiredError";
      const maxLengthError = "maxLengthError";

      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(() => {
          return requiredError;
        }),
        maxLength: vi.fn(() => {
          return maxLengthError;
        }),
      };

      const inputErrorsMock1 = new InputErrors(input1);
      inputErrorsMock1.errors.push(requiredError);

      const inputErrorsMock2 = new InputErrors(input2);
      inputErrorsMock2.errors.push(maxLengthError);
      inputErrorsMock2.errors.push(requiredError);

      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidator,
        inputErrorsFactory,
      );

      // act
      const inputErrorsArray = validationProcessor.validate(inputRulesArray);

      const expectedResult = [inputErrorsMock1, inputErrorsMock2];

      expect(inputErrorsArray).toEqual(expectedResult);
    });

    it("given singleValidator has mocked validation methods, when you pass inputRulesArray of single input InputRules instances where there's a rule in inputRules.rules that corresponds to no validation methods, it should throw an error", () => {
      document.body.innerHTML = `
        <form>
          <input type = "text">
        </form>
      `;

      const input = document.querySelector("input");
      const inputRules = new InputRules(input);
      const wrongRuleKey = "wrongRule";
      inputRules.rules[wrongRuleKey] = "test";
      const inputRulesArray = [inputRules];

      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        minLength: vi.fn(),
      };

      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidator,
        inputErrorsFactory,
      );

      // act
      const fn = () => {
        validationProcessor.validate(inputRulesArray);
      };

      expect(fn).toThrow(
        `${wrongRuleKey} is not a supported single input validation rule`,
      );
    });

    it("given groupValidator is mocked and passed to constructor, when you pass inputRulesArray of 2 checkbox inputRules with required rule, validationProcessor.validate() should call groupValidator.required() correct number of times with correct checkbox element", () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy" required>
          <input type = "checkbox" name = "openDays" value = "monday" required>
        </form>
      `;
      const checkbox1 = document.querySelector(`[value="fantasy"]`);
      const inputRules1 = new InputRules(checkbox1);
      inputRules1.rules.required = true;

      const checkbox2 = document.querySelector(`[name="openDays"]`);
      const inputRules2 = new InputRules(checkbox2);
      inputRules2.rules.required = true;

      const inputRulesArray = [inputRules1, inputRules2];
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      };
      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
      };
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidatorMock,
        inputErrorsFactory,
      );

      // act
      const inputErrorsArray = validationProcessor.validate(inputRulesArray);

      expect(groupValidatorMock.required).toBeCalledWith(checkbox1);
      expect(groupValidatorMock.required).toBeCalledWith(checkbox2);
    });

    it("given each of groupValidator methods is mocked to return an error msg and groupValidator is passed to constructor, when you pass inputRulesArray of 2 checkbox inputRules with required rule, validationProcessor.validate() should return correct array of InputRules instances with correct input and errors", () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy" required>
           <input type = "checkbox" name = "openDays" value = "monday" required>
        </form>
      `;
      const checkbox1 = document.querySelector(`[value="fantasy"]`);
      const inputRules1 = new InputRules(checkbox1);
      inputRules1.rules.required = true;

      const checkbox2 = document.querySelector(`[name="openDays"]`);
      const inputRules2 = new InputRules(checkbox2);
      inputRules2.rules.required = true;

      const inputRulesArray = [inputRules1, inputRules2];

      const errorMsg = "requiredError";

      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(() => {
          return errorMsg;
        }),
      };

      const inputErrorsMock1 = new InputErrors(checkbox1);
      inputErrorsMock1.errors.push(errorMsg);

      const inputErrorsMock2 = new InputErrors(checkbox2);
      inputErrorsMock2.errors.push(errorMsg);

      const validationProcessor = new ValidationProcessor(
        singleValidator,
        groupValidatorMock,
        inputErrorsFactory,
      );

      // act
      const inputErrorsArray = validationProcessor.validate(inputRulesArray);

      const expectedResult = [inputErrorsMock1, inputErrorsMock2];

      expect(inputErrorsArray).toEqual(expectedResult);
    });

    it("given groupValidator is mocked and passed to constructor, when you pass inputRulesArray of 2 radio inputRules with required rule, validationProcessor.validate() should call groupValidator.required() correct number of items with correct radio input element", () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "genres" value = "fantasy" required>
          <input type = "radio" name = "isOnline" value = "true" required>
        </form>
      `;
      const radio1 = document.querySelector(`[value="fantasy"]`);
      const inputRules1 = new InputRules(radio1);
      inputRules1.rules.required = true;

      const radio2 = document.querySelector(`[name = "isOnline"]`);
      const inputRules2 = new InputRules(radio2);
      inputRules2.rules.required = true;

      const inputRulesArray = [inputRules1, inputRules2];

      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
      };
      const validationProcessor = new ValidationProcessor(
        singleValidator,
        groupValidatorMock,
        inputErrorsFactory,
      );

      // act
      const inputErrorsArray = validationProcessor.validate(inputRulesArray);

      expect(groupValidatorMock.required).toBeCalledWith(radio1);
      expect(groupValidatorMock.required).toBeCalledWith(radio2);
    });

    it("given groupValidator is mocked to return an error msg and groupValidator is  passed to constructor, when you pass inputRulesArray of 2 radio inputRules with required rule, validationProcessor.validate() should return an array of instances of InputErrors with correct input and error msg", () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "genres" value = "fantasy" required>
          <input type = "radio" name = "isOnline" value = "true" required>
        </form>
      `;
      const radio1 = document.querySelector(`[value="fantasy"]`);
      const inputRules1 = new InputRules(radio1);
      inputRules1.rules.required = true;

      const radio2 = document.querySelector(`[name="isOnline"]`);
      const inputRules2 = new InputRules(radio2);
      inputRules2.rules.required = true;

      const inputRulesArray = [inputRules1, inputRules2];

      const errorMsg = "requiredError";

      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(() => {
          return errorMsg;
        }),
      };

      const inputErrors1 = new InputErrors(radio1);
      inputErrors1.errors.push(errorMsg);
      const inputErrors2 = new InputErrors(radio2);
      inputErrors2.errors.push(errorMsg);

      const validationProcessor = new ValidationProcessor(
        singleValidator,
        groupValidatorMock,
        inputErrorsFactory,
      );

      // act
      const inputErrorsArray = validationProcessor.validate(inputRulesArray);

      const expectedResult = [inputErrors1, inputErrors2];
      expect(inputErrorsArray).toEqual(expectedResult);
    });

    it("given groupValidator methods are mocked, if you pass an inputRulesArray of group inputs inputRules and there's an inputRules that specifies a rule that is not in groupValidator methods, it should throw an error", () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox">
        </form>
      `;
      const checkbox = document.querySelector("input");
      const inputRules = new InputRules(checkbox);
      const wrongRuleKey = "wrongRule";
      inputRules.rules[wrongRuleKey] = "test";
      const inputRulesArray = [inputRules];

      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
      };

      const validationProcessor = new ValidationProcessor(
        singleValidator,
        groupValidatorMock,
        inputErrorsFactory,
      );

      // act
      const fn = () => {
        validationProcessor.validate(inputRulesArray);
      };

      expect(fn).toThrow(
        `${wrongRuleKey} rule is not a supported group input validation rule`,
      );
    });
  });
});
