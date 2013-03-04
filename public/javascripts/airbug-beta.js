//TODO BRN: Update the objects in this file to use our class model from bugjs

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

    feedbackTab.bind("click", handleFeedbackTabClick);
    body.bind("click", handleBodyClick);
    feedbackContainer.bind("click", handleFeedbackContainerClick);
    feedbackEdgeContainer.bind("click", handleFeedbackEdgeContainerClick);
    feedbackFormCancelButton.bind("click", handleFeedbackFormCancelButtonClick);
    feedbackFormSubmitButton.bind("click", handleFeedbackFormSubmitButtonClick);
};

var handleFeedbackTabClick = function() {
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

    feedbackData.currentPage = currentPage;
    return feedbackData;
};

var showFeedbackFormError = function(error) {

};

var submitFeedbackForm = function(feedbackFormData) {
    sendApiRequest("/api/feedback", feedbackFormData, function(error, result) {
        //TODO BRN: Handle errors
    });
    feedbackSubmitted = true;
};

var validateFeedbackForm = function(feedbackFormData, callback) {
    //TODO BRN: Validate the feedback form data
    callback();
};


var currentPage = "loadingPage";

// Explainer page
//-------------------------------------------------------------------------------

var initializeExplainerPage = function() {
    var betaSignUpButton = $("#beta-sign-up-button");
    betaSignUpButton.bind("click", function(event) {
        goToBetaSignUpPage();
    });
};

var goToExplainerPage = function(){
    initializeExplainerPage();
    var explainerPage = $("#explainer-page");
    var loadingPage = $("#loading-page");
    explainerPage.show();
    loadingPage.hide();
    currentPage = "explainerPage";
};


// Beta SignUp Page
//-------------------------------------------------------------------------------

var goToBetaSignUpPage = function() {
    initializeBetaSignUpPage();
    var explainerPage = $("#explainer-page");
    var betaSignUpPage = $("#beta-sign-up-page");
    explainerPage.addClass("page-slide-hide");
    betaSignUpPage.show();
    betaSignUpPage.addClass("page-slide-show");
    currentPage = "betaSignUpPage";
};

var AirBug = function(name, element) {
    this.name = name;
    this.element = element;
};
AirBug.prototype = {
    setup: function() {
        DragManager.registerDraggableObject(this);
    },
    initializeDraggableObject: function() {
        var _this = this;
        var element = this.element;
        element.bind("touchstart mousedown", function(event) {
            _this.handleDragStart(event);
        });
    },
    handleDragStart: function(event) {
        event.preventDefault();
        DragManager.startDrag(this, event.clientX, event.clientY);
        AirbugJar.removeAirbug(this);
    },
    releaseDrag: function() {

    }
};

var airbugs = [
    new AirBug("basecamp", $("#airbug-basecamp-container")),
    new AirBug("bitbucket", $("#airbug-bitbucket-container")),
    new AirBug("github", $("#airbug-github-container")),
    new AirBug("jira", $("#airbug-jira-container")),
    new AirBug("other", $("#airbug-other-container")),
    new AirBug("pivotaltracker", $("#airbug-pivotaltracker-container")),
    new AirBug("salesforce", $("#airbug-salesforce-container")),
    new AirBug("uservoice", $("#airbug-uservoice-container")),
    new AirBug("zendesk", $("#airbug-zendesk-container"))
];
var initializeBetaSignUpPage = function() {
    airbugs.forEach(function(airbug) {
        airbug.setup();
    });
    DragManager.registerDragTarget(AirbugJar);
    BetaSignUpModal.initialize();
};

var AirbugJar = {
    element: $("#airbug-jar-container"),
    containedAirbugs: [],
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

        if (AirbugJar.getCount() >= 3 ) {
            setTimeout(function() {
                BetaSignUpModal.show();
            }, 1200)
        }
    },
    removeAirbug: function(airbug) {
        var index = AirbugJar.indexOf(airbug);
        if (index > -1) {
            AirbugJar.containedAirbugs.splice(index, 1);
            AirbugJar.renderAirbugs();
        }
    },
    renderAirbugs: function() {
        DragManager.clearProxies();
        for (var i = 0, size = AirbugJar.containedAirbugs.length; i < size; i++) {
            var airbug = AirbugJar.containedAirbugs[i];
            var element = airbug.element;
            if (i === 0) {
                element.css("left", "245px");
                element.css("top", "340px");
            } else if (i === 1) {
                element.css("left", "355px");
                element.css("top", "460px");
            } else {
                element.css("left", "235px");
                element.css("top", "540px");
            }
        }
    },
    initializeDragTarget: function() {
        var targetElement = AirbugJar.element;
        targetElement.bind("touchend mouseup", AirbugJar.handleDragReleaseOnTarget);
        targetElement.addClass("grabbing");
    },
    uninitializeDragTarget: function() {
        var targetElement = AirbugJar.element;
        targetElement.unbind("touchend mouseup", AirbugJar.handleDragReleaseOnTarget);
        targetElement.removeClass("grabbing");
    },
    handleDragReleaseOnTarget: function(event) {
        if (AirbugJar.getCount() < 3) {
            var instructionsContainer = $("#instructions-container");
            instructionsContainer.addClass("hide-instructions");
            event.stopPropagation();
            var draggingObject = DragManager.draggingObject;
            DragManager.releaseDrag();
            AirbugJar.addAirbug(draggingObject);
        }
    }
};

var BetaSignUpModal = {
    element: $("#beta-sign-up-modal"),
    initialize: function() {
        if (!BetaSignUpModal.initialized) {
            BetaSignUpModal.initialized = true;
            var betaSignUpSubmitButton = $("#beta-sign-up-form-submit-button");
            var betaSignUpCancelButton = $("#beta-sign-up-form-cancel-button");
            betaSignUpSubmitButton.bind("click", BetaSignUpModal.handleSubmitButtonClick);
            betaSignUpCancelButton.bind("click", BetaSignUpModal.handleCancelButtonClick);
        }
    },
    show: function() {
        BetaSignUpModal.element.modal('show');
    },
    hide: function() {
        BetaSignUpModal.element.modal('hide');
    },

    getFormData: function() {
        var formDataArray = $('#beta-sign-up-form').serializeArray();
        var betaSignUpData = {};

        //TEST
        console.log(formDataArray);
        formDataArray.forEach(function(formEntry) {
            betaSignUpData[formEntry.name] = formEntry.value;
        });
        betaSignUpData.wishList = AirbugJar.getAirbugNames();

        return betaSignUpData;
    },

    submitForm: function(formData) {
        sendApiRequest("/api/beta-sign-up", formData, function(error, result) {
            //TODO BRN: Handle errors
        });
        feedbackSubmitted = true;
    },

    validateForm: function(formData, callback) {
        //TODO BRN: Validate the feedback form data
        callback();
    },

    showFormError: function(error) {

    },

    handleCancelButtonClick: function(event) {
        event.preventDefault();
        BetaSignUpModal.hide();
        return false;
    },
    handleSubmitButtonClick: function(event) {
        event.preventDefault();

        var formData = BetaSignUpModal.getFormData();

        //TEST
        console.log("beta signup modal");
        console.log(formData);

        BetaSignUpModal.validateForm(formData, function(error) {
            if (!error) {
                BetaSignUpModal.submitForm(formData);
                BetaSignUpModal.hide();
                goToThankYouPage();
            } else {
                BetaSignUpModal.showFormError(error);
            }
        });
        return false;
    }

};


// Drag Manager
//-------------------------------------------------------------------------------

var DragManager = {
    draggingObject: null,
    boundingOffsets: null,
    dragStartOffsets: null,
    draggableObjects: [],
    dragTargets: [],
    registerDraggableObject: function(draggableObject) {
        DragManager.draggableObjects.push(draggableObject);
        draggableObject.initializeDraggableObject();
    },
    registerDragTarget: function(dragTarget) {
        DragManager.dragTargets.push(dragTarget);
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
        body.bind("touchmove mousemove", DragManager.handleDragMove);
        body.bind("touchend mouseup", DragManager.handleDragRelease);

        DragManager.dragTargets.forEach(function(dragTarget) {
            dragTarget.initializeDragTarget();
        });

        //NOTE BRN: There seems to be a bug here where the cursor is not changed immediately when the mouse is down
        //https://bugs.webkit.org/show_bug.cgi?id=53341

        draggableElement.removeClass("grab");
        draggableElement.removeClass("drag-released");
        draggableElement.addClass("grabbing");
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
        body.unbind("touchmove mousemove", DragManager.handleDragMove);
        body.unbind("touchend mouseup", DragManager.handleDragRelease);

        DragManager.dragTargets.forEach(function(dragTarget) {
            dragTarget.uninitializeDragTarget();
        });

        DragManager.draggingObject.releaseDrag();
        var draggingElement = DragManager.draggingObject.element;
        draggingElement.css("left", "");
        draggingElement.css("top", "");
        draggingElement.addClass("drag-released");
        draggingElement.addClass("grab");
        draggingElement.removeClass("grabbing");

        DragManager.dragStartOffsets = null;
        DragManager.draggingObject = null;
        DragManager.boundingOffsets = null;
    },
    clearProxies: function() {

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

var goToThankYouPage = function() {
    initializeThankYouPage();
    var betaSignUpPage = $("#beta-sign-up-page");
    var thankYouPage = $("#thank-you-page");
    betaSignUpPage.addClass("page-slide-hide");
    thankYouPage.show();
    thankYouPage.addClass("page-slide-show");
    currentPage = "thankYouPage";
};

var initializeThankYouPage = function() {

};

// App Code
//-------------------------------------------------------------------------------

var start = function() {
    if (Loader.appLoaded) {
        initializeApp();
    } else {
        Loader.addLoadedListener(function() {
            initializeApp();
        });
    }
};

var initializeApp = function() {
    initializeFeedbackPanel();
    goToExplainerPage();
};

start();