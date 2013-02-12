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