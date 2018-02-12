const { getArguments } = require('./reflection');

/**
 * Get a readable name for a value type
 * @param {any} val
 * @returns {string|object}
 */
const getTypeName = val => 
    val === null ? 'null' : ((typeof val === 'object' && val.constructor) ? val.constructor.name : val);

/**
 * Create a type error with propertyNames
 * @param {string} propertyName
 * @param {string} argName
 * @param {any} argType
 * @param {any} argVal
 * @returns {TypeError}
 */
const createTypeError = (propertyName, argName, argType, argVal) => {
    const argTypeName = getTypeName(argType);
    const valType = getTypeName(argVal);
    const valTypeName = typeof valType === 'string' ? valType : typeof valType;
    return new TypeError(`The property '${argName}' on method '${propertyName}' should be of type '${argTypeName}', got ${valTypeName}.`);
};

/**
 * Unpack required and type from arbitrary definition
 * @param {any} argDef 
 * @returns {{ required: boolean, type: any }}
 */
const getArgumentDefinition = (argDef) => {
    let type = null;
    let required = false;
    if (argDef !== null && typeof argDef === 'object' && (argDef.required !== undefined || argDef.type !== undefined)) {
        required = argDef.required === true;
        type = argDef.type || null;
    } else {
        type = argDef;
    }
    return { type, required };
};

function TypeGuard(options) {
    return function (target, name, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, name);
        }
        const fn = descriptor[descriptor.set !== undefined ? 'set' : 'value'];
        descriptor[descriptor.set !== undefined ? 'set' : 'value'] = function (...args) {
            let argNames = getArguments(fn);
            for (let i = 0; options !== undefined && i < argNames.length; i++) {
                if (options[argNames[i]] === undefined) {
                    continue;
                }
                const argDef = options[argNames[i]];
                const { type: argType, required: argRequired } = getArgumentDefinition(argDef);
                if (argRequired && args.length <= 1) {
                    throw new ReferenceError(`The property '${argNames[i]}' on method '${target.constructor.name}::${name}' is required and not set.`);
                }
                const argVal = args[i];
                const throwTypeError = () => { throw createTypeError(`${target.constructor.name}::${name}`, argNames[i], argType, argVal); };
                switch (argType) {
                    case 'any':
                        break;
                    case 'int':
                    case 'integer':
                        if (!Number.isInteger(argVal)) {
                            throwTypeError();
                        }
                        break;
                    case 'bool':
                    case 'boolean':
                        if (argVal !== true && argVal !== false) {
                            throwTypeError();
                        }
                        break;
                    case 'string':
                    case 'number':
                    case 'function':
                    case 'object':
                        if (typeof argVal !== argType) {
                            throwTypeError();
                        }
                        break;
                    default:
                        if (argType !== null && argType.constructor && !(argVal instanceof argType.constructor)) {
                            throwTypeError();
                        }
                }
            }
            return fn.apply(this, args);
        };
        return descriptor;
    };
}

module.exports = TypeGuard;
