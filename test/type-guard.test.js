const { TypeGuard } = require('../src/decorators');

class A {}
class B extends A {}
class C extends B {}

class TestClass {

    constructor() {
        this._x = 13;
    }

    @TypeGuard()
    testEmpty(x) {
        return true;
    }

    @TypeGuard({
        y: {
            required: true
        }
    })
    testRequired(x, y) {
        return true;
    }

    @TypeGuard({
        x: 'string'
    })
    testPrimitiveString(x) {
        return true;
    }

    @TypeGuard({
        x: 'number'
    })
    testNumber(x) {
        return true;
    }

    @TypeGuard({
        x: 'int',
        y: 'integer'
    })
    testInt(x, y) {
        return true;
    }

    @TypeGuard({
        x: 'bool',
        y: 'boolean'
    })
    testBool(x, y) {
        return true;
    }

    @TypeGuard({
        x: 'function'
    })
    testFunction(x) {
        return true;
    }

    @TypeGuard({
        x: 'any'
    })
    testAny(x) {
        return true;
    }

    @TypeGuard({
        x: 'object'
    })
    testObject(x) {
        return true;
    }

    @TypeGuard({
        x: B.prototype
    })
    testClass(x) {
        return true;
    }

    @TypeGuard({
        value: 'int'
    })
    set foo(value) {
        this._x = value;
    }

    get foo() {
        return this._x;
    }
}

let testClass;

describe('@TypeGuard test', () => {
    beforeEach(() => {
        testClass = new TestClass();
    });

    test('No errors should occur for empty options', () => {
        expect(testClass.testEmpty(42)).toBe(true);
    });

    test('Required arguments should be required', () => {
        expect(function() {
            testClass.testRequired(42);
        }).toThrowError(ReferenceError);
        expect(testClass.testRequired(42, 43)).toBe(true);
    });

    test('Primitive string', () => {
        expect(function() {
            testClass.testPrimitiveString(true);
        }).toThrowError(TypeError);
        expect(testClass.testPrimitiveString('test')).toBe(true);
    });

    test('Test number', () => {
        expect(testClass.testNumber(42)).toBe(true);
    });

    test('Test int', () => {
        expect(function () {
            testClass.testInt(1.1, 2);
        }).toThrowError(TypeError);
        expect(testClass.testInt(1, 2)).toBe(true);
    });

    test('Test bool', () => {
        expect(function () {
            testClass.testBool(true, 2);
        }).toThrowError(TypeError);
        expect(testClass.testBool(true, true)).toBe(true);
        expect(testClass.testBool(true, false)).toBe(true);
        expect(testClass.testBool(false, true)).toBe(true);
        expect(testClass.testBool(false, false)).toBe(true);
        expect(function () {
            testClass.testBool(true, null);
        }).toThrowError(TypeError);
    });

    test('Test function', () => {
        expect(testClass.testFunction(function(){})).toBe(true);
        expect(testClass.testFunction(() => {})).toBe(true);
    });

    test('Test any', () => {
        expect(testClass.testAny(true)).toBe(true);
        expect(testClass.testAny(null)).toBe(true);
        expect(testClass.testAny(undefined)).toBe(true);
        expect(testClass.testAny(function(){})).toBe(true);
        expect(testClass.testAny(42)).toBe(true);
        expect(testClass.testAny(42.3)).toBe(true);
        expect(testClass.testAny('foo')).toBe(true);
        expect(testClass.testAny({'foo': 13})).toBe(true);
        expect(testClass.testAny(['foo'])).toBe(true);
    });

    test('Test class', () => {
        // a > b > c
        const a = new A();
        const b = new B();
        const c = new C();
        expect(function(){ testClass.testClass(a); }).toThrowError(TypeError);
        expect(testClass.testClass(b)).toBe(true);
        expect(testClass.testClass(c)).toBe(true);
        expect(testClass.testClass(a)).toBe(true);
    });

    test('Test object', () => {
        expect(testClass.testObject({'foo': 13})).toBe(true);
    });

    test('Test setter', () => {
        const newVal = 42;
        expect(testClass.foo).not.toBe(newVal);
        testClass.foo = newVal;
        expect(testClass.foo).toBe(newVal);
        expect(function(){
            testClass.foo = 'test';
        }).toThrowError(TypeError);
    });

});