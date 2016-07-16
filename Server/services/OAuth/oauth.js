var host = require('../../configs/host');

module.exports = {
  facebook: {
    id: '1914286842131314',
    secret: '15de6083544e73e2e3d7f2adf7bf5141',
    token: '1914286842131314|UHVM5Ba95gHnaCQ4150aIhpwpcQ',
    callbackURL: 'http://localhost:3000/users/login/facebook/callback',
    //callbackURL: 'http://' + host.domain + '/users/login/facebook/callback',
  }
};
