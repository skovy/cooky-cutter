import { Config } from "./define";
import { compute } from "./compute";

type DerivedFunction<Base, Output> = (
  result: Base,
  values: Config<Base>,
  invocations: number,
  path: (keyof Base)[]
) => Output;

function derive<Base, Output>(
  fn: (input: Partial<Base>) => Output,
  ...dependentKeys: (keyof Base)[]
): DerivedFunction<Base, Output> {
  const derivedFunction: DerivedFunction<Base, Output> = (
    result,
    values,
    invocations,
    path
  ) => {
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

          compute(key, values, result, invocations, [...path, key]);
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
  Object.defineProperty(derivedFunction, "__cooky-cutter-derive", {
    value: true
  });

  return derivedFunction;
}

export { derive, DerivedFunction };
