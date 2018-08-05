import {
  isAttributeFunction,
  isDerivedFunction,
  isFactoryFunction
} from "./utils";
import { Config } from "./define";

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
  } else if (isFactoryFunction<Result[Key]>(value)) {
    result[key] = value();
  } else if (isAttributeFunction<Result[Key]>(value)) {
    result[key] = value(invocations);
  } else {
    result[key] = value as Result[Key];
  }
}

export { compute };
