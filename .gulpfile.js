"use strict";
const { version: VERSION, buildDestination: dest } = require('./package.json');
const babelConfig = JSON.parse(require('fs').readFileSync('./.babelrc', {encoding:'utf8'}));

const gulp = require('gulp');
const changed = require('gulp-changed');
const babel = require('gulp-babel');

babelConfig.ignore = /node_modules/;

gulp.task('copy', copy);

gulp.task('default', ['copy']);

function babelify(){
    return gulp.src(['src/**/*.js'], {base: 'src'})
        //.pipe(changed(`${dest}`))
        .pipe(babel(babelConfig))
        .pipe(gulp.dest(`${dest}`));
}

function copy() {
    return gulp.src([
        'src/assets/**/*'
    ], {base: 'src'})
        .pipe(changed(`${dest}`))
        .pipe(gulp.dest(`${dest}`));
}

