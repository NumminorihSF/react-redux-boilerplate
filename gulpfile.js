/**
 * Created by numminorihsf on 06.05.16.
 */
"use strict";

const { version: VERSION, buildDestination: dest } = require('./package.json');

const gulp = require('gulp');
const changed = require('gulp-changed');
const babel = require('gulp-babel');



gulp.task('copy', copy);

gulp.task('default', ['copy'], babelify);

function babelify(){
  return gulp.src(['src/**/*.js'], {base: 'src'})
    .pipe(changed(`${dest}`))
    .pipe(babel({
      ignore: /node_modules/
    }))
    .pipe(gulp.dest(`${dest}`));
}

function copy() {
  return gulp.src(['src/**/*.css', 'src/**/*.json', 'src/server/**/*', 'src/assets/**/*'], {base: 'src'})
    .pipe(changed(`${dest}`))
    .pipe(gulp.dest(`${dest}`));
}

