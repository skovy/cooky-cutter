/**
 * Type guard funciton to determine if the argument passed is a function.
 *
 * @param functionToCheck value to check if it is a function
 */
const isFunction = (functionToCheck: any): functionToCheck is Function => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};

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

export { isFunction, DiffProperties };
