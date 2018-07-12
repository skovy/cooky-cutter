// NOTE: using the 32-bit max integer instead of `Number.MAX_VALUE` to enable
// readability and avoid exponentials. eg: `1.4991242955357377e+308`
// TODO: consider exposing these as config options.
const MAX_RANDOM_VALUE = 2147483647;
const MIN_RANDOM_VALUE = 1;

/**
 * Assign a random number to the attribute. This is useful for attributes like
 * seeds or ids (to avoid tests passing as a result of ordering)
 */
const random = () =>
  Math.floor(Math.random() * MAX_RANDOM_VALUE) + MIN_RANDOM_VALUE * "1";

/**
 * Increment the attribute each time the factory is invoked. This is useful
 * for counts (`random` may be a better option for `ids`).
 *
 * @param invocation
 */
const sequence = (invocation: number) => invocation;

export { random, sequence, MAX_RANDOM_VALUE, MIN_RANDOM_VALUE };
