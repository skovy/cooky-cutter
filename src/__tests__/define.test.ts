import { define } from "../index";

type User = { firstName: string; age: number };
type Post = { title: string; user: User };

describe("define", () => {
  test("handles hardcoded attributes", () => {
    const user = define<User>({
      firstName: "Bob",
      age: 42
    });

    expect(user()).toEqual({
      firstName: "Bob",
      age: 42
    });
  });

  test("handles functional attributes", () => {
    const user = define<User>({
      firstName: () => "Bob",
      age: () => 42
    });

    expect(user()).toEqual({
      firstName: "Bob",
      age: 42
    });
  });

  test("returns a factory that returns a new instance each invocation", () => {
    const user = define<User>({
      firstName: () => "Bob",
      age: () => 42
    });

    const firstInvocation = user();
    const secondInvocation = user();

    expect(firstInvocation).not.toBe(secondInvocation);
  });

  test("passes the number of invocations to functional attributes", () => {
    const user = define<User>({
      firstName: (i: number) => `Bob #${i}`,
      age: (i: number) => i * 42
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

  test("handles nested factores", () => {
    const user = define<User>({
      firstName: "Bob",
      age: 42
    });

    const post = define<Post>({
      title: "The Best Post Ever",
      user
    });

    expect(post()).toEqual({
      title: "The Best Post Ever",
      user: {
        firstName: "Bob",
        age: 42
      }
    });
  });

  test("allows overriding the initial config", () => {
    const user = define<User>({
      firstName: "Bob",
      age: 42
    });

    expect(user({ firstName: "Sarah" })).toEqual({
      firstName: "Sarah",
      age: 42
    });

    expect(user({ age: (i: number) => i })).toEqual({
      firstName: "Bob",
      age: 2
    });

    expect(user({ firstName: "Jill", age: 43 })).toEqual({
      firstName: "Jill",
      age: 43
    });
  });
});
