import { define, sequence, random } from "../index";
import { MIN_RANDOM_VALUE, MAX_RANDOM_VALUE } from "../helpers";

type User = { age: number };

describe("helpers", () => {
  describe("sequence", () => {
    test("increments each time a factory is invoked", () => {
      const user = define<User>({
        age: sequence,
      });

      expect(user()).toEqual({
        age: 1,
      });
      expect(user()).toEqual({
        age: 2,
      });
      expect(user()).toEqual({
        age: 3,
      });
    });
  });

  describe("random", () => {
    test("returns a random number", () => {
      const user = define<User>({
        age: random,
      });

      const { age } = user();

      expect(age).toBeGreaterThanOrEqual(MIN_RANDOM_VALUE);
      expect(age).toBeLessThanOrEqual(MAX_RANDOM_VALUE);
    });
  });
});
