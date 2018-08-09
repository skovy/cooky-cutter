import { DerivedFunction } from "./derive";
import { compute } from "./compute";
import { ArrayFactory } from "./array";

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;

type Config<T> = {
  [Key in keyof T]:
    | T[Key]
    | AttributeFunction<T[Key]>
    | Factory<T[Key]>
    | DerivedFunction<T, T[Key]>
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

  const factory = (override = {}) => {
    invocations++;

    let result = {} as Result;
    const values = Object.assign({}, config, override);

    for (let key in values) {
      compute(key, values, result, invocations);
    }

    return result;
  };

  // Define a property to differentiate this function during the evaluation
  // phase when the factory is later invoked.
  Object.defineProperty(factory, "__cooky-cutter-factory", {
    value: true
  });

  return factory;
}

export { define, AttributeFunction, Config, Factory, FactoryConfig };
