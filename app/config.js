let config = {};

if (process.env.NODE_ENV === 'production') {
  config = {
    apiUrl: 'https://api.de.buzzn.net/',
    apiPath: 'api/admin',
    authPath: 'api/me',
    websitePath: 'api/website',
    versionPath: 'assets/version.json',
    clientId: '',
    callBackURL: '',
    secure: true,
  };
} else if (process.env.NODE_ENV === 'staging') {
  config = {
    apiUrl: 'https://staging-core.buzzn.net/',
    apiPath: 'api/admin',
    authPath: 'api/me',
    websitePath: 'api/website',
    versionPath: 'assets/version.json',
    clientId: '',
    callBackURL: '',
    secure: true,
  };
} else if (process.env.NODE_ENV === 'develop') {
  config = {
    apiUrl: 'https://staging-core.buzzn.net/',
    apiPath: 'api/admin',
    authPath: 'api/me',
    websitePath: 'api/website',
    versionPath: 'assets/version.json',
    clientId: '',
    callBackURL: '',
    secure: true,
  };
} else {
  config = {
    apiUrl: 'https://staging-core.buzzn.net/',
    apiPath: 'api/admin',
    authPath: 'api/me',
    websitePath: 'api/website',
    versionPath: 'version.json',
    clientId: '',
    callBackURL: '',
    secure: false,
  };
}

export default config;
