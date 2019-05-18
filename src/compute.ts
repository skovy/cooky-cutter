import {
  isAttributeFunction,
  isDerivedFunction,
  isFactoryFunction,
  isArrayFactoryFunction
} from "./utils";
import { Config } from "./define";
import { getConfig } from "./config";

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
  path: Key[] = [],
  override: Partial<Result> = {}
) {
  const value = values[key];

  // In essence, this is "exhaustively" checking for each type of attribute that
  // can be defined for a given key. Unfortunately it's not truly exhaustive,
  // but would be great to update this to do true exhaustive type checking.
  if (isDerivedFunction<Result, Result[Key]>(value)) {
    result[key] = value(result, values, invocations, path);
  } else if (isFactoryFunction<Result[Key]>(value)) {
    result[key] = value();
  } else if (isArrayFactoryFunction<Result[Key]>(value)) {
    result[key] = value();
  } else if (isAttributeFunction<Result[Key]>(value)) {
    result[key] = value(invocations);
  } else {
    if (!(key in override)) {
      warnAboutHardCodedValues([key, ...path], value);
    }

    result[key] = value as Result[Key];
  }
}

/**
 * Explicitly setting an object or array as a value in a factory can lead to
 * really challenging and subtle bugs since they will be shared across all
 * instances of a factory. Check for objects and arrays and by default display
 * a warning.
 */
const warnAboutHardCodedValues = <Key, Value>(path: Key[], value: Value) => {
  let message: string | undefined;
  if (Array.isArray(value)) {
    message = `\`${path.join(".")}\` contains a hard-coded array.`;
  } else if (typeof value === "object" && value !== null) {
    message = `\`${path.join(".")}\` contains a hard-coded object.`;
  }

  const { errorOnHardCodedValues } = getConfig();

  if (message) {
    message += ` It will be shared across all instances of this factory. Consider using a factory function.`;

    if (errorOnHardCodedValues) {
      console.trace();
      throw message;
    } else {
      console.warn(message);
    }
  }
};

export { compute };
