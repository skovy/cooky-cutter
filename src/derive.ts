type DerivedFunction<Base, Output> = (result: Base) => Output;

type InputObject<Base, InputKeys extends keyof Base> = {
  [Key in InputKeys]: Base[Key]
};

function derive<Base, InputKeys extends keyof Base, Output>(
  fn: (input: InputObject<Base, InputKeys>) => Output,
  ...dependentKeys: InputKeys[]
): DerivedFunction<Base, Output> {
  const derivedFunction = (config: Base): Output => {
    // Construct the input object from all of the dependent values that are
    // needed to derive the value.
    const input = dependentKeys.reduce<InputObject<Base, InputKeys>>(
      (input, key) => {
        input[key] = config[key];
        return input;
      },
      {} as InputObject<Base, InputKeys>
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
