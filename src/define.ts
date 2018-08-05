import { isFunction, isDerivedFunction } from "./utils";
import { DerivedFunction } from "./derive";

type Config<T> = {
  [Key in keyof T]:
    | T[Key]
    | AttributeFunction<T[Key]>
    | Factory<T[Key]>
    | DerivedFunction<T, T[Key]>
};

type AttributeFunction<T> = (invocation: number) => T;

type FactoryConfig<T> = Partial<Config<T>>;

type Factory<T> = (override?: FactoryConfig<T>) => T;

/**
 * Define a new factory function. The return value is a function that can be
 * invoked as many times as needed to create a given type of object. Use the
 * config param to define how the object is generated on each invocation.
 *
 * @param config An object that defines how the factory should generate objects.
 * Each key can either be a static value, a function that receives the
 * invocation count as the only parameter or another factory.
 */
function define<Result>(config: Config<Result>): Factory<Result> {
  let invocations = 0;

  return (override = {}) => {
    invocations++;
    let result = {} as Result;

    const values = Object.assign({}, config, override);

    for (let key in values) {
      compute(key, values, result, invocations);
    }

    return result;
  };
}

function compute<
  Key extends keyof Result,
  Values extends Config<Result>,
  Result
>(
  key: Key,
  values: Values,
  result: Result,
  invocations: number,
  path: Key[] = []
) {
  const value = values[key];

  if (isDerivedFunction<Result, Result[Key]>(value)) {
    result[key] = value(result, values, invocations, path);
  } else if (isFunction(value)) {
    // TODO: find a better way to distinguish AttributeFunction vs Factory
    result[key] = (value as AttributeFunction<any>)(invocations);
  } else {
    // TODO: Ideally we can avoid this cast.
    result[key] = value as Result[Key];
  }
}

export { define, compute, AttributeFunction, Config, Factory, FactoryConfig };
