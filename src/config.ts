interface Config {
  errorOnHardCodedValues: boolean;
}

let config: Config = {
  errorOnHardCodedValues: false
};

export const configure = (newConfig: Config) => {
  config = newConfig;
};

export const getConfig = () => config;
