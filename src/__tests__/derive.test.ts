import { define } from "../index";
import { derive } from "../derive";

type User = {
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  admin?: boolean;
};

describe("derive", () => {
  test("can compute derived attributes", () => {
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

  test("can compute derived attributes when dependent attributes are defined later", () => {
    const user = define<User>({
      firstName: "Bob",
      fullName: derive<User, "firstName" | "lastName" | "age", string>(
        ({ firstName, lastName, age }) => `${firstName} ${lastName} ${age}`,
        "firstName",
        "lastName",
        "age"
      ),
      // These attributes have not been "evaluated" yet
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
});
