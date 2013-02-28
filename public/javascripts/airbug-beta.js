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

var goToBetaSignupPage = function() {
    var explainerPage = $("#explainer-page");
    var betaSignupPage = $("#beta-signup-page");

    explainerPage.hide();
    betaSignupPage.show();
};

var start = function() {
    if (Loader.appLoaded) {
        initializeApp();
    } else {
        Loader.addLoadedListener(function() {
            initializeApp();
        });
    }
};

var feedbackPanelOpen = false;
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
        var feedbackContainer = $('#feedback-container');
        feedbackContainer.removeClass('feedback-container-collapse');
        feedbackContainer.addClass('feedback-container-expand');

       //TODO BRN: After the completion of the animation, change the feedback pulling airbug to be the proud airbug
   }
};

var closeFeedbackPanel = function() {
    if (feedbackPanelOpen) {
        feedbackPanelOpen = false;
        var feedbackContainer = $('#feedback-container');
        feedbackContainer.removeClass('feedback-container-expand');
        feedbackContainer.addClass('feedback-container-collapse');

        //TODO BRN: After the completion of the animation,
        // If the user submitted feedback change the feedback pulling airbug to be the thanks you sign airbug
        // If the user did not submit feedback change the feedback airbug to the pulling airbug
    }
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

var initializeApp = function() {
    var betaSignupButton = $("#beta-signup-button");
    var explainerPage = $("#explainer-page");
    var loadingPage = $("#loading-page");
    var feedbackTab = $("#feedback-tab");
    var body = $('body');
    var feedbackContainer = $('#feedback-container');
    var feedbackEdgeContainer = $("#feedback-edge-container");
    betaSignupButton.bind("click", function(event) {
        goToBetaSignupPage();
    });
    feedbackTab.bind("click", handleFeedbackTabClick);
    body.bind("click", handleBodyClick);
    feedbackContainer.bind("click", handleFeedbackContainerClick);
    feedbackEdgeContainer.bind("click", handleFeedbackEdgeContainerClick);
    explainerPage.show();
    loadingPage.hide();
};

start();
