import $hz3R0$lodash from "lodash";

const $38249a4475bf1fdd$export$532cdf2f5d7d6bf1 = Symbol('InputExtracterBase/is-instance');
class $38249a4475bf1fdd$var$InputExtracterBase {
    constructor(){
        if (new.target === $38249a4475bf1fdd$var$InputExtracterBase) throw new Error('InputExtracterBase cannot be directly instantiated');
        this[$38249a4475bf1fdd$export$532cdf2f5d7d6bf1] = true;
    }
    getFormInputs() {
        throw new Error('getFormInputs() needs to be implemented in subclass');
    }
}
var $38249a4475bf1fdd$export$2e2bcd8739ae039 = $38249a4475bf1fdd$var$InputExtracterBase;


const $31b92437bb6e6faf$export$7f33478ef0429898 = Symbol('InputRulesFactoryBase/is-instance');
class $31b92437bb6e6faf$var$InputRulesFactoryBase {
    constructor(){
        if (new.target === $31b92437bb6e6faf$var$InputRulesFactoryBase) throw new Error('InputRulesFactoryBase cannot be instantiated directly');
        this[$31b92437bb6e6faf$export$7f33478ef0429898] = true;
    }
    create() {
        throw new Error('create() needs to be implemented in subclass');
    }
}
var $31b92437bb6e6faf$export$2e2bcd8739ae039 = $31b92437bb6e6faf$var$InputRulesFactoryBase;


const $583b8d21833f2e2f$var$objectUtils = {
    isPlainObject (value) {
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
    }
};
var $583b8d21833f2e2f$export$2e2bcd8739ae039 = $583b8d21833f2e2f$var$objectUtils;


const $eb5c8c31dfac73d0$export$2009ae4e72abcbb7 = Symbol('ValidationSchema/is-instance');
class $eb5c8c31dfac73d0$var$ValidationSchema {
    constructor(schemaDef){
        if (!(0, $583b8d21833f2e2f$export$2e2bcd8739ae039).isPlainObject(schemaDef)) throw new TypeError('You need to pass a plain object to 1st parameter');
        const keys = Object.keys(schemaDef);
        if (keys.length === 0) throw new TypeError('You need to pass a plain object that is NOT empty in 1st parameter');
        for (let key of keys)this[key] = schemaDef[key];
        this[$eb5c8c31dfac73d0$export$2009ae4e72abcbb7] = true;
    }
}
var $eb5c8c31dfac73d0$export$2e2bcd8739ae039 = $eb5c8c31dfac73d0$var$ValidationSchema;


const $8f2c6c2ddb5d6a0e$export$e7d22bec8bcddbf1 = Symbol('SchemaParserBase/is-instance');
class $8f2c6c2ddb5d6a0e$var$SchemaParserBase {
    constructor(){
        if (new.target === $8f2c6c2ddb5d6a0e$var$SchemaParserBase) throw new Error('You cannot directly instantiate SchemaParserBase');
        this[$8f2c6c2ddb5d6a0e$export$e7d22bec8bcddbf1] = true;
    }
    parse() {
        throw new Error('parse() needs to be implemented in subclass');
    }
}
var $8f2c6c2ddb5d6a0e$export$2e2bcd8739ae039 = $8f2c6c2ddb5d6a0e$var$SchemaParserBase;


class $a08e9494c48b12ed$var$SchemaParser extends (0, $8f2c6c2ddb5d6a0e$export$2e2bcd8739ae039) {
    constructor(inputExtracter, inputRulesFactory){
        super();
        if (!inputExtracter?.[0, $38249a4475bf1fdd$export$532cdf2f5d7d6bf1]) throw new TypeError('First parmameter needs an instanceof InputExtracterBase');
        if (!inputRulesFactory?.[0, $31b92437bb6e6faf$export$7f33478ef0429898]) throw new TypeError('Second parameter needs to be instanceof InputRulesFactoryBase');
        this.inputExtracter = inputExtracter;
        this.inputRulesFactory = inputRulesFactory;
    }
    parse(form, schema) {
        if (!(form instanceof HTMLFormElement)) throw new TypeError('You need to pass a form element to first parameter');
        if (!schema[0, $eb5c8c31dfac73d0$export$2009ae4e72abcbb7]) throw new TypeError('You need to pass an instance of ValidationSchema');
        const inputs = this.inputExtracter.getFormInputs(form);
        const schemaKeys = Object.keys(schema);
        let result = [];
        for (let schemaKey of schemaKeys){
            const inputFound = inputs.find((input)=>{
                if (!Array.isArray(input)) return input.name === schemaKey;
                else return input[0].name === schemaKey;
            });
            if (inputFound) {
                const rules = schema[schemaKey];
                if (!Array.isArray(inputFound)) {
                    const inputRules = this.inputRulesFactory.create(inputFound);
                    inputRules.rules = rules;
                    result.push(inputRules);
                } else {
                    const firstGroupInput = inputFound[0];
                    const inputRules = this.inputRulesFactory.create(firstGroupInput);
                    inputRules.rules = rules;
                    result.push(inputRules);
                }
            } else throw new TypeError(`Cannot find input with name attribute of "${schemaKey}"`);
        }
        return result;
    }
}
var $a08e9494c48b12ed$export$2e2bcd8739ae039 = $a08e9494c48b12ed$var$SchemaParser;




class $7fa714fccd82f275$var$FormInputExtracter extends (0, $38249a4475bf1fdd$export$2e2bcd8739ae039) {
    constructor(){
        super();
    }
    getFormInputs(form) {
        if (form.tagName !== 'FORM') throw new TypeError('You need to pass a form element as an argument');
        const elements = form.elements;
        let result = [];
        for(let i = 0; i < elements.length; i++){
            const element = elements[i];
            let isUnique = true;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                for(let j = 0; j < result.length; j++){
                    const itemInResult = result[j];
                    const selectionElements = [];
                    if (!(0, $hz3R0$lodash).isArray(itemInResult)) {
                        if (element.name === itemInResult.name) {
                            isUnique = false;
                            selectionElements.push(result[j], element);
                            result[j] = selectionElements;
                        }
                    } else if (itemInResult[0].name === element.name) {
                        isUnique = false;
                        result[j].push(element);
                    }
                }
                if (isUnique === true) result.push(element);
            }
        }
        return result;
    }
}
var $7fa714fccd82f275$export$2e2bcd8739ae039 = $7fa714fccd82f275$var$FormInputExtracter;


const $b5f8850d77bbc3ce$var$typeCheck = {
    isSingleInputType (input) {
        if (!this.isInputElement(input)) return false;
        if (input instanceof HTMLInputElement) {
            if (input.type === 'checkbox' || input.type === 'radio') return false;
            else return true;
        }
        if (!(input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) return false;
        else return true;
    },
    isInputElement (input) {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) return true;
        else return false;
    }
};
var $b5f8850d77bbc3ce$export$2e2bcd8739ae039 = $b5f8850d77bbc3ce$var$typeCheck;


const $5d6439b000822ed6$export$e57dd118759bb04c = Symbol('InputRules/is-instance');
class $5d6439b000822ed6$var$InputRules {
    constructor(input){
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isInputElement(input)) throw new TypeError('You need to pass either an input element, select element or textarea element');
        this.input = input;
        this.rules = {};
        this[$5d6439b000822ed6$export$e57dd118759bb04c] = true;
    }
    addRule(name, value) {
        if (typeof name !== 'string') throw new TypeError('First param needs to be of string data type');
        if (value === undefined || value === null || typeof value === 'object') throw new TypeError('You need to pass a value that is NOT undefined, null or object data type');
        this.rules[name] = value;
    }
    getGroupInputs() {
        const form = this.input.form;
        const name = this.input.name;
        let inputs;
        if (name) inputs = Array.from(form.elements[name]);
        else throw new TypeError('The input in your inputRules instance needs to have name attribute value');
        const groupInputs = inputs.filter((input)=>{
            return input.type === 'checkbox' || input.type === 'radio';
        });
        return groupInputs;
    }
}
var $5d6439b000822ed6$export$2e2bcd8739ae039 = $5d6439b000822ed6$var$InputRules;




class $d835a08c5f31416a$var$InputRulesFactory extends (0, $31b92437bb6e6faf$export$2e2bcd8739ae039) {
    constructor(){
        super();
    }
    create(input) {
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isInputElement(input)) throw new TypeError('You need to pass an input element to first parameter');
        return new (0, $5d6439b000822ed6$export$2e2bcd8739ae039)(input);
    }
}
var $d835a08c5f31416a$export$2e2bcd8739ae039 = $d835a08c5f31416a$var$InputRulesFactory;


const $726fefb5eb08aba0$export$f56c5117a2ea9416 = Symbol('SingleValidatorBase/is-instance');
class $726fefb5eb08aba0$var$SingleValidatorBase {
    constructor(){
        if (new.target === $726fefb5eb08aba0$var$SingleValidatorBase) throw new Error('ValidatorBase cannot be instantiated directly');
        this[$726fefb5eb08aba0$export$f56c5117a2ea9416] = true;
    }
    required() {
        throw new Error('required() needs to be implemented in subclass');
    }
    maxLength() {
        throw new Error('maxLength() needs to be implemented in subclass');
    }
    groupInputRequired() {
        throw new Error('groupInputRequired() needs to be implemented in subclass');
    }
}
var $726fefb5eb08aba0$export$2e2bcd8739ae039 = $726fefb5eb08aba0$var$SingleValidatorBase;


const $11f64af16cc3c95f$var$numberUtils = {
    generateRandNum (min, max) {
        if (typeof min !== 'number' || typeof max !== 'number') throw new TypeError('First and second parameters must be of number data type');
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
var $11f64af16cc3c95f$export$2e2bcd8739ae039 = $11f64af16cc3c95f$var$numberUtils;



const $6bff602d11a07d6f$var$arrayUtils = {
    getRandItem (array) {
        if (!Array.isArray(array)) throw new TypeError('First parameter should be of array data type');
        return array[(0, $11f64af16cc3c95f$export$2e2bcd8739ae039).generateRandNum(0, array.length - 1)];
    },
    generateArray (option) {
        let newArray = [];
        if (!option.numberItems) throw new TypeError('First object parameter MUST have numberItems property');
        else if (option.enum && !option.default) {
            if (!Array.isArray(option.enum)) throw new TypeError('enum property must be an array');
            if (option.uniqueItems !== true) for(let i = 0; i < option.numberItems; i++){
                const randItemFromEnum = this.getRandItem(option.enum);
                newArray.push(randItemFromEnum);
            }
            else if (option.uniqueItems === true) {
                if (option.numberItems > option.enum.length) throw new TypeError("numberItems should be smaller than or equal to enum array's length");
                for(let i = 0; i < option.numberItems; i++){
                    let isInArray = true;
                    let randItem;
                    while(isInArray === true){
                        randItem = this.getRandItem(option.enum);
                        isInArray = this.isValueInArray(randItem, newArray);
                    }
                    newArray.push(randItem);
                    console.log(newArray);
                }
            }
        } else if (!option.enum && option.default) for(let i = 0; i < option.numberItems; i++)newArray.push(option.default);
        else if (!option.enum && !option.default) throw new TypeError('First object parameter must have enum property OR default property');
        else throw new TypeError('First object parameter CANNOT have both default property and enum property');
        return newArray;
    },
    isValueInArray (value, array) {
        if (!Array.isArray(array)) throw new TypeError('2nd param must be an array');
        for (let item of array){
            if ((0, $hz3R0$lodash).isEqual(value, item)) return true;
        }
        return false;
    },
    areAllGroupInputs (inputs) {
        if (!Array.isArray(inputs)) throw new TypeError('First parameter should be an array');
        for (let input of inputs){
            if (input.type !== 'checkbox' && input.type !== 'radio') return false;
        }
        return true;
    }
};
var $6bff602d11a07d6f$export$2e2bcd8739ae039 = $6bff602d11a07d6f$var$arrayUtils;



const $4136a024e8bb51bc$export$25de8332662b53ee = Symbol('InputErrors/is-instance');
class $4136a024e8bb51bc$var$InputErrors {
    constructor(input){
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isInputElement(input)) throw new TypeError('You need to pass an input element to first parameter');
        this.input = input;
        this.errors = [];
        this[$4136a024e8bb51bc$export$25de8332662b53ee] = true;
    }
    addError(error) {
        if (typeof error !== 'string') throw new TypeError('You need to pass a string to first parameter');
        this.errors.push(error);
    }
}
var $4136a024e8bb51bc$export$2e2bcd8739ae039 = $4136a024e8bb51bc$var$InputErrors;



const $08cc71d167b92496$export$f08fae476ed39a09 = Symbol('InputErrorsFactoryBase/is-instance');
class $08cc71d167b92496$var$InputErrorsFactoryBase {
    constructor(){
        if (new.target === $08cc71d167b92496$var$InputErrorsFactoryBase) throw new Error('You cannot directly instantiate InputErrorFactoryBase');
        this[$08cc71d167b92496$export$f08fae476ed39a09] = true;
    }
    create() {
        throw new Error('create() needs to be implemented in subclass');
    }
}
var $08cc71d167b92496$export$2e2bcd8739ae039 = $08cc71d167b92496$var$InputErrorsFactoryBase;


class $806ef6720f97e688$var$InputErrorsFactory extends (0, $08cc71d167b92496$export$2e2bcd8739ae039) {
    constructor(){
        super();
    }
    create(input) {
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isInputElement(input)) throw new TypeError('You need to pass an input element in first parameter');
        return new (0, $4136a024e8bb51bc$export$2e2bcd8739ae039)(input);
    }
}
var $806ef6720f97e688$export$2e2bcd8739ae039 = $806ef6720f97e688$var$InputErrorsFactory;




class $3286e2a90605c9b9$var$SingleValidator extends (0, $726fefb5eb08aba0$export$2e2bcd8739ae039) {
    constructor(){
        super();
    }
    required(input) {
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isSingleInputType(input)) throw new TypeError('You need to pass single input type element to the function, NOT group input type element');
        const value = input.value;
        let errorMsg;
        if (value.length === 0) errorMsg = 'This field is required';
        if (value.length > 0) errorMsg = null;
        return errorMsg;
    }
    maxLength(input, maxLength) {
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isSingleInputType(input)) throw new TypeError('First parameter needs to be a single input type element, NOT group input type element');
        if (typeof maxLength !== 'number' || maxLength <= 0) throw new TypeError('Second parameter needs to be a positive number');
        const value = input.value;
        let errorMsg;
        if (value.length > maxLength) {
            errorMsg = `This field needs to be less or equal to ${maxLength}`;
            return errorMsg;
        } else errorMsg = null;
        return errorMsg;
    }
    minLength(input, minLength) {
        if (!(0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isSingleInputType(input)) throw new TypeError('You need to pass a single input element to first parameter');
        if (typeof minLength !== 'number' || minLength <= 0) throw new TypeError('You need to pass a positive number to second parameter');
        const inputValue = input.value;
        let errorMsg;
        if (inputValue.length < minLength) errorMsg = `The field requires a minimum of ${minLength} characters`;
        else errorMsg = null;
        return errorMsg;
    }
}
var $3286e2a90605c9b9$export$2e2bcd8739ae039 = $3286e2a90605c9b9$var$SingleValidator;





const $5cc938edcbcd09f8$export$61e3a134f6f8cc1f = Symbol('GroupValidatorBase/is-instance');
class $5cc938edcbcd09f8$var$GroupValidatorBase {
    constructor(){
        if (new.target === $5cc938edcbcd09f8$var$GroupValidatorBase) throw new Error('GroupValidatorBase cannot be instantiated directly');
        this[$5cc938edcbcd09f8$export$61e3a134f6f8cc1f] = true;
    }
    required() {
        throw new Error('You need to implement required() in subclass');
    }
}
var $5cc938edcbcd09f8$export$2e2bcd8739ae039 = $5cc938edcbcd09f8$var$GroupValidatorBase;


class $9b586fd7eb63aa5a$var$GroupValidator extends (0, $5cc938edcbcd09f8$export$2e2bcd8739ae039) {
    constructor(){
        super();
    }
    required(input) {
        if (!input) throw new TypeError('You need to pass group input element to first parameter');
        if (!(input.type === 'checkbox' || input.type === 'radio')) throw new TypeError('You need to pass group input element to first parameter');
        const form = input.form;
        const name = input.name;
        const groupInputs = Array.from(form.elements[name]);
        const checkedGroupInputs = groupInputs.filter((groupInput)=>{
            return groupInput.checked;
        });
        let errorMsg;
        if (checkedGroupInputs.length > 0) errorMsg = null;
        else errorMsg = `Atleast 1 input needs to be checked`;
        return errorMsg;
    }
}
var $9b586fd7eb63aa5a$export$2e2bcd8739ae039 = $9b586fd7eb63aa5a$var$GroupValidator;








const $6e323790cfa4985d$export$19a9a733907fff08 = Symbol('ValidationProcessorBase/is-instance');
class $6e323790cfa4985d$var$ValidationProcessorBase {
    constructor(){
        if (new.target === $6e323790cfa4985d$var$ValidationProcessorBase) throw new Error('You cannot directly instantiate ValidationProcessorBase');
        this[$6e323790cfa4985d$export$19a9a733907fff08] = true;
    }
    validate() {
        throw new Error('validate() needs to be implemented in subclass()');
    }
}
var $6e323790cfa4985d$export$2e2bcd8739ae039 = $6e323790cfa4985d$var$ValidationProcessorBase;


class $844fb3309cf945dd$var$ValidationProcessor extends (0, $6e323790cfa4985d$export$2e2bcd8739ae039) {
    constructor(singleValidator, groupValidator, inputErrorsFactory){
        super();
        if (!singleValidator?.[0, $726fefb5eb08aba0$export$f56c5117a2ea9416]) throw new TypeError('You need to pass instance of SingleValidatorBase to first parameter');
        if (!groupValidator?.[0, $5cc938edcbcd09f8$export$61e3a134f6f8cc1f]) throw new TypeError('You need to pass instance of GroupValidatorBase in 2nd parameter');
        if (!inputErrorsFactory?.[0, $08cc71d167b92496$export$f08fae476ed39a09]) throw new TypeError('You need to pass instance of InputErrorsFactoryBase in 3rd parameter');
        this.singleValidator = singleValidator;
        this.groupValidator = groupValidator;
        this.inputErrorsFactory = inputErrorsFactory;
    }
    validate(inputRulesArray) {
        if (Array.isArray(inputRulesArray)) for (let inputRules of inputRulesArray){
            if (!(inputRules && inputRules[0, $5d6439b000822ed6$export$e57dd118759bb04c])) throw new TypeError('You need to pass an array of instances of InputRules in 2nd parameter');
        }
        else throw new TypeError('You need to pass an array of instances of InputRules in 2nd parameter');
        let inputErrorsArray = [];
        for (let inputRules of inputRulesArray){
            const input = inputRules.input;
            const rules = Object.keys(inputRules.rules);
            const inputErrors = this.inputErrorsFactory.create(input);
            if ((0, $b5f8850d77bbc3ce$export$2e2bcd8739ae039).isSingleInputType(input)) for (let rule of rules){
                if (typeof this.singleValidator[rule] !== 'function') throw new TypeError(`${rule} is not a supported single input validation rule`);
                else {
                    const errorMsg = this.singleValidator[rule](input, inputRules.rules[rule]);
                    inputErrors.errors.push(errorMsg);
                }
            }
            if (input.type === 'checkbox' || input.type === 'radio') for (let rule of rules){
                if (typeof this.groupValidator[rule] !== 'function') throw new TypeError(`${rule} rule is not a supported group input validation rule`);
                else {
                    const errorMsg = this.groupValidator[rule](input);
                    inputErrors.errors.push(errorMsg);
                }
            }
            inputErrorsArray.push(inputErrors);
        }
        return inputErrorsArray;
    }
}
var $844fb3309cf945dd$export$2e2bcd8739ae039 = $844fb3309cf945dd$var$ValidationProcessor;


const $1f4154bb4e7b559b$export$e6dc6f99fa0f5946 = Symbol('ElementRendererBase/is-instance');
class $1f4154bb4e7b559b$var$ElementRendererBase {
    constructor(){
        if (new.target === $1f4154bb4e7b559b$var$ElementRendererBase) throw new Error('ElementRendererBase cannot be instantiated directly');
        this[$1f4154bb4e7b559b$export$e6dc6f99fa0f5946] = true;
    }
    createTextElement() {
        throw new Error('createTextElement needs to be implemented in subclass');
    }
}
var $1f4154bb4e7b559b$export$2e2bcd8739ae039 = $1f4154bb4e7b559b$var$ElementRendererBase;




const $71c3db8f5993544a$export$5382e6358849ae07 = Symbol('ErrorsRendererBase/is-instance');
class $71c3db8f5993544a$var$ErrorsRendererBase {
    constructor(){
        if (new.target === $71c3db8f5993544a$var$ErrorsRendererBase) throw new Error('You cannot directly instantiate ErrorsRendererBase');
        this[$71c3db8f5993544a$export$5382e6358849ae07] = true;
    }
    render() {
        throw new Error('render() needs to be implemented in subclass');
    }
}
var $71c3db8f5993544a$export$2e2bcd8739ae039 = $71c3db8f5993544a$var$ErrorsRendererBase;


const $5ed32c4c90d12648$export$c9085fdff3124b9e = Symbol('SchemaAdapterBase/is-instance');
class $5ed32c4c90d12648$var$SchemaAdapterBase {
    constructor(){
        if (new.target === $5ed32c4c90d12648$var$SchemaAdapterBase) throw new Error('SchemaAdapterBase cannot be directly instantiated');
        this[$5ed32c4c90d12648$export$c9085fdff3124b9e] = true;
    }
    validate() {
        throw new Error('validate() needs to be implemented in subclass');
    }
}
var $5ed32c4c90d12648$export$2e2bcd8739ae039 = $5ed32c4c90d12648$var$SchemaAdapterBase;


const $8e3d50018f875401$export$641e49958c016c2e = Symbol('ObjArgValidatorBase/is-instance');
class $8e3d50018f875401$var$ObjArgValidatorBase {
    constructor(){
        if (new.target === $8e3d50018f875401$var$ObjArgValidatorBase) throw new Error('ObjArgValidatorBase cannot be directly instantiated');
        this[$8e3d50018f875401$export$641e49958c016c2e] = true;
    }
}
var $8e3d50018f875401$export$2e2bcd8739ae039 = $8e3d50018f875401$var$ObjArgValidatorBase;


class $66160c02acd4a00a$var$FormErrorsRenderer extends (0, $71c3db8f5993544a$export$2e2bcd8739ae039) {
    constructor(elementRenderer, objArgValidator){
        super();
        if (!elementRenderer?.[0, $1f4154bb4e7b559b$export$e6dc6f99fa0f5946]) throw new TypeError('You need to pass an isntance of ElementRendererBase to constructor');
        if (!objArgValidator?.[0, $8e3d50018f875401$export$641e49958c016c2e]) throw new TypeError('You need to pass instance of ObjArgValidatorBase to 2nd parameter');
        this.elementRenderer = elementRenderer;
        this.objArgValidator = objArgValidator;
    }
    render(inputErrorsArray, options) {
        if (!Array.isArray(inputErrorsArray)) throw new TypeError('You need to pass an array of InputErrors instances');
        else for (let inputErrors of inputErrorsArray){
            if (!inputErrors[0, $4136a024e8bb51bc$export$25de8332662b53ee]) throw new TypeError('You need to pass an array of InputErrors instances');
        }
        const error = this.objArgValidator.options.validate(options);
        if (error) throw error;
        // if (
        //   !objectUtils.isPlainObject(options) ||
        //   !options.tagName ||
        //   !options.style
        // ) {
        //   throw new TypeError(
        //     'You need to pass a plain object with tagName and style properties to 2nd parameter'
        //   )
        // }
        for (let inputErrors of inputErrorsArray){
            const input = inputErrors.input;
            const errors = inputErrors.errors;
            const errorMsg = errors.join(', ');
            const newErrorElement = this.elementRenderer.createTextElement(errorMsg, options);
            const fieldset = input.closest('fieldset');
            fieldset.after(newErrorElement);
        }
    }
}
var $66160c02acd4a00a$export$2e2bcd8739ae039 = $66160c02acd4a00a$var$FormErrorsRenderer;






class $9531f834b085f356$var$ElementRenderer extends (0, $1f4154bb4e7b559b$export$2e2bcd8739ae039) {
    constructor(objArgValidator){
        super();
        if (!objArgValidator?.[0, $8e3d50018f875401$export$641e49958c016c2e]) throw new TypeError('You need to pass instance of ObjArgValidatorBase to constructor');
        this.objArgValidator = objArgValidator;
    }
    createTextElement(text, options = {}) {
        if (typeof text !== 'string') throw new TypeError('First parameter needs to be of string data type');
        const error = this.objArgValidator.options.validate(options);
        if (error) throw error;
        const defaultOptions = {
            tagName: 'div',
            class: '',
            id: '',
            style: {
                color: 'black',
                fontSize: '16px'
            }
        };
        const finalOptions = {
            ...defaultOptions,
            ...options
        };
        finalOptions.style = {
            ...defaultOptions.style,
            ...options.style
        };
        const newElement = document.createElement(finalOptions.tagName);
        newElement.innerText = text;
        if (typeof finalOptions.class === 'string') {
            const classes = finalOptions.class.split(' ');
            newElement.classList.add(...classes);
        }
        if (typeof finalOptions.id === 'string') newElement.id = finalOptions.id;
        const styleKeys = Object.keys(finalOptions.style);
        for (let styleKey of styleKeys){
            if (newElement.style[styleKey] === undefined) throw new TypeError(`${styleKey} is not a valid style property`);
            newElement.style[styleKey] = finalOptions.style[styleKey];
        }
        return newElement;
    }
}
var $9531f834b085f356$export$2e2bcd8739ae039 = $9531f834b085f356$var$ElementRenderer;




const $85ae1174a304e172$export$d0b9416cf0c4dc52 = Symbol('ObjArgValidator/is-instance');
class $85ae1174a304e172$var$ObjArgValidator extends (0, $8e3d50018f875401$export$2e2bcd8739ae039) {
    constructor(schemaAdapters){
        super();
        if (!Array.isArray(schemaAdapters)) {
            if (!schemaAdapters?.[0, $5ed32c4c90d12648$export$c9085fdff3124b9e]) throw new TypeError('You need to pass intsance of SchemaAdapterBase');
        } else for (let schemaAdapter of schemaAdapters){
            if (!schemaAdapter?.[0, $5ed32c4c90d12648$export$c9085fdff3124b9e]) throw new TypeError('Your array items need to be ALL isntances of SchemaAdapterBase');
        }
        if (!Array.isArray(schemaAdapters)) this[schemaAdapters.paramName] = schemaAdapters.schema;
        else for (let schemaAdapter of schemaAdapters){
            const paramName = schemaAdapter.paramName;
            const schema = schemaAdapter.schema;
            const objArgValidatorKeys = Object.keys(this);
            for (let key of objArgValidatorKeys){
                if (key === paramName) throw new TypeError('There are SchemaAdapterBase instances with the same .paramName value. Each SchemaAdapterBase instance in the array needs to have unique .paramName value');
            }
            this[paramName] = schema;
        }
        this[$85ae1174a304e172$export$d0b9416cf0c4dc52] = true;
    }
}
var $85ae1174a304e172$export$2e2bcd8739ae039 = $85ae1174a304e172$var$ObjArgValidator;







class $a0cfa26e26cfc4a6$var$FormValidator {
    constructor(schemaParser, validationProcessor, errorsRenderer, objArgValidator){
        if (!schemaParser?.[0, $8f2c6c2ddb5d6a0e$export$e7d22bec8bcddbf1]) throw new TypeError('You need to pass instance of SchemaParserBase to 1st param');
        if (!validationProcessor?.[0, $6e323790cfa4985d$export$19a9a733907fff08]) throw new TypeError('You need to pass instance of ValidationProcessorBase to 2nd parameter');
        if (!errorsRenderer?.[0, $71c3db8f5993544a$export$5382e6358849ae07]) throw new TypeError('You need to pass instance of ErrorsRendererBase to 3rd parameter');
        if (!objArgValidator?.[0, $8e3d50018f875401$export$641e49958c016c2e]) throw new TypeError('You need to pass an instance of ObjArgValidatorBase to 4th parameter');
        this.schemaParser = schemaParser;
        this.validationProcessor = validationProcessor;
        this.errorsRenderer = errorsRenderer;
        this.objArgValidator = objArgValidator;
    }
    validate(form, schema, options = {}) {
        if (!(form instanceof HTMLFormElement)) throw new TypeError('You need to pass form element to first parameter');
        if (!schema?.[0, $eb5c8c31dfac73d0$export$2009ae4e72abcbb7]) throw new TypeError('You need to pass instance of ValidationSchema to 2nd parameter');
        const error = this.objArgValidator.options.validate(options);
        if (error) throw error;
        const defaultOptions = {
            tagName: 'div',
            class: 'error',
            id: '',
            style: {
                color: 'red',
                fontSize: '16px'
            }
        };
        const finalOptions = {
            ...defaultOptions,
            ...options
        };
        finalOptions.style = {
            ...defaultOptions.style,
            ...options.style
        };
        const inputRulesArray = this.schemaParser.parse(form, schema);
        const inputErrorsArray = this.validationProcessor.validate(inputRulesArray);
        this.errorsRenderer.render(inputErrorsArray, finalOptions);
    }
}
var $a0cfa26e26cfc4a6$export$2e2bcd8739ae039 = $a0cfa26e26cfc4a6$var$FormValidator;



const $d429a153bfb1e458$var$inputExtracter = new (0, $7fa714fccd82f275$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$inputRulesFactory = new (0, $d835a08c5f31416a$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$schemaParser = new (0, $a08e9494c48b12ed$export$2e2bcd8739ae039)($d429a153bfb1e458$var$inputExtracter, $d429a153bfb1e458$var$inputRulesFactory);
const $d429a153bfb1e458$var$singleValidator = new (0, $3286e2a90605c9b9$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$groupValidator = new (0, $9b586fd7eb63aa5a$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$inputErrorsFactory = new (0, $806ef6720f97e688$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$validationProcessor = new (0, $844fb3309cf945dd$export$2e2bcd8739ae039)($d429a153bfb1e458$var$singleValidator, $d429a153bfb1e458$var$groupValidator, $d429a153bfb1e458$var$inputErrorsFactory);
const $d429a153bfb1e458$var$elementRenderer = new (0, $9531f834b085f356$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$objArgValidator = new (0, $85ae1174a304e172$export$2e2bcd8739ae039)();
const $d429a153bfb1e458$var$formErrorsRenderer = new (0, $66160c02acd4a00a$export$2e2bcd8739ae039)($d429a153bfb1e458$var$elementRenderer, $d429a153bfb1e458$var$objArgValidator);
const $d429a153bfb1e458$var$formValidator = new (0, $a0cfa26e26cfc4a6$export$2e2bcd8739ae039)($d429a153bfb1e458$var$schemaParser, $d429a153bfb1e458$var$validationProcessor, $d429a153bfb1e458$var$formErrorsRenderer, $d429a153bfb1e458$var$objArgValidator);
const $d429a153bfb1e458$var$form = document.querySelector('.form-create');
const $d429a153bfb1e458$var$schema = new (0, $eb5c8c31dfac73d0$export$2e2bcd8739ae039)({
    'bookstore[name]': {
        required: true,
        maxLength: 100
    },
    'bookstore[address]': {
        maxLength: 255,
        required: true
    },
    'bookstore[description]': {
        maxLength: 500,
        required: true
    },
    'bookstore[genres]': {
        required: true
    },
    'bookstore[images]': {
        required: true
    },
    'bookstore[openDays]': {
        required: true
    }
});
$d429a153bfb1e458$var$form.addEventListener('submit', (event)=>{
    event.preventDefault();
    $d429a153bfb1e458$var$formValidator.validate($d429a153bfb1e458$var$form, $d429a153bfb1e458$var$schema);
});


//# sourceMappingURL=app.js.map
