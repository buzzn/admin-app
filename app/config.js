let config = {};

if (process.env.NODE_ENV === 'production') {
  config = {
    apiUrl: 'https://core.buzzn.io/',
    apiPath: 'api/admin',
    clientId: '',
    callBackURL: '',
    secure: true,
  };
} else if (process.env.NODE_ENV === 'staging') {
  config = {
    apiUrl: 'https://docker-staging-core.buzzn.io/',
    apiPath: 'api/admin',
    clientId: '',
    callBackURL: '',
    secure: true,
  };
} else {
  config = {
    apiUrl: 'http://localhost:3000/',
    apiPath: 'api/admin',
    clientId: '',
    callBackURL: '',
    secure: false,
  };
}

export default config;
