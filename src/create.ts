import { isFunction } from "./utils";

type Config<T> = { [P in keyof T]: ((i: number) => T[P]) | T[P] };

export function create<Result>(config: Config<Result>): () => Result {
  let invocations = 0;
  return (): Result => {
    invocations++;
    let result = {};

    Object.keys(config).forEach(key => {
      const cur = config[key];
      if (isFunction(cur)) {
        result[key] = cur(invocations);
      } else {
        result[key] = cur;
      }
    });
    return result as Result;
  };
}
