
module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        predef: ["document", "console", "firebase"],
        esnext: true,
        globalstrict: true,
        globals: { angular: true }
      },
      files: ["./app/**/*.js"]
    },
    sass: {
      dist: {
        files: {
          "./styles/css/main.css": "./styles/sass/main.scss"
        }
      }
    },
    watch: {
      javascripts: {
        files: ["./app/**/*.js"],
        tasks: ["jshint"]
      },
      sass: {
        files: ["./styles/sass/**/*.scss"],
        tasks: ["sass"]
      }
    }
  });

  require("matchdep")
    .filterDev("grunt-*")
    .forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", ["jshint", "sass", "watch"]);
}