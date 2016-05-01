// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-27 using
// generator-karma 1.0.0

var webpack = require('karma-webpack');
var path = require('path');
var specDir = path.join(__dirname, '/test/spec/unit');
var jsDir = path.join(__dirname, '/js');
var specFilePattern = specDir + '/**/*.js';
var jsFilePattern = jsDir + '/**/*.js';
var preprocessors = {};
var preprocessorActions = ['webpack', 'sourcemap']

preprocessors[specFilePattern] = preprocessorActions;
preprocessors[jsFilePattern] = preprocessorActions;

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
		devtool: 'source-map',
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
						specDir,
						jsDir
					]
				}
			],
			postLoaders: [{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['istanbul-instrumenter'],
				include: jsDir
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

