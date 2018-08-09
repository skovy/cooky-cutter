import { Factory, FactoryConfig } from "./define";

type ArrayFactory<T> = (override?: FactoryConfig<T>) => T[];

/**
 * Define a new array factory function. The return value is a function that can be
 * invoked as many times as needed to create an array of object of given type.
 *
 * @param factory An existing factory object.
 * @param size Size of target array can either be a static value or a function that receives the
 * invocation count as the only parameter.
 */
function array<Result>(
  factory: Factory<Result>,
  size: number = 5
): ArrayFactory<Result> {
  return (override?: FactoryConfig<Result>) => {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(factory(override));
    }
    return arr;
  };
}

export { array, ArrayFactory };
