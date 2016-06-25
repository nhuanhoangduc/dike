var gulp = require('gulp');
var runSequence = require('run-sequence');

// lint
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// minify js
var minify = require('gulp-minify');

// concat files
var concat = require('gulp-concat');

// node mon
nodemon = require('gulp-nodemon');

// lint server js files
gulp.task('jslint Server', function() {
  return gulp
    .src('./Server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, { beep: true }));
});


// lint client js files
gulp.task('jslint Client', function() {
  gulp
    .src('./Client/modules/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, { beep: true }));
});


// minify client js files
gulp.task('minify client js files', function() {
  gulp
    .src('./Client/modules/**/*.js')
    .pipe(concat('app.js'))
    .pipe(minify())
    .pipe(gulp.dest('./Client/production'));
});



gulp.task('start dev', function() {
  return nodemon({
    script: './Server/server.js',
    args: ['development'],
  });
});

gulp.task('dev', function(done) {
  console.log('Start gulp development');

  runSequence(
    'jslint Server',
    'jslint Client',
    'minify client js files',
    done
  );

});
