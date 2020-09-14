//LEAFLET MAP
var currentClient;//eingeloggter Nutzer
var database;
var userCoordinates;//gewählte Koordinaten in der Karte, Marker
var inputStops=[];//auswahlmöglichkeiten im Dropdown nach hinzufügen des Nutzers
var mymap = L.map('mapid').setView([51.653, 10.203], 6);
fetchDatabase();


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);

// creating a Toolbar on the Mapboxmap only option to set a marker

//wird durch button aufgerufen, macht die Marker setzfunktion sichtbar
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
    layer.bindPopup('Ausgewählte Position: '+ layer.getLatLng()).openPopup();}


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
var apiHere;
function showPosition(position) {

    let userLocation = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates":[ position.coords.longitude, position.coords.latitude]},
          "properties":{ "name":"aktuelle Position"}}]};
    //JSON.parse('{"userLocation":true}');
    //runden der Koordinaten der Browserlocation
    userLocation.features[0].geometry.coordinates[0]=(userLocation.features[0].geometry.coordinates[0]).toFixed(3);
    userLocation.features[0].geometry.coordinates[1]=(userLocation.features[0].geometry.coordinates[1]).toFixed(3);
    console.log(userLocation.features[0].geometry.coordinates);
    inputStops.push(userLocation);
    var popupLocation = L.popup({
                           autoClose: false}).setContent('Ihr Standort');
    var coordinates=[userLocation.features[0].geometry.coordinates[1],userLocation.features[0].geometry.coordinates[0]];
    var icon=L.icon({iconUrl:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF'});
    L.marker(coordinates, {
      icon: icon
    }).addTo(mymap).bindPopup(popupLocation).openPopup();
    console.log(coordinates);

    apiHere='https://transit.router.hereapi.com/v8/departures?apiKey=yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA&in='+coordinates+'&maxPlaces=7';
    console.log(apiHere);
  fetchApi(apiHere);
  refreshDropdown();

  }



  /**
  *@function changeVisibility
  *@desc makes address input section visible for user
  */
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

/**
*@function refreshDropdown
*@desc refreshes dropdown-list and shows all user inputs
*/
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


/**
*@function showStations
*@desc shows Stations in radius around user location
*/
function showStations(resultStaDep){
  console.log(resultStaDep);
  for (var i=0; i<resultStaDep.boards.length; i++){
    var stationCoordinates=[];

    stationCoordinates.push(resultStaDep.boards[i].place.location.lat, resultStaDep.boards[i].place.location.lng);

  var popupInfo=document.createElement('ul');
  popupInfo.appendChild(document.createTextNode(resultStaDep.boards[i].place.name));
  popupInfo.appendChild(document.createElement("br"));
  popupInfo.appendChild(document.createElement("br"));

    for(var j=0; j<resultStaDep.boards[i].departures.length; j++){

      var li = document.createElement('li');

      var text=(resultStaDep.boards[i].departures[j].time).slice(0,16)+' '+resultStaDep.boards[i].departures[j].transport.headsign;
      var checkbox = document.createElement('input');
      checkbox.type = "radio";
      checkbox.id = "checkboxid" + i+j;
      checkbox.name="popup";
      //checkbox.innerHTML+=text;
      checkbox.onclick=function(){filterPopupInfos(this); }



      //checkbox.setAttribute("value",text);

      var label =document.createElement("label");
      label.id="labelid"+i+j;
      label.innerHTML += text;

      label.appendChild(checkbox);
      li.appendChild(checkbox);
      li.appendChild(label);
      //li.appendChild(text);
      popupInfo.appendChild(li);



}
var popupCloseStations = L.popup({
  autoClose: true}).setContent(popupInfo);
    //autoClose: true}).setContent("Nächste Abfahrten"+JSON.stringify(resultStaDep.boards[i].departures[0]));
    L.circle(stationCoordinates, {radius: 10}).addTo(mymap).bindPopup(popupCloseStations);



  }

}

function filterPopupInfos(myRadio){
  var checkboxid=(myRadio.id).slice(10,12);
  var label=document.getElementById('labelid'+checkboxid).textContent;
  console.log(label);
  //console.log(document.getElementById('labelid'+checkboxid));
  var date=label.slice(0,10);
  console.log(date);

  var time=label.slice(11,16);
  console.log(time);

  document.getElementById('start-date').value=date;
  document.getElementById('start-time').value=time;
}



var s = new XMLHttpRequest();

function fetchApi(api){

  s.onload = sloadcallback;
  s.onerror = serrorcallback;
  s.onreadystatechange = sstatechangecallback;
  s.open("GET", api, true);
  s.send();

}

/**
*@function sstatechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls mappingUserInput function
*/
function sstatechangecallback() {
  if (s.status == "200" && s.readyState == 4) {
    var resultStaDep=JSON.parse(s.responseText);
    //console.log(stations);
      showStations(resultStaDep);}


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

//stellt die neu hinzugefügte Route des Users auf der Karte dar
//alle Koordinatenpaare die sich auf den ÖPNV beziehen werden in der richtigen Reihenfolge aus der Route gefiltert
function drawRoute(){
  var coordiArray=[];// enthält nur die Koordinaten der Strecke in der Richtigen Reihenfolge (Abschnittsweise Startpunkt, Zwischenhalte, Zielpunkt)
  //if(route.routes[0].length==0){alert('Keine Route gefunden. Überprüfe alle Angaben'); return;}
  if(route.notices){alert('Keine Route gefunden. Überprüfe alle Angaben'); return;}
  for (var i=0; i<route.routes[0].sections.length; i++){
     if(route.routes[0].sections[i].type=='transit'){
       console.log(route.routes[0].sections[i].departure.place.location.lat, route.routes[0].sections[i].departure.place.location.lng);
       coordiArray.push([route.routes[0].sections[i].departure.place.location.lat, route.routes[0].sections[i].departure.place.location.lng]);

       for (var j=0; j<route.routes[0].sections[i].intermediateStops.length; j++){
         console.log(route.routes[0].sections[i].intermediateStops[j].departure.place.location.lat, route.routes[0].sections[i].intermediateStops[j].departure.place.location.lng);
         coordiArray.push([route.routes[0].sections[i].intermediateStops[j].departure.place.location.lat, route.routes[0].sections[i].intermediateStops[j].departure.place.location.lng]);
        }
        console.log(route.routes[0].sections[i].arrival.place.location.lat, route.routes[0].sections[i].arrival.place.location.lng);
        coordiArray.push([route.routes[0].sections[i].arrival.place.location.lat, route.routes[0].sections[i].arrival.place.location.lng]);
     }
   }console.log(coordiArray);
   var popupStart = L.popup({
                          autoClose: false}).setContent("Abfahrtsbahnhof");
    var startMarker=L.marker(coordiArray[0]).addTo(mymap).bindPopup(popupStart).openPopup();

    var popupDesti = L.popup({
                           autoClose: false}).setContent("Ankunftsbahnhof");
     var destiMarker=L.marker(coordiArray[coordiArray.length-1]).addTo(mymap).bindPopup(popupDesti).openPopup();
   var polyline=L.polyline(coordiArray, {color: 'blue'}).addTo(mymap);
   mymap.fitBounds(polyline.getBounds());
}

//speichert die ausgewählte route in einem GEoJSON mit den relevanten Informationen
var routeGeoJSON={"type":"FeaturesCollection", "contaminatedRide":0,
"features":[]};
function toGeoJson(){

  console.log(route);
    var geoJSON;


  if(route.notices){return;}
  for(var k=0; k<route.routes[0].sections.length; k++){
    if(route.routes[0].sections[k].type==='transit'){
      //nur Abschnitte, welche ÖPNV beinhalten werden berücksichtigt
      //ein Abschnitt ist die Strecke welche ohne Umsteigen zurückegelegt wird. Sobald ein Umstieg stattfindet, gibt es einen neuen ABfahrtsort, neue Zwischenhalte und einen weiteren Ankunftsort (wird nicht auf der KArte dargestellt)
      //der Startpunkt des ersten Abschnittes wird als GeoJSON gespeichert und als erstes in das RoutenGeoJSON hinzugefügt
       geoJSON = {
              "type": "Feature",
              "geometry":{"type": "Point", "coordinates":[route.routes[0].sections[k].departure.place.location.lng, route.routes[0].sections[k].departure.place.location.lat]},
              "properties":{ "name":route.routes[0].sections[k].departure.place.name,
                              "time":route.routes[0].sections[k].departure.time,
                              //"risk":0
                            }};


      routeGeoJSON.features.push(geoJSON);
      //console.log(routeGeoJSON);

      for (var j=0; j<route.routes[0].sections[k].intermediateStops.length; j++){
        //alle Zwischenstops des Abschnittes werden als GeoJSON der Route angehängt
        geoJSON = {
               "type": "Feature",
               "geometry":{"type": "Point", "coordinates":[route.routes[0].sections[k].intermediateStops[j].departure.place.location.lng, route.routes[0].sections[k].intermediateStops[j].departure.place.location.lat]},
               "properties":{ "name":route.routes[0].sections[k].intermediateStops[j].departure.place.name,
                               "time":route.routes[0].sections[k].intermediateStops[j].departure.time,
                               //"risk":0
                             }};

        routeGeoJSON.features.push(geoJSON);
        //console.log(routeGeoJSON);
      }
      //das Ziel wird als GeoJSON der Route hinzugefügt
      geoJSON = {
             "type": "Feature",
             "geometry":{"type": "Point", "coordinates":[route.routes[0].sections[k].arrival.place.location.lng, route.routes[0].sections[k].arrival.place.location.lat]},
             "properties":{ "name":route.routes[0].sections[k].arrival.place.name,
                             "time":route.routes[0].sections[k].arrival.time,
                             //"risk":0
                           }};

      //console.log(geoJSON.geometry.coordinates,geoJSON.properties.name,geoJSON.properties.time);
      routeGeoJSON.features.push(geoJSON);
      }
  }console.log(routeGeoJSON);

  currentClient.rides.push(routeGeoJSON);
  updateDB();
  routeGeoJSON={"type":"FeaturesCollection", "contaminatedRide":0,
  "features":[]};
  //setTimeout(function (){console.log(currentClient.rides);}, 500);
}


//speichert die Informationen des aktuell eingeloggten Users
function extractClientData(){
  document.getElementById('start-date').value='TT-MM-JJJJ';
  document.getElementById('start-time').value='HH-MM';
  for(var i=0; i<database.length; i++){
    if(database[i].username==currentClient.username){
      currentClient=database[i];
      console.log(currentClient);
      console.log(currentClient.rides);
      document.getElementById('general').innerHTML='<b>'+'Übersicht des Nutzers: '+currentClient.username;
      return;
      }
    }

}

async function fetchDatabase(){

    let result =await promise();
    //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
    console.log(result[result.length-1]);
    currentClient=result[result.length-1];
    database=result;
    extractClientData();
  }

/**
*@function promise
*@desc sends a request to the server via /item
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
//die Rides des aktuell eingeloggten Users werden überschrieben
//Problem beim aktualisieren wird ein weiteres Array außenrum geschrieben
function updateDB(){
  var rides=currentClient.rides;
  var addTo={"_id":currentClient._id, "rides":rides, "coronaStatus":currentClient.coronaStatus};
  console.log(rides);

  //server request- updating changed coordinates by _id
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




}



//https://transit.router.hereapi.com/v8/routes?apiKey=yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA&origin=51.9568,7.6345&destination=51.9694,7.5961&modes=bus&return=intermediate
