//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('SplashApplication')
//@Autoload

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('List')
//@Require('sonarbugclient.SonarBugClient')
//@Require('splitbug.SplitBug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var BugFlow         = bugpack.require('bugflow.BugFlow');
var List            = bugpack.require('List');
var SonarBugClient  = bugpack.require('sonarbugclient.SonarBugClient');
var SplitBug        = bugpack.require('splitbug.SplitBug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel       = BugFlow.$parallel;
var $task           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Update the objects in this file to use our class model from bugjs
var SplashApplication = {

    /**
     *
     */
    start: function() {
        $parallel([
            $task(function(flow){
                SonarBugClient.configure("http://sonarbug.com:80/socket-api", function(error){
                    if (!error) {
                        console.log('SonarBugClient configured');
                    } else {
                        console.error(error);
                    }
                });

                //NOTE BRN: We complete this flow immediately because we don't need to wait for sonarbug to configure before calling the track method
                flow.complete();
            }),
            $task(function(flow){
                SplitBug.configure({}, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(){
            if (Loader.appLoaded) {
                SplashApplication.initialize();
            } else {
                Loader.addLoadedListener(function() {
                    SplashApplication.initialize();
                });
            }
        });
    },

    /**
     *
     */
    initialize: function() {
        SonarBugClient.startTracking();
        Tracker.trackAppLoad();
        initializeFeedbackPanel();
        if (firstPage === "explainerPage") {
            PageManager.goToPage(ExplainerPage);
        } else if (firstPage === "four04Page") {
            PageManager.goToPage(Four04Page);
        }
    }
};


var sendApiRequest = function(endpoint, dataObject, callback) {
    $.ajax({
        url: endpoint,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(dataObject),
        processData: false,
        type: "POST",
        error: function(jqXHR, textStatus, errorThrown) {
            var error = {
                jqXHR: jqXHR,
                textStatus: textStatus,
                errorThrown: errorThrown
            };
            callback(error);
        },
        success: function(data, textStatus, jqXHR) {
            var result = {
                data: data,
                textStatus: textStatus,
                jqXHR: jqXHR
            };
            callback(null, result);
        }
    });
};


// Tracking Code
//-------------------------------------------------------------------------------

var Tracker = {
    trackAppLoad: function() {
        Tracker.trackGA("App", "Load");
        Tracker.trackSB("appLoad", null);
    },
    trackGoalComplete: function(goalName) {
        Tracker.trackGA("Goal", "Complete", goalName);
        Tracker.trackSB("goalComplete", {goalName: goalName});
    },
    trackPageView: function(pageId) {
        Tracker.trackGA("Page", "View", pageId);
        Tracker.trackSB("pageView", {pageId: pageId});
    },
    trackGA: function(category, action, label, value, nonInteraction) {
        if (_appConfig.production) {
            _gaq.push(['_trackEvent', category, action, label, nonInteraction]);
        } else {
            console.log("TackingEvent - category:" + category + " action:" + action +
                " label:" + label + " nonInteraction:" + nonInteraction);
        }
    },
    trackSB: function(eventName, data){
        SonarBugClient.track(eventName, data);
    }
};

// Feedback Panel
//-------------------------------------------------------------------------------

var feedbackPanelOpen = false;
var feedbackSubmitted = false;

var initializeFeedbackPanel = function() {
    var feedbackTab = $("#feedback-tab");
    var body = $('body');
    var feedbackContainer = $('#feedback-container');
    var feedbackEdgeContainer = $("#feedback-edge-container");
    var feedbackFormCancelButton = $("#feedback-form-cancel-button");
    var feedbackFormSubmitButton = $("#feedback-form-submit-button");

    feedbackTab.on("click", handleFeedbackTabClick);
    body.on("click", handleBodyClick);
    feedbackContainer.on("click", handleFeedbackContainerClick);
    feedbackEdgeContainer.on("click", handleFeedbackEdgeContainerClick);
    feedbackFormCancelButton.on("click", handleFeedbackFormCancelButtonClick);
    feedbackFormSubmitButton.on("click", handleFeedbackFormSubmitButtonClick);
};

var handleFeedbackTabClick = function(event) {
    if (feedbackPanelOpen) {
        closeFeedbackPanel();
    } else {
        openFeedbackPanel();
    }
    event.stopPropagation();
};

var openFeedbackPanel = function() {
    if (!feedbackPanelOpen) {
        feedbackPanelOpen = true;
        var interferenceContainer = $("#interference-container");
        interferenceContainer.css("width", "100%");
        interferenceContainer.css("height", "100%");
        animateFeedbackPanelOpen();
   }
};

var animateFeedbackPanelOpen = function() {

    //TODO BRN: Add some sort of check here for supported css transitions. If they're supported, then use css
    // transitions, otherwise use jquery to animate.

    var pageContainer = $("#page-container");
    pageContainer.removeClass("page-container-fadein");
    pageContainer.addClass("page-container-fadeout");
    var feedbackContainer = $("#feedback-container");
    feedbackContainer.removeClass("feedback-container-collapse");
    feedbackContainer.addClass("feedback-container-expand");
    var feedbackAirbugPull1 = $("#feedback-airbug-pull-1");
    feedbackAirbugPull1.removeClass("feedback-airbug-show");
    feedbackAirbugPull1.removeClass("feedback-airbug-show-after-collapse");
    feedbackAirbugPull1.addClass("feedback-airbug-hide");
    var feedbackAirbugPull2 = $("#feedback-airbug-pull-2");
    feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-collapse");
    feedbackAirbugPull2.addClass("feedback-airbug-pull-2-expand");
    var feedbackAirbugPull3 = $("#feedback-airbug-pull-3");
    feedbackAirbugPull3.removeClass("feedback-airbug-hide");
    feedbackAirbugPull3.addClass("feedback-airbug-pull-3-expand");
    feedbackAirbugPull3.addClass("feedback-airbug-show");
    var feedbackAirbugThankyou = $("#feedback-airbug-thankyou");
    feedbackAirbugThankyou.removeClass("feedback-airbug-show");
    feedbackAirbugThankyou.removeClass("feedback-airbug-show-after-collapse");
    feedbackAirbugThankyou.addClass("feedback-airbug-hide");
};

var closeFeedbackPanel = function() {
    if (feedbackPanelOpen) {
        feedbackPanelOpen = false;
        var interferenceContainer = $("#interference-container");
        interferenceContainer.css("width", "");
        interferenceContainer.css("height", "");
        animateFeedbackPanelClose();
    }
};

var animateFeedbackPanelClose = function() {

    //TODO BRN: Add some sort of check here for supported css transitions. If they're supported, then use css
    // transitions, otherwise use jquery to animate.

    var pageContainer = $('#page-container');
    pageContainer.removeClass('page-container-fadeout');
    pageContainer.addClass('page-container-fadein');
    var feedbackContainer = $('#feedback-container');
    feedbackContainer.removeClass('feedback-container-expand');
    feedbackContainer.addClass('feedback-container-collapse');
    var feedbackAirbugPull1 = $("#feedback-airbug-pull-1");
    var feedbackAirbugThankyou = $("#feedback-airbug-thankyou");
    if (feedbackSubmitted) {
        feedbackAirbugPull1.addClass("feedback-airbug-hide");
        feedbackAirbugPull1.removeClass("feedback-airbug-show");
        feedbackAirbugThankyou.removeClass("feedback-airbug-hide");
        feedbackAirbugThankyou.addClass("feedback-airbug-show");
        feedbackAirbugThankyou.addClass("feedback-airbug-show-after-collapse");
    } else {
        feedbackAirbugPull1.removeClass("feedback-airbug-hide");
        feedbackAirbugPull1.addClass("feedback-airbug-show");
        feedbackAirbugPull1.addClass("feedback-airbug-show-after-collapse");
    }
    var feedbackAirbugPull2 = $("#feedback-airbug-pull-2");
    feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-expand");
    feedbackAirbugPull2.addClass("feedback-airbug-pull-2-collapse");
    var feedbackAirbugPull3 = $("#feedback-airbug-pull-3");
    feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-expand");
    feedbackAirbugPull3.removeClass("feedback-airbug-show");
    feedbackAirbugPull3.addClass("feedback-airbug-hide");
};

var handleBodyClick = function(event) {
    if (feedbackPanelOpen) {
        closeFeedbackPanel();
    }
};

var handleFeedbackContainerClick = function(event) {
    event.stopPropagation();
};

var handleFeedbackEdgeContainerClick = function(event) {
    if (feedbackPanelOpen) {
        closeFeedbackPanel();
    } else {
        openFeedbackPanel();
    }
};

var handleFeedbackFormCancelButtonClick = function(event) {
    event.preventDefault();
    closeFeedbackPanel();
    return false;
};

var handleFeedbackFormSubmitButtonClick = function(event) {
    event.preventDefault();

    var feedbackFormData = getFeedbackFormData();
    validateFeedbackForm(feedbackFormData, function(error) {
        if (!error) {
            submitFeedbackForm(feedbackFormData);
            closeFeedbackPanel();
        } else {
            showFeedbackFormError(error);
        }
    });
    return false;
};

var getFeedbackFormData = function() {
    var formDataArray = $('#feedback-form').serializeArray();
    var feedbackData = {};

    formDataArray.forEach(function(formEntry) {
        feedbackData[formEntry.name] = formEntry.value;
    });

    feedbackData.currentPage = PageManager.currentPage.pageName;
    return feedbackData;
};

var showFeedbackFormError = function(error) {

};

var submitFeedbackForm = function(feedbackFormData) {
    Tracker.trackGoalComplete("FeedbackSubmitted");
    sendApiRequest("/api/feedback", feedbackFormData, function(error, result) {
        //TODO BRN: Handle errors
    });
    feedbackSubmitted = true;
};

var validateFeedbackForm = function(feedbackFormData, callback) {
    //TODO BRN: Validate the feedback form data
    callback();
};


var PageManager = {
    currentPage: null,
    goToPage: function(page) {
        if (page) {
            page.initialize();
            page.activate();
            PageManager.currentPage = page;
            Tracker.trackPageView(page.pageName);
        }
    }
};


// Explainer page
//-------------------------------------------------------------------------------

var ExplainerPage = {
    pageName: "explainerPage",
    initialize: function() {

        var marketingTaglineHeader = $("#marketing-tagline-header");
        SplitBug.splitTest({
            name: "alternate-tag-line",
            controlFunction: function() {
                marketingTaglineHeader.html("Unite and motivate your team's cross-platform collaboration");
            },
            testFunction: function() {
                marketingTaglineHeader.html("Collaborative chat for developers");
            }
        });

        var betaSignUpButton = $("#beta-sign-up-button");
        betaSignUpButton.on("click", function(event) {
            PageManager.goToPage(BetaSignUpPage);
        });

    },
    activate: function() {
        var explainerPage = $("#explainer-page");
        var loadingPage = $("#loading-page");
        loadingPage.hide();
        explainerPage.removeClass("page-slide-show");
        explainerPage.removeClass("page-slide-hide");
        explainerPage.show();
    }
};

// 404 page
//-------------------------------------------------------------------------------

var Four04Page = {
    pageName: "four04Page",
    initialize: function() {
    },
    activate: function() {
        var four04Page = $("#four04-page");
        var loadingPage = $("#loading-page");
        loadingPage.hide();
        four04Page.show();
    }
};


// Beta SignUp Page
//-------------------------------------------------------------------------------

var BetaSignUpPage = {
    pageName: "betaSignUpPage",
    initialize: function() {
        airbugs.forEach(function(airbug) {
            airbug.setup();
        });
        DragManager.registerDragTarget(AirbugJar);
        BetaSignUpModal.initialize();
        OtherAirBugForm.initialize();
        $('#nav-pull-down-tab').on('click', function(event){
            var explainerPage = $("#explainer-page");
            var betaSignUpPage = $("#beta-sign-up-page");
            betaSignUpPage.removeClass("page-slide-show");
            betaSignUpPage.addClass("page-slide-hide");
            PageManager.goToPage(ExplainerPage);
            explainerPage.addClass("page-slide-show");
        });
    },
    activate: function() {
        var explainerPage = $("#explainer-page");
        var betaSignUpPage = $("#beta-sign-up-page");
        explainerPage.addClass("page-slide-hide");
        betaSignUpPage.removeClass("page-slide-show");
        betaSignUpPage.removeClass("page-slide-hide");
        betaSignUpPage.show();
        betaSignUpPage.addClass("page-slide-show");
    }
};

var AirBug = function(name, element) {
    this.name = name;
    this.element = element;
};
AirBug.prototype = {
    setup: function() {
        DragManager.registerDraggableObject(this);
    },
    teardown: function() {
        DragManager.deregisterDraggableObject(this);
    },
    initializeDraggableObject: function() {
        this.activateDrag();
    },
    activateDrag: function(){
        var _this = this;
        var element = this.element;
        element.on("touchstart mousedown", function(event) {
            _this.handleInteractionStart(event);
        });
        element.addClass("grab");
    },
    deactivateDrag: function(){
        var _this = this;
        var element = this.element;
        element.off("touchstart mousedown");
        element.removeClass("grab");
    },
    handleInteractionStart: function(event) {
        event.preventDefault();
        DragManager.startDrag(this, event.clientX, event.clientY);
    },
    startDrag: function() {
        AirbugJar.removeAirbug(this);
        var element = this.element;
        //NOTE BRN: There seems to be a bug here where the cursor is not changed immediately when the mouse is down
        //https://bugs.webkit.org/show_bug.cgi?id=53341

        element.removeClass("grab");
        element.removeClass("drag-released");
        element.addClass("grabbing");
    },
    releaseDrag: function() {
        var element = this.element;
        element.css("left", "");
        element.css("top", "");
        element.addClass("drag-released");
        element.addClass("grab");
        element.removeClass("grabbing");
    },
    isOtherAirbug: function() {
        return false;
    }
};

var airbugs = [
    new AirBug("basecamp", $("#airbug-basecamp-container")),
    new AirBug("bitbucket", $("#airbug-bitbucket-container")),
    new AirBug("github", $("#airbug-github-container")),
    new AirBug("jira", $("#airbug-jira-container")),
    new AirBug("pivotaltracker", $("#airbug-pivotaltracker-container")),
    new AirBug("salesforce", $("#airbug-salesforce-container")),
    new AirBug("uservoice", $("#airbug-uservoice-container")),
    new AirBug("zendesk", $("#airbug-zendesk-container"))
]; // For other airbug see below

var AirbugJar = {
    element: $("#airbug-jar-container"),
    containedAirbugs: [],
    previouslyContainedAirbugs: [],
    getAirbugNames: function() {
        var names = [];
        AirbugJar.containedAirbugs.forEach(function(airbug) {
            names.push(airbug.name);
        });
        return names;
    },
    getCount: function() {
        return AirbugJar.containedAirbugs.length;
    },
    /*
     * @return {boolean}
     **/
    isFull: function() {
        if (AirbugJar.getCount() >= 3) {
            return true;
        } else {
            return false;
        }
    },
    /*
     * @return {boolean}
     **/
    isNotFull: function() {
        return !AirbugJar.isFull();
    },
    /*
     * @return {boolean}
     **/
    isEmpty: function(){
        if (AirbugJar.getCount() === 0) {
            return true;
        } else {
            return false;
        }
    },
    indexOf: function(airbug) {
        for (var i = 0, size = AirbugJar.containedAirbugs.length; i < size; i++) {
            var airbugAt = AirbugJar.containedAirbugs[i];
            if (airbugAt.name === airbug.name) {
                return i;
            }
        }
    },
    addAirbug: function(airbug) {
        AirbugJar.containedAirbugs.push(airbug);
        AirbugJar.renderAirbugs();
        if (AirbugJar.isFull()) {
            setTimeout(function() {
                BetaSignUpModal.show();
                // Make airbugs ungrabbable
            }, 1200)
        }
    },
    removeAirbug: function(airbug) {
        var index = AirbugJar.indexOf(airbug);
        if (index > -1) {
            AirbugJar.containedAirbugs.splice(index, 1);
            AirbugJar.renderAirbugs();
        }
        if(airbug.isOtherAirbug()){
            airbug.element.fadeOut(1200);
        }
        OtherAirBugForm.removeWarning();
    },
    renderAirbugs: function() {
        DragManager.clearProxies();
        for (var i = 0, size = AirbugJar.containedAirbugs.length; i < size; i++) {
            var airbug = AirbugJar.containedAirbugs[i];
            var element = airbug.element;
            if (i === 0) {
                DragManager.createDragProxy("hotspot1", $("#airbug-jar-hotspot-1"), airbug);
                element.css("left", "245px");
                element.css("top", "340px");
            } else if (i === 1) {
                DragManager.createDragProxy("hotspot2", $("#airbug-jar-hotspot-2"), airbug);
                element.css("left", "355px");
                element.css("top", "460px");
            } else {
                DragManager.createDragProxy("hotspot3", $("#airbug-jar-hotspot-3"), airbug);
                element.css("left", "235px");
                element.css("top", "540px");
            }
        }
    },
    startDrag: function() {
        var targetElement = AirbugJar.element;
        targetElement.on("touchend mouseup", AirbugJar.handleDragReleaseOnTarget);
        targetElement.addClass("grabbing");
    },
    releaseDrag: function() {
        var targetElement = AirbugJar.element;
        targetElement.off("touchend mouseup", AirbugJar.handleDragReleaseOnTarget);
        targetElement.removeClass("grabbing");
    },
    handleDragReleaseOnTarget: function(event) {
        if (AirbugJar.isNotFull()) {
            var instructionsContainer = $("#instructions-container");
            instructionsContainer.addClass("hide-instructions");
            event.stopPropagation();
            var draggingObject = DragManager.draggingObject;
            DragManager.releaseDrag();
            AirbugJar.addAirbug(draggingObject);
        }
    },
    handleRemovalOfFinalBug: function(event) {
        if (AirbugJar.isNotFull()) {
            ContinueSignUpButton.hide();
            Arrow.show();
            AirbugJar.previouslyContainedAirbugs.forEach(function(airbug){
               airbug.element.off("touchend mouseup", AirbugJar.handleRemovalOfFinalBug);
            });
            AirbugJar.previouslyContainedAirbugs = [];
        }
    }
};

var otherAirBug = new AirBug("other", $("#airbug-other-container"));

var OtherAirBugForm = {
    count: 0,
    element: $('#other-airbug-form-container'),
    initialize: function(){
        $("#other-airbug-form-submit-button").on('click', OtherAirBugForm.handleSubmitButtonClick);
        $("#other-airbug-form-cancel-button").on('click', OtherAirBugForm.handleCancelButtonClick);
        $("#other-airbug-form-container input").on('click', OtherAirBugForm.handleInputFieldClick);
        $('#other-airbug-form-container input').keyup(function(e) {
            if(e.keyCode == 13) {
                OtherAirBugForm.handleSubmitButtonClick(e);
                if (AirbugJar.isNotFull()) {
                    OtherAirBugForm.showButtons();
                }
            } else {
                var inputValue = $('#other-airbug-form-container input').val();
                $('#other-airbug-faux-form input').attr('placeholder', inputValue);
            }
        });
    },
    hide: function(){OtherAirBugForm.element.hide()},
    handleInputFieldClick: function(){
        OtherAirBugForm.removeWarning();
        OtherAirBugForm.showButtons();
    },
    handleSubmitButtonClick: function(event){
        if (AirbugJar.isNotFull()) {
            var instructionsContainer   = $("#instructions-container");
            var otherAirbug             = OtherAirBugForm.createOtherAirbug();
            instructionsContainer.addClass("hide-instructions");
            AirbugJar.addAirbug(otherAirbug);
            $('#other-airbug-form-container input').val('');
        } else {
            OtherAirBugForm.addWarning();
        }
        OtherAirBugForm.hideButtons();
    },
    handleCancelButtonClick: function(event){
        $('#other-airbug-form-container input').val('');
        $('#other-airbug-form-container .btn').hide();
        $('#other-airbug-form-cancel-button').hide();
    },
    removeWarning: function(){
        $('#other-airbug-form-container input').removeClass('warning');
        $('#other-airbug-form-container input').val('');
    },
    addWarning: function(){
        $('#other-airbug-form-container input').val('Too many bugs in the jar!');
        $('#other-airbug-form-container input').addClass('warning');
    },
    hideButtons: function(){
        $('#other-airbug-form-container .btn').hide();
        $('#other-airbug-form-cancel-button').hide();
    },
    showButtons: function(){
        $('#other-airbug-form-container .btn').show();
        $('#other-airbug-form-cancel-button').show();
    },
    /*
     * @return {AirBug}
     **/
    createOtherAirbug: function(){
        var count                   = OtherAirBugForm.count += 1;
        var inputValue              = $('#other-airbug-form-container input').val();
        var otherAirbugHtml         = "<div id='airbug-other-" + count + "-container', class='airbug-container airbug-other-container'><img id='airbug-other-image', class='airbug-image', src='/img/airbug-service-swarm-other.png', alt='Other'/><div class='other-airbug-faux-form'><div class='control-group'><label class='control-label', for='other'><div class='controls'><input type='text', id='other', name='other', placeholder='Other Tools' /></div></div></div></div>";
        $('#bug-swarm-container').append(otherAirbugHtml);
        var otherAirbug             = new AirBug('other: ' + inputValue, $("#airbug-other-" + count + "-container"));
        otherAirbug.isOtherAirbug = function(){return true};
        $("#airbug-other-" + count + "-container .other-airbug-faux-form input").val(inputValue);
        return otherAirbug;
    }
};

var Arrow = {
    element: $(".arrow-container"),
    activate: function(){
        Arrow.element.on('click', function(){
            BetaSignUpModal.element.modal('show');
            Arrow.element.css("cursor", "pointer");
        });
    },
    hide: function(){
        Arrow.element.hide();
    },
    show: function(){
        Arrow.element.show();
    }
};

var ContinueSignUpButton = {
    element: $("#continue-sign-up-button-container"),
    show: function(){
        ContinueSignUpButton.element.show();
    },
    hide: function(){
        ContinueSignUpButton.element.hide();
    }
};

var BetaSignUpModal = {
    element: $("#beta-sign-up-modal"),
    initialize: function() {
        if (!BetaSignUpModal.initialized) {
            BetaSignUpModal.initialized = true;
            var betaSignUpSubmitButton = $("#beta-sign-up-form-submit-button");
            var betaSignUpCancelButton = $("#beta-sign-up-form-cancel-button");
            var betaSignUpCloseButton  = $(".modal-header .close");
            betaSignUpSubmitButton.on("click", BetaSignUpModal.handleSubmitButtonClick);
            betaSignUpCancelButton.on("click", BetaSignUpModal.handleCancelButtonClick);
            betaSignUpCloseButton.on("click", BetaSignUpModal.handleCancelButtonClick);
            ContinueSignUpButton.element.on("click", function(){
                BetaSignUpModal.element.modal('show');
            });
        }
    },
    show: function() {
        BetaSignUpModal.element.modal('show');
        Arrow.hide();
        ContinueSignUpButton.show();
    },
    hide: function() {
        BetaSignUpModal.element.modal('hide');
    },

    getFormData: function() {
        var formDataArray = $('#beta-sign-up-form').serializeArray();
        var betaSignUpData = {};
        formDataArray.forEach(function(formEntry) {
            betaSignUpData[formEntry.name] = formEntry.value;
        });
        betaSignUpData.wishList = AirbugJar.getAirbugNames();
        return betaSignUpData;
    },

    submitForm: function(formData) {
        Tracker.trackGoalComplete("SignedUpForBeta");
        sendApiRequest("/api/beta-sign-up", formData, function(error, result) {
            //TODO BRN: Handle errors
        });
    },

    validateForm: function(formData, callback) {
        var formDataArray = $('#beta-sign-up-form').serializeArray();
        var error = null;
        formDataArray.forEach(function(formEntry){
            var name = formEntry.name;
            var value = formEntry.value;
            if((name === 'name' && value === '') || (name === 'email' && value === '')){
                $('#' + name + '+.validation').addClass("invalid");
                error = new Error("Required fields have not been filled in");
            }
        });
        callback(error);
    },

    showFormError: function(error) {

    },

    handleCancelButtonClick: function(event) {
        event.preventDefault();
        BetaSignUpModal.hide();
        var currentlyContainedAirbugs = AirbugJar.containedAirbugs;
        AirbugJar.previouslyContainedAirbugs = currentlyContainedAirbugs;
        currentlyContainedAirbugs.forEach(function(airbug){
           airbug.element.on("touchend mouseup", AirbugJar.handleRemovalOfFinalBug);
        });
        $('#name+.validation').removeClass("invalid");
        $('#email+.validation').removeClass("invalid");
        return false;
    },
    handleSubmitButtonClick: function(event) {
        event.preventDefault();
        var formData = BetaSignUpModal.getFormData();
        $('#name+.validation').removeClass("invalid");
        $('#email+.validation').removeClass("invalid");
        BetaSignUpModal.validateForm(formData, function(error) {
            if (!error) {
                BetaSignUpModal.submitForm(formData);
                BetaSignUpModal.hide();
                PageManager.goToPage(ThankYouPage);
            } else {
                BetaSignUpModal.showFormError(error);
            }
        });
        return false;
    }
};


// Drag Manager
//-------------------------------------------------------------------------------

var DragProxy = function(name, element, draggableObject) {
    this.name = name;
    this.element = element;
    this.draggableObject = draggableObject;
};
DragProxy.prototype = {
    setup: function() {
        DragManager.registerDraggableObject(this);
    },
    initializeDragProxy: function() {
        var _this = this;
        this._handle = function(event) {
            _this.handleInteractionStart(event);
        };
        this.element.on("touchstart mousedown", this._handle);
        this.element.addClass("grab");
    },
    uninitializeDragProxy: function() {
        this.element.off("touchstart mousedown", this._handle);
        this.element.removeClass("grab");
        this.element.removeClass("grabbing");
    },
    startDrag: function() {
        this.element.addClass("grabbing");
        this.element.removeClass("grab");
    },
    releaseDrag: function() {
        this.element.addClass("grab");
        this.element.removeClass("grabbing");
    },
    handleInteractionStart: function(event) {
        event.preventDefault();
        DragManager.startDrag(this.draggableObject, event.clientX, event.clientY);
    }
};

var DragManager = {
    draggingObject: null,
    boundingOffsets: null,
    dragStartOffsets: null,
    draggableObjects: new List(),
    dragTargets: [],
    dragProxies: [],

    createDragProxy: function(name, element, draggableObject) {
        var dragProxy = new DragProxy(name, element, draggableObject);
        DragManager.registerDragProxy(dragProxy);
    },
    registerDraggableObject: function(draggableObject) {
        DragManager.draggableObjects.add(draggableObject);
        draggableObject.initializeDraggableObject();
    },
    deregisterDraggableObject: function(draggableObject) {
        DragManager.draggableObjects.remove(draggableObject);
        draggableObject.deactivateDraggableObject();
    },
    registerDragTarget: function(dragTarget) {
        DragManager.dragTargets.push(dragTarget);
    },
    registerDragProxy: function(dragProxy) {
        DragManager.dragProxies.push(dragProxy);
        dragProxy.initializeDragProxy();
    },
    startDrag: function(draggableObject, startX, startY) {
        DragManager.draggingObject = draggableObject;
        var draggableElement = draggableObject.element;
        var draggingElementOffsets = draggableElement.offset();
        DragManager.dragStartOffsets = {
            left: startX - draggingElementOffsets.left,
            top: startY - draggingElementOffsets.top
        };
        DragManager.boundingOffsets = draggableElement.parent().offset();
        var body = $('body');
        body.on("touchmove mousemove", DragManager.handleDragMove);
        body.on("touchend mouseup", DragManager.handleDragRelease);

        DragManager.dragTargets.forEach(function(dragTarget) {
            dragTarget.startDrag();
        });
        DragManager.dragProxies.forEach(function(dragProxy) {
            dragProxy.startDrag();
        });
        draggableObject.startDrag();
    },
    moveDrag: function(clientX, clientY) {
        var x = clientX - DragManager.boundingOffsets.left - DragManager.dragStartOffsets.left;
        var y = clientY - DragManager.boundingOffsets.top - DragManager.dragStartOffsets.top;
        var element = DragManager.draggingObject.element;
        element.css("left", x + "px");
        element.css("top", y + "px");
    },
    releaseDrag: function() {
        var body = $('body');
        body.off("touchmove mousemove", DragManager.handleDragMove);
        body.off("touchend mouseup", DragManager.handleDragRelease);

        DragManager.dragTargets.forEach(function(dragTarget) {
            dragTarget.releaseDrag();
        });
        DragManager.dragProxies.forEach(function(dragProxy) {
            dragProxy.releaseDrag();
        });

        DragManager.draggingObject.releaseDrag();

        DragManager.dragStartOffsets = null;
        DragManager.draggingObject = null;
        DragManager.boundingOffsets = null;
    },
    clearProxies: function() {
        DragManager.dragProxies.forEach(function(dragProxy) {
            dragProxy.uninitializeDragProxy();
        });
        DragManager.dragProxies = [];
    },
    indexOf: function(dragProxy) {
        for (var i = 0, size = DragManager.dragProxies.length; i < size; i++) {
            var dragProxyAt = DragManager.dragProxies[i];
            if (dragProxyAt.name === dragProxy.name) {
                return i;
            }
        }
    },
    removeProxy: function(dragProxy) {
        var index = DragManager.indexOf(dragProxy);
        if (index > -1) {
            DragManager.dragProxies.splice(index, 1);
            dragProxy.uninitializeDragProxy();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    handleDragMove: function(event) {
        DragManager.moveDrag(event.clientX, event.clientY);
    },

    handleDragRelease: function(event) {
        DragManager.releaseDrag();
    }
};


// Thank You Page
//-------------------------------------------------------------------------------

var ThankYouPage = {
    pageName: "thankYouPage",
    initialize: function() {

    },
    activate: function() {
        var betaSignUpPage = $("#beta-sign-up-page");
        var thankYouPage = $("#thank-you-page");
        betaSignUpPage.addClass("page-slide-hide");
        thankYouPage.show();
        thankYouPage.addClass("page-slide-show");
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.SplashApplication', SplashApplication);
