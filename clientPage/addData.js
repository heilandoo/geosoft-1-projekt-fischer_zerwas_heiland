//LEAFLET MAP
console.log("test");
var chosenPatient;
var patient;
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVpbGFuZG9vIiwiYSI6ImNrYWM2MTN2YjFkaTgyd3F3czRwYmRhcWcifQ.ehq-ZqczEZiBcFwaZC0jDg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(mymap);

//https://transit.router.hereapi.com/v8/routes?apiKey=yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA&origin=51.9568,7.6345&destination=51.9694,7.5961&modes=bus&return=intermediate
/**function createRidesList(){

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
