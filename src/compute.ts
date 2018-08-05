import { isFunction, isDerivedFunction } from "./utils";
import { Config, AttributeFunction } from "./define";

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

  if (isDerivedFunction<Result, Result[Key]>(value)) {
    result[key] = value(result, values, invocations, path);
  } else if (isFunction(value)) {
    // TODO: find a better way to distinguish AttributeFunction vs Factory
    result[key] = (value as AttributeFunction<any>)(invocations);
  } else {
    // TODO: Ideally we can avoid this cast.
    result[key] = value as Result[Key];
  }
}

export { compute };
