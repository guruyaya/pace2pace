(function(){
Pace2PaceDocSigException = {
      name:        "Pace2PaceDocSigException",
      level:       "Show Stopper",
      message:     "The document signature is invalid",
      htmlMessage: "The document signature is invalid",
      toString:    function(){return this.name + ": " + this.message;}
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
  getSignedFile('http://www.balibalic.info/yairkey.txt', function(data, xhr){
    var signedJson = openpgp.cleartext.readArmored(data);
    var pubKeyTxt = extractJsonFromSignedFile(signedJson).keys._ROOT.key;
    var pubKey = openpgp.key.readArmored(pubKeyTxt);
    signedJson.verify(pubKey.keys).then(function(v){
      if (!v[0].valid) {
        throw Pace2PaceDocSigException;
      }
      console.log('SigSuccess');
    });
    // get the _ROOT key
    // validate signature

  });
})();
