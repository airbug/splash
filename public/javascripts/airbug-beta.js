var postXMLDoc, parseToURLEncoded, parseToJSON;

postXMLDoc = function postXMLDoc(data) {
    var xmlhttp, contentType;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        contentType = 'application/json';
        data = parseToJSON(data);
    } else {// code for IE6, IE5
        var ieXMLHttpVersions = ['MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp', 'Microsoft.XMLHttp']; 
        for (var i = 0; i < ieXMLHttpVersions.length; i++) {
               try {
                   xmlHttp = new ActiveXObject(ieXMLHttpVersions[i]);
               } catch (e) {
               }
           } 
        xmlhttp = new ActiveXObject(ieXMLHttpVersions[i]);
        contentType = 'application/x-www-form-urlencoded';
        data = parseToURLEncoded(data);
    }
    
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                alert(xmlHttp.responseText);
            } else {
                alert('Error: ' + xmlHttp.responseText);
            }
        } else {
        //still loading
        }
    };

    xmlhttp.open("POST", "beta-signup-form.txt", true);
    xmlHttp.setRequestHeader("Content-Type", contentType);
    xmlhttp.send(data);
};

parseToJSON = function(sendForm) {
    var jsonObj = {};
    for (var i = 0; i < sendForm.elements.length; i++) {
        var name = sendForm.elements[i].name;
        var value = sendForm.elements[i].value;
        jsonObj.name = value;
    }
    return JSON.stringify(jsonObj);
};

parseToURLEncoded = function(sendForm) {
    var dataArray = [];
    //Getting the data from all elements in the form
    for (var i = 0; i < sendForm.elements.length; i++) {
        var encodedData = encodeURIComponent(sendForm.elements[i].name);
        encodedData += "=";
        encodedData += encodeURIComponent(sendForm.elements[i].value);
        dataArray.push(ProM);
    }
    return dataArray.join("&");
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
    feedbackAirbugPull1.removeClass("feedback-airbug-pull-1-collapsed");
    feedbackAirbugPull1.removeClass("feedback-airbug-pull-1-collapse");
    feedbackAirbugPull1.addClass("feedback-airbug-pull-1-expanded");
    feedbackAirbugPull1.addClass("feedback-airbug-pull-1-expand");
    var feedbackAirbugPull2 = $("#feedback-airbug-pull-2");
    feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-collapse");
    feedbackAirbugPull2.addClass("feedback-airbug-pull-2-expand");
    var feedbackAirbugPull3 = $("#feedback-airbug-pull-3");
    feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-collapse");
    feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-collapsed");
    feedbackAirbugPull3.addClass("feedback-airbug-pull-3-expand");
    feedbackAirbugPull3.addClass("feedback-airbug-pull-3-expanded");

    //TODO BRN: Hide the thank you airbug
};

var closeFeedbackPanel = function() {
    if (feedbackPanelOpen) {
        feedbackPanelOpen = false;
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
    feedbackAirbugPull1.removeClass("feedback-airbug-pull-1-expandeded");
    feedbackAirbugPull1.removeClass("feedback-airbug-pull-1-expand");
    if (feedbackSubmitted) {
        feedbackAirbugPull1.addClass("feedback-airbug-pull-1-thankyou");
        //TODO BRN: Show the thank you airbug
    } else {
        feedbackAirbugPull1.addClass("feedback-airbug-pull-1-collapsed");
        feedbackAirbugPull1.addClass("feedback-airbug-pull-1-collapse");
    }
    var feedbackAirbugPull2 = $("#feedback-airbug-pull-2");
    feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-expand");
    feedbackAirbugPull2.addClass("feedback-airbug-pull-2-collapse");
    var feedbackAirbugPull3 = $("#feedback-airbug-pull-3");
    feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-expand");
    feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-expanded");
    feedbackAirbugPull3.addClass("feedback-airbug-pull-3-collapse");
    feedbackAirbugPull3.addClass("feedback-airbug-pull-3-collapsed");
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

    //TODO BRN: Parse the data from the feedback form.

    return {};
};

var showFeedbackFormError = function(error) {

};

var submitFeedbackForm = function(feedbackFormData) {

    //TODO BRN: Submit the feedback form to the server.
    //postXMLDoc(parseForm(document.getElementById('feedback-form')));

    feedbackSubmitted = true;
};

var validateFeedbackForm = function(feedbackFormData, callback) {
    //TODO BRN: Validate the feedback form data
    callback();
};


// Explainer page
//-------------------------------------------------------------------------------

var initializeExplainerPage = function() {
    var betaSignupButton = $("#beta-signup-button");
    betaSignupButton.bind("click", function(event) {
        goToBetaSignupPage();
    });
};

var goToExplainerPage = function(){
    initializeExplainerPage();
    var explainerPage = $("#explainer-page");
    var loadingPage = $("#loading-page");
    explainerPage.show();
    loadingPage.hide();
};


// Beta Signup Page
//-------------------------------------------------------------------------------

var goToBetaSignupPage = function() {
    initializeBetaSignupPage();
    var explainerPage = $("#explainer-page");
    var betaSignupPage = $("#beta-signup-page");
    explainerPage.hide();
    betaSignupPage.show();
};

var initializeBetaSignupPage = function() {

    $(
        "#airbug-basecamp-container," +
        "#airbug-bitbucket-container," +
        "#airbug-github-container," +
        "#airbug-jira-container," +
        "#airbug-other-container," +
        "#airbug-pivotaltracker-container," +
        "#airbug-salesforce-container," +
        "#airbug-uservoice-container," +
        "#airbug-zendesk-container"
    ).each(function() {
        var target = $(this);
        target.bind("touchstart mousedown", function(event) {
            handleAirbugDragStart(event, target);
        });
    });

};

var dragTarget = null;
var boundingOffsets = null;
var dragStartOffsets = null;
var handleAirbugDragStart = function(event, target) {
    event.preventDefault();
    dragTarget = target;
    var dragTargetOffsets = dragTarget.offset();
    dragStartOffsets = {
        left: event.clientX - dragTargetOffsets.left,
        top: event.clientY - dragTargetOffsets.top
    };
    boundingOffsets = $("#bug-swarm-container").offset();
    var body = $('body');
    body.bind("touchmove mousemove", handleAirbugDragMove);
    body.bind("touchend mouseup", handleAirbugDragEnd);
    dragTarget.removeClass("airbug-container-released");
};

var handleAirbugDragMove = function(event) {
    var x = event.clientX - boundingOffsets.left - dragStartOffsets.left;
    var y = event.clientY - boundingOffsets.top - dragStartOffsets.top;

    //TODO BRN: Add an animation that has the bug follow your cursor.

    dragTarget.css("left", x + "px");
    dragTarget.css("top", y + "px");
};

var handleAirbugDragEnd = function(event) {
    var body = $('body');
    body.unbind("touchmove mousemove", handleAirbugDragMove);
    body.unbind("touchend mouseup", handleAirbugDragEnd);
    dragTarget.css("left", "");
    dragTarget.css("top", "");
    dragTarget.addClass("airbug-container-released");
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
