const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const inlineSrc = require('gulp-inline-source');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const gulpUtil = require('gulp-util');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const browser = require('browser-sync');
const browserSync = browser.create();

const PATH = {
    HTML: "src/**/*.html",
    SCSS: "src/**/*.scss",
    JS: "src/**/*.js",
    ASSETS: "src/**/*.{}",
    DIST: "dist/"
}

async function buildHtml(cb) {
    try {
        await new Promise((resolve, reject) => {
            gulp.src(PATH.HTML)
                .pipe(gulp.dest(PATH.DIST))
                .on('end', resolve)
                .on('error', reject);
        });

        gulp.src('dist/**/*.html')
            .pipe(inlineSrc())
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest(PATH.DIST));

        cb();
    } catch (error) {
        console.error(error);
    }
}

function buildScss(cb) {
    gulp.src(PATH.SCSS)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(PATH.DIST))
        .pipe(browserSync.stream());
    cb();
}

function buildJs(cb) {
    gulp.src(PATH.JS)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            mangle: {
                toplevel: true
            }
        }).on('error', gulpUtil.log))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(PATH.DIST))
        .pipe(browserSync.stream());
    cb();
}


function build(cb) {
    gulp.series(buildScss, buildJs, buildHtml)();
    cb();
}

exports.build = build;
exports.default = function (cb) {
    browserSync.init({
        server: 'dist/'
    })

    gulp.series(build)();
    gulp.watch(PATH.HTML, buildHtml).on('change', browserSync.reload);
    gulp.watch(PATH.SCSS, gulp.series(buildScss, buildHtml)).on('change', browserSync.reload);
    gulp.watch(PATH.JS, gulp.series(buildJs, buildHtml)).on('change', browserSync.reload);
    cb()
}