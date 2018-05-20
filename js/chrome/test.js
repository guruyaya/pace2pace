(function(){
  readPace2PaceSignaturesDoc('http://www.balibalic.info/pace2pace.txt', function(){
    console.log('I am here');
  });
  readPace2PaceSignaturesDoc('http://www.balibalic.info/Pace2PaceDocSigException.txt');
  readPace2PaceSignaturesDoc('http://www.balibalic.info/Pace2PaceUrlInvalidException.txt');
})();
