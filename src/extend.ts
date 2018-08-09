import { Factory, FactoryConfig, AttributeFunction, Config } from "./index";
import { DiffProperties } from "./utils";
import { compute } from "./compute";
import { DerivedFunction } from "./derive";

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
};

/**
 * Define a new factory function from an existing fatory. The return value is a
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

  return (override = {}) => {
    invocations++;
    let result = base(override as FactoryConfig<Base>) as Result;

    // TODO: this cast is necessary for the correct `key` typings and playing
    // nice with `compute`. Ideally, this can be avoided.
    const values = Object.assign({}, config, override) as Config<Result>;

    for (let key in values) {
      compute(key, values, result, invocations);
    }

    return result;
  };
}

export { extend, ExtendConfig };
