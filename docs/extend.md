# Extending factories

The `cooky-cutter` package provides an `extend` method to extend an existing
factory (created using `define` or possibly even `extend`). The `extend` method
receives a base factory to extend and a second argument to
[configure](api#configuration-object) additional fields or override the base factory
fields. The configuration object behavior is identical to [`define`](define).

## Usage

### Basic example

In this example, each invocation of the `user` factory will return an object
with `firstName`, `age` **and** with a random `id`.

```typescript
type Model = { id: number };
type User = { firstName: string; age: number } & Model;

const model = define<Model>({
  id: random
});

const user = extend<Model, User>(model, {
  firstName: (i: number) => `Bob #${i}`,
  age: 42
});
```

### Overriding base factories

In addition to defining new attributes with the config method, existing base
factory attributes can be overridden. For example, the entity `type` field
has a generic value defined in the base `model` factory, but is more specific
in the `user` factory.

```typescript
type Model = { id: number; type: string };
type User = { firstName: string; age: number } & Model;

const model = define<Model>({
  id: sequence,
  type: "BaseModel"
});

const user = extend<Model, User>(model, {
  firstName: "Bob",
  age: 42,
  type: "User"
});
```
