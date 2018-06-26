import { Factory, Config, FactoryConfig, AttributeFunction } from "./define";
import { isFunction } from "./utils";

// Returns a union of the keys.
// e.g. it will convert `{ a: {}, b: {} }` into `"a" | "b"`
type Keys<T> = keyof T;

// Remove types from T that are assignable to U
// e.g. it will convert `Diff<"a" | "b" | "d", "a" | "f">` into `"b" | "d"`
type Diff<T, U> = T extends U ? never : T;

// Remove attributes from T that are in U
// e.g. it will convert
// `DiffProperties<{ a: string; b: number; }, { a: string; c: string; }>`
// into `{ b: number; }`
type DiffProperties<T, U> = Pick<T, Diff<Keys<T>, Keys<U>>>;

function extend<From, Result extends From>(
  from: Factory<From>,
  config: Config<DiffProperties<Result, From>>
): Factory<Result> {
  let invocations = 0;

  return (override = {}) => {
    invocations++;
    let result = from(override as FactoryConfig<From>) as Result;

    for (let k in config) {
      // TODO: the type of k is not properly inferred 
      let key = k as Extract<keyof Result, string>;
      const value = override[key] ? override[key] : config[key as string]

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
