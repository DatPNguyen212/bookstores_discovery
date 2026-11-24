// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import SchemaParser from "../../../../../public/js/validation/SchemaParser.js";
import FormInputExtracter from "../../../../../public/js/validation/FormInputExtracter.js";
import InputRulesFactory from "../../../../../public/js/validation/InputRulesFactory.js";
import ValidationSchema from "../../../../../public/js/validation/ValidationSchema.js";

import { Window } from "happy-dom";
const window = new Window();
const document = window.document;

vi.stubGlobal("document", document);

describe("schemaParser.parse()", () => {
  let schemaParser;
  let inputExtracter;
  let inputRulesFactory;
  beforeEach(() => {
    document.body.innerHTML = "";
    inputExtracter = new FormInputExtracter();
    inputRulesFactory = new InputRulesFactory();
    schemaParser = new SchemaParser(inputExtracter, inputRulesFactory);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("when you pass a form and schema where the form does not contain an input element with name attribute value specified in schema, it should throw an error", () => {
    document.body.innerHTML = `
    <form>
      <input type = "text" name = "title" required>
    </form>`;
    const form = document.querySelector("form");
    const schema = new ValidationSchema({
      title: {
        required: true,
      },
      address: {
        required: true,
      },
    });

    const fn = () => {
      const result = schemaParser.parse(form, schema);
    };

    expect(fn).toThrow(`Cannot find input with name attribute of "address"`);
  });

  it("when you pass a form that contains group input elements specified in the schema that you also pass as argument, it should return correct array of InputRules instances", () => {
    document.body.innerHTML = `
    <form>
      <input type = "checkbox" name = "openDays" value = "monday" required>
      <input type = "checkbox" name = "openDays" value = "tuesday">

      <input type = "radio" name = "online" value = "true" required>
      <input type = "radio" name = "online" value = "false">
    </form>
    `;
    const form = document.querySelector("form");
    const schema = new ValidationSchema({
      openDays: {
        required: true,
      },
      online: {
        required: true,
      },
    });
    const firstCheckbox = document.querySelector(`[value="monday"]`);
    const firstRadio = document.querySelector(`[value="true"]`);

    const firstCheckboxInputRules = inputRulesFactory.create(firstCheckbox);
    firstCheckboxInputRules.rules.required = true;
    const firstRadioInputRules = inputRulesFactory.create(firstRadio);
    firstRadioInputRules.rules.required = true;

    const expectedResult = [firstCheckboxInputRules, firstRadioInputRules];

    const result = schemaParser.parse(form, schema);

    expect(result).toEqual(expectedResult);
  });

  it("when you pass a form that contains single input elements specified in the schema that you also pass as argument, it should return correct array of InputRules instances", () => {
    document.body.innerHTML = `
      <form>
        <input type = "text" name = "title" required>
        <textarea name = "description" required maxLength = "3"></textarea>
      </form>
    `;
    const input1 = document.querySelector(`[name="title"]`);
    const input2 = document.querySelector(`[name="description"]`);
    const form = document.querySelector("form");
    const schema = new ValidationSchema({
      title: {
        required: "true",
      },
      description: {
        required: "true",
        maxLength: 3,
      },
    });
    const input1InputRules = inputRulesFactory.create(input1);
    input1InputRules.rules.required = "true";
    const input2InputRules = inputRulesFactory.create(input2);
    input2InputRules.rules.required = "true";
    input2InputRules.rules.maxLength = 3;

    const expectedResult = [input1InputRules, input2InputRules];

    const result = schemaParser.parse(form, schema);

    expect(result).toEqual(expectedResult);
  });

  it("when you pass a form that contains both single and group input elements specified in the schema that you also pass as argument, it should return correct array of InputRules instances", () => {
    document.body.innerHTML = `
      <form>
        <input type = "text" name = "title" required>
        <textarea name = "description" required></textarea>

        <input type = "checkbox" name = "openDays" value = "monday" required>
        <input type = "checkbox" name = "openDays" value = "tuesday">
      </form>
    `;
    const form = document.querySelector("form");
    const schema = new ValidationSchema({
      title: {
        required: true,
      },
      description: {
        required: true,
      },
      openDays: {
        required: true,
      },
    });
    const singleInput1 = document.querySelector(`[name="title"]`);
    const singleInput2 = document.querySelector(`[name="description"]`);
    const groupInput1 = document.querySelector(`[value="monday"]`);

    const singleInput1InputRules = inputRulesFactory.create(singleInput1);
    singleInput1InputRules.rules.required = true;
    const singleInput2InputRules = inputRulesFactory.create(singleInput2);
    singleInput2InputRules.rules.required = true;
    const groupInput1InputRules = inputRulesFactory.create(groupInput1);
    groupInput1InputRules.rules.required = true;

    const expectedResult = [
      singleInput1InputRules,
      singleInput2InputRules,
      groupInput1InputRules,
    ];

    const result = schemaParser.parse(form, schema);

    expect(result).toEqual(expectedResult);
  });
});
