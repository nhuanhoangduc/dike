var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

nodemon = require('gulp-nodemon')

// lint server js files
gulp.task('jslint Server', function() {
  return gulp.src('./Server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, { beep: true }));
});

// lint client js files
gulp.task('jslint Client', function() {
  return gulp.src('./Client/modules/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, { beep: true }));
});

gulp.task('start dev', function() {
  return nodemon({
    script: './Server/server.js',
    args: ['development'],
  });
});

gulp.task('dev', ['jslint Server', 'jslint Client', 'start dev']);
