var host = require('../../configs/host');

module.exports = {
  facebook: {
    id: '1914286842131314',
    secret: '15de6083544e73e2e3d7f2adf7bf5141',
    callbackURL: 'http://' + host.domain + ':' + host.port + '/users/login/facebook/callback',
    //callbackURL: 'http://' + host.domain + '/users/login/facebook/callback',
  }
};
