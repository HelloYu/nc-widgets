var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var browserSync = require('browser-sync');


var source = [
	'ncTreetable/*js'
]

gulp.task('default', ['build','browser-sync']);

gulp.task('build',function(){
	gulp.src(source)
	
    .pipe(concat('nc-widgets.min.js'))
	.pipe(ngAnnotate())
    .pipe(uglify({mangle: true}))
	.pipe(gulp.dest('build'))

    gulp.src(source)
    .pipe(concat('nc-widgets.js'))
    .pipe(gulp.dest('build'))
})

gulp.task('browser-sync', function() {
    browserSync({
        files: "**",
        server: {
            baseDir: "./"
        }
    });
});
