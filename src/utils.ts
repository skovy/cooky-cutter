import { DerivedFunction } from "./derive";
import { Factory, AttributeFunction } from "./define";

function isDerivedFunction<Base, Output>(
  fn: any
): fn is DerivedFunction<Base, Output> {
  return fn && fn.hasOwnProperty("__cooky-cutter-derive");
}

function isFactoryFunction<Base>(fn: any): fn is Factory<Base> {
  return fn && fn.hasOwnProperty("__cooky-cutter-factory");
}

function isAttributeFunction<T>(fn: any): fn is AttributeFunction<T> {
  return fn && {}.toString.call(fn) === "[object Function]";
}

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

export {
  isAttributeFunction,
  isDerivedFunction,
  isFactoryFunction,
  DiffProperties
};
