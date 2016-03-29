// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-27 using
// generator-karma 1.0.0

module.exports = function(config) {
	'use strict';

	config.set({
	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,

	// base path, that will be used to resolve files and exclude
	basePath: '',

	// testing framework to use (jasmine/mocha/qunit/...)
	// as well as any additional frameworks (requirejs/chai/sinon/...)
	frameworks: [
		'mocha',
		'chai',
		'sinon',
		'browserify'
	],

	// list of files / patterns to load in the browser
	files: [
		'../../js/**/*.js',
		'../spec/unit/**/*.js'
	],

	// list of files / patterns to exclude
	exclude: [
	],

	// web server port
	port: 9876,


	// cli runner port
	runnerPort: 9100,

	watchify: {
		poll: true
	},

	browserify: {
		debug: true,
		transform: [
			[
				'babelify',
				{
					loose: 'all',
					modules: 'common',
					optional: []
				}
			]
		]
	},

	preprocessors: {
		'../../js/**/*.js': ['browserify'],
		'../spec/unit/**/*.js': ['browserify']
	},

	reporters: ['mocha'],

	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	browsers: [
		"Chrome"
	],

	// Which plugins to enable
	plugins: [
		"karma-mocha",
		"karma-chai",
		"karma-sinon",
		"karma-browserify",
		"karma-phantomjs-launcher",
		"karma-chrome-launcher",
		"karma-firefox-launcher",
		"karma-ie-launcher",
		"karma-mocha-reporter"
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

