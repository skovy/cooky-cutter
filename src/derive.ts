import { Config } from "./define";
import { compute } from "./compute";

const DERIVE_FUNCTION_KEY = "derived";

interface DerivedFunction<Base, Output> {
  (
    result: Base,
    values: Config<Base>,
    invocations: number,
    path: (keyof Base)[],
    override: Partial<Base>
  ): Output;
  __cooky_cutter: typeof DERIVE_FUNCTION_KEY;
}

/**
 * Compute a single value and assign it to the attribute based off any number
 * of other attributes defined in the factory. This is useful for deriving a
 * fields value off of other dynamic field(s) that are not known until a factory
 * is invoked. A derived field can reference other derived fields, but they
 * cannot be circularly referenced.
 *
 * @param fn a function to reduce all of the dependent keys into a single
 * dervied value. The return value will be assigned to the attribute.
 * @param dependentKeys a list of all keys that the derive function is dependent
 * on. If the key is not defined in this list, it is not guaranteed to be
 * defined.
 */
function derive<Base, Output>(
  fn: (input: Partial<Base>) => Output,
  ...dependentKeys: (keyof Base)[]
): DerivedFunction<Base, Output> {
  const derivedFunction: DerivedFunction<Base, Output> = function(
    result,
    values,
    invocations,
    path,
    override
  ) {
    // Construct the input object from all of the dependent values that are
    // needed to derive the value.
    const input = dependentKeys.reduce<Partial<Base>>(
      (input, key) => {
        // Verify the derived value has been computed, otherwise compute any
        // derived values before continuing.
        if (!result.hasOwnProperty(key)) {
          // Verify the field has not already been visited. If it has, there
          // is a circular reference and it cannot be resolved.
          if (path.indexOf(key) > -1) {
            throw `${key} cannot circularly derive itself. Check along this path: ${path.join(
              "->"
            )}->${key}`;
          }

          compute(key, values, result, invocations, [...path, key], override);
        }

        input[key] = result[key];
        return input;
      },
      {} as Partial<Base>
    );

    return fn(input);
  };

  // Define a property to differentiate this function during the evaluation
  // phase when the factory is later invoked.
  derivedFunction.__cooky_cutter = DERIVE_FUNCTION_KEY as typeof DERIVE_FUNCTION_KEY;

  return derivedFunction;
}

export { derive, DerivedFunction, DERIVE_FUNCTION_KEY };
