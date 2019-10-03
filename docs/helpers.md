# Helpers

The `cooky-cutter` package provides a few utility methods for common patterns
when defining factory attributes.

## sequence

This helper increments the value on each factory invocation starting at `1`.

### Example

In this example, `age` will be `1` the first time `user` is invoked, `2` the
second, `3` the third and so on.

```typescript
type User = { age: number };

const user = define<User>({
  age: sequence
});
```

To reset this value (if a test is dependent on starting at `1`) the
`resetSequence` function can be invoked on the factory to reset the sequence
back to `1`.

```typescript
user(); // { age: 1 }
user(); // { age: 2 }

user.resetSequence();

user(); // { age: 1 }
user(); // { age: 2 }
```

## random

This helpers assigns a random positive integer on each factory invocation.

?> **TIP:** If you have an integer `id` (or equivalent unique identifier) use
`random` to avoid bugs and fragile tests due to sequential unique identifiers.

### Example

In this example, `age` could be any positive integer (eg: `980711200` ).

```typescript
type User = { age: number };

const user = define<User>({
  age: random
});
```
