import SchemaParser from "../validation/SchemaParser.js";
import FormInputExtracter from "../validation/FormInputExtracter.js";
import InputRulesFactory from "../validation/InputRulesFactory.js";
import SingleValidator from "../validation/SingleValidator.js";
import GroupValidator from "../validation/GroupValidator.js";
import InputErrorsFactory from "../validation/InputErrorsFactory.js";
import ValidationProcessor from "../validation/ValidationProcessor.js";
import FormErrorsRenderer from "../validation/FormErrorsRenderer.js";
import ElementRenderer from "../validation/ElementRenderer.js";
import ObjArgValidator from "../validation/ObjArgValidator.js";
import FormValidator from "../validation/FormValidator.js";
import ValidationSchema from "../validation/ValidationSchema.js";
import CreateTextOptsSchema from "../validation/CreateTextOptsSchema.js";

const inputExtracter = new FormInputExtracter();
const inputRulesFactory = new InputRulesFactory();
const schemaParser = new SchemaParser(inputExtracter, inputRulesFactory);

const singleValidator = new SingleValidator();
const groupValidator = new GroupValidator();
const inputErrorsFactory = new InputErrorsFactory();
const validationProcessor = new ValidationProcessor(
  singleValidator,
  groupValidator,
  inputErrorsFactory,
);

const createTextOptsSchema = new CreateTextOptsSchema("options");

const createTextOptsSchemaAdapter = new ObjArgValidator(createTextOptsSchema);

const elementRenderer = new ElementRenderer(createTextOptsSchemaAdapter);

const formErrorsRenderer = new FormErrorsRenderer(
  elementRenderer,
  createTextOptsSchemaAdapter,
);

const formValidator = new FormValidator(
  schemaParser,
  validationProcessor,
  formErrorsRenderer,
  createTextOptsSchemaAdapter,
);

const form = document.querySelector(".form-create");
const schema = new ValidationSchema({
  "bookstore[name]": {
    required: true,
    maxLength: 100,
  },
  "bookstore[address]": {
    maxLength: 255,
    required: true,
  },
  "bookstore[description]": {
    maxLength: 500,
    required: true,
  },
  "bookstore[genres]": {
    required: true,
  },
  "bookstore[images]": {
    required: true,
  },
  "bookstore[openDays]": {
    required: true,
  },
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  formValidator.validate(form, schema, {
    tagName: "div",
    class: "error",
    id: "",
    style: {
      color: "red",
      fontSize: "16px",
    },
  });
});

console.log("test");
