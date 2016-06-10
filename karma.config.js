// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-27 using
// generator-karma 1.0.0

var webpack = require('karma-webpack');
var path = require('path');
var rootDir = path.join(__dirname);
var specDir = path.join(__dirname, '/test/spec/unit');
var libDir = path.join(__dirname, '/lib');
var extensionsDir = path.join(__dirname, '/extensions');
var helpersDir = path.join(__dirname, '/helpers');
var specFilePattern = specDir + '/**/*.js';
var libFilePattern = libDir + '/**/*.js';
var extensionsFilePattern = extensionsDir + '/**/*.js';
var helpersFilePattern = helpersDir + '/**/*.js';
var rootFilePattern = rootDir + '/complay*.js';
var configFilePattern = rootDir + '/default-config.js';
var preprocessors = {};
var preprocessorActions = ['webpack', 'sourcemap'];

preprocessors[rootFilePattern] = preprocessorActions;
preprocessors[configFilePattern] = preprocessorActions;
preprocessors[helpersFilePattern] = preprocessorActions;
preprocessors[extensionsFilePattern] = preprocessorActions;
preprocessors[specFilePattern] = preprocessorActions;
preprocessors[libFilePattern] = preprocessorActions;

module.exports = function(config) {
	'use strict';

	config.set({
	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,

	// base path, that will be used to resolve files and exclude
	basePath: './',

	// testing framework to use (jasmine/mocha/qunit/...)
	// as well as any additional frameworks (requirejs/chai/sinon/...)
	frameworks: [
		'mocha',
		'chai',
		'sinon'
	],

	// list of files / patterns to load in the browser
	files: [
		specFilePattern
	],

	// list of files / patterns to exclude
	exclude: [
	],

	// web server port
	port: 9876,


	// cli runner port
	runnerPort: 9100,

	preprocessors: preprocessors,

	reporters: ['spec', 'coverage'],

	coverageReporter: {
		dir: 'build/reports/coverage',
		reporters: [
			{ type: 'html', subdir: 'report-html' },
			{ type: 'lcov', subdir: 'report-lcov' },
			{ type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
		]
	},

	webpack: {
		resolve: {
			extensions: ['', '.js', '.jsx']
		},
		devtool: 'eval-source-map',
		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					loader: 'babel-loader',
					exclude: /(node_modules|bower_components)/,
					query: {
						presets: ['react', 'es2015']
					},
					include: [
						helpersDir,
						extensionsDir,
						specDir,
						libDir,
						configFilePattern
					]
				}
			],
			postLoaders: [{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['istanbul-instrumenter'],
				include: libDir
			}]
		}
	},

	webpackMiddleware: { noInfo: true },

	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	browsers: [
		'Chrome'
	],

	// Which plugins to enable
	plugins: [
		webpack,
		'karma-mocha',
		'karma-chai',
		'karma-coverage',
		'karma-sinon',
		'karma-phantomjs-launcher',
		'karma-chrome-launcher',
		'karma-firefox-launcher',
		'karma-ie-launcher',
		'karma-sourcemap-loader',
		'karma-spec-reporter'
	],

	// Continuous Integration mode
	// if true, it capture browsers, run tests and exit
	singleRun: false,

	colors: true,

	// level of logging
	// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
	logLevel: config.LOG_DEBUG,

	// Uncomment the following lines if you are using grunt's server to run the tests
	// proxies: {
	//   '/': 'http://localhost:9000/'
	// },
	// URL root prevent conflicts with the site root
	// urlRoot: '_karma_'
	});
};

