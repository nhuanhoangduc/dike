var fs = require('fs');
var path = require('path');
var walk = require('walk');

var files = [];
var walker = walk.walk(path.join(__dirname, '../../Client', 'modules'), {
  followLinks: false
});

walker.on('file', function(root, stat, next) {
  // Add this file to the list of files
  if (stat.name !== 'app.js' && stat.name.indexOf('.html') < 0) {
    var dir = '/' + path.basename(root) + '/' + stat.name;
    files.push(dir);
  }
  next();
});

walker.on('end', function() {
  console.log('Loaded all js files');
});


module.exports = {
  getJsFiles: files
};
