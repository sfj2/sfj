'use strict';

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

// format `*.[chunkhash].min.js`
var CHUNK_REGEX = /^([A-Za-z0-9_\-]+)\..*/;

var nodemonArgs = [];
if (process.env.DEBUGGER) {
    nodemonArgs.push('--debug');
}

module.exports = function (grunt) {
    grunt.initConfig({
        // project variables
        project: {
            build: './build',
            public: '/public'
        },

        // clean build
        clean: ['build'],

        // ------------------------------------------------------------------------------
        // DEV TASKS --------------------------------------------------------------------
        // ------------------------------------------------------------------------------

        jshint: {
            all: [
                '*.js',
                '{actions,components,services,stores}/**/*.js'
            ],
            options: {
                jshintrc: true
            }
        },

        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: ['images/**'],
                    dest: '<%= project.build %>/'
                }]
            }
        },

        // webpack bundling
        webpack: {
            dev: {
                resolve: {
                    extensions: ['', '.js', '.jsx']
                },
                entry: './client.js',
                output: {
                    path: '<%= project.build %>/js',
                    publicPath: '/public/js/',
                    filename: '[name].js',
                    chunkFilename: '[name].[chunkhash].js'
                },
                module: {
                    loaders: [
                        { test: /\.css$/, loader: 'style!css' },
                        { test: /\.jsx?$/, exclude: /node_modules/, loader: require.resolve('babel-loader') },
                        { test: /\.json$/, loader: 'json-loader'}
                    ]
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('development')
                        }
                    }),
                    new webpack.optimize.CommonsChunkPlugin('common.js', undefined, 2),
                    new webpack.NormalModuleReplacementPlugin(/^react(\/addons)?$/, require.resolve('react'))
                ],
                stats: {
                    colors: true
                },
                devtool: 'source-map',
                watch: true,
                keepalive: true
            },
            prod: {
                resolve: {
                    extensions: ['', '.js', '.jsx']
                },
                entry: './client.js',
                output: {
                    path: '<%= project.build %>/js',
                    publicPath: '<%= project.cdnPath %>js/',
                    filename: '[name].[chunkhash].min.js',
                    chunkFilename: '[name].[chunkhash].min.js'
                },
                module: {
                    loaders: [
                        { test: /\.css$/, loader: 'style!css' },
                        { test: /\.jsx?$/, exclude: /node_modules/, loader: require.resolve('babel-loader') },
                        { test: /\.json$/, loader: 'json-loader'}
                    ]
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('production')
                        }
                    }),

                    // These are performance optimizations for your bundles
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.optimize.CommonsChunkPlugin('common.[hash].min.js', 2),

                    // This ensures requires for `react` and `react/addons` normalize to the same requirement
                    new webpack.NormalModuleReplacementPlugin(/^react(\/addons)?$/, require.resolve('react/addons')),

                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    }),

                    // generates webpack assets config to use hashed assets in production mode
                    function webpackStatsPlugin() {
                        this.plugin('done', function(stats) {
                            var data = stats.toJson();
                            var assets = data.assetsByChunkName;
                            var output = {
                                assets: {},
                                cdnPath: this.options.output.publicPath
                            };

                            Object.keys(assets).forEach(function eachAsset(key) {
                                var value = assets[key];

                                // if `*.[chunkhash].min.js` regex matched, then use file name for key
                                var matches = key.match(CHUNK_REGEX);
                                if (matches) {
                                    key = matches[1];
                                }

                                output.assets[key] = value;
                            });

                            fs.writeFileSync(
                                path.join(process.cwd(), 'build', 'assets.json'),
                                JSON.stringify(output, null, 4)
                            );
                        });
                    }
                ],

                // removes verbosity from builds
                progress: false
            }
        }
    });

    // libs
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');

    // tasks
    grunt.registerTask('default', 'dev');
    grunt.registerTask('dev', ['clean', 'copy']);
    grunt.registerTask('build', ['clean', 'copy', 'webpack:prod']);
};