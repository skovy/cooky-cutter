# Deriving values

The `cooky-cutter` package provides a `derive` method to compute a single value
and assign it to the attribute based off any number of other attributes defined
in the factory. This is useful for deriving a fields value off of other dynamic
field(s) that are not known until a factory is invoked. The order does not
matter, dependent attributes will be calculated first.

!> A derived field can reference other derived fields, but they **cannot be
circularly referenced.**

## Usage

### Basic example

```typescript
type User = {
  firstName: string;
  lastName: string;
  fullName: string;
};

const user = define<User>({
  firstName: "Bob",
  lastName: "Smith",
  fullName: derive<User, string>(
    ({ firstName, lastName }) => `${firstName} ${lastName}`,
    "firstName",
    "lastName"
  )
});

user().fullName; // "Bob Smith"
```
