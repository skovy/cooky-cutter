# Overview

## Why?

You need to write maintainable tests for JavaScript that depends on a
specific data model. Plain objects work at first, then maybe factory functions,
but after a while the data model and the factories get out of sync. A new column
gets added, an old one gets removed or maybe an entirely new entity is added.
The breaking change isn't noticed until the entire test suite runs (or maybe
never).

**cooky-cutter** is a light, simple package that leverages TypeScript to define
and extend factories. Simply pass the type the factory represents and configure
your factory. When the types change, the factories become invalid!

## Features

- 🛠 [Configuration](configure)
- 🤖 [Define](define) factories
- ⚙️ [Extend](extend) existing factories
- 📦 [Arrays](array) of factories
- 🚀 [Helpers](helpers) for common patterns
- ⚡️️ Type safety!

## Getting started

Check out the [Quick start](quick-start) documentation to get started.
