# Quick start

## Installation

Install `cooky-cutter` as a development dependency with your favorite package
manager.

```bash
npm install --save-dev cooky-cutter
# or
yarn add --dev  cooky-cutter
```

## Usage

To define a factory for a given type, import `define`. The only argument
is a required config object that matches that shape of the type. Each attribute
can be a hardcoded value, a function that receives the invocation count as
the only argument or another factory. Additionally, there are utility helpers
like `random` and `sequence` for common factory attributes.

```typescript
import { define, random, sequence } from "cooky-cutter";

// Define an interface (or type) for the entity that the factory will represent
interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

// Define a factory that represents the defined interface
const user = define<User>({
  id: random, // This will be a random integer each invocation
  firstName: i => `Bob #${i}`, // `i` will be incremented each invocation
  lastName: "Smith", // This will always be the hardcoded value
  age: sequence // This will increment each invocation
});

// Invoke the factory a few times, see example outputs below...
console.log(user());
// => { id: 980711200, firstName: 'Bob #1', lastName: 'Smith', age: 1 }

console.log(user());
// => { id: 1345667839, firstName: 'Bob #2', lastName: 'Smith', age: 2 }

console.log(user());
// => { id: 796816401, firstName: 'Bob #3', lastName: 'Smith', age: 3 }
```
