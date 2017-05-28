Npm.depends({
  'express': '4.15.3',
  'socket.io': '2.0.1',
  'node-sass': '4.5.3',
  'chokidar': '1.7.0',
});

Package.describe({
  name: 'wcj3:sass-hot-loader',
  version: '0.0.1-beta',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  debugOnly: true,
});

Package.onUse((api) => {
  api.versionsFrom('1.4.4.2');
  api.use('ecmascript');
  api.mainModule('client.js', 'client');
  api.mainModule('index.js', 'server');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('hot-reload-css');
  api.mainModule('sass-hot-loader-tests.js');
});
