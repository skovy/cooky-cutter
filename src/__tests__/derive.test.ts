import { define, derive, sequence } from "../index";

type User = {
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  admin?: boolean;
};

describe("derive", () => {
  test("computes derived attributes", () => {
    const user = define<User>({
      firstName: "Bob",
      lastName: "Smith",
      age: 3,
      fullName: derive<User, "firstName" | "lastName" | "age", string>(
        ({ firstName, lastName, age }) => `${firstName} ${lastName} ${age}`,
        "firstName",
        "lastName",
        "age"
      )
    });

    expect(user()).toEqual({
      firstName: "Bob",
      lastName: "Smith",
      age: 3,
      fullName: "Bob Smith 3"
    });
  });

  test("computes derived attributes when dependent attributes have not been evaluated", () => {
    const user = define<User>({
      firstName: "Bob",
      fullName: derive<User, "firstName" | "lastName" | "age", string>(
        ({ firstName, lastName, age }) => `${firstName} ${lastName} ${age}`,
        "firstName",
        "lastName",
        "age"
      ),
      lastName: "Smith",
      age: 3
    });

    expect(user()).toEqual({
      firstName: "Bob",
      lastName: "Smith",
      age: 3,
      fullName: "Bob Smith 3"
    });
  });

  test("computes derived attributes dependent on other derived attributes", () => {
    const user = define<User>({
      age: sequence,
      firstName: derive<User, "age", string>(({ age }) => `Bob ${age}`, "age"),
      fullName: derive<User, "firstName" | "lastName", string>(
        ({ firstName, lastName }) => `${firstName} ${lastName}`,
        "firstName",
        "lastName"
      ),
      lastName: derive<User, "age", string>(({ age }) => `Smith ${age}`, "age")
    });

    expect(user()).toEqual({
      age: 1,
      firstName: "Bob 1",
      lastName: "Smith 1",
      fullName: "Bob 1 Smith 1"
    });

    expect(user()).toEqual({
      age: 2,
      firstName: "Bob 2",
      lastName: "Smith 2",
      fullName: "Bob 2 Smith 2"
    });
  });
});
