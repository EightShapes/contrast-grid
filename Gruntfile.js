module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var currentVersion = require('./package.json').version;

    grunt.initConfig({
        sasslint: {
            options: {
                configFile: '.sass-lint.yml',
            },
            target: ['src/styles/*.scss']
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/styles',
                    src: '*.scss',
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
            map: true, // inline sourcemaps
            processors: [
                require('autoprefixer')({browsers: ['last 2 versions', 'iOS 8']}) // add vendor prefixes
                ]
            },
            project: {
                src: 'dist/project.css'
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    'dist/**/*.html',
                    'dist/**/*.css',
                    'dist/**/*.js'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: 'dist'
                }
            }
        },

        concat: {
            // Concatenate nunjucks components macro files
            component_macros: {
                options: {
                    banner: '{# DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten #}\n'
                },
                src: ['src/components/**/*.njk', '!src/components/project.njk'],
                dest: 'src/components/project.njk'
            }
        },

        // Compile nunjucks doc src files to html
        nunjucks: {
            options: {
                configureEnvironment: function(env, nunjucks) {
                    // 
                },
                data: grunt.file.exists('src/data.json') ? grunt.file.readJSON('src/data.json') : {},
                paths: ['src/components', 'src/templates', 'src']
            },
            render: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: '**/*.njk',
                        dest: 'dist',
                        ext: '.html'
                    }
                ]
            }
        },

        watch: {
            styles: {
                files: 'src/styles/*.scss',
                tasks: ['styles']
            },
            nunjucks_render: {
                files: ['src/**/*{.njk,.md}', '!src/components/project.njk'],
                tasks: 'markup'
            },
            // svg: {
            //     files: ['src/library/base/icons/**/*.svg', 'src/library/docs/icons/**/*.svg'],
            //     tasks: ['svg']
            // },
            // project_assets: {
            //     files: ['releases/latest/project/**/*'],
            //     tasks: 'newer:copy:project_to_dist'
            // },
            // package_json: {
            //     files: 'package.json',
            //     tasks: ['set_project_data'] //re-render markup since it may reference the version number from package.json
            // },
            // tokens: {
            //     files: 'src/library/base/tokens.yaml',
            //     tasks: ['process_tokens_file']
            // },
            // nunjucks_content: {
            //     files: ['src/docs/data/**/*.json', '!src/docs/data/auto-generated/all_data.json'], //If any of the content json files change (auto-generated or manually updated), re-render markup
            //     tasks: ['set_nunjucks_global_data', 'markup']
            // },
            // project_images: {
            //     files: ['src/library/base/images/**/*'],
            //     tasks: 'newer:copy:project_images_to_release'
            // },
            // fonts: {
            //     files: 'src/library/base/fonts/**/*',
            //     tasks: 'webfonts'
            // }
        },
    });
    grunt.registerTask('styles', ['sasslint', 'sass', 'postcss']);
    grunt.registerTask('markup', ['concat:component_macros', 'nunjucks']);
    grunt.registerTask('build-dist', ['styles', 'markup']);
    grunt.registerTask('dev', ['build-dist', 'browserSync', 'watch']);


    grunt.registerTask('default', ['dev']);
};

