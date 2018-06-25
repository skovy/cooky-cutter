import { isFunction } from "./utils";

type Config<T> = { [P in keyof T]: T[P] | ((i: number) => T[P]) };

/**
 * Define a new factory function. The return value is a function that can be
 * invoked as many times as needed to create a given type of object. Use the 
 * config param to define how the object is generated on each invocation.
 * 
 * @param config An object that defines how the object should be generated. Each
 * key can either be a static value, or a function that receives the invocation
 * count as the only parameter.
 */
export function define<Result>(config: Config<Result>): () => Result {
  let invocations = 0;

  return (): Result => {
    invocations++;
    let result: Result = {} as any;

    for (let key in config) {
      const value = config[key];

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