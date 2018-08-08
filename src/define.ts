import { isFunction } from "./utils";
import { ArrayFactory } from "./array";

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;

type Config<T> = {
  [Key in keyof T]:
    | T[Key]
    | AttributeFunction<T[Key]>
    | Factory<T[Key]>
    | ArrayFactory<ArrayElement<T[Key]>>
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
      const value = override.hasOwnProperty(key) ? override[key] : config[key];

      if (isFunction(value)) {
        result[key] = value(invocations);
      } else {
        // TODO: Ideally we can avoid this cast.
        result[key] = value as Result[Extract<keyof Result, string>];
      }
    }

    return result;
  };
}

export { define, AttributeFunction, Config, Factory, FactoryConfig };
