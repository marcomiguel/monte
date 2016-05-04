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
  jade_path_watch: ['src/templates/*.jade', 'src/templates/**/*.jade'],
  jade_path: 'src/templates/*.jade',
  jade_path_dest: 'html',

  sass_path_watch: ['src/styles/*.sass', 'src/styles/**/*.sass'],
  sass_main: 'src/styles/*.sass',
  sass_path: 'src/styles',
  sass_path_dest: 'css',

  js_path_watch: 'src/scripts/app.js',
  js_name_dest: 'rpp-app.js',
  js_path_dest: 'js',

  www_port: 3004,
  www_root: '../',
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
      pretty: true
    }).on('error', function (err) {
      var displayErr = gutil.colors.red(err);
      gutil.log(displayErr);
      gutil.beep();
      this.emit('end');
    }))
    .pipe(gulp.dest(conf.jade_path_dest))
    //.pipe(connect.reload());
});


gulp.task('sass', function (a, b) {
  return gulp.src(conf.sass_main)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', function (err) {
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
    .pipe(uglify({preserveComments : 'license'}))
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
