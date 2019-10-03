# API

## configure

Globally configure all factories. For examples, see [configuration](configure).

| Param         | Type     | Description                                             |
| ------------- | -------- | ------------------------------------------------------- |
| configuration | `Object` | [Configuration object](configure#configuration-options) |

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

## array

Uses an existing cooky-cutter factory to create arrays. For examples, see [creating array of objects](define#creating-array-of-objects).

| Param       | Type           | Description                                          |
| ----------- | -------------- | ---------------------------------------------------- |
| factory     | `Factory`      | Existing cooky-cutter factory                        |
| size        | `number`       | Size of the array that will be generated             |
| **Returns** | `ArrayFactory` | [Array factory function](api#array-factory-function) |

## derive

Derive an attribute's value from other fields in the factory. For examples, see
[deriving values](derive).

| Param         | Type           | Description                                        |
| ------------- | -------------- | -------------------------------------------------- |
| fn            | `Function`     | Receives an object with the dependent keys defined |
| dependentKeys | `String`       | Attributes the derived field is dependent on       |
| **Returns**   | Attribute Type | Matches the attribute type                         |

## Factory function

The return value of `define` and `extend`. It can be invoked any number of times
to create a new object representing a given type following the configuration
object specifications. The function also accepts an optional `override`
parameter to override the original configuration.

| Param       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| override    | `Object` | [Configuration object](api#configuration-object) |
| **Returns** | `Object` | Matches the configuration specifications         |

The internal sequence can be reset by calling `resetSequence()` on the factory
returned from `define` or `extend`.

## Array factory function

The return value of `array`. It can be invoked any number of times
to create a new array with objects representing a given type following the configuration
object specifications. The function also accepts an optional `override`
parameter to override the original configuration.

| Param       | Type       | Description                                          |
| ----------- | ---------- | ---------------------------------------------------- |
| override    | `Object`   | [Configuration object](api#configuration-object)     |
| **Returns** | `Object[]` | Each object matches the configuration specifications |

## Configuration object

The configuration object is an argument to [`define`](api#define),
[`extend`](api#extend), and the override argument for a [`Factory`](api#factory).
Each attribute can be:

1.  A hard-coded value (eg: `string`, `number`). This will be
    identical for all invocations.
1.  A function that receives the invocation count as the only argument. This
    can be useful to have a unique field each invocation by appending the
    count or using as a seed.
1.  Another factory. This will be invoked every time the parent factory is
    invoked.

!> Prefer composing factories over hard-coding `object` or `array` attributes.
Hard-coded objects will be identical across all factory invocations so any
mutations will affect all instances.
