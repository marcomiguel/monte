/* Config Gulp Task */
var fs = require('fs');
var chalk = require('chalk');
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    gutil = require('gulp-util'),
    copy = require('gulp-contrib-copy'),
    jslint = require('gulp-jslint');
var winInstaller = require('electron-windows-installer');

//Vars
var path = {
    jade: ['jade/**/*.jade'],
    html: '/',
    sass: 'sass/**/*.sass',
    css: 'css/',
    js: 'js/**/*.js',
    jsmin_input: 'controller/publicador/*.js',
    jsmin_output: 'controller/publicador/min/',
    htmlwatch: './*.html',
    csswatch: './css/*.css'
},
CONST = {
    PORT : 9090,
    ROOT : ''
};

//Livereload - Watch Taks HTML - CSS
gulp.task('connect', function(){
    connect.server({
        root: CONST.ROOT,
        port: CONST.PORT/*,
        livereload: true*/
    });
});

//Jade
gulp.task('jade', function() {
    return gulp.src(path.jade)
    .pipe(jade({
        pretty: true
    }).on('error', gutil.log))
    .pipe(gulp.dest(path.html))
    .pipe(connect.reload());
});

//Sass
gulp.task('sass', function () {
    gulp.src(path.sass)
    .pipe(sass({
        sourceComments: 'normal',
        indentedSyntax: true,
        outputStyle: 'compressed',
        //outputStyle: 'expanded',
        sourceMap: true
    }).on('error', gutil.log))
    .pipe(gulp.dest(path.css))
    .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src(path.htmlwatch)
    .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src(path.csswatch)
    .pipe(connect.reload());
});

//Watch SASS JADE
gulp.task('watch', function () {
    //gulp.watch(path.jade, ['jade']);
    gulp.watch(path.sass, ['sass']);
    //gulp.watch([path.htmlwatch], ['html']);
    //gulp.watch([path.csswatch], ['css']);
});

//Watch Server, JADE, SASS
//gulp.task('default', ['connect','watch']);
gulp.task('default', ['connect','watch']);


//Min js
gulp.task('minjs', function() {
    var option, i = process.argv.indexOf('-d');
    if(i>-1) {
        option = process.argv[i+1];
    }
    if(option){
        try {
            var stats = fs.lstatSync(option);
            // Is it a directory?
            if (stats.isDirectory()) {
                // Yes it is
                //gulp.src(path.jsmin_input)
                gulp.src(option + '*.js')
                  .pipe(uglify({
                      mangle : false,
                      output: { beautify: false }
                  }))
                  .pipe(rename({suffix : '.min'}))
                  //.pipe(gulp.dest(path.jsmin_output))
                  .pipe(gulp.dest(option + 'min/'))
            }
        }
        catch (e) {
            console.error(chalk.red.bgWhite('Error Task minjs :'));
            console.error(chalk.white.bgBlue('[DIRECTORY] UNKNOW'));
            console.log(chalk.white.bgBlue('gulp minjs -d [DIRECTORY]'));
            process.exit(1);
        }
    }else{
        console.error(chalk.red.bgWhite('Error Task minjs :'));
        console.log(chalk.white.bgBlue('gulp minjs -d [DIRECTORY]'));
        process.exit(1);
    }
});

//COPY BUILD
gulp.task('copy', function() {
    gulp.src('/**/*')
        .pipe(copy())
        .pipe(gulp.dest('build/'));
});

//Concat
gulp.task('concat', function() {
    gulp.src(['js/lib/plugin1.js', 'js/lib/plugin2.js', 'js/lib/plugin3.js'])
        .pipe(concat('js/rpp_utils.js'))
        .pipe(gulp.dest('public/js/'))
});

//https://www.npmjs.com/package/electron-windows-installer
gulp.task('create-windows-installer', function(done) {
  winInstaller({
    appDirectory: './build/win32',
    outputDirectory: './release',
    arch: 'ia32'
  }).then(done).catch(done);
});
