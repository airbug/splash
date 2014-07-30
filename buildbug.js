/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
var buildScript         = buildbug.buildScript;
var buildTarget         = buildbug.buildTarget;
var enableModule        = buildbug.enableModule;
var parallel            = buildbug.parallel;
var series              = buildbug.series;
var targetTask          = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws                 = enableModule('aws');
var bugpack             = enableModule('bugpack');
var bugunit             = enableModule('bugunit');
var core                = enableModule('core');
var lintbug             = enableModule('lintbug');
var nodejs              = enableModule('nodejs');
var uglifyjs            = enableModule("uglifyjs");


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var name                = "splash";
var version             = "1.1.3";
var dependencies        = {
    bugpack: "0.1.14",
    express: "3.1.x",
    jade: "1.5.0",
    mongodb: "1.4.7",
    mongoose: "3.8.13",
    "mailchimp-api": "2.0.6"
};


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    name: name,
    version: version
});

buildProperties({
    client: {
        buildPath: "{{buildPath}}/{{client.name}}/{{client.version}}",
        jsBuildPath: "{{client.buildPath}}/js",
        staticBuildPath: "{{client.buildPath}}/static",
        name: "{{name}}client",
        version: "{{version}}",
        outputFile: "{{distPath}}/{{client.name}}.js",
        outputMinFile: "{{distPath}}/{{client.name}}.min.js",
        sourcePaths: [
            "./projects/splashclient/js/src",
            "../bugcore/libraries/bugcore/js/src",
            "../bugjs/external/jquery/js/src",
            "../bugjs/external/bootstrap3/js/src",
            "../bugjs/external/socket-io/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugioc/libraries/bugioc/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/session/js/src",
            "../bugmeta/projects/bugmeta/js/src"
        ],
        staticPaths: [
            "./projects/splashclient/static",
            "../bugjs/external/bootstrap3/static"
        ],
        loader: {
            source: "./projects/splashclient/js/scripts/splashclient-application-loader.js",
            outputFile: "{{distPath}}/splashclient-application-loader.js",
            outputMinFile: "{{distPath}}/splashclient-application-loader.min.js"
        }
    },
    server: {
        packageJson: {
            name: "{{name}}server",
            version: "{{version}}",
            dependencies: dependencies,
            private: true,
            scripts: {
                start: "node ./scripts/splashserver-application-start.js"
            }
        },
        sourcePaths: [
            "../bugcore/libraries/bugcore/js/src",
            "../bugfs/projects/bugfs/js/src",
            "../bugioc/libraries/bugioc/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "./projects/splashserver/js/src"
        ],
        scriptPaths: [
            "./projects/splashserver/js/scripts"
        ],
        resourcePaths: [
            "./projects/splashserver/resources"
        ],
        unitTest: {
            packageJson: {
                name: "{{name}}server-test",
                version: "{{version}}",
                dependencies: dependencies,
                private: true,
                scripts: {
                    start: "node ./scripts/splashserver-application-start.js"
                }
            },
            sourcePaths: [
                "../buganno/projects/buganno/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src",
                "../bugyarn/libraries/bugyarn/js/src"
            ],
            scriptPaths: [
                "../buganno/projects/buganno/js/scripts",
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "../bugcore/libraries/bugcore/js/test",
                "../bugmeta/projects/bugmeta/js/test"
            ]
        }
    },
    lint: {
        targetPaths: [
            "."
        ],
        ignorePatterns: [
            ".*\\.buildbug$",
            ".*\\.bugunit$",
            ".*\\.git$",
            ".*node_modules$"
        ]
    },
    deployLocal: {
        tempPath: "../temp"
    }
});


//-------------------------------------------------------------------------------
// Declare BuildTargets
//-------------------------------------------------------------------------------

// Clean BuildTarget
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local BuildTarget
//-------------------------------------------------------------------------------

buildTarget('local').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
                    "cleanupExtraSpacingAtEndOfLines",
                    "ensureNewLineEnding",
                    "indentEqualSignsForPreClassVars",
                    "orderBugpackRequires",
                    "orderRequireAnnotations",
                    "updateCopyright"
                ]
            }
        }),
        parallel([
            series([
                targetTask('copy', {
                    properties: {
                        fromPaths: ["{{client.loader.source}}"],
                        intoPath: "{{distPath}}"
                    }
                }),
                targetTask("uglifyjsMinify", {
                    properties: {
                        sources: ["{{client.loader.outputFile}}"],
                        outputFile: "{{client.loader.outputMinFile}}"
                    }
                })
            ]),
            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("client.staticPaths"),
                        intoPath: "{{client.staticBuildPath}}"
                    }
                })
            ]),
            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("client.sourcePaths"),
                        intoPath: "{{client.jsBuildPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        name: "{{client.name}}",
                        sourceRoot: "{{client.jsBuildPath}}"
                    }
                }),
                targetTask("concat", {
                    init: function(task, buildProject, properties) {
                        var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("client.name"));
                        var sources         = [];
                        var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                        registryEntries.forEach(function(bugPackRegistryEntry) {
                            sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                        });
                        task.updateProperties({
                            sources: sources
                        });
                    },
                    properties: {
                        outputFile: "{{client.outputFile}}"
                    }
                }),
                targetTask("uglifyjsMinify", {
                    properties: {
                        sources: ["{{client.outputFile}}"],
                        outputFile: "{{client.outputMinFile}}"
                    }
                })
            ])
        ]),
        series([
            targetTask('createNodePackage', {
                properties: {
                    packageJson: buildProject.getProperty("server.packageJson"),
                    packagePaths: {
                        "./scripts": buildProject.getProperty("server.scriptPaths").concat(
                            buildProject.getProperty("server.unitTest.scriptPaths")
                        ),
                        "./lib": buildProject.getProperty("server.sourcePaths").concat(
                            buildProject.getProperty("server.unitTest.sourcePaths")
                        ),
                        "./static": ["{{client.staticBuildPath}}"],
                        "./test": buildProject.getProperty("server.unitTest.testPaths"),
                        "./resources": buildProject.getProperty("server.resourcePaths"),
                        "./static/js/client": [
                            "{{client.jsBuildPath}}",
                            buildProject.getProperty("client.outputFile"),
                            buildProject.getProperty("client.outputMinFile"),
                            buildProject.getProperty("client.loader.outputFile"),
                            buildProject.getProperty("client.loader.outputMinFile")
                        ]
                    }
                }
            }),
            targetTask('replaceTokens', {
                properties: {
                    tokenObjects: [
                        {token: "{{BUILD_VERSION}}", replacementValue: version, filePaths: ["{{buildPath}}/splashserver/{{version}}/resources/config"]}
                    ]
                }
            }),
            targetTask('generateBugPackRegistry', {
                init: function(task, buildProject) {
                    var nodePackage = nodejs.findNodePackage(
                        buildProject.getProperty("server.packageJson.name"),
                        buildProject.getProperty("server.packageJson.version")
                    );
                    task.updateProperties({
                        sourceRoot: nodePackage.getBuildPath(),
                        ignore: ["static"]
                    });
                }
            }),
            targetTask('packNodePackage', {
                properties: {
                    packageName: "{{server.packageJson.name}}",
                    packageVersion: "{{server.packageJson.version}}"
                }
            }),
            targetTask('startNodeModuleTests', {
                init: function(task, buildProject, properties) {
                    var packedNodePackage = nodejs.findPackedNodePackage(
                        buildProject.getProperty("server.packageJson.name"),
                        buildProject.getProperty("server.packageJson.version")
                    );
                    task.updateProperties({
                        modulePath: packedNodePackage.getFilePath()
                    });
                }
            }),
            targetTask("s3PutFile", {
                init: function(task, buildProject, properties) {
                    var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("server.packageJson.name"),
                        buildProject.getProperty("server.packageJson.version"));
                    task.updateProperties({
                        file: packedNodePackage.getFilePath(),
                        options: {

                            //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                            acl: 'public-read',
                            encrypt: true
                        }
                    });
                },
                properties: {
                    bucket: "{{local-bucket}}"
                }
            })
        ])
    ])
).makeDefault();


// Short BuildTarget
//-------------------------------------------------------------------------------

buildTarget('short').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        series([
            parallel([
                series([
                    targetTask('copy', {
                        properties: {
                            fromPaths: ["{{client.loader.source}}"],
                            intoPath: "{{distPath}}"
                        }
                    })
                ]),
                series([
                    targetTask('copyContents', {
                        properties: {
                            fromPaths: buildProject.getProperty("client.staticPaths"),
                            intoPath: "{{client.staticBuildPath}}"
                        }
                    })
                ]),
                series([
                    targetTask('copyContents', {
                        properties: {
                            fromPaths: buildProject.getProperty("client.sourcePaths"),
                            intoPath: "{{client.jsBuildPath}}"
                        }
                    }),
                    targetTask('generateBugPackRegistry', {
                        properties: {
                            name: "{{client.name}}",
                            sourceRoot: "{{client.jsBuildPath}}"
                        }
                    }),
                    targetTask("concat", {
                        init: function(task, buildProject, properties) {
                            var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("client.name"));
                            var sources         = [];
                            var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                            registryEntries.forEach(function(bugPackRegistryEntry) {
                                sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                            });
                            task.updateProperties({
                                sources: sources
                            });
                        },
                        properties: {
                            outputFile: "{{client.outputFile}}"
                        }
                    })
                ])
            ]),
            targetTask('createNodePackage', {
                properties: {
                    packageJson: buildProject.getProperty("server.packageJson"),
                    packagePaths: {
                        "./scripts": buildProject.getProperty("server.scriptPaths").concat(
                            buildProject.getProperty("server.unitTest.scriptPaths")
                        ),
                        "./lib": buildProject.getProperty("server.sourcePaths").concat(
                            buildProject.getProperty("server.unitTest.sourcePaths")
                        ),
                        "./static": ["{{client.staticBuildPath}}"],
                        "./test": buildProject.getProperty("server.unitTest.testPaths"),
                        "./resources": buildProject.getProperty("server.resourcePaths"),
                        "./static/js/client": [
                            "{{client.jsBuildPath}}",
                            buildProject.getProperty("client.outputFile"),
                            buildProject.getProperty("client.loader.outputFile")
                        ]
                    }
                }
            }),
            targetTask('replaceTokens', {
                properties: {
                    tokenObjects: [
                        {token: "{{BUILD_VERSION}}", replacementValue: version, filePaths: ["{{buildPath}}/splashserver/{{version}}/resources/config"]}
                    ]
                }
            }),
            targetTask('generateBugPackRegistry', {
                init: function(task, buildProject) {
                    var nodePackage = nodejs.findNodePackage(
                        buildProject.getProperty("server.packageJson.name"),
                        buildProject.getProperty("server.packageJson.version")
                    );
                    task.updateProperties({
                        sourceRoot: nodePackage.getBuildPath(),
                        ignore: ["static"]
                    });
                }
            }),
            targetTask('packNodePackage', {
                properties: {
                    packageName: "{{server.packageJson.name}}",
                    packageVersion: "{{server.packageJson.version}}"
                }
            })
        ])
    ])
);


// Prod Flow
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
                    "cleanupExtraSpacingAtEndOfLines",
                    "ensureNewLineEnding",
                    "indentEqualSignsForPreClassVars",
                    "orderBugpackRequires",
                    "orderRequireAnnotations",
                    "updateCopyright"
                ]
            }
        }),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.unitTest.packageJson"),
                        packagePaths: {
                            "./scripts": buildProject.getProperty("server.scriptPaths").concat(
                                buildProject.getProperty("server.unitTest.scriptPaths")
                            ),
                            "./lib": buildProject.getProperty("server.sourcePaths").concat(
                                buildProject.getProperty("server.unitTest.sourcePaths")
                            ),
                            "./test": buildProject.getProperty("server.unitTest.testPaths"),
                            "./resources": buildProject.getProperty("server.resourcePaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("server.unitTest.packageJson.name"),
                            buildProject.getProperty("server.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{server.unitTest.packageJson.name}}",
                        packageVersion: "{{server.unitTest.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("server.unitTest.packageJson.name"),
                            buildProject.getProperty("server.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                })
            ]),
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("server.packageJson"),
                        packagePaths: {
                            "./scripts": buildProject.getProperty("server.scriptPaths"),
                            "./lib": buildProject.getProperty("server.sourcePaths"),
                            "./resources": buildProject.getProperty("server.resourcePaths")
                        }
                    }
                }),
                targetTask('replaceTokens', {
                    properties: {
                        tokenObjects: [
                            {token: "{{BUILD_VERSION}}", replacementValue: version, filePaths: ["{{buildPath}}/splashserver/{{version}}/resources/config"]}
                        ]
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{server.packageJson.name}}",
                        packageVersion: "{{server.packageJson.version}}"
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("server.packageJson.name"),
                            buildProject.getProperty("server.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{prod-deploy-bucket}}"
                    }
                })
            ]),
            series([
                parallel([
                    series([
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{client.loader.source}}"],
                                outputFile: "{{client.loader.outputMinFile}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("client.staticPaths"),
                                intoPath: "{{client.staticBuildPath}}"
                            }
                        })
                    ]),
                    series([
                        targetTask('copyContents', {
                            properties: {
                                fromPaths: buildProject.getProperty("client.sourcePaths"),
                                intoPath: "{{client.jsBuildPath}}"
                            }
                        }),
                        targetTask('generateBugPackRegistry', {
                            properties: {
                                name: "{{client.name}}",
                                sourceRoot: "{{client.jsBuildPath}}"
                            }
                        }),
                        targetTask("concat", {
                            init: function(task, buildProject, properties) {
                                var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("client.name"));
                                var sources         = [];
                                var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                                registryEntries.forEach(function(bugPackRegistryEntry) {
                                    sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                                });
                                task.updateProperties({
                                    sources: sources
                                });
                            },
                            properties: {
                                outputFile: "{{client.outputFile}}"
                            }
                        }),
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{client.outputFile}}"],
                                outputFile: "{{client.outputMinFile}}"
                            }
                        })
                    ])
                ]),
                parallel([
                    targetTask("s3PutFile", {
                        properties: {
                            file: "{{client.outputMinFile}}",
                            options: {
                                acl: 'public-read',
                                gzip: true,
                                base: "splash/" + version + "/static/js/client",
                                cacheControl: "max-age=31536000, public"
                            },
                            bucket: "{{prod-static-bucket}}"
                        }
                    }),
                    targetTask("s3PutFile", {
                        properties: {
                            file: "{{client.loader.outputMinFile}}",
                            options: {
                                acl: 'public-read',
                                gzip: true,
                                base: "splash/" + version + "/static/js/client",
                                cacheControl: "max-age=31536000, public"
                            },
                            bucket: "{{prod-static-bucket}}"
                        }
                    }),
                    targetTask("s3PutDirectoryContents", {
                        properties: {
                            directory: "{{client.staticBuildPath}}",
                            options: {
                                acl: 'public-read',
                                gzip: true,
                                base: "splash/" + version + "/static",
                                cacheControl: "max-age=31536000, public"
                            },
                            bucket: "{{prod-static-bucket}}"
                        }
                    })
                ])
            ])
        ])
    ])
);


// Deploy Local Flow
//-------------------------------------------------------------------------------

buildTarget('deploy-local').buildFlow(
    series([
        targetTask('npmInstall', {
            init: function(task, buildProject, properties) {
                var packedNodePackage = nodejs.findPackedNodePackage(
                    buildProject.getProperty("server.packageJson.name"),
                    buildProject.getProperty("server.packageJson.version"));
                task.updateProperties({
                    module: packedNodePackage.getFilePath().getAbsolutePath()
                });
            },
            properties: {
                installPath: "{{deployLocal.tempPath}}"
            }
        })
    ])
);



//-------------------------------------------------------------------------------
// Build Scripts
//-------------------------------------------------------------------------------

buildScript({
    dependencies: [
        "bugcore",
        "bugflow",
        "bugfs"
    ],
    script: "./lintbug.js"
});
