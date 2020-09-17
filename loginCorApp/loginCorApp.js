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


var database;
var user;
var client;
var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.


/**
*@function validate
*@desc retrieves user information of the the user that has clicked the "login button" and saves this information to the database
*/

function validate(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  user= {"username": username, "password": password};
  fetchDatabase();

}


/**
*@function checkUserInformation
*@desc checks if the information that is filled in by the user is correct and corresponds with the data that is saved in the database
*/

function checkUserInformation(){

  if (user.username==''|| user.password==''){ // checks if user has filled in the information fields
    alert("Eingabe fehlt");
    return;
  }
  for (var i=0; i<database.length; i++){

    if (database[i].username==user.username && database[i].password==user.password){//if log-in infos are correct and user == doc
        if(database[i].doc==true){//
          window.location = "/doctorPage/changeRisk.html";//loads website for the doctor
        return;
      }
      else{//if log-in is correct and user != doc
        client=database[i];
        addToDatabase(client);
        return;
        }
    }
  }

  attempt --;// decrementing by one.
  alert("You have left "+attempt+" attempt;");

  // disabling fields temporarily after 3 failed login attempts
  if( attempt == 0){
    document.getElementById("username").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("submit").disabled = true;
  }return false;
}


/**
*@function fetchDatabase
*@desc sends a request to the server via /item for fetching the database, awaits till the database is loaded
*/

async function fetchDatabase(){

  let result =await promise();
  console.log(result);
  database=result;
  checkUserInformation();

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
*@function addToDatabase
*@desc saves logged-in user information to database
*/

function addToDatabase(){
  console.log(client);
	fetch('/save-input', {
        method: 'post',
        body: JSON.stringify(user),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setTimeout(function loadPage(){window.location = "/clientPage/dataOverview.html";}, 500);

    }
