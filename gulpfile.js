const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const inlineSource = require('gulp-inline-source');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browserify = require('browserify');

const PATHS = {
    HTML: "src/**/*.html",
    SCSS: "src/**/*.scss",
    JS: "src/**/*.js",
    DIST: "dist/"
}

function buildHtml(cb) {
    gulp.src(PATHS.HTML)
        .pipe(gulp.dest(PATHS.DIST));
    cb();
}

function buildScss(cb) {
    gulp.src(PATHS.SCSS)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(PATHS.DIST))
        .pipe(cleanCss())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(PATHS.DIST))
    cb();
}


function build(cb) {
    gulp.series(buildHtml, buildScss)();
    cb();
}

exports.build = build;
exports.default = function (cb) {
    gulp.series(build)();
    cb()
}