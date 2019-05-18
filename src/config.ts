interface Configuration {
  errorOnHardCodedValues: boolean;
}

let config: Configuration = {
  errorOnHardCodedValues: false
};

export const configure = (newConfig: Configuration) => {
  config = newConfig;
};

export const getConfig = () => config;
