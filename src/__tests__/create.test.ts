import { create } from "../index";

type User = { firstName: string; age: number };

describe("create", () => {
  test("handles string and number attributes", () => {
    const user = create<User>({
      firstName: "Bob",
      age: 42
    });

    expect(user()).toEqual({
      firstName: "Bob",
      age: 42
    });
  });

  test("handles functional attributes", () => {
    const user = create<User>({
      firstName: () => "Bob",
      age: () => 42
    });

    expect(user()).toEqual({
      firstName: "Bob",
      age: 42
    });
  });

  test("returns a factory that returns a new instance each invocation", () => {
    const user = create<User>({
      firstName: () => "Bob",
      age: () => 42
    });

    const firstInvocation = user();
    const secondInvocation = user();

    expect(firstInvocation).not.toBe(secondInvocation);
  });

  test("passes the number of invocations to functional attributes", () => {
    const user = create<User>({
      firstName: i => `Bob #${i}`,
      age: i => i * 42
    });

    // First invocation
    expect(user()).toEqual({
      firstName: "Bob #1",
      age: 42
    });

    // Second invocation
    expect(user()).toEqual({
      firstName: "Bob #2",
      age: 84
    });

    // Third invocation
    expect(user()).toEqual({
      firstName: "Bob #3",
      age: 126
    });
  });
});
