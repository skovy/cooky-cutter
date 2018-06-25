import { isFunction } from "./utils";

type Config<Result> = {
  [Key in keyof Result]:
    | Result[Key]
    | ((invocation: number) => Result[Key])
    | FactoryFunction<Result[Key]>
};

type FactoryFunction<Result> = (override?: Partial<Config<Result>>) => Result;

/**
 * Define a new factory function. The return value is a function that can be
 * invoked as many times as needed to create a given type of object. Use the
 * config param to define how the object is generated on each invocation.
 *
 * @param config An object that defines how the object should be generated. Each
 * key can either be a static value, or a function that receives the invocation
 * count as the only parameter.
 */
function define<Result>(config: Config<Result>): FactoryFunction<Result> {
  let invocations = 0;

  return (override = {}) => {
    invocations++;
    let result: Result = {} as any;

    for (let key in config) {
      const value = override[key] ? override[key] : config[key];

      if (isFunction(value)) {
        result[key] = value(invocations);
      } else {
        // NOTE: Ideally we can infer this is _not_ a function without the cast.
        result[key] = value as Result[Extract<keyof Result, string>];
      }
    }

    return result;
  };
}

export { define };
