interface Configuration {
  /**
   * Enabling this setting will throw (rather than warn) when an object
   * or array is hard-coded in the configuration for a factory (not in the
   * override). It's strongly discouraged to use a shared instance of an
   * object or an array between different factory instances. If one test case
   * modifies the object or array, the next test that relies on this factory
   * will still have those mutations which can lead to confusing and subtle
   * bugs or random test failures.
   *
   * @default false
   */
  errorOnHardCodedValues: boolean;
}

let config: Configuration = {
  errorOnHardCodedValues: false
};

/**
 * Configure global settings to cooky-cutter. This will affect ALL factories.
 * This should be ran once before all tests and factories so that all factories
 * rely on the same configuration.
 *
 * @param newConfig - an object that represents the desired configuration
 */
export const configure = (newConfig: Configuration) => {
  config = newConfig;
};

/**
 * Retrieve the current global configuration options.
 */
export const getConfig = () => config;
