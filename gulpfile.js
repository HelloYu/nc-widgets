var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

var source = [
    'module.js',
	'ncTreetable/*js'
]
gulp.task('default', ['build']);

gulp.task('build',function(){
	gulp.src(source)
	.pipe(uglify())
	.pipe(concat('nc-widgets.min.js'))
	.pipe(gulp.dest('build'))

    gulp.src(source)
    .pipe(concat('nc-widgets.js'))
    .pipe(gulp.dest('build'))
})