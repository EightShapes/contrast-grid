module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    const currentVersion = require('./package.json').version;
    const version_stamp = 'EightShapes Contrast Grid v' + currentVersion;


    grunt.initConfig({
        sasslint: {
            options: {
                configFile: '.sass-lint.yml',
            },
            target: ['src/styles/*.scss']
        },
        sass: {
            options: {
                includePaths: ['src/components']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/styles',
                    src: '*.scss',
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            },
            grid_itself: {
                files: [{
                    src: 'src/components/contrast_grid/contrast_grid.scss',
                    dest: 'dist/css/contrast_grid.css'
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
            },
            // Copy/Concatenate Component JS Files
            component_scripts: {
                options: {
                    banner: '/* ' + version_stamp + ' */\n' + '/* DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten */\n'
                },
                src: ['src/components/**/*.js', 'src/scripts/project.js'],
                dest: 'dist/scripts/eightshapes-contrast-grid.js'
            }
        },

        // Compile nunjucks doc src files to html
        nunjucks: {
            options: {
                configureEnvironment: function(env, nunjucks) {
                    // 
                },
                data: grunt.file.exists('src/data.json') ? grunt.file.readJSON('src/data.json') : {},
                paths: ['src/components', 'src/templates', 'src', 'dist/css']
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

        copy: {
            vendor_assets: {
                expand: true,
                src: [
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/jquery-ui-dist/jquery-ui.min.js',
                    'node_modules/clipboard/dist/clipboard.min.js',
                    'node_modules/prismjs/prism.js',
                    'node_modules/prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js',
                    'node_modules/prismjs/plugins/keep-markup/prism-keep-markup.min.js',
                    'node_modules/prismjs/plugins/-whitespace/prism-normalize-whitespace.min.js',
                    'node_modules/prismjs/themes/prism.css',
                    'node_modules/js-beautify/js/lib/beautify.js',
                    'node_modules/js-beautify/js/lib/beautify-html.js',
                    'node_modules/js-beautify/js/lib/beautify-css.js',
                    'node_modules/svg4everybody/dist/svg4everybody.min.js',
                    'src/scripts/dragtable.js'
                ],
                flatten: true,
                dest: 'dist/scripts/'
            } 
        },

        /* svgmin ********************************************************/
        /* SVG Optimization, remove inline styles, strip out fill attributes 
        /* added by Illustrator, etc.
        /******************************************************************/
        svgmin: {
            options: {
                plugins: [
                    {
                        removeAttrs: {
                            attrs: ['fill']
                        }
                    },
                    {
                        removeStyleElement: true
                    }
                ]
            },
            // Optimize icons
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/svg/',
                        src: '*.svg',
                        dest: 'src/svg/'
                    }
                ]
            }
        },

        /* svg_sprite ********************************************************/
        /* SVG Sprite generation
        /* Enables the <use> SVG method to reference individual icons:
        /* https://css-tricks.com/svg-use-with-external-reference-take-2/
        /******************************************************************/
        svg_sprite: {
            icons: {
                expand: true,
                cwd: 'src/svg/',
                flatten: true,
                src: ['*.svg'],
                dest: 'dist/svg',
                svg: {
                    namespaceIDs: false
                },
                options: {
                    mode: {
                        symbol: {
                            dest: '.',
                            sprite: 'contrast-grid.svg',
                            example: false
                        }
                    }
                }
            }
        },

        watch: {
            styles: {
                files: ['src/styles/*.scss', 'src/components/**/*.scss'],
                tasks: ['styles']
            },
            scripts: {
                files: 'src/**/*.js',
                tasks: ['concat:component_scripts']
            },
            nunjucks_render: {
                files: ['src/**/*{.njk,.md}', 'dist/css/contrast_grid.css', '!src/components/project.njk'],
                tasks: 'markup'
            },
            svg: {
                files: ['src/svg/*.svg'],
                tasks: ['svg']
            },
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
    grunt.registerTask('build-dist', ['copy:vendor_assets', 'concat:component_scripts', 'styles', 'markup']);
    grunt.registerTask('dev', ['build-dist', 'browserSync', 'watch']);

    /* svg ********************************************************/
    /* Minify/Optimize individual SVG files (Comet Components AND 
    /* DOC-ONLY compoents), generate SVG sprite, add a version stamp 
    /* to the sprite, copy the icon file names to icons.json,
    /* format icons.json with propert indentation
    /*
    /******************************************************************/
    grunt.registerTask('svg', ['svgmin', 'svg_sprite']);

    grunt.registerTask('default', ['dev']);
};

