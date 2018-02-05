const { getArguments } = require('./reflection');

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
                let argType = null;
                if (argDef !== null && typeof argDef === 'object' && (argDef.required !== undefined || argDef.type !== undefined)) {
                    if (argDef.required === true && args.length <= i) {
                        throw new ReferenceError(`The property '${argNames[i]}' on method '${target.constructor.name}::${name}' is required and not set.`);
                    }
                    if (argDef.type !== undefined) {
                        argType = argDef.type;
                    }
                } else {
                    argType = argDef;
                }
                const argVal = args[i];
                const throwTypeError = () => {
                    const argTypeName = (typeof argType === 'object' && argType !== null && argType.constructor) ? argType.constructor.name : argType;
                    const valTypeName = (typeof argVal === 'object' && argVal !== null && argVal.constructor) ? argVal.constructor.name : (argVal === null ? 'null' : typeof argVal);
                    throw new TypeError(`The property '${argNames[i]}' on method '${target.constructor.name}::${name}' should be of type '${argTypeName}', got ${valTypeName}.`);
                };
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