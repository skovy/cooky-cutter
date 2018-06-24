/**
 * Type guard funciton to determine if the argument passed is a function.
 *
 * @param functionToCheck value to check if it is a function
 */
export const isFunction = (
  functionToCheck: any
): functionToCheck is Function => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};
