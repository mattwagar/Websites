// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();


//Sass conversions
var input = './**/*.scss';
var output = './';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 3 versions', 'not ie <= 10']
};


gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output))
    .pipe(browserSync.stream());
});


gulp.task('jshint', function () {
    return gulp
        .src([
            './src/**/*.js',
            './*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }));
});

gulp.task('default', ['sass'] , function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch('./content/**/*.scss', ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);

});
