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
  path: Key[],
  override: Partial<Result>,
  computedKeys: Key[]
) {
  // If this key was already computed (according to the passed array) then skip
  // this computation. This likely was a result of a `derive` function requiring
  // this key to be computed to invoke the derived function because it was a
  // dependency. In these cases, avoid re-computing the value because often
  // the factories are not idempotent (eg: each call the invocation is
  // incremented) which can lead to unexpected inconsistencies.
  if (computedKeys.indexOf(key) >= 0) {
    return;
  }

  const value = values[key];

  // In essence, this is "exhaustively" checking for each type of attribute that
  // can be defined for a given key. Unfortunately it's not truly exhaustive,
  // but would be great to update this to do true exhaustive type checking.
  if (isDerivedFunction<Result, Result[Key]>(value)) {
    result[key] = value(
      result,
      values,
      invocations,
      path,
      override,
      computedKeys
    );
  } else if (isFactoryFunction<Result[Key]>(value)) {
    result[key] = value();
  } else if (isArrayFactoryFunction<Result[Key]>(value)) {
    result[key] = value();
  } else if (isAttributeFunction<Result[Key]>(value)) {
    result[key] = value(invocations);
  } else {
    if (!(key in override)) {
      warnAboutHardCodedValues(key, value);
    }

    result[key] = value as Result[Key];
  }

  // Mark this key has having it's value computed.
  computedKeys.push(key);
}

/**
 * Explicitly setting an object or array as a value in a factory can lead to
 * really challenging and subtle bugs since they will be shared across all
 * instances of a factory. Check for objects and arrays and by default display
 * a warning.
 */
const warnAboutHardCodedValues = <Key, Value>(key: Key, value: Value) => {
  let message: string | undefined;
  if (Array.isArray(value)) {
    message = `\`${key}\` contains a hard-coded array.`;
  } else if (typeof value === "object" && value !== null) {
    message = `\`${key}\` contains a hard-coded object.`;
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
