/*!
 * reading-time
 * Copyright (c) 2013 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

module.exports = function(grunt) {
	// loads npm tasks
	require('load-grunt-tasks')(grunt);
	// time tasks
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
				'<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;' +
				' Licensed <%%= pkg.license %> */\n'
		},
		jshint: {
			options: grunt.file.readJSON('.jshintrc'),
			all: ['lib/*.js', 'test/*.js', 'Gruntfile.js']
		},
		mochaTest: {
			options: {
				reporter: 'spec',
				bail: true
			},
			all: ['test/*.js']
		}
	});

	// front tasks
	grunt.registerTask('test', ['jshint', 'mochaTest']);
};