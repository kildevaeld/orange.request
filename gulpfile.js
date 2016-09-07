'use strict';

const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    webpack = require('webpack-stream'),
    merge = require('merge2'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel');


const project = tsc.createProject('./tsconfig.json', {
    declaration: true
});
gulp.task('typescript', () => {
    let result = project.src()
    .pipe(tsc(project))
    
    let js = result.js
    .pipe(babel({
        presets: ['es2015']
        }))
    .pipe(gulp.dest('./lib'));
    
    let dts = result.dts.pipe(gulp.dest('./lib'));
    
    return merge([js,dts]);
    
});

gulp.task('uglify', ['bundle'], () => {
    return gulp.src('./dist/orange.request.js')
    .pipe(uglify())
    .pipe(rename('orange.request.min.js'))
    .pipe(gulp.dest('dist'));
})

gulp.task('default', ['bundle', 'uglify']);

gulp.task('bundle', ['typescript'], () => {
    
    return gulp.src('./lib/index.js')
    .pipe(webpack({
        
        output: {
            libraryTarget: 'umd',
            library: ['orange','request'],
            filename: 'orange.request.js'
        },
        externals: {
            orange: 'orange'
        }
    }))
    .pipe(gulp.dest('dist'))
    
});

gulp.task('watch', () => {
    return gulp.watch('./src/**/*.ts', ['bundle']);
});