[![Build Status](https://travis-ci.org/mindscreen/mindscreen-js-decorators.svg?branch=master)](https://travis-ci.org/mindscreen/mindscreen-js-decorators)

# mindscreen JavaScript decorators
A package to gather JS decorators from projects at [mindscreen](https://mindscreen.de).

## TypeGuard
Specify expected argument types on class methods to ensure correct types when calling them. Throws a `TypeError` if called with an incorrect type or a `ReferenceError`, if a required argument is missing.
```js
// import { TypeGuard } from 'mindscreen-decorators';
// const { TypeGuard } = require('mindscreen-decorators');

class A {}
class B extends A {}
class C {}

class Example {

    @TypeGuard({
        a: A.prototype,
        b: { required: true, type: 'int' },
        c: 'boolean'
    })
    foo(a, b, c, d) {
        // ...
    }

    @TypeGuard({
        value: 'string'
    })
    set bar(value) {
        // ...
    }
}

const a = new A();
const b = new B();
const c = new C();
const e = new Example();

e.foo(a, 12); // OK
e.foo(a); // ReferenceError: The property 'b' on method 'Example::foo' is required and not set.
e.foo(c, 12); // TypeError: The property 'a' on method 'Example::foo' should be of type 'A', got C.
e.foo(b, 12); // OK
```
Note that not all arguments have to be mentioned in the `@TypeGuard` options. Arguments not explicitly configured to be required, won't act this way. Arguments can be set to be required without configuring a `type`. Alternatively `any` can be used.

The spread-operator (`...args`) can't be configured, as it is removed by transpiling your source.