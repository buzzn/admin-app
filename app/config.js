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
    clientId: '',
    scope: 'full',
    callBackURL: 'http://localhost:2999/',
  };
}

export default config;
