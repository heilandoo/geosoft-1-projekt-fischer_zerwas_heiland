//LEAFLET MAP



var mymap = L.map('mapid').setView([51.653, 10.203], 6);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);


//console.log("hallo");
var database=[];
var patients=[];
var chosenPatient;
fetchDatabase();


function dropDown(){


  var sel = document.getElementById('patientDropdown');
  var opt = null;
  //console.log(database);
  for (var i=0; i<database.length; i++){

    if(database[i].doc==false){

      patients.push(database[i]);

    }//console.log(patients);
  }

  for(i = 0; i<patients.length; i++) {

    opt = document.createElement('option');
    opt.value = patients[i].username;
    opt.innerHTML = patients[i].username;
    sel.appendChild(opt);

    }
  }

  var selection = document.getElementById('patientDropdown');

  selection.addEventListener('change', (e) => {
     chosenPatient=e.target.value;
    for (var i=0; i<patients.length;i++){
      if (chosenPatient==patients[i].username){
        chosenPatient=patients[i];
        console.log(patients[i].coronaStatus);
        document.getElementById('patientCoronaStatus').innerHTML=patients[i].coronaStatus;
        if(chosenPatient.coronaStatus=='positive'){
          document.getElementById('confirm').checked=true;
        }
        document.getElementById('patientRisk').innerHTML=patients[i].risk;
        //document.getElementById('patientRides').innerHTML=patients[i].rides;
        console.log(chosenPatient);
        createRidesList();
        plotRides();

      }
    }
});
var addTimeFrame = document.getElementById('timeFrame');
  addTimeFrame.addEventListener('change', (e) => {
   if(addTimeFrame.checked==true){
     document.getElementById('addTime').style.visibility='visible';
     createRidesList();
 }
   else{
     document.getElementById('addTime').style.visibility='hidden';
     createRidesList();
   }
  });


function createRidesList(){

  document.getElementById('ul').innerHTML='';
  //console.log(chosenPatient.rides.length);
  for(var i=0; i<chosenPatient.rides.length; i++){
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);
    var br = document.createElement('br');
    var label= document.createElement("label");
    var description = document.createTextNode('Fahrt vom: '+(chosenPatient.rides[i].features[0].properties.time).slice(0,19)+': '+chosenPatient.rides[i].features[0].properties.name + ' bis ' +chosenPatient.rides[i].features[chosenPatient.rides[i].features.length-1].properties.name);
    if(timeFrame.checked==false){
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


    if(chosenPatient.rides[i].contaminatedRide==1){
      document.getElementById('checkboxid'+i).checked=true;
    }
  }
}

function plotRides(){
  for(var i=0; i<chosenPatient.rides.length; i++){
    var ride=[];
    for(var j=0; j<chosenPatient.rides[i].features.length; j++){
    ride.push([chosenPatient.rides[i].features[j].geometry.coordinates[1],chosenPatient.rides[i].features[j].geometry.coordinates[0]]);
  }
  console.log(ride);
  if(chosenPatient.rides[i].contaminatedRide==1){
    var polyline = L.polyline(ride, {color: 'red'}).addTo(mymap);
    var popupStartR = L.popup({
                           autoClose: false}).setContent(chosenPatient.rides[i].features[0].properties.name);
    var startMarkerR=L.marker(ride[0]).addTo(mymap).bindPopup(popupStartR);

    var popupDestiR = L.popup({
                            autoClose: false}).setContent(chosenPatient.rides[i].features[chosenPatient.rides[i].features.length-1].properties.name);
    var destiMarkerR=L.marker(ride[ride.length-1]).addTo(mymap).bindPopup(popupDestiR);

  }

  else{
      var line = L.polyline(ride, {color: 'green'}).addTo(mymap);
      var popupStartG = L.popup({
                             autoClose: false}).setContent(chosenPatient.rides[i].features[0].properties.name);
      var startMarkerG=L.marker(ride[0]).addTo(mymap).bindPopup(popupStartG);

      var popupDestiG = L.popup({
                              autoClose: false}).setContent(chosenPatient.rides[i].features[chosenPatient.rides[i].features.length-1].properties.name);
      var destiMarkerG=L.marker(ride[ride.length-1]).addTo(mymap).bindPopup(popupDestiG);
      // zoom the map to the polyline
      //mymap.fitBounds(line.getBounds());
    }

  }
}

function checkChanges(){
  var checkbox = document.getElementById("confirm");
  var rideCheckbox= document.getElementById("timeFrame");

  if(checkbox.checked){
    chosenPatient.coronaStatus='positive';}
    //console.log(chosenPatient);
  else{
    chosenPatient.coronaStatus='negative';
  }

  if(rideCheckbox.checked==false){  // contaminated rides are selected by checkboxes
    //console.log('checkboxcheck');
    for(var i=0; i<chosenPatient.rides.length; i++){
      var checkboxRides=document.getElementById('checkboxid'+i);
      if (checkboxRides.checked){
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


      var d1 = dateFrom.split("-");
      var d2 = dateTo.split("-");

      var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
      var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
      checkContaminatedRidesTime(to,from);/*
      for(var k=0; k<chosenPatient.rides.length; k++){
        dateCheck=chosenPatient.rides[k].features[0].properties.time;
        dateCheck=dateCheck.slice(0,10);
        var c = dateCheck.split("-");
        var check = new Date(c[2], parseInt(c[1])-1, c[0]);
        console.log(dateFrom,dateCheck);

        if((check.getTime() <= to.getTime() && check.getTime() >= from.getTime())){
          chosenPatient.rides[k].contaminatedRide=1;

        }
        else{
          chosenPatient.rides[k].contaminatedRide=0;

        }
      }
      */

    }

    plotRides();
  console.log(chosenPatient);
  updateDB();
  alert('Eingabe erfolgreich aktualisiert.');
}

function checkContaminatedRidesTime(to, from){
  var dateCheck;
  for(var k=0; k<chosenPatient.rides.length; k++){
    dateCheck=chosenPatient.rides[k].features[0].properties.time;
    dateCheck=dateCheck.slice(0,10);
    var c = dateCheck.split("-");
    var check = new Date(c[2], parseInt(c[1])-1, c[0]);
    //console.log(dateFrom,dateCheck);

    if((check.getTime() <= to.getTime() && check.getTime() >= from.getTime())){
      chosenPatient.rides[k].contaminatedRide=1;

    }
    else{
      chosenPatient.rides[k].contaminatedRide=0;
      
    }
  }
}


function updateDB(){
  var rides=chosenPatient.rides;
  var coronaStatus=chosenPatient.coronaStatus;
  var addTo={"_id":chosenPatient._id, "rides":rides, "coronaStatus":coronaStatus};
  //console.log(rides);

  //server request- updating changed coordinates by _id
  fetch("/update-input",{
    method:'put',
    body: JSON.stringify(addTo),
    headers: {
      'Content-Type': 'application/json'}
    }).then(res=>{if (res.ok) return res.json();});
    console.log(rides);
    //location.reload();
  }

  async function fetchDatabase(){

    let result =await promise();
    //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
    //console.log(result);
    database=result;
    //console.log(database);
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
