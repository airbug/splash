//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('splash.SplashApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.AutowiredTagProcessor')
//@Require('bugioc.AutowiredTagScan')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.ModuleTagScan')
//@Require('bugioc.IocContext')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var Obj                                 = bugpack.require('Obj');
    var AutowiredTagProcessor        = bugpack.require('bugioc.AutowiredTagProcessor');
    var AutowiredTagScan                       = bugpack.require('bugioc.AutowiredTagScan');
    var ModuleTagProcessor           = bugpack.require('bugioc.ModuleTagProcessor');
    var ModuleTagScan                          = bugpack.require('bugioc.ModuleTagScan');
    var IocContext                          = bugpack.require('bugioc.IocContext');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var SplashApplication = Class.extend(Obj, {

        _name: "splash.SplashApplication",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext         = new IocContext();

            /**
             * @private
             * @type {AutowiredTagScan}
             * @type {ConfigurationTagScan}
             */
            this.autowiredScan      = new AutowiredTagScan(BugMeta.context(), new AutowiredTagProcessor(this.iocContext));

            /**
             * @private
             * @type {ModuleTagScan}
             */
            this.moduleTagScan      = new ModuleTagScan(BugMeta.context(), new ModuleTagProcessor(this.iocContext));
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        start: function(callback) {
            this.autowiredScan.scanAll();
            this.autowiredScan.scanContinuous();
            this.moduleTagScan.scanAll();
            this.iocContext.generate();
            this.iocContext.initialize(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("splash.SplashApplication", SplashApplication);
});
