//LEAFLET MAP
console.log("test");
var chosenPatient;
var patient;
var inputStops=[];
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);

function refreshDropdown(){
  var start = document.getElementById('start');
  var destination= document.getElementById('destination');
  var opt1 = null;
  var opt2 = null;

  for(i = 0; i<inputStops.length; i++) {

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
    g.onload = loadcallback;
    g.onerror = errorcallback;
    g.onreadystatechange = statechangecallback;
    g.open("GET", resource, true);
    g.send();

}

/**
*@function statechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls mappingUserInput function
*/
function statechangecallback() {
  if (g.status == "200" && g.readyState == 4) {

    convertedAdress = g.responseText;
    let userAdress = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates":[ convertedAdress.features[0].geometry.coordinates]},
          "properties":{ "name":"Adresse"}}]};
    console.log(convertedAdress);
    convertedAdress= JSON.parse(convertedAdress);
    console.log(convertedAdress.features[0].geometry.coordinates);
    convertedAdress=convertedAdress.features[0].geometry.coordinates;
    refreshDropdown();
    }
}

/**
*@function errorcallback
*@desc informs the User about an error
*/
function errorcallback(e) {
  document.getElementById("result").innerHTML = "errorcallback: check web-console";
}

/**
*@function loadcallback
*@desc informs about an incorrect format in the console
*/
function loadcallback() {
  if(g.status!="200"){
    console.log(g.status);
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
