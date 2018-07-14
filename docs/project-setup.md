# Project setup

The `cooky-cutter` package is flexible and can be used in any way you'd like.
However, this section of the documentation will offer a _suggested_ project
setup following patterns that work well.

## Extending

Many projects with entities or data models often have a unique identifer or
other attributes that are shared across all entities. For example, maybe a
`type` property, or a `createdAt` timestamp. If this is the case, consider
creating a "base" factory that all other factories can extend.

**`model.ts`**

```typescript
import { define, random } from "cooky-cutter";

import { BaseModel } from "models";

export const model = define<BaseModel>({
  id: random,
  createdAt: new Date()
});
```

**`user.ts`**

```typescript
import { extend, sequence } from "cooky-cutter";

import { User, BaseModel } from "models";
import { model } from "./model";

export const user = extend<BaseModel, User>(model, {
  type: "User",
  name: "Joe",
  age: sequence
});
```

## Naming

As with everything in this section, you're free to name things in any way you'd
like, but this convention can work well in larger projects. In the above
examples, both factories were camel cased and the name of the entity as opposed
to appending factory (eg: `userFactory`). This is useful for composing factories
and making the configuration very declartive. For example, a post with a user
is a single line with [ES6 Object Punning](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015).

**`post.ts`**

```typescript
import { extend, sequence } from "cooky-cutter";

import { Post, BaseModel } from "models";
import { model } from "./model";
import { user } from "./user";

export const post = extend<BaseModel, Post>(model, {
  type: "Post",
  title: "A fun post",
  user
});
```

## Directory structure

Lastly, consider containing all factories within a single directory
(eg: `factories`) with an `index` file that exports all factories. This is
useful for tests that need multiple factories. They can all be imported with
a single line:

```typescript
import { user, post } from "factories";
```

Additionally, it makes it easy to import factories into other factories and
compose them. Using the above examples and following this approach, the directory
structure would look like the following.

```
.
└── factories
    ├── index.ts
    ├── model.ts
    ├── post.ts
    └── user.ts
```
