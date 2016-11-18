/**
 * grunt-nunjucks-2-html
 * https://github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Copyright (c) 2014 Vit Karpov
 * Licensed under the MIT license.
 */

'use strict'

const nunjucks = require('nunjucks')
const chalk = require('chalk')
const path = require('path')

module.exports = function (grunt) {
  grunt.registerMultiTask('nunjucks', `Renders Nunjucks' templates to HTML`, function () {
    // Declare async task
    const completeTask = this.async()

    // Get options and set defaults
    // @note We're using `undefined` to fallback to Nunjucks' default settings
    const options = this.options({
      paths: '',
      configureEnvironment: false,
      data: false,
      preprocessData: false
    })

    // Finish task if no files specified
    if (!this.files.length) {
      grunt.log.error('No files specified.')

      // Finish task — nothing we can do without specified files
      return completeTask()
    }

    // Warn in case of undefined data
    if (!options.data) {
      grunt.log.error(`Template's data is empty. Guess you've forget to specify data option.`)
    }

    // Arm Nunjucks
    const env = nunjucks.configure(options.paths, {
      watch: false,
      autoescape: options.autoescape,
      throwOnUndefined: options.throwOnUndefined,
      trimBlocks: options.trimBlocks,
      lstripBlocks: options.lstripBlocks,
      noCache: true,
      tags: options.tags
    })

    // Pass configuration to Nunjucks if specified
    if (typeof options.configureEnvironment === 'function') {
      options.configureEnvironment.call(this, env, nunjucks)
    }

    // Get number of files
    const totalFiles = this.files.length
    // Start counter for number of compiled files
    let countCompiled = 0

    // Run compilation asynchronously, wait for finish, then print results and complete task
    const task = new Promise((resolve, reject) => {
      // Iterate over all files' groups
      this.files.forEach(file => {
        // Set destination
        let filedest = file.dest

        // Check whether there are any source files
        if (!file.src.length) {
          grunt.log.error(`No source files specified for ${chalk.cyan(filedest)}.`)

          // Skip to next file — nothing we can do without specified source files
          return reject('For some destinations were not specified source files.')
        }

        // Iterate over files' sources
        file.src.forEach(src => {
          // Construct absolute path to file for Nunjucks
          let filepath = path.join(process.cwd(), src)

          let data = {}
          // Clone data
          for (let i in options.data) {
            if (options.data.hasOwnProperty(i)) {
              data[i] = options.data[i]
            }
          }

          // Preprocess data
          if (options.data && typeof options.preprocessData === 'function') {
            data = options.preprocessData.call(file, data)
          }

          // Asynchronously render templates with configurated Nunjucks environment
          // and write to destination
          env.render(filepath, data, (error, result) => {
            // Catch errors, warn
            if (error) {
              grunt.log.error(error)
              grunt.fail.warn('Failed to compile one of the source files.')
              grunt.log.writeln()

              // Prevent writing of failed to compile file, skip to next file
              return reject('Failed to compile some source files.')
            }

            // Write rendered template to destination
            grunt.file.write(filedest, result)

            // Debug process
            grunt.verbose.ok(`File ${chalk.cyan(filedest)} created.`)
            grunt.verbose.writeln()

            countCompiled++
          })
        })
      })

      // Finish Promise
      resolve()
    })

    // Print any errors from rejects
    task.catch(error => {
      if (error) {
        grunt.log.writeln()
        grunt.log.error(error)
        grunt.log.writeln()
      }
    })

    // Log number of processed templates
    task.then(success => {
      // Log number of processed templates
      let logType = (countCompiled === totalFiles) ? 'ok' : 'error'
      let countCompiledColor = (logType === 'ok') ? 'green' : 'red'
      grunt.log[logType](`${chalk[countCompiledColor](countCompiled)}/${chalk.cyan(totalFiles)} ${grunt.util.pluralize(totalFiles, 'file/files')} compiled.`)
    })

    // Finish async task
    completeTask()
  })
}
