'use strict';

var path = require('path');

// configurable paths
var yeomanConfig = {
  app: 'app',
  dist: 'dist'
};

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    yeoman: yeomanConfig,

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [ '.tmp', '<%= yeoman.dist %>' ]
          }
        ]
      }
    },

    eslint: {
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/{,**/}*.js'
      ]
    },

    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        srcStrip: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>',
        flow: {
          steps: {
            js: ['concat'],
            css: ['concat', 'cssmin']
          },
          post: {}
        }
      }
    },

    cssmin: {
      options: {
        aggressiveMerging: true,
        keepBreaks: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp',
            src: '**/*.css',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {},
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['{,*/}*.html'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // Put files not handled in other tasks here
    ///////////////////////////////////////////////
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [ '*.{ico,png,txt}' ]
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.merged %>',
        dest: '.tmp/',
        src: '**/*.css'
      }

    },

    // uglify js files
    ///////////////////////////////////////
    uglify: {
      options: {
        sourceMap: true,
        mangle: {},
        compress: {},
        beautify: false,
        banner: '/* Time: <%= yeoman.timestamp %> */'
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '**/*.js',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // hash files
    ///////////////////////
    filerev: {
      options: {},
      dist: {
        src: [
          '<%= yeoman.dist %>/**/*.js',
          '<%= yeoman.dist %>/**/*.css',
          '<%= yeoman.dist %>/_shared/fonts/*.{css,otf,eot,ttf,woff,svg}',
          '<%= yeoman.dist %>/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/{,**/}*.html'],
      css: ['<%= yeoman.dist %>/**/*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },

    s3: {
      options: {
        bucket: grunt.option('bucket'),
        region: grunt.option('region') || 'eu-west-1',
        cache: false,
        gzip: false
      },
      resources: {
        options: {
          headers: {
            CacheControl: 1296000
          }
        },
        cwd: '<%= yeoman.dist %>',
        src: ['**', '!**/*.html'] // everything except html files
      },
      html: {
        options: {
          headers: {
            CacheControl: 'no-cache, no-store, max-age=0, must-revalidate'
          }
        },
        cwd: '<%= yeoman.dist %>',
        src: '**/*.html'
      }
    }

  });

  grunt.registerTask('build', [
    'clean',
    'eslint',           // code quality check
    'useminPrepare',    // prepares build steps for html blocks
    'concat',           // concatinates files and moves them to dist
    'cssmin',           // minifies css in tmp and moves to dist
    'htmlmin',          // minifies html and moves them to dist
    'copy:dist',        // copies previously unhandled files to dist
    'uglify',           // minifies & uglifies js files in dist
    'filerev',          // hashes js/css/img/font files in dist
    'usemin'
  ]);

  grunt.registerTask('deploy', function () {
    // Usage: grunt deploy --bucket=<bucket> [--region=<region>]
    // For configuration of credentials see http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
    // e.g. Loaded from the shared credentials file (~/.aws/credentials)
    //      Loaded from Environment Variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
    grunt.task.run([
      's3:resources',
      's3:html'
    ]);
  });

  grunt.registerTask('default', [
    'clean',
    'build'
  ]);
};
