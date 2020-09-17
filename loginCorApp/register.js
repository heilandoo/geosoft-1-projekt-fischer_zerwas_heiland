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


//declaration of variables
var database;
var user;

/**
*@function checkDatabase
*@desc creates new user accounts based on user information
*/

function checkDatabase(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var doc;
  var checkbox = document.getElementById("doc");

  if(checkbox.checked){ // to differentiate doctors and patients
    doc=true;
  }
  else{ doc=false;} // to differentiate doctors and patients

  user= {"username": username, "password": password, "doc":doc, "risk":0, "coronaStatus":'negative', "rides":[]}; // filling user profiles with default information
  fetchDatabase();
  return user;
  }


  /**
  *@function checkUser
  *@desc checks if its possible to create requested profile
  */

function checkUser(database){ //checks if there is an input
  if (user.username==''|| user.password==''){
    alert("Eingabe fehlt");
    return;}

  if (database.length==0){ //only for the first registration
  	addToDatabase(user);
    alert("Nutzerkonto erstellt");
  }

  else {
    for (var i=0; i<database.length; i++){
      if(database[i].username==user.username){ // checks for duplication of username
        alert("Benutzername bereits vergeben");
      return;
      }
    }
    //creates new user profile
      addToDatabase(user);
      alert("Nutzerkonto erstellt");
      return;
    }
}


/**
*@function fetchDatabase
*@desc sends a request to the server via /item for fetching the database, awaits till the database is loaded
*/

async function fetchDatabase(){

  let result =await promise();
  console.log(result);
  checkUser(result);
  database=JSON.stringify(result);
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
*@desc saves a newly created Profile to the database
*/

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
