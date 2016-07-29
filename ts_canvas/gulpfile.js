'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    tsfmt = require('gulp-tsfmt'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    Config = require('./gulpfile.config'),
    tsProject = tsc.createProject('tsconfig.json'),
    browserSync = require('browser-sync'),
    superstatic = require('superstatic'),
    jade = require('gulp-jade');


var config = new Config();
 
gulp.task('jade', function() {
  var YOUR_LOCALS = {
      "books": ["A", "B", "C"]
  };
 
  gulp.src('./src/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./src/'))
});



/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    
    var sourceTsFiles = [config.allTypeScript, //path to typescript files
                         config.libraryTypeScriptDefinitions]; //reference to library .d.ts files


    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tsResult.dts.pipe(gulp.dest(config.libraryDTS));
    
    console.log("compile-ts");
    
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
    var typeScriptGenFiles = [
                              config.tsOutputPath + '/**/*.js', // path to all JS files auto gen'd by editor
                              config.tsOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
                              '!' + config.tsOutputPath + '/lib'
                           ];

    // delete the files
    del(typeScriptGenFiles, cb);
});

gulp.task('fts', function () {
  gulp.src('src/app/**/*.ts')
    .pipe(tsfmt())
    .pipe(gulp.dest('src'));
});


var autoprefixerOptions = {
    browsers: ['last 3 versions', 'not ie <= 10']
};

gulp.task('sass', function () {
    return gulp
        .src(config.sassInput)
        .pipe(sass(config.sassOptions).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/content'));
});

gulp.task('watch', function () {
    gulp.watch('./src/content/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.jade', ['jade']);
    gulp.watch("./**/*.html").on('change', browserSync.reload);
    // gulp.watch([config.allTypeScript], ['compile-ts', 'ts-lint']);
});

gulp.task('watch-ts', function (cb) {
    gulp.watch([config.allTypeScript], ['ts-lint', 'compile-ts']);
    gulp.watch('./src/**/*.jade', ['jade']);
});

gulp.task('serve', ['sass', 'compile-ts', 'watch'], function () {
    process.stdout.write('Starting browserSync and superstatic...\n');
    browserSync({
        port: 3000,
        files: ['./src/index.html', './src/js/**/*.js', './src/content/scss/app.css'],
        injectChanges: true,
        logFileChanges: false,
        logLevel: 'silent',
        logPrefix: '',
        notify: true,
        reloadDelay: 0,
        server: {
            baseDir: './src',
            middleware: superstatic({
                debug: false
            })
        }
    });
});

gulp.task('default', ['ts-lint', 'compile-ts']);
