document.addEventListener("DOMContentLoaded", function(event) {
  //This function is just for making post requests
  var postRequest = function(postData, endpoint) {
    request.open('POST', endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    request.send(JSON.stringify(postData));
  }

  //This function posts the time difference to the analytics back end
  var postTimeDifference = function(firstDate, domain, location) {
    let postData = {
      domain: domain,
      timeDifference: Math.abs(new Date() - window.firstDate),
      location: window.thisLocation,
      date: window.firstDate
    };
    postRequest(postData, pageTimeEndpoint);
    window.firstDate = new Date();
  }

  $.get('http://ipinfo.io', function(response) {
      $.get('http://freegeoip.net/json/' + response.ip, function(response) {
        if (response.country_code === 'US') {
          var cityUS = response.city + ', ' + response.region_code;
        }
        console.log('location data', response);
        console.log('city here', cityUS || response.city);
        var postData = {
          city: cityUS || response.city,
          country: response.country_name
        }
        console.log('postData', postData);
      });
  }, 'jsonp');

  window.firstDate = new Date();
  window.thisLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
  window.onbeforeunload = function() {
    postTimeDifference(window.firstDate, location.hostname, window.thisLocation);
  }
  document.onbeforeunload = window.onbeforeunload;



  //configuration (move to object eventually)

  //sends events by type and to endpoint
  var wokeSharkMetrics = {},
    event, request, eventType;

  //set wokeShark Session

  sessionStorage.setItem("wokeSharkSession", true);

  //add endpoints here

  const linkClickEndpoint = "https://swanky-ibises-analytics.herokuapp.com/linkClick";
  const pageViewEndpoint = "https://swanky-ibises-analytics.herokuapp.com/pageView";
  const pageTimeEndpoint = "http://127.0.0.1:8080/pagetime";


  //Generic Tracking Mechanism

  wokeSharkMetrics.report = function(eventData, eventType, endpoint, metaData) {
    event = {};
    event[eventType] = eventData;
    console.log('EVENT BEING SENT TO ENDPOINT', event, endpoint);
    request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    request.send(JSON.stringify(event));
  };

  //click events

  document.body.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    // console.log('event target', event.target);
    // console.log('event target inner text', event.target.text);
    if (event.target.text) {
      //event type = url, eventData = "Add to card"
      //how to pass product name back to server?
      wokeSharkMetrics.report(event.target.text, "url", linkClickEndpoint);
    }
  };

  //hash change events

  if ("onhashchange" in window) {
    function currentHash() {
      console.log('hash change HERE')
      // console.log('location hash', location.hash);
      if (!location.hash) {
        //event type = title , eventData = "Buyify"
        wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
      } else {
        var locationNoHash = location.hash.replace(/[^\w\s]/gi, '');
        // console.log('locationNoHash', locationNoHash);
        wokeSharkMetrics.report(locationNoHash, "title", pageViewEndpoint);
      }
      //Post the time difference to analytics
      postTimeDifference(window.firstDate, location.hostname, window.thisLocation);
      window.thisLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
    }
  }


  //listen for hash change events
  window.onhashchange = currentHash;

  //send initial pageview data on load
  wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
});
