document.addEventListener("DOMContentLoaded", function(event) {

  // console.log('DOCUMENT READY TO PARSE!', 'DATA READY TO TRACK AND SEND!');

  //sends events by type and to endpoint
  var wokeSharkMetrics = {},
    event, request, eventType;

  //add more endpoints here

  const linkClickEndpoint = "http://wokesharks.herokuapp.com/linkClick";
  const pageViewEndpoint = "http://wokesharks.herokuapp.com/pageView";


  //Generic Tracking Mechanism
  wokeSharkMetrics.report = function(eventData, eventType, endpoint) {
    event = {};
    event[eventType] = eventData;
    console.log('EVENT BEING SENT TO ENDPOINT', event, endpoint);
    request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(event));
  };

  //click events
  document.body.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    console.log('event target', event.target);
    console.log('event target inner text', event.target.text);
    if (event.target.text) {
      wokeSharkMetrics.report(event.target.text, "url", linkClickEndpoint);
    }
  };

  //hash change events
  if ("onhashchange" in window) {
    function currentHash() {
      console.log('location hash', location.hash);
      if (!location.hash) {
        wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
      } else {
        wokeSharkMetrics.report(location.hash, "title", pageViewEndpoint);
      }
    }
  }

  //listen for hash change events
  window.onhashchange = currentHash;

  //send initial pageview data on load
  wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);

});
