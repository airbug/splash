//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
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
var nodejs              = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var version             = "1.0.10";
var name                = "splash";


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    static: {
        outputPath: buildProject.getProperty("buildPath") + "/static",
        sourcePaths: [
            "../bugjs/external/jquery/js/src",
            "../bugjs/external/bootstrap3/js/src",
            "../bugjs/external/bootstrap3/static",
            "../bugjs/external/socket-io/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/cookies/js/src",
            "../bugjs/projects/session/js/src",
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
                bugpack: "https://s3.amazonaws.com/deploy-airbug/bugpack-0.0.5.tgz",
                express: "3.1.x",
                jade: "1.0.2",
                mongodb: ">=1.2.11",
                mongoose: "3.8.x",
                "mailchimp-api": "2.0.4"
            }
        },
        sourcePaths: [
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugtrace/js/src",
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
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugflow/js/test",
            "../bugjs/projects/bugjs/js/test",
            "../bugjs/projects/bugmeta/js/test",
            "../bugjs/projects/bugtrace/js/test"
        ]
    }
});


//-------------------------------------------------------------------------------
// Declare Tasks
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Flows
//-------------------------------------------------------------------------------

// Clean Flow
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local Flow
//-------------------------------------------------------------------------------

//TODO BRN: Local development of node js and client side projects should "create" the packages and package them up but
// the sources should be symlinked to instead

buildTarget('local').buildFlow(
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
