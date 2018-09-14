# Defining factories

The `cooky-cutter` package provides a `define` method to [configure](api#configuration-object)
a factory for a given type. Each factory invocation return a new object matching
the config. Each attribute can be a hardcoded value (eg: `string` or `number`),
a function that receives the invocation count as the only argument or another
factory.

## Usage

### Basic example

In this example, each invocation of the `user` factory will return an identically
shaped object (but each is a new instance).

```typescript
type User = { firstName: string; age: number };

const user = define<User>({
  firstName: "Bob",
  age: 42
});
```

### Attribute functions

In this example, each invocation of the `user` factory will return a unique
factory. The value of `i` for each function starts at `1` and will increment each
call. For example, the first three calls for `firstName` will be `Bob #1`,
`Bob #2` and `Bob #3`. Similarily, `age` will be `42`, `84` and `126`. See
[helpers](helpers) for utility methods for common patterns.

```typescript
type User = { firstName: string; age: number };

const user = define<User>({
  firstName: (i: number) => `Bob #${i}`,
  age: (i: number) => i * 42
});
```

### Composing factories

Factories can also reference other factories. In this example, a `Post` has
a `User`. We could manually define this `User`, but since we likely already have
a `User` factory for elsewhere, we can reference it.

```typescript
type User = { firstName: string; age: number };
type Post = { title: string; user: User };

const user = define<User>({
  firstName: "Bob",
  age: 42
});

const post = define<Post>({
  title: "The Best Post Ever",
  user
});
```

?> **TIP:** Name factories the same as attributes that reference that type to leverage
[ES6 Object Punning](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015).
For example, the user factory above.
