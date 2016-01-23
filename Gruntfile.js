module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				}
			},
			dist: {
				options: {
					browserifyOptions: {
						debug: false
					},
					exclude: ['jquery', 'underscore'],
					transform: [
						[
							'babelify',
							{
								'loose': 'all',
								'sourceMaps': true,
								'modules': 'common',
								'optional': []
							}
						],[
							'aliasify', 
							{
								aliases: {
									'backbone': 'exoskeleton'
								},
								global: true, // By default Aliasify only runs against your code (not node_modules). This flag tells it to remap third-party code too.
								verbose: true
							}
					]
				]},
				files: { 
					'./dist/conduit.js': ['./js/conduit.js'],
					'./examples/conduit.js': ['./js/conduit.js']
				}
			}
		},
		karma: {
			unit: {
				configFile: './test/config/karma.conf.js'
			},
			continuous: {
				configFile: './test/config/karma.ci.conf.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('default', [
		'browserify:dist',
		'karma:continuous'
	]);
	grunt.registerTask('build', ['browserify']);
	grunt.registerTask('unit-test', ['karma:unit']);
};