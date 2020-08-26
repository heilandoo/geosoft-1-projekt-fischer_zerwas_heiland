//LEAFLET MAP
console.log("test");
var currentClient=[];
var database;


fetchDatabase();
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);

function showData(){
  for(var i=0; i<database.length; i++){
    if(database[i].username==currentClient.username){
      currentClient=database[i];
      console.log(currentClient);
      document.getElementById('general').innerHTML='<b>'+'Übersicht: '+'</b>'+currentClient.username;
      document.getElementById('patientCoronaStatus').innerHTML=currentClient.coronaStatus;
      document.getElementById('patientRisk').innerHTML=currentClient.risk;
      createRidesList(currentClient);
      return;
    }
  }

}

function createRidesList(currentClient){

  var ul = document.getElementById('ul');

  for(var i=0; i<currentClient.rides.length; i++){

    var li = document.createElement('li');

    ul.appendChild(li);
    li.innerHTML=li.innerHTML+currentClient.rides[i];

  }
}

async function fetchDatabase(){

    let result =await promise();
    //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
    console.log(result[result.length-1]);
    currentClient=result[result.length-1];
    database=result;
    

    showData();



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
