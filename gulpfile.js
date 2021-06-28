'use strict'

var postcss = require('gulp-postcss')
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var sass = require('gulp-sass')(require('node-sass'));
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var del = require('del')
var concat = require('gulp-concat')

sass.compiler = require('node-sass');

var paths = {
  styles: {
    src: 'src/scss',
    dest: 'public/static/css'
  },
  scripts: {
    src: 'src/js',
    dest: 'public/static/js'
  }
};

function clean() {
  return del([ 'assets' ]);
}

function styles() {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];
  return gulp.src(paths.styles.src + '/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
  return gulp.src(paths.scripts.src + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
}

function watchFiles() {
  gulp.watch(paths.scripts.src + '/**/*.js', scripts)
  gulp.watch(paths.styles.src + '/**/*.scss', style)
}

var style = gulp.series(styles)
var script = gulp.parallel(scripts)

var defaults = gulp.series(clean, style, script)

exports.watch = watchFiles
exports.default = defaults
