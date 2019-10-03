import { define, random, sequence, extend } from "../index";
import { array } from "../array";

type User = { firstName: string; age: number; admin?: boolean };
type Post = { title: string; user: User };
type UsersCollection = { users: User[]; role: string };
type Model = { id: number };
type Record = { id: number; value: string };
type Thing = { id: number; name: string; users: User[] };

describe("array", () => {
  test("returns array with 5 elements by default", () => {
    const user = define<User>({
      age: random,
      firstName: "Mike"
    });

    const users = array(user);
    expect(Array.isArray(users())).toBe(true);
    expect(users().length).toBe(5);
  });

  test("allows overriding array size", () => {
    const user = define<User>({
      age: random,
      firstName: "Mike"
    });

    const users = array(user, 10);
    expect(users().length).toBe(10);
  });

  test("calls underlying factories during generation", () => {
    const user = define<User>({
      age: sequence,
      firstName: (i: number) => `Mike ${i}`
    });

    const users = array(user, 2);
    const first = users();
    const second = users();

    expect(first[0]).toEqual({ firstName: "Mike 1", age: 1 });
    expect(first[1]).toEqual({ firstName: "Mike 2", age: 2 });
    expect(second[0]).toEqual({ firstName: "Mike 3", age: 3 });
    expect(second[1]).toEqual({ firstName: "Mike 4", age: 4 });
  });

  test("allows overriding underlying factory", () => {
    const user = define<User>({
      age: 30,
      firstName: "Mike"
    });

    const users = array(user, 1);
    expect(users({ firstName: "Mickey", admin: true })[0]).toEqual({
      firstName: "Mickey",
      age: 30,
      admin: true
    });
    expect(users({ firstName: "M", age: 20 })[0]).toEqual({
      firstName: "M",
      age: 20
    });
  });

  test("allows compound factories", () => {
    const user = define<User>({
      age: 30,
      firstName: "Mike"
    });
    const post = define<Post>({
      user,
      title: "Test title"
    });

    const posts = array(post);
    expect(posts().length).toBe(5);
    expect(posts()[0]).toEqual({
      title: "Test title",
      user: { age: 30, firstName: "Mike" }
    });
  });

  test("can be used inline with define", () => {
    const user = define<User>({
      age: 30,
      firstName: "Mike"
    });
    const moderators = define<UsersCollection>({
      role: "moderator",
      users: array(user, 2)
    });

    expect(moderators().users.length).toBe(2);
  });

  test("allows overriding initial config", () => {
    const user = define<User>({
      age: 30,
      firstName: "Mike"
    });
    const moderators = define<UsersCollection>({
      role: "moderator",
      users: array(user, 2)
    });

    expect(moderators().users.length).toBe(2);
    expect(moderators({ users: array(user, 3) }).users.length).toBe(3);
  });

  test("allows extending an existing factory and use an array factory", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = define<User>({
      age: random,
      firstName: "Mike"
    });

    const thing = extend<Model, Thing>(model, {
      name: "Some Thing",
      users: array(user, 3)
    });

    const value = thing();
    expect(value.id).toBe(1);
    expect(value.name).toBe("Some Thing");
    expect(value.users).toHaveLength(3);
  });

  test("allows creating an array factory from extend", () => {
    const model = define<Model>({
      id: sequence
    });

    const record = extend<Model, Record>(model, {
      value: "foo"
    });

    const records = array(record, 2);
    expect(records()).toHaveLength(2);
  });
});
