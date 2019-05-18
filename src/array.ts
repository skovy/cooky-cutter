import { Factory, FactoryConfig } from "./define";

export type ArrayFactory<T> = (override?: FactoryConfig<T>) => T[];

export type ArrayFactoryPassThrough<T> = (override?: FactoryConfig<T>) => T;

export const ARRAY_FACTORY_KEY = "arrayFactory";

/**
 * Define a new array factory function. The return value is a function that can be
 * invoked as many times as needed to create an array of object of given type.
 *
 * @param factory An existing factory object.
 * @param size Size of target array can either be a static value or a function that receives the
 * invocation count as the only parameter.
 */
export function array<Result>(
  factory: Factory<Result>,
  size: number = 5
): ArrayFactory<Result> {
  const arrayFactory = (override?: FactoryConfig<Result>) => {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(factory(override));
    }
    return arr;
  };

  // Define a property to differentiate this function during the evaluation
  // phase when the factory is later invoked.
  arrayFactory.__cooky_cutter = ARRAY_FACTORY_KEY as typeof ARRAY_FACTORY_KEY;

  return arrayFactory;
}
