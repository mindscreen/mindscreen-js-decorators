const reflection = require('../src/reflection');

const arrSerialize = JSON.stringify;

test('correct function argument names', () => {
    const getArguments = reflection.getArguments;

    function test1(a) { }
    expect(arrSerialize(getArguments(test1)))
        .toBe(arrSerialize(['a']));

    function test2(a, b) { }
    expect(arrSerialize(getArguments(test2)))
        .toBe(arrSerialize(['a', 'b']));

    const test3 = (a, b) => { };
    expect(arrSerialize(getArguments(test3)))
        .toBe(arrSerialize(['a', 'b']));

    const test4 = () => { };
    expect(arrSerialize(getArguments(test4)))
        .toBe(arrSerialize([]));

    // babel removes the spread-operator argument
    // running this test without babel would fail
    function test5(a, ...b) { }
    expect(arrSerialize(getArguments(test5)))
        .toBe(arrSerialize(['a'/* , 'b' */]));
    
    expect(getArguments('not a function'))
        .toBe(null);
});