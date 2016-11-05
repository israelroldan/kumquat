'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');

function scripts(watch) {
    var bundler = watchify(browserify('./src/kumquat.js', { debug: true }).transform(babel.configure({
        presets: ["es2015"]
    })));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('kumquat.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

gulp.task('sass', function() {
    return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function() { return scripts(); });
gulp.task('watch-scripts', function() { return scripts(true); });

gulp.task('watch', ['sass', 'scripts'], function () {
    connect.server();
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.js', ['watch-scripts']);
});

gulp.task('default', ['watch']);