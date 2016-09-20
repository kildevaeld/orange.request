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
/*
gulp.task('bundle', ['typescript'], () => {
    
    return gulp.src('./lib/index.js')
    .pipe(webpack({
        module: {
            loaders: [
                 { test: /fetch.js$/, loader: 'ignore-loader' },
            ]
        },
        output: {
            libraryTarget: 'umd',
            library: ['orange','request'],
            filename: 'orange.request.js'
        },
        externals: {
            orange: 'orange'
        },
    }))
    .pipe(gulp.dest('dist'))
    
});*/

var JsonpTemplatePlugin = require('./node_modules/webpack/lib/JsonpTemplatePlugin');
var FunctionModulePlugin = require('./node_modules/webpack/lib/FunctionModulePlugin');
var NodeTargetPlugin = require('./node_modules/webpack/lib/node/NodeTargetPlugin');
var NodeTemplatePlugin = require('./node_modules/webpack/lib/node/NodeTemplatePlugin');
var LoaderTargetPlugin = require('./node_modules/webpack/lib/LoaderTargetPlugin');

var webpackOutput = {
    library: ['orange', 'request'],
    libraryTarget: 'umd',
    filename: 'orange.request.js'
};

var webpackNode = {
    // do not include poly fills...
    console: false,
    process: false,
    global: false,
    buffer: false,
    __filename: false,
    __dirname: true
};


gulp.task('bundle', ['typescript'], () => {
    return gulp.src('lib/index.js')
        .pipe(webpack({
            output: webpackOutput,
            target: function (compiler) {
                compiler.apply(
                    new JsonpTemplatePlugin(webpackOutput),
                    new FunctionModulePlugin(webpackOutput),
                    new NodeTemplatePlugin(webpackOutput),
                    new NodeTargetPlugin(webpackNode),
                    new LoaderTargetPlugin('web')
                );
            },
            node: webpackNode,
            module: {
                loaders: [
                    { test: /\.json/, loader: 'json-loader' },
                    { test: /fetch.js$/, loader: 'ignore-loader' },
                    //{ test: /\.js$/, loader: 'babel', query: { presets: ['es2015'] } },

                ]
            },

            externals: {
                "orange": "orange",
            }
        })).pipe(gulp.dest('dist'))
});

gulp.task('watch', () => {
    return gulp.watch('./src/**/*.ts', ['bundle']);
});