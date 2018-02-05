module.exports = {
    "env": {
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4, {SwitchCase: 1}],
        "quotes": ["error", "single"],
        "semi": ["error", "always"]
    }
}