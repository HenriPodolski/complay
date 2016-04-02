module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				},
				exclude: ['jquery'],
				transform: [
					[
						'babelify',
						{
							'loose': 'all',
							'sourceMaps': true,
							'modules': 'common',
							'optional': []
						}
					]
			]},
			dist: {
				options: {
					browserifyOptions: {
						debug: false
					}
				},
				files: { 
					'./dist/conduit.es5.js': ['./js/conduit.es5.js'],
					'./dist/conduit.js': ['./js/conduit.js']
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
		},
		uglify: {
			options: {
				compress: {
					global_defs: {
						"DEBUG": false
					},
					dead_code: true
				},
				report: 'gzip',
				sourceMap: false,
				preserveComments: false
			},
			dist: {
				files: {
					'dist/conduit.es5.min.js': ['./dist/conduit.es5.js'],
					'dist/conduit.min.js': ['./dist/conduit.js']
				}
			}
		},
		watch: {
			scripts: {
				files: ['js/**/*.js'],
				tasks: ['browserify:dist', 'karma:continuous'],
				options: {
					spawn: false,
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'browserify:dist',
		'karma:continuous'
	]);
	grunt.registerTask('build', ['browserify:dist', 'uglify:dist']);
	grunt.registerTask('unit-test', ['karma:unit']);
};