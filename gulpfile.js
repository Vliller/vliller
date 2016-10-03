var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');

var paths = {
  sass: './scss/**/*.scss',
  templates: './src/app/**/*.html'
};

gulp.task('default', ['sass', 'templates', 'compress']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({errLogToConsole: true}))
    .on('error', sass.logError)
    .pipe(cleanCSS({keepSpecialComments: 0}))
    // .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('templates', function (done) {
  gulp.src(paths.templates)
    .pipe(templateCache({standalone: true}))
    .pipe(gulp.dest('./.tmp/'))
    .on('end', done);
});

gulp.task('compress', ['sass', 'templates'], function (done) {
  gulp.src('./src/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.html', htmlmin()))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templates, ['templates']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
