var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var browserSync = require('browser-sync');
var cssmin = require('gulp-cssmin');

var source = {
    js: ['widgets/**/*.js'],
    css: ['widgets/**/*.css']
}

gulp.task('default', ['build', 'browser-sync']);

gulp.task('build', function() {
    gulp.src(source.js)

    .pipe(concat('nc-widgets.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: true }))
        .pipe(gulp.dest('build'))

    gulp.src(source.js)
        .pipe(concat('nc-widgets.js'))
        .pipe(gulp.dest('build'))

    // css
    gulp.src(source.css)
        .pipe(concat('nc-widgets.min.css'))
        .pipe(cssmin())
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
