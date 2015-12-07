/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */


'use strict';

var ngrok = require('ngrok');

module.exports = function(grunt) {

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Grunt configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /** JavaScript **/
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },

            uses_defaults: ['src/**/*.js'], //, 'src/**/*.js'],

            with_overrides: {
                options: {
                    curly: false,
                    undef: true
                },
                files: {
                    src: ['src/**/*.js', 'src/**/*.js']
                }
            },

            beforeconcat: ['src/static/scripts/script.js'],
            afterconcat: ['src/static/scripts/script.concat.js']
        },

        /** Concat **/
        concat: {
            index: {
                src: ['src/static/styles/style.css'],
                dest:'src/static/styles/style.css',
                options: {
                    separator: ''
                }
            },
            pizza: {
                src: ['src/views/pizza/css/style.css', 'src/views/pizza/css/bootstrap-grid.css'],
                dest:'src/views/pizza/css/combined.css',
                options: {
                    separator: ''
                }
            }
        },

        codekit: {
            dev: {
                files: {
                    'src/static/scripts/script.concat.js': ['src/static/scripts/script.js', 'src/static/scripts/app.js']
                }
            }
        },

        uglify: {
            options: {
                mangle: false,
                sourceMap: false
            },
            dist: {
                files: {
                    'dist/static/scripts/script.js': ['src/static/scripts/script.concat.js']
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            },
        },


        /** CSS **/

        sass: {
            dev: {
                options: {
                    //outputStyle: 'compressed',
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/static/styles/',
                    src: ['style.scss', 'print.scss', 'under480.scss'],
                    dest: 'src/static/styles',
                    ext: '.css'
                }]
            },

            dist: {
                options: {
                    //outputStyle: 'compressed',
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/static/styles/',
                    src: ['style.scss', 'print.scss', 'under480.scss'],
                    dest: 'dist/static/styles',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                //browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%'],
                browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
            },
            dev: {
                expand: true,
                flatten: true,
                src: 'src/static/styles/*.css',
                dest: 'src/static/styles'
            },
            dist: {
                expand: true,
                flatten: true,
                src: 'dist/static/styles/*.css',
                dest: 'dist/static/styles'
            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/static/styles',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/static/styles',
                    ext: '.css'
                }]
            }
        },

        /** Images **/

        responsive_images: {
            dev: {
                options: {
                    engine: 'im',
                    sizes: [
                        {
                            name: 'small',
                            width: 100,
                            quality: 60
                        },
                        {
                            name: 'medium',
                            width: 512,
                            quality: 50
                        },
                        {
                            name: 'large',
                            width: 1024,
                            quality: 20
                        },
                        {
                            name: '2x',
                            width: 640,
                            quality: 30
                        }
                    ]
                },

                /*
                 You don't need to change this part if you don't change
                 the directory structure.
                 */
                files: [
                {
                    expand: true,
                    src: ['*.{gif,jpg,png}'],
                    cwd: 'src/img_src/work',
                    dest: 'src/static/images'

                }]
            }
        },

        imagemin: {                          // Task
            dynamic: {
                options: {                       // Target options
                    optimizationLevel: 7,
                    svgoPlugins: [{ removeViewBox: false }]
                },          // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/static/images',                   // Src matches are relative to this path
                    src: ['*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'dist/static/images'                  // Destination path prefix
                }]
            }
        },

        imageoptim: {
            options: {
                quitAfter: true
            },
            allPngs: {
                options: {
                    imageAlpha: true,
                    jpegMini: false
                },
                src: ['src/static/images/**/*.png']
            },
            allJpgs: {
                options: {
                    imageAlpha: false,
                    jpegMini: true
                },
                src: ['src/static/images/**/*.jpg']

            }
        },

        /* Clear out the images directory if it exists */
        clean: {
            img: {
                src: ['src/static/images/']
            },
            pub: ['public/'],
            dist: ['dist/'],
            concatenatedjsfile: [
                "src/static/scripts/script.concat.js",
                "src/views/pizza/js/main.concat.js"],
            beforeprfixedcssfile: ["dist/static/styles/before-prefix",],
            afterprfixedcssfile: ["dist/static/styles/after-prefix"]
        },

        /* Generate the images directory if it is missing */
        mkdir: {
            img: {
                options: {
                    create: ['src/static/images']
                }
            }
        },

        /* Copy the "fixed" images that don't go through processing into the images/directory */
        copy: {
            img: {
                files: [{
                    expand: true,
                    src: 'src/img_src/fixed/*.{gif,jpg,png}',
                    dest: 'src/static/images/',
                    flatten: true
                },
               ]
            },

            serviceWorker: {
                files:[{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        'static/scripts/third_party/serviceworker-cache-polyfill.js',
                        'static/service-worker.js'
                    ],
                    dest: 'dist/'
                }]
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        '**',
                        '!img_src/**',
                        '!static/scripts/**',
                        '!static/scripts/**/*.js',
                        '!static/styles/**/*.scss'
                    ],
                    dest: 'dist/'
                }]
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dist: {
                tasks: ['watch:notjsorcss', 'watch:js', 'watch:scss']
            }
        },

        watch: {
            notjsorcss: {
                files: [
                    'src/**/*.*',
                    '!src/static/scripts/*.*',
                    '!src/static/styles/*.*'
                ],
                tasks: ['copy:html']
            },
            js: {
                files: [
                    'src/static/scripts/**/*.js',
                    '!src/static/scripts/script.concat.js'
                ],
                tasks: ['codekit', 'uglify', 'copy:serviceWorker']
            },
            scss: {
                files: ['src/static/styles/**/*.scss'],
                tasks: ['sass']
            }
        },

        pagespeed: {
            options: {
                nokey: true,
                locale: "en_GB",
                threshold: 40

            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            }
        },

        critical: {
            test: {
                options: {
                    base: 'dist/',
                    css: [
                        'dist/static/styles/style'
                    ],
                    width: 320,
                    height: 480
                },
                src: 'index.html',
                dest: 'dist/index-critical.html'
            }
        }
    });


    // Register default tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-codekit');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-criticalcss');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-imageoptim');

    grunt.registerTask('resp', ['clean:img', 'mkdir:img', 'copy:img', 'responsive_images']);

    grunt.registerTask('js', [
        'jshint:uses_defaults',
        'codekit',
        ]);

    grunt.registerTask('css', [
        'sass',
        'autoprefixer:dev',
        'concat'
    ]);

    grunt.registerTask('minify', [
        'uglify',
        'autoprefixer:dist',
        'cssmin',
        'htmlmin']
    );

    grunt.registerTask('image', [
        'responsive_images',
        'imagemin'
        //'imageoptim'
    ]);

    grunt.registerTask('cleanup', [
        'clean:concatenatedjsfile'
    ]);

    grunt.registerTask('dev', [
        'clean:dist',
        'clean:pub',
        'copy',
        'js',
        'css',
        'cleanup',
        'concurrent'
    ]);


    grunt.registerTask('dist', [
        'clean:dist',
        'clean:pub',
        'copy',
        'js',
        'css',
        'minify',
        'cleanup'
    ]);


    grunt.registerTask('full', [
        'dist',
        'imagemin'
    ]);
}
