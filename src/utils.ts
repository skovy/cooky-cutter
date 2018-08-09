import { DerivedFunction } from "./derive";
import { Factory, AttributeFunction } from "./define";

// Determine if the function is an internal derive function based on properties
// define on the function.
function isDerivedFunction<Base, Output>(
  fn: any
): fn is DerivedFunction<Base, Output> {
  return fn && fn.hasOwnProperty("__cooky-cutter-derive");
}

// Determine if the function is an internal factory function based on properties
// define on the function.
function isFactoryFunction<Base>(fn: any): fn is Factory<Base> {
  return fn && fn.hasOwnProperty("__cooky-cutter-factory");
}

// Determine if the function is an attribute function. Since this is end-user
// defined there is not a great way to know for sure if it exactly matches
// an attribute function, but this is a best guess. This should be used after
// all other function type checks.
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
