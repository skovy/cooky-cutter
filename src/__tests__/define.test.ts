import { define, derive, configure, sequence } from "../";

type User = { firstName: string; age: number; admin?: boolean };
type Post = { title: string; user: User; tags?: string[] };

describe("define", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test("handles hard-coded attributes", () => {
    const user = define<User>({
      firstName: "Bob",
      age: 42
    });

    expect(user()).toEqual({
      firstName: "Bob",
      age: 42
    });

    expect(warnSpy).not.toHaveBeenCalled();
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

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("returns a factory that returns a new instance each invocation", () => {
    const user = define<User>({
      firstName: () => "Bob",
      age: () => 42
    });

    const firstInvocation = user();
    const secondInvocation = user();

    expect(firstInvocation).not.toBe(secondInvocation);

    expect(warnSpy).not.toHaveBeenCalled();
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

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("handles nested factories", () => {
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

    expect(warnSpy).not.toHaveBeenCalled();
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

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows defining optional attributes as overrides", () => {
    const user = define<User>({
      firstName: "Bob",
      age: 42
    });

    expect(user({ firstName: "Sarah", admin: true })).toEqual({
      firstName: "Sarah",
      age: 42,
      admin: true
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows overriding with 'falsy' values", () => {
    const user = define<User>({
      firstName: "Bob",
      age: 42,
      admin: true
    });

    expect(user({ firstName: undefined, admin: false, age: 0 })).toEqual({
      firstName: undefined,
      admin: false,
      age: 0
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  describe("resetSequence", () => {
    interface Task {
      position: number;
    }

    test("it resets the sequence value", () => {
      // A Task can have a position within a list
      const task = define<Task>({
        position: sequence
      });

      expect(task()).toHaveProperty("position", 1);
      expect(task()).toHaveProperty("position", 2);
      expect(task()).toHaveProperty("position", 3);

      task.resetSequence();

      expect(task()).toHaveProperty("position", 1);
      expect(task()).toHaveProperty("position", 2);
      expect(task()).toHaveProperty("position", 3);

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("hard-coded values", () => {
    test("warns about objects", () => {
      const post = define<Post>({
        title: "The Best Post Ever",
        user: {
          firstName: "Hard-coded",
          age: 1
        }
      });

      const firstPost = post();
      expect(firstPost).toEqual({
        title: "The Best Post Ever",
        user: {
          firstName: "Hard-coded",
          age: 1
        }
      });

      expect(warnSpy).toBeCalledWith(
        "`user` contains a hard-coded object. It will be shared across all instances of this factory. Consider using a factory function."
      );

      // When this warning is ignored, this will be the "expected" (accepted) behavior.
      firstPost.user.firstName = "Joe";
      expect(post().user.firstName).toEqual("Joe");
    });

    test("warns about arrays", () => {
      const user = define<User>({
        firstName: "Bob",
        age: 42
      });

      const post = define<Post>({
        title: "The Best Post Ever",
        user,
        tags: ["popular", "trending"]
      });

      const firstPost = post();
      expect(firstPost).toEqual({
        title: "The Best Post Ever",
        tags: ["popular", "trending"],
        user: {
          firstName: "Bob",
          age: 42
        }
      });

      expect(warnSpy).toBeCalledWith(
        "`tags` contains a hard-coded array. It will be shared across all instances of this factory. Consider using a factory function."
      );

      // When this warning is ignored, this will be the "expected" (accepted) behavior.
      firstPost.tags!.push("YOLO");
      expect(post().tags).toEqual(["popular", "trending", "YOLO"]);
    });

    test("does not warn about objects or arrays as overrides", () => {
      const user = define<User>({
        firstName: "Bob",
        age: 42
      });

      const post = define<Post>({
        title: "The Best Post Ever",
        user
      });

      const firstPost = post({
        user: {
          firstName: "Hard-coded",
          age: 1
        },
        tags: ["popular", "trending"]
      });

      expect(firstPost).toEqual({
        title: "The Best Post Ever",
        user: {
          firstName: "Hard-coded",
          age: 1
        },
        tags: ["popular", "trending"]
      });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    test("does not warn when using derive with an override value", () => {
      interface Child {
        id: number;
      }

      interface Parent {
        childId: number | null;
        child?: Child;
      }

      const parent = define<Parent>({
        childId: derive<Parent, number | null>(
          ({ child }) => (child ? child.id : null),
          "child"
        )
      });

      parent({
        child: { id: 1 }
      });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    describe("with errorOnHardCodedValues enabled", () => {
      let traceSpy: jest.SpyInstance;

      beforeEach(() => {
        configure({ errorOnHardCodedValues: true });

        traceSpy = jest.spyOn(console, "trace").mockImplementation();
      });

      afterEach(() => {
        traceSpy.mockRestore();
      });

      test("throws about objects", () => {
        const post = define<Post>({
          title: "The Best Post Ever",
          user: {
            firstName: "Hard-coded",
            age: 1
          }
        });

        expect(() => {
          post();
        }).toThrow(
          "`user` contains a hard-coded object. It will be shared across all instances of this factory. Consider using a factory function."
        );
        expect(traceSpy).toHaveBeenCalled();
      });

      test("throws about arrays", () => {
        const user = define<User>({
          firstName: "Bob",
          age: 42
        });

        const post = define<Post>({
          title: "The Best Post Ever",
          user,
          tags: ["popular", "trending"]
        });

        expect(() => {
          post();
        }).toThrow(
          "`tags` contains a hard-coded array. It will be shared across all instances of this factory. Consider using a factory function."
        );
        expect(traceSpy).toHaveBeenCalled();
      });
    });
  });
});
