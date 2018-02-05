type ArgumentTypeName =
    'int' | 'integer' |
    'bool' | 'boolean' |
    'number' | 'string' | 'function' |
    'any' |
    object

type ArgumentTypeOption =
    ArgumentTypeName
    | { type?: ArgumentTypeName, required?: boolean }

type ArgumentTypeOptions = { [propertyName: string]: ArgumentTypeOption }

/**
 * Enforce correct argument types
 * @param {ArgumentTypeOptions} o
 * @return {MethodDecorator}
 * @constructor
 */
export function TypeGuard(o: ArgumentTypeOptions): MethodDecorator;