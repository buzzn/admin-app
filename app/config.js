let config = {};

if (process.env.NODE_ENV === 'production') {
  config = {
    apiUrl: 'https://app.buzzn.net/',
    apiPath: 'api/v1',
    clientId: '',
    scope: 'full',
    callBackURL: '',
  };
} else if (process.env.NODE_ENV === 'staging') {
  config = {
    apiUrl: 'https://staging.buzzn.net/',
    apiPath: 'api/v1',
    clientId: '',
    scope: 'full',
    callBackURL: '',
  };
} else {
  config = {
    apiUrl: 'http://localhost:3000/',
    apiPath: 'api/v1',
    clientId: 'a2fe779b73cb3070fcf9ddbbefad2f37145fd959e09d5701efdcab07fb769178',
    scope: 'full',
    callBackURL: 'http://localhost:2999/',
  };
}

export default config;
