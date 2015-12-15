'use strict';

var gulp=require('gulp'),
	sass=require('gulp-sass'),
	connect=require('gulp-connect');

var path={
	styles:{
		sass:'sass/**/*.sass',
		css:'css/'
	}
}

gulp.task('default', ['webserver', 'sass:watch']);

gulp.task('sass', function() {
	gulp.src(path.styles.sass)
	  .pipe(sass({
	  	sourceComments: 'normal',
        indentedSyntax: true,
        outputStyle: 'compressed',
        // sourceMap: true
	  })
	  .on('error', sass.logError))
	  .pipe(gulp.dest(path.styles.css))
	  .pipe(connect.reload());
});

gulp.task('sass:watch', function() {
	gulp.watch(path.styles.sass, ['sass']);
});

gulp.task('webserver', function() {
	connect.server({
		root:'',
		port:'8081',
		livereload:true
	});
});