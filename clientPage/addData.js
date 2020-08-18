//LEAFLET MAP
console.log("test");

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);

var resource = "https://transit.hereapi.com/v8/stations";
var x = new XMLHttpRequest();
var pointCollection;

stations();

/**
*@function stations
*@desc handling the XMLHttpRequest
*/
function stations () {

  x.onload = loadcallback;
  x.onerror = errorcallback;
  x.onreadystatechange = statechangecallback;
  x.open("GET", resource, true);
  x.send();

}

/**
*@function statechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, transforming it into a JSON, calls unixConverter
*/
function statechangecallback() {
  if (x.status == "200" && x.readyState == 4) {

    pointCollection = x.responseText;
    console.log(pointCollection);
    pointCollection = JSON.parse(pointCollection);

  }
}

/**
*@function errorcallback
*@desc informs the User about an error
*/
function errorcallback(e) {
  document.getElementById("error").innerHTML = "errorcallback: check web-console";
}

/**
*@function loadcallback
*@desc informs about an incorrect format in the console
*/
function loadcallback() {
  if(x.status!="200"){
    console.log(x.status);
  }
}
