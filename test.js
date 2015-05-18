function test(){
  var props = "";
  var tests = filter(isTest_, Object.keys(window));
  var results = zip(tests, map(function(f){return window[f]()}, tests));
  var failed = filter(function(arr){return !arr[1]}, results);
  var output = foldl(function(x, acc){ return acc + x[0] + ", " }, failed, "");
  var div = document.getElementById("results");
  div.innerHTML = "Failed: " + output;
}

function isTest_(test){
  return test.length > 4 &&
         test.length - 4 == test.indexOf("Test");
}
