# Arrays of factories

The `cooky-cutter` package provides an `array` method to create a generator
function to return an array of objects matching the provided factory definition.
The generator accepts a [configuration object](api#configuration-object)
to override the underlying factories. Each generator invocation returns a new
array with new objects matching the factory and optional config.

## Usage

### Creating an array of factories

In this example we will use `User` factory to create arrays of various size.

```typescript
type User = { firstName: string; age: number };

const user = define<User>({
  firstName: "Bob",
  age: 42
});

const pairOfUsers = array(user, 2);

const trioOfUsers = array(user, 3);

pairOfUsers(); // returns an array of two user objects
trioOfUsers(); // returns an array of three user objects
```

### Overriding an array of factories

Similar to the [define method](define) the array generator accepts a config
to override the underlying factories.

```typescript
pairOfUsers({ firstName: "Joe" }); // return an array of two user object with the `firstName` "Joe"
```
