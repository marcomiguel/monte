var gulp = require('gulp'),
  jade = require('gulp-jade'),
  connect = require('gulp-connect'),
  open = require('gulp-open'),

  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),

  order = require("gulp-order"),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  rename = require("gulp-rename");

  require('es6-promise').polyfill();

var conf = {
  jade_path_watch: ['front/templates/*.jade', 'front/templates/**/*.jade'],
  jade_path: 'front/templates/*.jade',
  jade_path_dest: 'public/static/html',
  jade_pretty: true,

  sass_path_watch: ['front/styles/*.sass', 'front/styles/**/*.sass'],
  sass_main: 'front/styles/*.sass',
  sass_path: 'front/styles',
  sass_path_dest: 'public/static/css',

  js_path_watch: 'front/scripts/app.js',
  js_name_dest: 'rpp-app.js',
  js_path_dest: 'public/static/js',

  www_port: 3003,
  www_root: 'public/',
  www_browser: 'chrome'
}

gulp.task('connect', function () {
  connect.server({
    port: conf.www_port,
    root: conf.www_root
      /*livereload: true*/
  });
});

gulp.task('jade', function () {
  return gulp.src(conf.jade_path)
    .pipe(jade({
      pretty: conf.jade_pretty
    }).on('error', function (err) {
      var displayErr = gutil.colors.red(err);
      gutil.log(displayErr);
      gutil.beep();
      this.emit('end');
    }))
    .pipe(gulp.dest(conf.jade_path_dest))
    //.pipe(connect.reload());
});

gulp.task('sass_', function (a, b) {
  return gulp.src(conf.sass_main)
    .pipe(order([
      'front/styles/layouts/x.sass',
      'front/styles/**/*.sass'
    ], {
      base: '.'
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(conf.sass_path_dest));
  //.pipe(gulp.dest(conf.sass_path_dest + '/tmp'));
});

gulp.task('sass', function (a, b) {
  return gulp.src(conf.sass_main)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', function (err) {
      var displayErr = gutil.colors.red(err);
      gutil.log(displayErr);
      gutil.beep();
      this.emit('end');
    }))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(conf.sass_path_dest));
  //.pipe(gulp.dest(conf.sass_path_dest + '/tmp'));
});


gulp.task('js', function () {
  return gulp.src(conf.js_path_watch)
    /*.pipe(uglify())*/
    .pipe(rename(conf.js_name_dest))
    .pipe(gulp.dest(conf.js_path_dest));
});

gulp.task('watch', function () {
  gulp.watch(conf.jade_path_watch, ['jade']);
  gulp.watch(conf.sass_path_watch, ['sass']);
  gulp.watch(conf.js_path_watch, ['js']);
});

gulp.task('open', function () {
  gulp.src('')
    .pipe(open({
      app: conf.www_browser,
      uri: 'http://localhost:' + conf.www_port + '/static/html'
    }));
});

gulp.task('default', ['connect', 'watch', 'open']);
