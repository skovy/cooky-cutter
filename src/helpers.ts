/**
 * Assign a random number to the attribute. This is useful for attributes like 
 * seeds or ids (to avoid tests passing as a result of ordering)
 */
export const random = () =>
  Math.floor(Math.random() * (Number.MAX_VALUE - 1 + 1)) + 1;

/**
 * Increment the attribute each time the factory is invoked. This is useful
 * for counts (`random` may be a better option for `ids`).
 *
 * @param invocation
 */
export const sequence = (invocation: number) => invocation;
