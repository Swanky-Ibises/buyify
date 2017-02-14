document.addEventListener("DOMContentLoaded", function(event) {
  var domain = window.location.hostname;
  var analyticsURL = 'https://ibises-analytics.herokuapp.com'
  //This function is just for making post requests
  request = new XMLHttpRequest();
  var postRequest = function(postData, endpoint) {
    request.open('POST', endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    request.send(JSON.stringify(postData));
  }
  //This function posts the time difference to the analytics back end
  var postTimeDifference = function(firstDate, location, newLocation) {
    let postData = {
      newLocation,
      domain,
      timeDifference: Math.abs(new Date() - window.firstDate),
      location: window.thisLocation,
      date: window.firstDate
    };
    postRequest(postData, pageTimeEndpoint);
    window.firstDate = new Date();
  }

  var postPageView = function(page) {
    let postData = {
      domain,
      title: page
    }
    postRequest(postData, pageViewEndpoint);
  }

  var postLinkClick = function(link) {
    let postData = {
      domain,
      url: link
    }
    postRequest(postData, linkClickEndpoint);
  }


  //add endpoints here

  const linkClickEndpoint = `${analyticsURL}/linkClick`;
  const pageViewEndpoint = `${analyticsURL}/pageView`;
  const pageTimeEndpoint = `${analyticsURL}/pagetime`;
  const addressEndpoint = `${analyticsURL}/${domain}/address`;


  //Get request for IP address of client
  $.get('http://ipinfo.io', function(response) {
      $.get('http://freegeoip.net/json/' + response.ip, function(response) {
        if (response.country_code === 'US') {
          var cityUS = response.city + ', ' + response.region_code;
        }
        // console.log('location data', response);
        // console.log('city here', cityUS || response.city);
        var postData = {
          ip: response.ip,
          city: cityUS || response.city,
          country: response.country_name
        }
        console.log('postData', postData);
        postRequest(postData, addressEndpoint);
      });
  }, 'jsonp');

  window.firstDate = new Date();
  window.thisLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
  window.onbeforeunload = function() {
    postTimeDifference(window.firstDate, window.thisLocation);
  }
  document.onbeforeunload = window.onbeforeunload;



  //configuration (move to object eventually)

  //sends events by type and to endpoint
  var wokeSharkMetrics = {},
    event, request, eventType;

  //set wokeShark Session

  sessionStorage.setItem("wokeSharkSession", true);



  //Generic Tracking Mechanism

  wokeSharkMetrics.report = function(eventData, eventType, endpoint, metaData) {
    event = {};
    event[eventType] = eventData;
    console.log('EVENT BEING SENT TO ENDPOINT', event, endpoint);
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
    if (event.target.text) {
      postLinkClick(event.target.text);
    }
  };

  //hash change events

  if ("onhashchange" in window) {
    function currentHash() {
      var newLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
      postTimeDifference(window.firstDate, window.thisLocation, newLocation);
      window.thisLocation = newLocation;
    }
  }


  //listen for hash change events
  window.onhashchange = currentHash;

  //send initial pageview data on load
  wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
});
