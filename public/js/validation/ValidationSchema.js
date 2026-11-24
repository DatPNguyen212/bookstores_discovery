import objectUtils from "../utils/objectUtils.js";

const IS_VALIDATION_SCHEMA_INSTANCE = Symbol("ValidationSchema/is-instance");
class ValidationSchema {
  constructor(schemaDef) {
    if (!objectUtils.isPlainObject(schemaDef)) {
      throw new TypeError("You need to pass a plain object to 1st parameter");
    }
    const keys = Object.keys(schemaDef);

    if (keys.length === 0) {
      throw new TypeError(
        "You need to pass a plain object that is NOT empty in 1st parameter",
      );
    }

    for (let key of keys) {
      this[key] = schemaDef[key];
    }

    this[IS_VALIDATION_SCHEMA_INSTANCE] = true;
  }
}

export default ValidationSchema;
export { IS_VALIDATION_SCHEMA_INSTANCE };
