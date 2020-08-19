//LEAFLET MAP
console.log("test");

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

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
  console.log(database);
  for (var i=0; i<database.length; i++){

    if(database[i].doc==false){

      patients.push(database[i]);
    }console.log(patients);
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
        document.getElementById('patientRisk').innerHTML=patients[i].risk;
        //document.getElementById('patientRides').innerHTML=patients[i].rides;
        createRidesList();
      }
    }
});

function createRidesList(){

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
    ul.appendChild(li);
    li.appendChild(br);

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
