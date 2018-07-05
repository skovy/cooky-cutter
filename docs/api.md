# API

## define

Define a new cooky-cutter factory. For examples, see [defining factories](define).

| Param       | Type      | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| config      | `Object`  | [Configuration object](api#configuration-object) |
| **Returns** | `Factory` | [Factory function](api#factory-function)         |

## extend

Extend an existing cooky-cutter factory. For examples, see [extending factories](extend).

| Param       | Type      | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| base        | `Factory` | Existing cooky-cutter factory                    |
| config      | `Object`  | [Configuration object](api#configuration-object) |
| **Returns** | `Factory` | [Factory function](api#factory-function)         |

## Factory function

The return value of `define` and `extend`. It can be invoked any number of times
to create a new object representing a given type following the configuration
object specifications. The function also accepts an optional `override`
parameter to override the original configuration.

| Param       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| override    | `Object` | [Configuration object](api#configuration-object) |
| **Returns** | `Object` | Matches the configuration specifications         |

## Configuration object

The configuration object is an argument to [`define`](api#define),
[`extend`](api#extend), and the override argument for a [`Factory`](api#factory).
Each attribute can be:

1.  A hardcoded value (eg: `string`, `number`). This will be
    identical for all invocations.
1.  A function that receives the invocation count as the only argument. This
    can be useful to have a unique field each invocation by appending the
    count or using as a seed.
1.  Another factory. This will be invoked every time the parent factory is
    invoked.

!> Prefer composing factories over hardcoding `object` attributes. Hardcoded
objects will be identical across all factory invocations so any mutations will
affect all instances.
