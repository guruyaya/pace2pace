(function(){
  console.log(openpgp);
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

  // load the json file from url
  // extract the json portion
  // get the _ROOT key
  // validate signature
})();
