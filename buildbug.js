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
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    splash: {
        packageJson: {
            name: "splash",
            version: "1.0.0",
            private: true,
            scripts: {
                start: "node ./scripts/splash-server-start.js"
            },
            dependencies: {
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
                express: "3.1.x",
                jade: "*",
                mongodb: ">=1.2.11",
                mongoose: "3.8.x"
            }
        },
        sourcePaths: [
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src",
            "./projects/splash/js/src"
        ],
        scriptPaths: [
            "../bugunit/projects/bugunit/js/scripts",
            "./projects/splash/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugflow/js/test",
            "../bugjs/projects/bugjs/js/test",
            "../bugjs/projects/bugtrace/js/test"
        ],
        staticPaths: [
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
        ],
        resourcePaths: [
            "./projects/splash/resources"
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
        targetTask('createNodePackage', {
            properties: {
                packageJson: buildProject.getProperty("splash.packageJson"),
                scriptPaths: buildProject.getProperty("splash.scriptPaths"),
                sourcePaths: buildProject.getProperty("splash.sourcePaths"),
                staticPaths: buildProject.getProperty("splash.staticPaths"),
                testPaths: buildProject.getProperty("splash.testPaths"),
                resourcePaths: buildProject.getProperty("splash.resourcePaths")
            }
        }),
        parallel([
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
            targetTask('generateBugPackRegistry', {
                init: function(task, buildProject, properties) {
                    var nodePackage = nodejs.findNodePackage(
                        buildProject.getProperty("splash.packageJson.name"),
                        buildProject.getProperty("splash.packageJson.version")
                    );
                    task.updateProperties({
                        sourceRoot: nodePackage.getBuildPath().getAbsolutePath() + "/static"
                    });
                }
            })
        ]),
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
        targetTask("s3EnsureBucket", {
            properties: {
                bucket: "{{local-bucket}}"
            }
        }),
        targetTask("s3PutFile", {
            init: function(task, buildProject, properties) {
                var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("splash.packageJson.name"),
                    buildProject.getProperty("splash.packageJson.version"));
                task.updateProperties({
                    file: packedNodePackage.getFilePath(),
                    options: {
                        acl: 'public-read'
                    }
                });
            },
            properties: {
                bucket: "{{local-bucket}}"
            }
        })
    ])
).makeDefault();


// Prod Flow
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        targetTask('createNodePackage', {
            properties: {
                packageJson: buildProject.getProperty("splash.packageJson"),
                scriptPaths: buildProject.getProperty("splash.scriptPaths"),
                sourcePaths: buildProject.getProperty("splash.sourcePaths"),
                staticPaths: buildProject.getProperty("splash.staticPaths"),
                testPaths: buildProject.getProperty("splash.testPaths"),
                resourcePaths: buildProject.getProperty("splash.resourcePaths")
            }
        }),
        parallel([
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
            targetTask('generateBugPackRegistry', {
                init: function(task, buildProject, properties) {
                    var nodePackage = nodejs.findNodePackage(
                        buildProject.getProperty("splash.packageJson.name"),
                        buildProject.getProperty("splash.packageJson.version")
                    );
                    task.updateProperties({
                        sourceRoot: nodePackage.getBuildPath().getAbsolutePath() + "/static"
                    });
                }
            })
        ]),
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
        targetTask("s3EnsureBucket", {
            properties: {
                bucket: "airbug"
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
                        acl: 'public-read'
                    }
                });
            },
            properties: {
                bucket: "airbug"
            }
        })
    ])
);
