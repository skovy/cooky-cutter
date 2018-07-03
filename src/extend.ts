import { Factory, Config, FactoryConfig, AttributeFunction } from "./index";
import { isFunction, DiffProperties } from "./utils";

/**
 * Define a new factory function from an existing fatory. The return value is a
 * function that can be invoked as many times as needed to create a given type
 * of object. Use the config param to define how the object is generated on each
 * invocation.
 *
 * @param from An existing factory to extend.
 * @param config An object that defines how the factory should generate objects.
 * Each key can either be a static value, a function that receives the
 * invocation count as the only parameter or another factory.
 */
function extend<From, Result extends From>(
  from: Factory<From>,
  config: Config<DiffProperties<Result, From> & Partial<From>>
): Factory<Result> {
  let invocations = 0;

  return (override = {}) => {
    invocations++;
    let result = from(override as FactoryConfig<From>) as Result;

    for (let k in config) {
      // TODO: the type of k is not properly inferred
      let key = k as Extract<keyof Result, string>;
      const value = override[key] ? override[key] : config[key as string];

      if (isFunction(value)) {
        // TODO: find a better way to distinguish AttributeFunction vs Factory
        result[key] = (value as AttributeFunction<any>)(invocations);
      } else {
        // TODO: Ideally we can avoid this cast.
        result[key] = value as Result[Extract<keyof Result, string>];
      }
    }

    return result;
  };
}

export { extend };
