/**
*@author Magdalena Fischer, Ole Heiland, Cornelius Zerwas
*m_fisc39@wwu.de, oleheiland@wwu.de, czerwas@uni-muenster.de
*01.08.2020
*/

var database;
var user;
var client;
var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.

function validate(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  user= {"username": username, "password": password};
  fetchDatabase();
//return user;

}
function checkUserInformation(){

  if (user.username==''|| user.password==''){
    alert("Eingabe fehlt");
    return;
  }
  for (var i=0; i<database.length; i++){
    //database.parse();
    //console.log(database[i].username);
    //console.log(user.username);
    if (database[i].username==user.username && database[i].password==user.password){
        if(database[i].doc==true){
          window.location = "/doctorPage/changeRisk.html";
        return;
      }else{
        client=database[i];
        console.log(database);
        addToDatabase(client);

        return;
        }
    }
  }
  attempt --;// Decrementing by one.
  alert("You have left "+attempt+" attempt;");
  // Disabling fields after 3 attempts.
  if( attempt == 0){
    document.getElementById("username").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("submit").disabled = true;
  }return false;
}

async function fetchDatabase(){

  let result =await promise();
  //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
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
                          //alert('string');

                          //window.location = "/clientPage/dataOverview.html";
                        }
