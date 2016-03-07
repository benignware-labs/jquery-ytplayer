module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  var
    // Read package information
    pkg = grunt.file.readJSON('package.json');
  
  grunt.initConfig({
    pkg: pkg,
    clean: {
      dist: "dist"
    }, 
    copy: {
      dist: {
        expand: true, 
        cwd: 'src/js', 
        src: ['**/*'], 
        dest: 'dist/js'
      }
    }, 
    // Lint definitions
    jshint: {
      all: ["src/**/*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/less/',
          src: ['**/jquery.*.less'],
          dest: 'dist/css/',
          rename: function(dest, path, opts) {
            return dest + path.replace(/\.less$/, '.css');
          }
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: ['**/*.css'],
          dest: 'dist/css/',
          rename: function(dest, path) {
            return dest + path.replace(/\.css$/, '.min.css');
          }
        }]
      }
    },
    qunit: {
      options: {
        timeout: 10000,
        '--web-security': 'no',
        '--local-to-remote-url-access': 'yes',
        '--ignore-ssl-errors' : 'true' 
      },
      all: ['test/**/*.html']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'dist/',
          rename: function(dest, path) {
            return dest + path.replace(/\.js$/, '.min.js');
          }
        }]
      }
    },
    watch: {
      dist: {
        files: ['src/**/*.*'],
        tasks: ['build']
      }
    }
  });
  
  grunt.registerTask('test', ['jshint']); // FIXME: phantomjs iframe issue forces to leave out test
  
  grunt.registerTask('build', ['clean', 'copy:dist', 'uglify:dist', 'less', 'cssmin']);
  
  grunt.registerTask('default', ['test']);
  
};