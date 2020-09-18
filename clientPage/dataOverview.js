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

var apiKey = '';
var access_token = "";


var currentClient=[]; // information of the logged-in user
var database;


fetchDatabase();
var mymap = L.map('mapid').setView([51.653, 10.203], 6);
createMap();

/**
*@function createMap
*@desc initializes map
*/

function createMap(){
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+access_token, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: access_token
}).addTo(mymap);}


var pooledRides=[];

/**
*@function createPooledRides
*@desc creates an array with all stations and the corresponding time of the rides that the doctor has marked as riskful
*/

function createPooledRides(){
  for(var a=0; a<database.length; a++){
    if(database[a].rides){
    if(database[a].doc==false){
      for (var b=0; b<database[a].rides.length; b++){
        if(database[a].rides[b].contaminatedRide==1){
          for(var c=0; c<database[a].rides[b].features.length; c++){
            if(database[a].username!=currentClient.username){
            pooledRides.push([database[a].rides[b].features[c].properties.name, database[a].rides[b].features[c].properties.time]);
        }
        }
        }
        }
      }
    }
  }
  console.log(pooledRides);
  createCurrentClientRides();

}


var currentClientRides=[];
/**
*@function createCurrentClientRides
*@desc creates an array with all stations and corresponding time that the currently logged-in user has stopped at during a ride
*/
function createCurrentClientRides(){

  for(var d=0; d<currentClient.rides.length; d++){
    for(var f=0; f<currentClient.rides[d].features.length; f++){
      currentClientRides.push([currentClient.rides[d].features[f].properties.name, currentClient.rides[d].features[f].properties.time]);

    }
  }
  console.log(currentClientRides);
  matchRides();
}


/**
*@function matchRides
*@desc checks if the current user has stopped at stations at the same time as other users; counts the number of "shared" stations of a user
*@desc shows an alert giving the current corona information of a user as soon as the user is logged-in
*/

function matchRides(){
  var mybr = document.createElement('br');
  console.log(pooledRides);
  var riskCounter=0; // counts the number of "risky" stations
  for (var g=0; g<currentClientRides.length;g++){
    for (var h=0; h<pooledRides.length; h++){
      if(currentClientRides[g][0]==pooledRides[h][0] && currentClientRides[g][1]==pooledRides[h][1]){
        riskCounter++;
      }
    }
  }
  console.log(riskCounter);
  //classification of the risk a single user has
  if(riskCounter==0 && currentClient.coronaStatus == 'negative'){
    currentClient.risk=0; // no alert if the user has not been on "riskful" rides and if the coronastatus is negative
    return;
  }
  else if(riskCounter==0 && currentClient.coronaStatus== 'positive'){
    currentClient.risk=0;
    alert('Ihr aktueller Infektionsstatus ist '+ currentClient.coronaStatus+'.\n'+ 'Das durch Ihre Fahrtenaktivität bedingte Infektionsrisiko liegt bei '+currentClient.risk+'.');
    return;
  }
  else if(riskCounter<11){
    currentClient.risk=1;
    updateDB();
    alert('Ihr aktueller Infektionsstatus ist '+ currentClient.coronaStatus+'.\n'+ 'Das durch Ihre Fahrtenaktivität bedingte Infektionsrisiko liegt bei '+currentClient.risk+'.');
    return;
  }
  else if(riskCounter<21){
    currentClient.risk=2;
    updateDB();
    alert('Ihr aktueller Infektionsstatus ist '+ currentClient.coronaStatus+'.\n'+ 'Das durch Ihre Fahrtenaktivität bedingte Infektionsrisiko liegt bei '+currentClient.risk+'.');
    return;
  }
  else if(riskCounter>20){
    currentClient.risk=3;
    updateDB();
    alert('Ihr aktueller Infektionsstatus ist '+ currentClient.coronaStatus+'.\n'+ 'Das durch Ihre Fahrtenaktivität bedingte Infektionsrisiko liegt bei '+currentClient.risk+'.');
    return;
  }
}

/*
  var ev = document.getElementById('infobox');
ev.onmouseover = function() {
  document.getElementById('popupInfo').style.display = 'block';
}
ev.onmouseout = function() {
  document.getElementById('popupInfo').style.display = 'none';
}
*/

/**
*@function showData
*@desc shows user profile on the website
*/

function showData(){

      document.getElementById('general').innerHTML='<b>'+'Nutzername: '+currentClient.username;
      document.getElementById('patientCoronaStatus').innerHTML=currentClient.coronaStatus;
      document.getElementById('patientRisk').innerHTML=currentClient.risk;
}


/**
*@function plotRides
*@desc mapping all rides a user has taken in the colour depending on whether a ride has a risk or not (determined by the doctor)
*/

function plotRides(){
//clears the map before showing rides
  mymap.eachLayer(function (layer) {
  mymap.removeLayer(layer);
  });
  createMap();

  for(var i=0; i<currentClient.rides.length; i++){//checks which rides are checked
    var checkbox=document.getElementById('checkboxid'+i);
    if(checkbox.checked){
      //only checked rides are being mapped
      var ride=[];
      for(var j=0; j<currentClient.rides[i].features.length; j++){
      ride.push([currentClient.rides[i].features[j].geometry.coordinates[1],currentClient.rides[i].features[j].geometry.coordinates[0]]);
  }

  if(currentClient.rides[i].contaminatedRide==1){ //riskful rides are plotted red
    var polyline = L.polyline(ride, {color: 'red'}).addTo(mymap);
    var popupStartR = L.popup({
                           autoClose: false}).setContent('Starthaltestelle: ' + currentClient.rides[i].features[0].properties.name);
    var startMarkerR=L.marker(ride[0]).addTo(mymap).bindPopup(popupStartR);

    var popupDestiR = L.popup({
                            autoClose: false}).setContent('Endhaltestelle: ' + currentClient.rides[i].features[currentClient.rides[i].features.length-1].properties.name);
    var destiMarkerR=L.marker(ride[ride.length-1]).addTo(mymap).bindPopup(popupDestiR);
  }

  else{
        var line = L.polyline(ride, {color: 'green'}).addTo(mymap);//rides with no risk are plotted green
        var popupStartG = L.popup({
                                autoClose: false}).setContent('Starthaltestelle: ' + currentClient.rides[i].features[0].properties.name);
        var startMarkerG=L.marker(ride[0]).addTo(mymap).bindPopup(popupStartG);
        var popupDestiG = L.popup({
                                 autoClose: false}).setContent('Endhaltestelle: ' + currentClient.rides[i].features[currentClient.rides[i].features.length-1].properties.name);
        var destiMarkerG=L.marker(ride[ride.length-1]).addTo(mymap).bindPopup(popupDestiG);
      }
    }
  }
}


/**
*@function createRidesList
*@desc creates of all rides of the user on the website
*/

function createRidesList(){
  document.getElementById('ul').innerHTML='';
  console.log(currentClient.rides.length);
  for(var i=0; i<currentClient.rides.length; i++){ // for-loop to create list
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);
    var br = document.createElement('br');
    var checkbox = document.createElement('input');
    var label= document.createElement("label");
    label.id='label'+i;

    if(currentClient.rides[i].contaminatedRide==1){ // checks if the ride is "risky"
      var descriptionRed = document.createTextNode('Fahrt vom: '+(currentClient.rides[i].features[0].properties.time).slice(0,19)+': '+currentClient.rides[i].features[0].properties.name + ' bis ' +currentClient.rides[i].features[currentClient.rides[i].features.length-1].properties.name );
      label.style.color='red'; // "risky" rides are red
      label.appendChild(descriptionRed);
  }

  else{ // checks if the ride is "unrisky"
    var descriptionGreen = document.createTextNode('Fahrt vom: '+(currentClient.rides[i].features[0].properties.time).slice(0,19)+': '+currentClient.rides[i].features[0].properties.name + ' bis ' +currentClient.rides[i].features[currentClient.rides[i].features.length-1].properties.name );
    label.appendChild(descriptionGreen);
      label.style.color='green'; // "riskless" rides are green
}

    checkbox.type = "checkbox";
    checkbox.id = "checkboxid" + i;

    label.appendChild(checkbox);

    //adds all elements to the website
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(br);
    ul.appendChild(li);
    document.getElementById('checkboxid'+i).checked = true;
  }
}

/**
*@function fetchDatabase
*@desc sends a request to the server via /item for fetching the database, awaits till the database is loaded
*/

async function fetchDatabase(){

    let result =await promise();

    currentClient=result[result.length-1];//getting the information from the log-in
    database=result;

    createCurrentClient();
    createPooledRides();
    showData();
    createRidesList();
    plotRides();
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


/**
*@function createCurrentClient
*@desc loads the data of the currentClient from the database
*/

function createCurrentClient(){
  for(var i=0; i<database.length; i++){ // for-loop to go through whole database
    console.log(database[i].username);
    if(database[i].username==currentClient.username){ //checks for the correct user
      currentClient=database[i];
      console.log(currentClient);
      return;
    }
  }
}

/**
*@function updateDB
*@desc overwrites risk status of the logged-in user
*/

function updateDB(){
  var addTo={"_id":currentClient._id, "risk":currentClient.risk};

  //server request- updating rides  by _id
  fetch("/update-risk",{
    method:'put',
    body: JSON.stringify(addTo),
    headers: {
      'Content-Type': 'application/json'}
    }).then(res=>{if (res.ok) return res.json();});
}
