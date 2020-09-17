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
}).addTo(mymap);
}

var database=[];
var patients=[];
var chosenPatient;
fetchDatabase();


/**
*@function dropDown
*@desc initalizes dropdown menu to select patient/user
*/

function dropDown(){
  var sel = document.getElementById('patientDropdown');
  var opt = null;
  //console.log(database);
  for (var i=0; i<database.length; i++){

    if(database[i].doc==false){ //select only patients and not usernames of doctors
      patients.push(database[i]); // array with all patients
    }
  }

  for(i = 0; i<patients.length; i++) { // for-loop to create dropdown option for every patient
    opt = document.createElement('option');
    opt.value = patients[i].username;
    opt.innerHTML = patients[i].username;
    sel.appendChild(opt);
    }
  }


// eventlistener for selected dropdown option
// depending on selection, the corresponding patient information is showed on the website
  var selection = document.getElementById('patientDropdown');
  selection.addEventListener('change', (e) => {
     chosenPatient=e.target.value;
    for (var i=0; i<patients.length;i++){
      if (chosenPatient==patients[i].username){
        chosenPatient=patients[i];
        document.getElementById('patientCoronaStatus').innerHTML=patients[i].coronaStatus; // to show coronastatus on the website
        if(chosenPatient.coronaStatus=='positive'){
          document.getElementById('confirm').checked=true; // mark checkbox as checked if patient is infected
        }
        createRidesList();
        plotRides();
      }
    }
});


// time frame to mark rides within a time period as "risky"
var addTimeFrame = document.getElementById('timeFrame');
  addTimeFrame.addEventListener('change', (e) => {
   if(addTimeFrame.checked==true){ // show time frame option only if selected
     document.getElementById('addTime').style.visibility='visible';
     createRidesList();
 }
   else{
     document.getElementById('addTime').style.visibility='hidden';
     createRidesList();
   }
  });


  /**
  *@function createRidesList
  *@desc creates a list of the rides that the selected patient/user has made
  */

function createRidesList(){
  document.getElementById('ul').innerHTML='';

  for(var i=0; i<chosenPatient.rides.length; i++){ // for-loop to go through all rides of the selected patient
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);
    var br = document.createElement('br');
    var label= document.createElement("label");
    var description = document.createTextNode('Fahrt vom: '+(chosenPatient.rides[i].features[0].properties.time).slice(0,19)+': '+chosenPatient.rides[i].features[0].properties.name + ' bis ' +chosenPatient.rides[i].features[chosenPatient.rides[i].features.length-1].properties.name);

    if(timeFrame.checked==false){ // show selection option for the doctor only if the selection of contaminated rides is not selected by the time-frame
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.id = "checkboxid" + i;
      label.appendChild(checkbox);
      li.appendChild(checkbox);
    }

    label.appendChild(description);

    //adds all elements to the website
    li.appendChild(label);
    li.appendChild(br);
    ul.appendChild(li);

    if(chosenPatient.rides[i].contaminatedRide==1){ // to show a checked checkbox if the ride is contaminated
      document.getElementById('checkboxid'+i).checked=true;
    }
  }
}


/**
*@function plotRides
*@desc plots the rides of the user on the map; depending on if the ride is contaminated or not it is shown in green or in red
*/

function plotRides(){
  mymap.eachLayer(function (layer) {
  mymap.removeLayer(layer);
  });
  createMap();
  for(var i=0; i<chosenPatient.rides.length; i++){
    var ride=[];
    for(var j=0; j<chosenPatient.rides[i].features.length; j++){
    ride.push([chosenPatient.rides[i].features[j].geometry.coordinates[1],chosenPatient.rides[i].features[j].geometry.coordinates[0]]);
  }

  if(chosenPatient.rides[i].contaminatedRide==1){ // if ride is contaminated then it has to be mapped in red
    var polyline = L.polyline(ride, {color: 'red'}).addTo(mymap);
    var popupStartR = L.popup({ // sets a popup with the destination station name
                           autoClose: false}).setContent(chosenPatient.rides[i].features[0].properties.name);
    var startMarkerR=L.marker(ride[0]).addTo(mymap).bindPopup(popupStartR); // sets a marker at the departure station

    var popupDestiR = L.popup({ // sets a popup with the destination station name
                            autoClose: false}).setContent(chosenPatient.rides[i].features[chosenPatient.rides[i].features.length-1].properties.name);
    var destiMarkerR=L.marker(ride[ride.length-1]).addTo(mymap).bindPopup(popupDestiR); // sets a marker at the destination station

  }

  else{ // if ride is not contaminated then it has to be mapped in green
      var line = L.polyline(ride, {color: 'green'}).addTo(mymap);
      var popupStartG = L.popup({ // sets a popup with the departure station name
                             autoClose: false}).setContent(chosenPatient.rides[i].features[0].properties.name);
      var startMarkerG=L.marker(ride[0]).addTo(mymap).bindPopup(popupStartG); // sets a marker at the departure station

      var popupDestiG = L.popup({ // sets a popup with the destination station name
                              autoClose: false}).setContent(chosenPatient.rides[i].features[chosenPatient.rides[i].features.length-1].properties.name);
      var destiMarkerG=L.marker(ride[ride.length-1]).addTo(mymap).bindPopup(popupDestiG); // sets a marker at the destination station
    }
  }
}


/**
*@function checkChanges
*@desc called after refresh button, checks if the coronaStatus or the risk of single rides has changed and calls updateDB faunction
*/

function checkChanges(){
  var checkbox = document.getElementById("confirm");
  var rideCheckbox= document.getElementById("timeFrame");

  if(checkbox.checked){//changes the coronaStatus to positive
    chosenPatient.coronaStatus='positive';}
  else{
    chosenPatient.coronaStatus='negative';
  }

  if(rideCheckbox.checked==false){  // contaminated rides can be selected by checkboxes
    for(var i=0; i<chosenPatient.rides.length; i++){//checks which checkboxes are checked
      var checkboxRides=document.getElementById('checkboxid'+i);
      if (checkboxRides.checked){//changes rides to risky if checkbox is checked
        chosenPatient.rides[i].contaminatedRide=1;
      }
      else{
        chosenPatient.rides[i].contaminatedRide=0;
        }
      }
    }
    else{ // contaminated rides are selected by time-frame
      var dateFrom=document.getElementById('contaminatedStart').value;
      var dateTo=document.getElementById('contaminatedEnd').value;
      //saving date in a array
      var d1 = dateFrom.split("-");
      var d2 = dateTo.split("-");
      //parse to UNIX timestamp
      var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
      var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
      checkContaminatedRidesTime(to,from);
    }
    plotRides();
    console.log(chosenPatient);
    updateDB();
    alert('Eingabe erfolgreich aktualisiert.');
}

/**
*@function checkContaminatedRidesTime
*@desc checks if there are rides during the timespan the doctor set as risky
*@param to = startdate in Unix timestamp
*@param from = enddate in Unix timestamp
*/

function checkContaminatedRidesTime(to, from){
  var dateCheck;
  for(var k=0; k<chosenPatient.rides.length; k++){//iterating all rides taken by the currently activated patient
    dateCheck=chosenPatient.rides[k].features[0].properties.time;
    dateCheck=dateCheck.slice(0,10);
    var c = dateCheck.split("-");
    var check = new Date(c[2], parseInt(c[1])-1, c[0]);//creating a UNIX timestamp from the date

    if((check.getTime() <= to.getTime() && check.getTime() >= from.getTime())){ //checks if a ride was during the selected timespan
      chosenPatient.rides[k].contaminatedRide=1;
    }
    else{
      chosenPatient.rides[k].contaminatedRide=0;
    }
  }
}

/**
*@function updateDB
*@desc overwrites rides and coronaStatus of the currently activated patient
*/

function updateDB(){
  var rides=chosenPatient.rides;
  var coronaStatus=chosenPatient.coronaStatus;
  var addTo={"_id":chosenPatient._id, "rides":rides, "coronaStatus":coronaStatus};

  //server request- updating rides and coronaStatus
  fetch("/update-input",{
    method:'put',
    body: JSON.stringify(addTo),
    headers: {
      'Content-Type': 'application/json'}
    }).then(res=>{if (res.ok) return res.json();});
  }

  /**
  *@function fetchDatabase
  *@desc sends a request to the server via /item for fetching the database, awaits till the database is loaded
  */

  async function fetchDatabase(){

    let result =await promise();
    database=result;
    dropDown();
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
