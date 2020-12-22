import { define, derive, sequence, extend } from "../index";

type Model = { id: number };
type Post = { title: string } & Model;
type User = {
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
};

describe("derive", () => {
  test("computes derived attributes", () => {
    const user = define<User>({
      firstName: "Bob",
      lastName: "Smith",
      age: 3,
      fullName: derive<User, string>(
        ({ firstName, lastName, age }) => `${firstName} ${lastName} ${age}`,
        "firstName",
        "lastName",
        "age"
      ),
    });

    expect(user()).toEqual({
      firstName: "Bob",
      lastName: "Smith",
      age: 3,
      fullName: "Bob Smith 3",
    });
  });

  test("computes derived attributes using extend", () => {
    const model = define<Model>({
      id: sequence,
    });

    const post = extend<Model, Post>(model, {
      title: derive<Post, string>(({ id }) => `Post ${id}`, "id"),
    });

    expect(post()).toEqual({
      id: 1,
      title: "Post 1",
    });
  });

  test("computes derived attributes when dependent attributes have not been evaluated", () => {
    const user = define<User>({
      firstName: "Bob",
      fullName: derive<User, string>(
        ({ firstName, lastName, age }) => `${firstName} ${lastName} ${age}`,
        "firstName",
        "lastName",
        "age"
      ),
      lastName: "Smith",
      age: 3,
    });

    expect(user()).toEqual({
      firstName: "Bob",
      lastName: "Smith",
      age: 3,
      fullName: "Bob Smith 3",
    });
  });

  test("computes derived attributes dependent on other derived attributes", () => {
    const user = define<User>({
      age: sequence,
      firstName: derive<User, string>(({ age }) => `Bob ${age}`, "age"),
      fullName: derive<User, string>(
        ({ firstName, lastName }) => `${firstName} ${lastName}`,
        "firstName",
        "lastName"
      ),
      lastName: derive<User, string>(({ age }) => `Smith ${age}`, "age"),
    });

    expect(user()).toEqual({
      age: 1,
      firstName: "Bob 1",
      lastName: "Smith 1",
      fullName: "Bob 1 Smith 1",
    });

    expect(user()).toEqual({
      age: 2,
      firstName: "Bob 2",
      lastName: "Smith 2",
      fullName: "Bob 2 Smith 2",
    });
  });

  test("throws on circularly derived fields at runtime", () => {
    const user = define<User>({
      age: sequence,
      fullName: derive<User, string>(
        ({ lastName }) => `${lastName}`,
        "lastName"
      ),
      lastName: derive<User, string>(
        ({ firstName }) => `${firstName} Smith`,
        "firstName"
      ),
      firstName: derive<User, string>(
        ({ fullName }) => `Bob ${fullName}`,
        "fullName"
      ),
    });

    expect(() => {
      user();
    }).toThrowError(
      "lastName cannot circularly derive itself. Check along this path: lastName->firstName->fullName->lastName"
    );
  });

  test("only invokes a function once when deriving", () => {
    interface Child {
      id: number;
    }

    interface Parent {
      childId: number | null;
      child?: Child;
    }

    const child = define<Child>({
      id: sequence,
    });

    const parent = define<Parent>({
      childId: derive<Parent, number | null>(
        ({ child }) => (child ? child.id : null),
        "child"
      ),
    });

    expect(
      parent({
        child,
      })
    ).toEqual({
      childId: 1,
      child: {
        id: 1,
      },
    });
  });
});
