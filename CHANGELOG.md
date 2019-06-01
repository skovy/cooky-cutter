# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- An incorrect warning about hard-coded values when using an override value with `derive` [#17](https://github.com/skovy/cooky-cutter/pull/17)

## [1.3.0] - 2019-05-18

### Security

- Update dependencies with vulnerabilities reported via `npm audit` via `npm audit fix --force` [#11](https://github.com/skovy/cooky-cutter/pull/11)

### Added

- By default, warnings will now be show for hard-coded objects and arrays [#12](https://github.com/skovy/cooky-cutter/pull/12)
- A `configure` function was added to globally configure factories [#12](https://github.com/skovy/cooky-cutter/pull/12)
- A configuration option `errorOnHardCodedValues` will throw (rather than warn) about hard-coded values [#12](https://github.com/skovy/cooky-cutter/pull/12)
- Properly ignore `.vscode` config when publishing to npm in [#9](https://github.com/skovy/cooky-cutter/pull/9)

### Fixed

- The `array` type definitions now match the `extend` type definitions [#12](https://github.com/skovy/cooky-cutter/pull/12)

## [1.2.0] - 2018-11-10

### Changed

- Upgrade to `typescript@3.1.6` and update the internals to use proper function
  properties in [#7](https://github.com/skovy/cooky-cutter/pull/7)

### Fixed

- Run `npm audit fix` to resolve `devDependency` vulnerabilities in [#8](https://github.com/skovy/cooky-cutter/pull/8)

## [1.1.0] - 2018-08-08

### Added

- Add `array` for creating an array of objects (from a factory) in [#2](https://github.com/skovy/cooky-cutter/pull/2) by [@kijowski](https://github.com/kijowski)
- Add `derive` for deriving values dependent on other attributes in [#5](https://github.com/skovy/cooky-cutter/pull/5)

### Changed

- Update internal version of TypeScript to `3.0.1` in [#3](https://github.com/skovy/cooky-cutter/pull/3)

## [1.0.3] - 2018-07-15

### Added

- `CHANGELOG` with current changes and (most) retroactive changes

### Fixed

- Allow overriding factory by passing a "falsy" value (eg: `0` or `false`)

## [1.0.2] - 2018-07-14

### Fixed

- Add another badge for types
- Update the homepage URL to point to documentation

## [1.0.1] - 2018-07-14

### Fixed

- Removed unintentionally published files that increased the bundle size unnecessarily

## [1.0.0] - 2018-07-14

### Changed

- Documentation updates
- `README` updates

## [0.0.6] - 2018-07-03

### Changed

- Allow optional params in the `override` config
- Allow overriding base factory attributes when extending

## [0.0.5] - 2018-06-25

### Added

- Add `extend` function to extend existing factories
- Export types from the index

## [0.0.4] - 2018-06-25

### Changed

- `create` renamed to define

## [0.0.3] - 2018-06-24

### Added

- `README` was added with basic information

### Changed

- The range of the `random` helper was changed from `Number.MAX_VALUE` to the
  32-bit max for readability.

## [0.0.2] - 2018-06-24

### Fixed

- Correctly export the `create` method

## 0.0.1 - 2018-06-24

### Added

- `create` method to define factories
- `random` helper for a random integer
- `sequence` helper for a sequential integer

[unreleased]: https://github.com/skovy/cooky-cutter/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/skovy/cooky-cutter/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/skovy/cooky-cutter/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/skovy/cooky-cutter/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/skovy/cooky-cutter/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/skovy/cooky-cutter/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/skovy/cooky-cutter/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/skovy/cooky-cutter/compare/v0.3.0...v1.0.0
[0.0.6]: https://github.com/skovy/cooky-cutter/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/skovy/cooky-cutter/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/skovy/cooky-cutter/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/skovy/cooky-cutter/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/skovy/cooky-cutter/compare/v0.0.1...v0.0.2
