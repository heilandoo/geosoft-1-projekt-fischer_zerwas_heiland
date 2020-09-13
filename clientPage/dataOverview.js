//LEAFLET MAP
var currentClient=[];//informationen des aktuell eingeloggten Users
var database;


fetchDatabase();
var mymap = L.map('mapid').setView([51.653, 10.203], 6);
createMap();
function createMap(){
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);}

function matchRides(){
  var pooledRides=[];
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
}

function showData(){
  for(var i=0; i<database.length; i++){
    if(database[i].username==currentClient.username){
      currentClient=database[i];
      console.log(currentClient);
      document.getElementById('general').innerHTML='<b>'+'Übersicht: '+'</b>'+currentClient.username;
      document.getElementById('patientCoronaStatus').innerHTML=currentClient.coronaStatus;
      document.getElementById('patientRisk').innerHTML=currentClient.risk;

      return;
    }
  }

}

function plotRides(){

  mymap.eachLayer(function (layer) {
  mymap.removeLayer(layer);
  });
  createMap();

  for(var i=0; i<currentClient.rides.length; i++){
    var checkbox=document.getElementById('checkboxid'+i);
    //console.log(checkbox);
    if(checkbox.checked){
      //console.log(checkbox.checked);
    var ride=[];
    for(var j=0; j<currentClient.rides[i].features.length; j++){
    ride.push([currentClient.rides[i].features[j].geometry.coordinates[1],currentClient.rides[i].features[j].geometry.coordinates[0]]);
  }
  //console.log(ride);
  if(currentClient.rides[i].contaminatedRide==1){
     var polyline = L.polyline(ride, {color: 'red'}).addTo(mymap);

  }

  else{
       var line = L.polyline(ride, {color: 'green'}).addTo(mymap);

    }
  }
  }

}


//liste aller rides des Users
function createRidesList(){
  document.getElementById('ul').innerHTML='';
  console.log(currentClient.rides.length);
  for(var i=0; i<currentClient.rides.length; i++){
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);
    var br = document.createElement('br');
    var checkbox = document.createElement('input');
    var label= document.createElement("label");
    label.id='label'+i;
    if(currentClient.rides[i].contaminatedRide==1){
      var descriptionRed = document.createTextNode('Fahrt vom: '+(currentClient.rides[i].features[0].properties.time).slice(0,19)+': '+currentClient.rides[i].features[0].properties.name + ' bis ' +currentClient.rides[i].features[currentClient.rides[i].features.length-1].properties.name );
      label.style.color='red';
      label.appendChild(descriptionRed);


  }

  else{
    var descriptionGreen = document.createTextNode('Fahrt vom: '+(currentClient.rides[i].features[0].properties.time).slice(0,19)+': '+currentClient.rides[i].features[0].properties.name + ' bis ' +currentClient.rides[i].features[currentClient.rides[i].features.length-1].properties.name );
    label.appendChild(descriptionGreen);
      label.style.color='green';

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

async function fetchDatabase(){

    let result =await promise();
    //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
    console.log(result[result.length-1]);
    currentClient=result[result.length-1];
    database=result;
    console.log(database);
    //setTimeout(function loadPage(){window.location = "/clientPage/dataOverview.html";}, 500);
    showData();
    createRidesList();
    plotRides();
    matchRides();




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
