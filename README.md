# 🍪 cooky-cutter

**Simple, type safe\* object factories for JavaScript tests.** (_\*with TypeScript_)

## The problem

You need to write maintainable tests for JavaScript. The code depends on
specific entity types defined in the data model. These entities might initially
get stubbed out in tests (Mocha, Jest, etc) as plain objects. As complexity
grows, you move to factory functions (or another package that does this) to
avoid the duplication. A new column gets added, an old one gets removed or maybe
an entirely new entity is added. The breaking change isn't noticed until the
entire test suite runs (or maybe never).

## The solution

[`cooky-cutter`](https://www.npmjs.com/package/cooky-cutter) is a light package
that leverages TypeScript to define and create factories. Simply pass the type
as a generic (assuming you already have a type or interface defined for each
entity type). Whenever the entity type changes, the factories become invalid!

## Installation

```bash
npm install --save-dev cooky-cutter
# or
yarn add --dev  cooky-cutter
```

## Usage

```typescript
import { create, random, sequence } from "cooky-cutter";

// Define an interface (or type) for the entity
interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

// Create a factory that represents the defined interface
const user = create<User>({
  id: random,
  firstName: i => `Bob #${i}`,
  lastName: "Smith",
  age: sequence
});

// Invoke the factory a few times
console.log(user());
// => { id: 980711200, firstName: 'Bob #1', lastName: 'Smith', age: 1 }

console.log(user());
// => { id: 1345667839, firstName: 'Bob #2', lastName: 'Smith', age: 2 }

console.log(user());
// => { id: 796816401, firstName: 'Bob #3', lastName: 'Smith', age: 3 }
```
