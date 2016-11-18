var path = require('path')

module.exports = function (grunt) {
  grunt.initConfig({
    jscs: {
      src: ['tasks/nunjucks.js', 'tests/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    nunjucks: {
      options: {
        fooName: 'foo',
        data: grunt.file.readJSON('tests/data.json'),
        preprocessData: function (data) {
          data.page = path.basename(this.src[0], '.html')
          return data
        },
        configureEnvironment: function (env) {
          var options = this.options()
          env.addGlobal(options.fooName, 'bar')
        }
      },
      render: {
        files: {
          'tests/base/_output.html': ['tests/base/input.html'],
          'tests/autoescape/_output.html': ['tests/autoescape/input.html'],
          'tests/leaking-vars/_output1.html': ['tests/leaking-vars/input1.html'],
          'tests/leaking-vars/_output2.html': ['tests/leaking-vars/input2.html']
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-jscs')
  grunt.loadTasks('tasks/')

  grunt.registerTask('test', ['nunjucks'])
}
