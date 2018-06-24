import { create, sequence, random } from "../index";

type User = { age: number };

describe("helpers", () => {
  describe("sequence", () => {
    test("increments each time a factory is invoked", () => {
      const user = create<User>({
        age: sequence
      });

      expect(user()).toEqual({
        age: 1
      });
      expect(user()).toEqual({
        age: 2
      });
      expect(user()).toEqual({
        age: 3
      });
    });
  });

  describe("random", () => {
    test("returns a random number between 1 and MAX_VALUE inclusive", () => {
      const user = create<User>({
        age: random
      });

      const { age } = user();

      expect(age).toBeGreaterThanOrEqual(1);
      expect(age).toBeLessThanOrEqual(Number.MAX_VALUE);
    });
  });
});
