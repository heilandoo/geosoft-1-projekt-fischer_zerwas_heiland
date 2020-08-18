// Below function Executes on click of login button.
var database;
var user;
function checkDatabase(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var doc;
  var checkbox = document.getElementById("doc");
  if(checkbox.checked){
    doc=true;
  }
  else{ doc=false;}
  console.log(doc);
  user= {"username": username, "password": password, "doc":doc, "risk":0, "test":false, "rides":" "};
  console.log(user);
  //addToDatabase(user);
  fetchDatabase();
  return user;
  }

function checkUser(database){
  if (user.username==''|| user.password==''){
    alert("Eingabe fehlt");
    return;}
  console.log(database.length);
  if (database.length==0){
  	addToDatabase(user);
  }
  else{
    console.log(user);
    for (var i=0; i<database.length; i++){
      console.log(database[i][username]);
      if(database[i].username==user.username){
        alert("Benutzername bereits vergeben");
      return;}
    }
      addToDatabase(user);
      alert("Nutzerkonto erstellt");
      return;
    }

  /*alert ("Login successfully");
  window.location = "success.html"; // Redirecting to other page.
  return false;
  }
  else{
  attempt --;// Decrementing by one.
  alert("You have left "+attempt+" attempt;");
  // Disabling fields after 3 attempts.
  if( attempt == 0){
  document.getElementById("username").disabled = true;
  document.getElementById("password").disabled = true;
  document.getElementById("submit").disabled = true;
  return false;
  }
  }*/
}

//var length;

async function fetchDatabase(){

  let result =await promise();
  //document.getElementById('databaseContent').innerHTML=JSON.stringify(result);
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
