var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

var source = [
	'ncListBox/*js'
]
gulp.task('default', ['build']);

gulp.task('build',function(){
	gulp.src(source)
	.pipe(uglify())
	.pipe(concat('nc-widgets.js'))
	.pipe(gulp.dest('build'))
})