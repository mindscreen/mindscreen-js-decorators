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
        "indent": ["error", 4, {"SwitchCase": 1}],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "space-infix-ops": ["error", {"int32Hint": false}],
        "comma-dangle": [
            "error",
            {
                "arrays": "always-multiline",
                "objects": "only-multiline",
                "imports": "never",
                "exports": "only-multiline",
                "functions": "ignore",
            }
        ],
        "object-curly-spacing": [
            "warn",
            "always",
            {
                "objectsInObjects": true,
                "arraysInObjects": true
            }
        ],
        "array-bracket-spacing": ["warn", "always"],
    }
}