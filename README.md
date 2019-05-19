# 🍪 cooky-cutter

**Simple, type safe\* object factories for JavaScript tests.** (_\*with TypeScript_)

[![Travis branch](https://img.shields.io/travis/skovy/cooky-cutter/master.svg)](https://travis-ci.org/skovy/cooky-cutter)
[![Coverage Status](https://coveralls.io/repos/github/skovy/cooky-cutter/badge.svg?branch=master)](https://coveralls.io/github/skovy/cooky-cutter?branch=master)
[![npm](https://img.shields.io/npm/v/cooky-cutter.svg)](https://www.npmjs.com/package/cooky-cutter)
[![npm type definitions](https://img.shields.io/npm/types/cooky-cutter.svg)](https://www.npmjs.com/package/cooky-cutter)

**[Read the Release Annoucement](https://skovy.dev/object-factories-for-testing-in-typescript/)**.

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
yarn add --dev cooky-cutter
```

## Basic Usage

For more documentation and examples, read the [full documentation](https://skovy.github.io/cooky-cutter/).

```typescript
import { define, random, sequence } from "cooky-cutter";

// Define an interface (or type) for the entity
interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

// Define a factory that represents the defined interface
const user = define<User>({
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
