import {
  Factory,
  FactoryConfig,
  AttributeFunction,
  Config,
  ArrayFactory
} from "./index";
import { DiffProperties, ArrayElement } from "./utils";
import { compute } from "./compute";
import { DerivedFunction } from "./derive";
import { FACTORY_FUNCTION_KEY } from "./define";

// Helper specific to extending factories. Any keys required in the base type
// should be optional in the result config because they've already been defined
// in the base. However, they should still be overridable.
type Merge<Base, Result> = DiffProperties<Result, Base> & Partial<Base>;

// A config similar to the `define` method's config. However, there are a few
// differences. For example, to simplify the derived function, it expects the
// result type instead of the merged type to simplify the external type API.
type ExtendConfig<Base, Result> = {
  [Key in keyof Merge<Base, Result>]:
    | Merge<Base, Result>[Key]
    | AttributeFunction<Merge<Base, Result>[Key]>
    | Factory<Merge<Base, Result>[Key]>
    | DerivedFunction<Result, Merge<Base, Result>[Key]>
    | ArrayFactory<ArrayElement<Merge<Base, Result>[Key]>>
};

/**
 * Define a new factory function from an existing factory. The return value is a
 * function that can be invoked as many times as needed to create a given type
 * of object. Use the config param to define how the object is generated on each
 * invocation.
 *
 * @param base An existing factory to extend.
 * @param config An object that defines how the factory should generate objects.
 * Each key can either be a static value, a function that receives the
 * invocation count as the only parameter or another factory.
 */
function extend<Base, Result extends Base>(
  base: Factory<Base>,
  config: ExtendConfig<Base, Result>
): Factory<Result> {
  let invocations = 0;

  const factory = (override = {}) => {
    invocations++;
    let result = base(override as FactoryConfig<Base>) as Result;
    // The computed keys starts empty (rather than including the base result
    // keys) because those values should get overridden and recomputed by the
    // extended values.
    let computedKeys: Array<keyof Result> = [];

    // TODO: this cast is necessary for the correct `key` typings and playing
    // nice with `compute`. Ideally, this can be avoided.
    const values = Object.assign({}, config, override) as Config<Result>;

    for (let key in values) {
      compute(key, values, result, invocations, [], override, computedKeys);
    }

    return result;
  };

  // Define a property to differentiate this function during the evaluation
  // phase when the factory is later invoked.
  factory.__cooky_cutter = "factory" as typeof FACTORY_FUNCTION_KEY;

  return factory;
}

export { extend, ExtendConfig };
