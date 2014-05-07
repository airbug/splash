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


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var version             = "1.1.0";
var name                = "splash";


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    static: {
        outputPath: buildProject.getProperty("buildPath") + "/static",
        sourcePaths: [
            "../bugcore/projects/bugcore/js/src",
            "../bugflow/projects/bugflow/js/src",
            "../bugjs/external/jquery/js/src",
            "../bugjs/external/bootstrap3/js/src",
            "../bugjs/external/bootstrap3/static",
            "../bugjs/external/socket-io/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/session/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "../bugtrace/projects/bugtrace/js/src",
            "../sonarbug/projects/sonarbugclient/js/src",
            "../splitbug/projects/splitbug/js/src",
            "../splitbug/projects/splitbugclient/js/src",
            "./projects/splash/static"
        ]
    },
    splash: {
        packageJson: {
            name: "splash",
            version: version,
            private: true,
            scripts: {
                start: "node ./scripts/splash-server-start.js"
            },
            dependencies: {
                bugpack: "0.1.12",
                express: "3.1.x",
                jade: "1.0.2",
                mongodb: ">=1.2.11",
                mongoose: "3.8.x",
                "mailchimp-api": "2.0.4"
            }
        },
        sourcePaths: [
            "../bugcore/projects/bugcore/js/src",
            "../bugflow/projects/bugflow/js/src",
            "../bugfs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugmeta/projects/bugmeta/js/src",
            "../bugtrace/projects/bugtrace/js/src",
            "./projects/splash/js/src"
        ],
        scriptPaths: [
            "./projects/splash/js/scripts"
        ],
        resourcePaths: [
            "./projects/splash/resources"
        ]
    },
    splashUnitTest: {
        packageJson: {
            name: "splash-test",
            version: version,
            private: true,
            scripts: {
                start: "node ./scripts/splash-server-start.js"
            },
            dependencies: {
                bugpack: "https://s3.amazonaws.com/deploy-airbug/bugpack-0.0.5.tgz",
                express: "3.1.x",
                jade: "1.0.2",
                mongodb: ">=1.2.11",
                mongoose: "3.8.x"
            }
        },
        sourcePaths: [
            "../buganno/projects/buganno/js/src",
            "../bugjs/projects/bugyarn/js/src",
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "../buganno/projects/buganno/js/scripts",
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../bugcore/projects/bugcore/js/test",
            "../bugflow/projects/bugflow/js/test",
            "../bugmeta/projects/bugmeta/js/test",
            "../bugtrace/projects/bugtrace/js/test"
        ]
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
                    "fixExportAndRemovePackageAnnotations"
                ]
            }
        }),
        series([
            targetTask('copyContents', {
                properties: {
                    fromPaths: buildProject.getProperty("static.sourcePaths"),
                    intoPath: "{{static.outputPath}}"
                }
            }),
            targetTask('generateBugPackRegistry', {
                properties: {
                    sourceRoot: "{{static.outputPath}}"
                }
            }),
            targetTask('createNodePackage', {
                properties: {
                    packageJson: buildProject.getProperty("splash.packageJson"),
                    scriptPaths: buildProject.getProperty("splash.scriptPaths").concat(
                        buildProject.getProperty("splashUnitTest.scriptPaths")
                    ),
                    sourcePaths: buildProject.getProperty("splash.sourcePaths").concat(
                        buildProject.getProperty("splashUnitTest.sourcePaths")
                    ),
                    staticPaths: ["{{static.outputPath}}"],
                    testPaths: buildProject.getProperty("splashUnitTest.testPaths"),
                    resourcePaths: buildProject.getProperty("splash.resourcePaths")
                }
            }),
            targetTask('generateBugPackRegistry', {
                init: function(task, buildProject) {
                    var nodePackage = nodejs.findNodePackage(
                        buildProject.getProperty("splash.packageJson.name"),
                        buildProject.getProperty("splash.packageJson.version")
                    );
                    task.updateProperties({
                        sourceRoot: nodePackage.getBuildPath(),
                        ignore: ["static"]
                    });
                }
            }),
            targetTask('packNodePackage', {
                properties: {
                    packageName: "{{splash.packageJson.name}}",
                    packageVersion: "{{splash.packageJson.version}}"
                }
            }),
            targetTask('startNodeModuleTests', {
                init: function(task, buildProject, properties) {
                    var packedNodePackage = nodejs.findPackedNodePackage(
                        buildProject.getProperty("splash.packageJson.name"),
                        buildProject.getProperty("splash.packageJson.version")
                    );
                    task.updateProperties({
                        modulePath: packedNodePackage.getFilePath()
                    });
                }
            }),
            targetTask("s3PutFile", {
                init: function(task, buildProject, properties) {
                    var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("splash.packageJson.name"),
                        buildProject.getProperty("splash.packageJson.version"));
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
            targetTask('copyContents', {
                properties: {
                    fromPaths: buildProject.getProperty("static.sourcePaths"),
                    intoPath: "{{static.outputPath}}"
                }
            }),
            targetTask('generateBugPackRegistry', {
                properties: {
                    sourceRoot: "{{static.outputPath}}"
                }
            }),
            targetTask('createNodePackage', {
                properties: {
                    packageJson: buildProject.getProperty("splash.packageJson"),
                    scriptPaths: buildProject.getProperty("splash.scriptPaths").concat(
                        buildProject.getProperty("splashUnitTest.scriptPaths")
                    ),
                    sourcePaths: buildProject.getProperty("splash.sourcePaths").concat(
                        buildProject.getProperty("splashUnitTest.sourcePaths")
                    ),
                    staticPaths: ["{{static.outputPath}}"],
                    testPaths: buildProject.getProperty("splashUnitTest.testPaths"),
                    resourcePaths: buildProject.getProperty("splash.resourcePaths")
                }
            }),
            targetTask('generateBugPackRegistry', {
                init: function(task, buildProject) {
                    var nodePackage = nodejs.findNodePackage(
                        buildProject.getProperty("splash.packageJson.name"),
                        buildProject.getProperty("splash.packageJson.version")
                    );
                    task.updateProperties({
                        sourceRoot: nodePackage.getBuildPath(),
                        ignore: ["static"]
                    });
                }
            }),
            targetTask('packNodePackage', {
                properties: {
                    packageName: "{{splash.packageJson.name}}",
                    packageVersion: "{{splash.packageJson.version}}"
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
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("splash.packageJson"),
                        scriptPaths: buildProject.getProperty("splash.scriptPaths").concat(
                            buildProject.getProperty("splashUnitTest.scriptPaths")
                        ),
                        sourcePaths: buildProject.getProperty("splash.sourcePaths").concat(
                            buildProject.getProperty("splashUnitTest.sourcePaths")
                        ),

                        testPaths: buildProject.getProperty("splashUnitTest.testPaths"),
                        resourcePaths: buildProject.getProperty("splash.resourcePaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{splash.packageJson.name}}",
                        packageVersion: "{{splash.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version")
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
                        packageJson: buildProject.getProperty("splash.packageJson"),
                        scriptPaths: buildProject.getProperty("splash.scriptPaths"),
                        sourcePaths: buildProject.getProperty("splash.sourcePaths"),
                        resourcePaths: buildProject.getProperty("splash.resourcePaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath(),
                            ignore: ["static"]
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{splash.packageJson.name}}",
                        packageVersion: "{{splash.packageJson.version}}"
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("splash.packageJson.name"),
                            buildProject.getProperty("splash.packageJson.version"));
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
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("static.sourcePaths"),
                        intoPath: "{{static.outputPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        sourceRoot: "{{static.outputPath}}"
                    }
                }),
                targetTask("s3PutDirectoryContents", {
                    properties: {
                        directory: "{{static.outputPath}}",
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
);


//-------------------------------------------------------------------------------
// Build Scripts
//-------------------------------------------------------------------------------

buildScript({
    dependencies: [
        "bugcore",
        "bugflow"
    ],
    script: "./lintbug.js"
});
