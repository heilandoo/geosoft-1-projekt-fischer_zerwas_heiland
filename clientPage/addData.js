//LEAFLET MAP
console.log("test");
var chosenPatient;
var patient;
var userCoordinates;
var inputStops=[];
var mymap = L.map('mapid').setView([51.653, 10.203], 6);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);

// creating a Toolbar on the Mapboxmap only option to set a marker


function setMarker(){
  var drawnItems = new L.FeatureGroup();
  mymap.addLayer(drawnItems);
  var drawControl = new L.Control.Draw({
       draw:{
         polygon: false,
         polyline: false,
         line: false,
         circle: false,
         rectangle: false
       },
       edit: {
           featureGroup: drawnItems
       }
   });
   mymap.addControl(drawControl);
// saving marker position
   mymap.on('draw:created', function (e){

     var type = e.layerType,
     layer = e.layer;
     userCoordinates=(layer.getLatLng());
     if (type === 'marker') {
       mymap.on('click', function(e) {
    }),
    layer.bindPopup('Your chosen Location: '+ layer.getLatLng()).openPopup();}


    inputMarker=drawnItems.addLayer(layer);
    userCoordinates.lat=(userCoordinates.lat).toFixed(3);
    userCoordinates.lng=(userCoordinates.lng).toFixed(3);

    let userLocation = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates":[ userCoordinates.lng, userCoordinates.lat]},
          "properties":{ "name":"Marker: " +JSON.stringify(userCoordinates)}}]};

    console.log(userCoordinates);
    inputStops.push(userLocation);
    refreshDropdown();
});
   }


function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    document.getElementById('error').innerHTML = "Geolocation is not supported by this browser.";
    }

}

function showPosition(position) {

    let userLocation = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates":[ position.coords.longitude, position.coords.latitude]},
          "properties":{ "name":"aktuelle Position"}}]};
    //JSON.parse('{"userLocation":true}');
    userLocation.features[0].geometry.coordinates[0]=(userLocation.features[0].geometry.coordinates[0]).toFixed(3);
    userLocation.features[0].geometry.coordinates[1]=(userLocation.features[0].geometry.coordinates[1]).toFixed(3);
    console.log(userLocation.features[0].geometry.coordinates);
    inputStops.push(userLocation);
    //document.getElementById('browserLocation').innerHTML=JSON.stringify(userLocation);
    //console.log(userLocation);
  refreshDropdown();
  }
function changeVisibility(){
  document.getElementById('adressInput').style.visibility='visible';
}

var g = new XMLHttpRequest();
var convertedAdress=[];
var userLocationString=' ';


/**
*@function geocoding
*@desc converts an adress into Coordinates using mapBox and XMLHttpRequest
*/
//#####please fill in your own accessToken######################################

function geocoding(){

  var street=document.getElementById('street').value;
  var nr=document.getElementById('nr').value;
  var city=document.getElementById('city').value;
//#####your accessToken#########################################################
  var access_token="pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg";

  userLocationString= street+ ' '+nr+ ' ,'+city;
  var resource ="https://api.mapbox.com/geocoding/v5/mapbox.places/"+ street+ "%20"+ nr +"%20" + city +".json?country=DE&access_token="+access_token;
  console.log(resource);
  //if (inputMarker != undefined){inputMarker.remove();}
    g.onload = gloadcallback;
    g.onerror = gerrorcallback;
    g.onreadystatechange = gstatechangecallback;
    g.open("GET", resource, true);
    g.send();

}

/**
*@function gstatechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls mappingUserInput function
*/
function gstatechangecallback() {
  if (g.status == "200" && g.readyState == 4) {

    convertedAdress = g.responseText;
    convertedAdress= JSON.parse(convertedAdress);
    let userAdress = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates": convertedAdress.features[0].geometry.coordinates},
          "properties":{ "name":"Adresse,"+JSON.stringify(convertedAdress.query[0]+' '+ convertedAdress.query[1]+' '+convertedAdress.query[2])}}]};
          console.log(userAdress.features[0].geometry.coordinates[0]);
          userAdress.features[0].geometry.coordinates[0]=(userAdress.features[0].geometry.coordinates[0]).toFixed(3);
          userAdress.features[0].geometry.coordinates[1]=(userAdress.features[0].geometry.coordinates[1]).toFixed(3);
    inputStops.push(userAdress);
    //convertedAdress=convertedAdress.features[0].geometry.coordinates;
    refreshDropdown();
    }
}

/**
*@function gerrorcallback
*@desc informs the User about an error
*/
function gerrorcallback(e) {
  document.getElementById("error").innerHTML = "errorcallback: check web-console";
}

/**
*@function gloadcallback
*@desc informs about an incorrect format in the console
*/
function gloadcallback() {
  if(g.status!="200"){
    console.log(g.status);
  }
}

function refreshDropdown(){
  var start = document.getElementById('start');
  var destination= document.getElementById('destination');
  var opt1 = null;
  var opt2 = null;
  start.options.length=0;
  destination.options.length=0;

  for(i = 0; i<inputStops.length; i++) {
    console.log(inputStops[i].features[0].properties.name);
    opt1 = document.createElement('option');
    opt1.value = inputStops[i].features[0].properties.name;
    opt1.innerHTML = inputStops[i].features[0].properties.name;
    destination.appendChild(opt1);

    opt2 = document.createElement('option');
    opt2.value = inputStops[i].features[0].properties.name;
    opt2.innerHTML = inputStops[i].features[0].properties.name;
    start.appendChild(opt2);

    }
}

function creatingApi(){
  console.log(inputStops);
  var startInput=document.getElementById('start').value;
  var destiInput=document.getElementById('destination').value;
  var dateInput=document.getElementById('start-date').value;
  var timeInput=document.getElementById('start-time').value;
  var apiKey='yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA';
  var api;
  var startCoordinates=[];
  var destiCoordinates=[];


  if(startInput=='' | destiInput=='' | dateInput=='' | timeInput==''){
    alert('Eingaben unvollständig');
    return;
  }
  if(startInput==destiInput){ alert('Startpunkt und Ziel sind identisch');return;}
  else{
    for(var i=0; i<inputStops.length; i++){
      if(inputStops[i].features[0].properties.name==startInput){
        startCoordinates.push(inputStops[i].features[0].geometry.coordinates[1]);
        startCoordinates.push(inputStops[i].features[0].geometry.coordinates[0]);
        console.log(startCoordinates[0]+','+startCoordinates[1]);
      }
      if(inputStops[i].features[0].properties.name==destiInput){
        destiCoordinates.push(inputStops[i].features[0].geometry.coordinates[1]);
        destiCoordinates.push(inputStops[i].features[0].geometry.coordinates[0]);
      }
      console.log(inputStops);
       api='https://transit.router.hereapi.com/v8/routes?apiKey='+apiKey+'&origin='+startCoordinates[0]+','+startCoordinates[1]+'&destination='+destiCoordinates[0]+','+destiCoordinates[1]+'&departureTime='+dateInput+'T'+timeInput+':00&return=intermediate';
       console.log(api);
       fetchingRoute(api);
    }

  }
}
var x = new XMLHttpRequest();
var route;

function fetchingRoute(api){
    x.onload = loadcallback;
    x.onerror = errorcallback;
    x.onreadystatechange = statechangecallback;
    x.open("GET", api, true);
    x.send();
}

/**
*@function statechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls mappingUserInput function
*/
function statechangecallback() {
  if (x.status == "200" && x.readyState == 4) {

    route = x.responseText;
    console.log(route);

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
  if(g.status!="200"){
    console.log(x.status);
  }
}
//https://transit.router.hereapi.com/v8/routes?apiKey=yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA&origin=51.9568,7.6345&destination=51.9694,7.5961&modes=bus&return=intermediate
/*function createRidesList(){

  console.log(chosenPatient.rides.length);
  for(var i=0; i<chosenPatient.rides.length; i++){
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);
    var br = document.createElement('br');
    var checkbox = document.createElement('input');
    var label= document.createElement("label");
    var description = document.createTextNode(chosenPatient.rides[i]);

    checkbox.type = "checkbox";
    checkbox.id = "checkboxid" + i;

    label.appendChild(checkbox);
    label.appendChild(description);


    //adds all elements to the website

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(br);
    ul.appendChild(li);

  }
}

  async function fetchDatabase(){

    let result =await promise();
    //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
    console.log(result);
    database=result;
    console.log(database);
  dropDown();

  }

*/
/**
*@function promise
*@desc sends a request to the server via /item
*/
/*
function promise(){

  return new Promise(function (res, req){
    $.ajax({
      url:"/item",
      success: function (result){res(result);},
      error: function (err) {console.log(err);}
    });
    });
}

function addToDatabase(user){
  fetch('/save-input', {
                            method: 'post',
                            body: JSON.stringify(user),
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                            }
                          });


}
*/
