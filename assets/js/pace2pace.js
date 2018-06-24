function createCustomException (name) {
  return function(code, message) {
    this.prototype = new Error();
    this.prototype.constructor = name;
    this.message = message;
    this.code = code;
  }
}

var Pace2PaceDocSigException = {
    name:        "Pace2PaceDocSigException",
    message:     "The document signature is invalid",
};

var Pace2PaceUrlInvalidException = function(url){
  return {
    name:        "Pace2PaceUrlInvalidException",
    message:     "Url " + url + " is not allowed by this document",
  }
};


var getSignedFile = function(url, successCallback, failCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            successCallback(xhr.responseText, xhr);
        }
        else {
            failCallback(xhr);
        }
    };
    xhr.send();
}

var extractJsonFromSignedFile = function(signedJson){
  // extract the json portion from signed request
  return JSON.parse( signedJson.text );
}
// load the json file from url
var readPace2PaceSignaturesDoc = function(url, successCallback){
    getSignedFile(url, function(data, xhr){
      var signedJson = openpgp.cleartext.readArmored(data);
      var signaturesDoc = extractJsonFromSignedFile(signedJson);
      if (signaturesDoc.urls.indexOf(url) == -1){
        throw new Pace2PaceUrlInvalidException(url)
      }
      // get the _ROOT key
      var pubKeyTxt = signaturesDoc.keys._ROOT.key;
      var pubKey = openpgp.key.readArmored(pubKeyTxt);

      // validate signature
      var b = signedJson.verify(pubKey.keys).then(function(v){
        if (!v[0].valid) {
          throw Pace2PaceDocSigException;
        }
        successCallback();
      });

    });
}
