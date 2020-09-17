/**
*@author Magdalena Fischer, Ole Heiland, Cornelius Zerwas
*m_fisc39@wwu.de, oleheiland@wwu.de, czerwas@uni-muenster.de
*01.08.2020
*/

//****various Linter configs****
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097

//________________________________________________________________________________________________________________________________
//###############################################################please insert API key and access token here######################

var apiKey = 'yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA';
var access_token = "pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg";

//###############################################################global#variables#################################################
var currentClient;//logged user
var database;
var userCoordinates;//chosen coordinates of the user (marker)
var inputStops=[];//dropdown choices after adding by the user
var apiHere;

var mymap = L.map('mapid').setView([51.653, 10.203], 6);
createMap();
fetchDatabase(); // loads database

/**
*@function createMap
*@desc creates and initalizes map
*/

function createMap(){
// initialization of mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+access_token, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: access_token,
}).addTo(mymap);
}

// creating a Toolbar on the Mapboxmap only option to set a marker

/**
*@function setMarker
*@desc called by button click - makes marker options visible
*/

function setMarker(){
  var drawnItems = new L.FeatureGroup();
  mymap.addLayer(drawnItems);
  var drawControl = new L.Control.Draw({
       draw:{ // deactivation of several control options
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
    layer.bindPopup('Ausgewählte Position: '+ layer.getLatLng()).openPopup();} //popup for marker, showing coordinates


    inputMarker=drawnItems.addLayer(layer);
    userCoordinates.lat=(userCoordinates.lat).toFixed(3);
    userCoordinates.lng=(userCoordinates.lng).toFixed(3);
    //creating object for dropdown menu
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

 /**
 *@function getLocation callback function
 *@desc connected to browserLocation Button, asks for the Browser Location
 *source: https://www.w3schools.com/html/html5_geolocation.asp
 */

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    document.getElementById('error').innerHTML = "Geolocation is not supported by this browser.";
    }
}


/**
*@function showPosition callback function
*@desc converts browser location into GeoJSON
*@param position object containing coordinates
*source: https://www.w3schools.com/html/html5_geolocation.asp
*/
function showPosition(position) {
  //create dropdown object
    let userLocation = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates":[ position.coords.longitude, position.coords.latitude]},
          "properties":{ "name":"aktuelle Position"}}]};

    //rounds browser coordinates
    userLocation.features[0].geometry.coordinates[0]=(userLocation.features[0].geometry.coordinates[0]).toFixed(3);
    userLocation.features[0].geometry.coordinates[1]=(userLocation.features[0].geometry.coordinates[1]).toFixed(3);


    var popupLocation = L.popup({
                           autoClose: false }).setContent('Ihr Standort');
    var coordinates=[userLocation.features[0].geometry.coordinates[1],userLocation.features[0].geometry.coordinates[0]];
    var icon=L.icon({iconUrl:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF',iconAnchor:[10.5, 17], popupAnchor: [0,-15]});//diffrent marker-> icon
     L.marker(coordinates, {
      icon: icon
    }).addTo(mymap).bindPopup(popupLocation).openPopup();
    mymap.setView(coordinates, 13); // number defines zoom-level

    // console.log(coordinates);
// API for public transit stations near browser location
    apiHere='https://transit.router.hereapi.com/v8/departures?apiKey='+apiKey+'&in='+coordinates+'&maxPlaces=7';
    // console.log(apiHere);
  fetchApi(apiHere);
  for(var u=0; u<inputStops.length; u++){
    if (inputStops[u].features[0].properties.name == "aktuelle Position"){
      return;
    }
  }
  inputStops.push(userLocation);

  refreshDropdown();

}


  /**
  *@function changeVisibility
  *@desc makes address input section visible for user
  */
function changeVisibility(){
  document.getElementById('adressInput').style.visibility='visible';
}

//_______________________________________________________
//####################XMLHttpRequest#geocoding###########
var g = new XMLHttpRequest();
var convertedAdress=[];
var userLocationString=' ';


/**
*@function geocoding
*@desc converts an adress into coordinates using mapBox and XMLHttpRequest
*/

function geocoding(){

// selecting user input
  var street=document.getElementById('street').value;
  var nr=document.getElementById('nr').value;
  var city=document.getElementById('city').value;

  userLocationString= street+ ' '+nr+ ' ,'+city;
  var resource ="https://api.mapbox.com/geocoding/v5/mapbox.places/"+ street+ "%20"+ nr +"%20" + city +".json?country=DE&access_token="+access_token;
  console.log(resource);

    g.onload = gloadcallback;
    g.onerror = gerrorcallback;
    g.onreadystatechange = gstatechangecallback;
    g.open("GET", resource, true);
    g.send();

}


/**
*@function gstatechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, adding to dropdown menu
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


/**
*@function refreshDropdown
*@desc refreshes dropdown-list, adds new options and shows all user inputs
*/

function refreshDropdown(){
  var start = document.getElementById('start');
  var destination= document.getElementById('destination');
  var opt1 = null;
  var opt2 = null;
  start.options.length=0;
  destination.options.length=0;

  for(i = 0; i<inputStops.length; i++) {
    //console.log(inputStops[i].features[0].properties.name);
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


/**
*@function showStations
*@desc shows Stations in radius around user location and creates popups with departure information of all stations
*@param resultStaDep object from XMLHttpRequest
*/
function showStations(resultStaDep){
  //console.log(resultStaDep);
  for (var i=0; i<resultStaDep.boards.length; i++){
    var stationCoordinates=[];
    //array with all coordination pairs of the 5 closest stops
    stationCoordinates.push(resultStaDep.boards[i].place.location.lat, resultStaDep.boards[i].place.location.lng);

  //popup List with title
  var popupInfo=document.createElement('ul');
  popupInfo.appendChild(document.createTextNode(resultStaDep.boards[i].place.name));
  popupInfo.appendChild(document.createElement("br"));
  popupInfo.appendChild(document.createElement("br"));

    for(var j=0; j<resultStaDep.boards[i].departures.length; j++){ // goes through all departures of all stations

      var li = document.createElement('li');

      var text=(resultStaDep.boards[i].departures[j].time).slice(0,16)+' '+resultStaDep.boards[i].departures[j].transport.headsign; // selection of time and final destination of busline
      var checkbox = document.createElement('input');
      checkbox.type = "radio";
      checkbox.id = "checkboxid" + i+j;
      checkbox.name="popup";

      checkbox.onclick=function(){filterPopupInfos(this); }//eventlistener on clicked button


      var label =document.createElement("label");
      label.id="labelid"+i+j;
      label.innerHTML += text;

      //adds the radio button list to the popup
      label.appendChild(checkbox);
      li.appendChild(checkbox);
      li.appendChild(label);
      //li.appendChild(text);
      popupInfo.appendChild(li);
}

// shows closest stops as circles with departure in popup
var popupCloseStations = L.popup({
  autoClose: true}).setContent(popupInfo);
    L.circle(stationCoordinates, {radius: 10}).addTo(mymap).bindPopup(popupCloseStations).on('click', onClick);
  }
}


// declaration of variables for eventhandler
var popupContent;
var popupCoordinates;

/**
*@function onClick
*@desc eventhandler for radiobutton list in station popups
*/
function onClick(e){
  popupContent = e;
  // console.log(popupContent);
  popupCoordinates=e.latlng;
  popupContent=popupContent.target._map._popup._content.childNodes[0].data;
  //console.log(popupContent);
}


/**
*@function filterPopupInfos
*@desc extracting relevant information from station popup for dropdown menu
*@param myRadio clicked radiobutton in station popup
*/

function filterPopupInfos(myRadio){
  var checkboxid=(myRadio.id).slice(10,12);
  var label = document.getElementById('labelid'+checkboxid).textContent;
  // console.log(label);
  var date = label.slice(0,10); // slicing to select only date
  // console.log(date);
  var time = label.slice(11,16); // slicing to select only time
  //console.log(time);

  document.getElementById('start-date').value=date;
  document.getElementById('start-time').value=time;

  let popupLocation = {"type":"FeatureCollection",
    "features":[
        {"type": "Feature",
        "geometry":{"type": "Point", "coordinates":[ popupCoordinates.lng, popupCoordinates.lat]},
        "properties":{ "name":popupContent}}]};
        // console.log(inputStops.length);
        // console.log(inputStops[0].features[0].properties.name);
        // console.log(popupContent);
        for(var u=0; u<inputStops.length; u++){
          if (inputStops[u].features[0].properties.name == popupContent){ // avoids duplication of stations in dropdown list
            return;
        }
      }
        inputStops.unshift(popupLocation);//adds clicked station in front of dropdown
        refreshDropdown();
}


//_______________________________________________________
//#######XMLHttpRequest#departures_closest_Stops#########

var s = new XMLHttpRequest();


/**
*@function fetchApi
*@desc sets up Here XMLHttpRequest for departures of closest stations
*@param api = completed API link
*/

function fetchApi(api){

  s.onload = sloadcallback;
  s.onerror = serrorcallback;
  s.onreadystatechange = sstatechangecallback;
  s.open("GET", api, true);
  s.send();

}

/**
*@function sstatechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls showStations function, passes the retrieved object
*/

function sstatechangecallback() {
  if (s.status == "200" && s.readyState == 4) {
    var resultStaDep=JSON.parse(s.responseText);
    //console.log(stations);
      showStations(resultStaDep);
    }
}


/**
*@function serrorcallback
*@desc informs the User about an error
*/

function serrorcallback(e) {
  document.getElementById("error").innerHTML = "errorcallback: check web-console";
}


/**
*@function sloadcallback
*@desc informs about an incorrect format in the console
*/

function sloadcallback() {
  if(s.status!="200"){
    console.log(s.status);
  }
}


/**
*@function creatingApi
*@desc extracts the relevant information from the user input and creates an API-request-link
*/

function creatingApi(){
  // extracting user input
  var startInput=document.getElementById('start').value;
  var destiInput=document.getElementById('destination').value;
  var dateInput=document.getElementById('start-date').value;
  var timeInput=document.getElementById('start-time').value;

  var api;
  var startCoordinates=[];
  var destiCoordinates=[];

  // check if user filled out all input fields
  if(startInput=='' | destiInput=='' | dateInput=='' | timeInput==''){
    alert('Eingaben unvollständig');
    return;
  }

  // avoids that user chooses identical start- and endpoint
  if(startInput==destiInput){
    alert('Startpunkt und Ziel sind identisch');
    return;
  }

  //checks if all inputs are correct, extracting all relevantInputs for API-request
  else {
    for(var i=0; i<inputStops.length; i++){
      if(inputStops[i].features[0].properties.name==startInput){
        startCoordinates.push(inputStops[i].features[0].geometry.coordinates[1]);
        startCoordinates.push(inputStops[i].features[0].geometry.coordinates[0]);
        // console.log(startCoordinates[0]+','+startCoordinates[1]);
      }
      if(inputStops[i].features[0].properties.name==destiInput){
        destiCoordinates.push(inputStops[i].features[0].geometry.coordinates[1]);
        destiCoordinates.push(inputStops[i].features[0].geometry.coordinates[0]);
      }
      // console.log(inputStops);
       api='https://transit.router.hereapi.com/v8/routes?apiKey='+apiKey+'&origin='+startCoordinates[0]+','+startCoordinates[1]+'&destination='+destiCoordinates[0]+','+destiCoordinates[1]+'&departureTime='+dateInput+'T'+timeInput+':00&return=intermediate';
       //console.log(api);
       fetchingRoute(api);
    }
  }
}

//_______________________________________________________
//#######XMLHttpRequest###taken_route####################
//
var x = new XMLHttpRequest();
var route;


/**
*@function fetchingRoute
*@desc sets up Here XMLHttpRequest for requested route
*@param api = completed API link
*/

function fetchingRoute(api){
    x.onload = loadcallback;
    x.onerror = errorcallback;
    x.onreadystatechange = statechangecallback;
    x.open("GET", api, true);
    x.send();
}


/**
*@function statechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls drawRoute and toGeoJson function
*/

function statechangecallback() {
  if (x.status == "200" && x.readyState == 4) {
    route = JSON.parse(x.responseText);
    console.log(route);
    drawRoute();
    toGeoJson();
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

/**
*@function drawRoute
*@desc maps the most recently added route of the user
*/

function drawRoute(){
  mymap.eachLayer(function (layer) {
  mymap.removeLayer(layer);
  });
  createMap();
  var coordiArray=[]; //contains all coordinate pairs in correct order of one route (start,intermediate stops, destination)

  // checks if any route is available
  if(route.notices){
    alert('Keine Route gefunden. Überprüfe alle Angaben');
    return;
  }

  for (var i=0; i<route.routes[0].sections.length; i++){
     if(route.routes[0].sections[i].type=='transit'){ // add coordinates of start station
       coordiArray.push([route.routes[0].sections[i].departure.place.location.lat, route.routes[0].sections[i].departure.place.location.lng]);

       for (var j=0; j<route.routes[0].sections[i].intermediateStops.length; j++){ //adds coordinates of intermediate stops
        coordiArray.push([route.routes[0].sections[i].intermediateStops[j].departure.place.location.lat, route.routes[0].sections[i].intermediateStops[j].departure.place.location.lng]);
        }
        //adds coordinates of destination station
        coordiArray.push([route.routes[0].sections[i].arrival.place.location.lat, route.routes[0].sections[i].arrival.place.location.lng]);
     }
   }

   // popup and marker for departure station
   var popupStart = L.popup({
                          autoClose: false}).setContent("Abfahrtsbahnhof");
    var startMarker=L.marker(coordiArray[0]).addTo(mymap).bindPopup(popupStart).openPopup();

 // popup and marker for destination station
   var popupDesti = L.popup({
                           autoClose: false}).setContent("Ankunftsbahnhof");
    var destiMarker=L.marker(coordiArray[coordiArray.length-1]).addTo(mymap).bindPopup(popupDesti).openPopup();

   var polyline=L.polyline(coordiArray, {color: 'blue'}).addTo(mymap);
   mymap.fitBounds(polyline.getBounds());
}


/**
*@function toGeoJson
*@desc saves the selected route in a GeoJSON
*/

var routeGeoJSON={"type":"FeaturesCollection", "contaminatedRide":0,
"features":[]};
function toGeoJson(){
  var geoJSON;

  if(route.notices){return;}
  // only sections of the route containing public transport are considered
  for(var k=0; k<route.routes[0].sections.length; k++){
    if(route.routes[0].sections[k].type==='transit'){

      // a section is a part of the route without any busline (etc.) changes; if there is a change, it is considered as a new section with a new start and end
      //start station
       geoJSON = {
              "type": "Feature",
              "geometry":{"type": "Point", "coordinates":[route.routes[0].sections[k].departure.place.location.lng, route.routes[0].sections[k].departure.place.location.lat]},
              "properties":{ "name":route.routes[0].sections[k].departure.place.name,
                              "time":route.routes[0].sections[k].departure.time,
                            }};

      routeGeoJSON.features.push(geoJSON);
      //console.log(routeGeoJSON);

      for (var j=0; j<route.routes[0].sections[k].intermediateStops.length; j++){
        // all intermediate stops of one section are added to the route as GeoJSON
        geoJSON = {
               "type": "Feature",
               "geometry":{"type": "Point", "coordinates":[route.routes[0].sections[k].intermediateStops[j].departure.place.location.lng, route.routes[0].sections[k].intermediateStops[j].departure.place.location.lat]},
               "properties":{ "name":route.routes[0].sections[k].intermediateStops[j].departure.place.name,
                               "time":route.routes[0].sections[k].intermediateStops[j].departure.time,
                             }};

        routeGeoJSON.features.push(geoJSON);
        //console.log(routeGeoJSON);
      }
      //destination station
      geoJSON = {
             "type": "Feature",
             "geometry":{"type": "Point", "coordinates":[route.routes[0].sections[k].arrival.place.location.lng, route.routes[0].sections[k].arrival.place.location.lat]},
             "properties":{ "name":route.routes[0].sections[k].arrival.place.name,
                             "time":route.routes[0].sections[k].arrival.time,
                           }};

      //console.log(geoJSON.geometry.coordinates,geoJSON.properties.name,geoJSON.properties.time);
      routeGeoJSON.features.push(geoJSON);
      }
  }
  console.log(routeGeoJSON);
  //new ride gets added to the Users profil
  currentClient.rides.push(routeGeoJSON);
  updateDB();
  routeGeoJSON={"type":"FeaturesCollection", "contaminatedRide":0,
  "features":[]};
}

/**
*@function extractClientData
*@desc saves information of the logged-in user
*/

function extractClientData(){

  // reset of time selection field
  document.getElementById('start-date').value='TT-MM-JJJJ';
  document.getElementById('start-time').value='HH-MM';

  //using the login information->checking database for original user profile
  for(var i=0; i<database.length; i++){
    if(database[i].username==currentClient.username){
      currentClient=database[i];
      document.getElementById('general').innerHTML='<b>'+'Nutzername: '+currentClient.username;
      return;
      }
    }
}


/**
*@function fetchDatabase
*@desc sends a request to the server via /item for fetching the database
*/

async function fetchDatabase(){

    let result = await promise();
    // console.log(result[result.length-1]);
    currentClient=result[result.length-1];
    database=result;
    extractClientData();
  }


/**
*@function promise
*@desc sends a request to the database via /item
*/

function promise(){

  return new Promise(function (res, req){
    $.ajax({
      url:"/item",
      success: function (result){res(result);},
      error: function (err) {console.log(err);}
    });
    });
}

/**
*@function updateDB
*@desc overwrites routes of the logged-in user
*/

function updateDB(){
  var rides=currentClient.rides;
  var addTo={"_id":currentClient._id, "rides":rides, "coronaStatus":currentClient.coronaStatus};
  // console.log(rides);

  //server request- updating rides  by _id
  fetch("/update-input",{
    method:'put',
    body: JSON.stringify(addTo),
    headers: {
      'Content-Type': 'application/json'}
    }).then(res=>{if (res.ok) return res.json();});
    console.log(rides);
    //setTimeout(function(){ console.log(rides); }, 3000);
    //location.reload();
}



/*
function addToDatabase(routeGeoJSON){
  var value=currentClient.rides.push(routeGeoJSON);
  console.log(JSON.stringify(routeGeoJSON));
	fetch('/add-input', {
                            method: 'post',
                            body: JSON.stringify(value),
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                            }
                          });
}

function deleteItem(){
  var value=[];
  var id=[];

      value=currentClient;
      id=currentClient._id;
      console.log(value);
      //server request - deleting checked item by _id
      fetch("/delete-input",{
        method:'delete',
        body: JSON.stringify(value),
        headers: {
          'Content-Type': 'application/json'}
        });//.then(res=>{if (res.ok) return res.json();}).then(showingDatabaseContent()); //reloading database content
}*/
