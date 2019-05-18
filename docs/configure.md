# Configuration

The library can be configured via the `configure` function, which accepts a
plain object that will overwrite the existing configuration.

## Usage Example

```typescript
import { configure } from "cooky-cutter";

configure({ errorOnHardCodedValues: true });
```

### Configuration Options

`errorOnHardCodedValues`: Enabling this setting will throw (rather than warn)
when an object or array is hard-coded in the configuration for a factory (not in
the override). It's strongly discouraged to use a shared instance of an object
or an array between different factory instances. If one test case modifies the
object or array, the next test that relies on this factory will still have those
mutations which can lead to confusing and subtle bugs or random test failures.
