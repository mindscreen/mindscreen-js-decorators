/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/decorators.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/decorators.js":
/*!***************************!*\
  !*** ./src/decorators.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const TypeGuard = __webpack_require__(/*! ./type-guard */ "./src/type-guard.js");

module.exports = {
    TypeGuard
};

/***/ }),

/***/ "./src/reflection.js":
/*!***************************!*\
  !*** ./src/reflection.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

function getArguments(func) {
    const matchFunction = func.toString().match(/function\s.*?\(([^)]*)\)/);
    let args = null;
    if (matchFunction !== null) {
        args = matchFunction[1];
    } else {
        const matchArrowFunction = func.toString().match(/^\(([^)]*)\)/);
        if (matchArrowFunction !== null) {
            args = matchArrowFunction[1];
        }
    }
    if (args === null) {
        return null;
    }

    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim().replace(/^\.\.\./, '');
    }).filter(function (arg) {
        return arg;
    });
}

module.exports = {
    getArguments
};

/***/ }),

/***/ "./src/type-guard.js":
/*!***************************!*\
  !*** ./src/type-guard.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { getArguments } = __webpack_require__(/*! ./reflection */ "./src/reflection.js");

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
        let argNames = getArguments(fn);
        if (argNames === null) {
            return descriptor;
        }
        descriptor[descriptor.set !== undefined ? 'set' : 'value'] = function (...args) {
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


/***/ })

/******/ });
//# sourceMappingURL=decorators.js.map