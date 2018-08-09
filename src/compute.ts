import {
  isAttributeFunction,
  isDerivedFunction,
  isFactoryFunction
} from "./utils";
import { Config } from "./define";

// Given a key, the configuration object (with overrides already applied) and
// the end result object, compute the current value for the given key and write
// that value to the result object. Optionally track the path values are
// computed along in cases where it's possible to define circular dependencies.
function compute<
  Key extends keyof Result,
  Values extends Config<Result>,
  Result
>(
  key: Key,
  values: Values,
  result: Result,
  invocations: number,
  path: Key[] = []
) {
  const value = values[key];

  // In essence, this is "exhaustively" checking for each type of attribute that
  // can be defined for a given key. Unfortunately it's not truly exhaustive,
  // but would be great to update this to do true exhaustive type checking.
  if (isDerivedFunction<Result, Result[Key]>(value)) {
    result[key] = value(result, values, invocations, path);
  } else if (isFactoryFunction<Result[Key]>(value)) {
    result[key] = value();
  } else if (isAttributeFunction<Result[Key]>(value)) {
    result[key] = value(invocations);
  } else {
    result[key] = value as Result[Key];
  }
}

export { compute };
