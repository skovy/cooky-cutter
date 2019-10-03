import { define, extend, sequence, configure } from "../index";

type Model = { id: number; type?: string };
type User = { firstName: string; age: number; admin?: boolean } & Model;
type Post = { title: string; user: User; tags?: string[] } & Model;

describe("extend", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test("allows extending an existing factory", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: (i: number) => `Bob #${i}`,
      age: 42
    });

    expect(user()).toEqual({
      id: 1,
      firstName: "Bob #1",
      age: 42
    });

    expect(user()).toEqual({
      id: 2,
      firstName: "Bob #2",
      age: 42
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows overriding both the factory and the config", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42
    });

    expect(user({ id: -1, firstName: "Jill" })).toEqual({
      id: -1,
      firstName: "Jill",
      age: 42
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows overriding with 'falsy' values", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42,
      admin: true
    });

    expect(user({ firstName: undefined, admin: false, age: 0 })).toEqual({
      id: 1,
      firstName: undefined,
      admin: false,
      age: 0
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows overriding the factory with the config", () => {
    const model = define<Model>({
      id: sequence,
      type: "BaseModel"
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42,
      type: "User"
    });

    expect(user()).toEqual({
      id: 1,
      firstName: "Bob",
      age: 42,
      type: "User"
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows extending the same factory multiple times", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42
    });

    const post = extend<Model, Post>(model, {
      title: (i: number) => `My Post #${i}`,
      user
    });

    expect(post()).toEqual({
      id: 1,
      title: "My Post #1",
      user: {
        id: 2,
        firstName: "Bob",
        age: 42
      }
    });

    expect(user()).toEqual({
      id: 3,
      firstName: "Bob",
      age: 42
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test("allows defining optional attributes as overrides", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42
    });

    expect(user({ admin: true })).toEqual({
      id: 1,
      firstName: "Bob",
      age: 42,
      admin: true
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  describe("resetSequence", () => {
    interface BaseTask {
      id: number;
    }

    interface Task {
      id: number;
      position: number;
    }

    test("it resets the sequence value for only the extended factory (not the base factory)", () => {
      const baseTask = define<BaseTask>({
        id: sequence
      });

      // A Task can have a position within a list
      const task = extend<BaseTask, Task>(baseTask, {
        position: sequence
      });

      expect(task()).toEqual({ id: 1, position: 1 });
      expect(task()).toEqual({ id: 2, position: 2 });

      task.resetSequence();

      expect(task()).toEqual({ id: 3, position: 1 });
      expect(task()).toEqual({ id: 4, position: 2 });

      baseTask.resetSequence();
      task.resetSequence();

      expect(task()).toEqual({ id: 1, position: 1 });
      expect(task()).toEqual({ id: 2, position: 2 });

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("hard-coded values", () => {
    test("warns about objects", () => {
      const model = define<Model>({
        id: sequence
      });

      const post = extend<Model, Post>(model, {
        title: "The Best Post Ever",
        user: {
          id: 1,
          firstName: "Hard-coded",
          age: 1
        }
      });

      const firstPost = post();
      expect(firstPost).toEqual({
        id: 1,
        title: "The Best Post Ever",
        user: {
          id: 1,
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
      const model = define<Model>({
        id: sequence
      });

      const user = extend<Model, User>(model, {
        firstName: "Bob",
        age: 42
      });

      const post = extend<Model, Post>(model, {
        title: "The Best Post Ever",
        user,
        tags: ["popular", "trending"]
      });

      const firstPost = post();
      expect(firstPost).toEqual({
        id: 1,
        title: "The Best Post Ever",
        tags: ["popular", "trending"],
        user: {
          id: 2,
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
      const model = define<Model>({
        id: sequence
      });

      const user = extend<Model, User>(model, {
        firstName: "Bob",
        age: 42
      });

      const post = extend<Model, Post>(model, {
        title: "The Best Post Ever",
        user
      });

      const firstPost = post({
        user: {
          id: 2,
          firstName: "Hard-coded",
          age: 1
        },
        tags: ["popular", "trending"]
      });

      expect(firstPost).toEqual({
        id: 1,
        title: "The Best Post Ever",
        user: {
          id: 2,
          firstName: "Hard-coded",
          age: 1
        },
        tags: ["popular", "trending"]
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
        const model = define<Model>({
          id: sequence
        });

        const post = extend<Model, Post>(model, {
          title: "The Best Post Ever",
          user: {
            id: 1,
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
        const model = define<Model>({
          id: sequence
        });

        const user = extend<Model, User>(model, {
          firstName: "Bob",
          age: 42
        });

        const post = extend<Model, Post>(model, {
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
