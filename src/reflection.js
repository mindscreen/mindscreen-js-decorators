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