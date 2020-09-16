function geocoding(address){

//#####your accessToken#########################################################
  var access_token="pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg";

  var resource ="https://api.mapbox.com/geocoding/v5/mapbox.places/"+ address[0]+ "%20"+ address[1] +"%20" + address[2] +".json?country=DE&access_token="+access_token;
  //console.log(resource);
  //if (inputMarker != undefined){inputMarker.remove();}
    g.onload = gloadcallback;
    g.onerror = gerrorcallback;
    g.onreadystatechange = gstatechangecallback;
    g.open("GET", resource, true);
    g.send();

}



/**
*@function gstatechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls mappingUserInput function
*/
function gstatechangecallback() {
  if (g.status == "200" && g.readyState == 4) {

    convertedAdress = g.responseText;
    convertedAdress= JSON.parse(convertedAdress);
    return convertedAdress.features.properties.geometry.coordinates.length;
    }
}



/**
*@function gerrorcallback
*@desc informs the User about an error
*/
function gerrorcallback(e) {
  document.getElementById("error").innerHTML = "errorcallback: check web-console";
}



/**
*@function gloadcallback
*@desc informs about an incorrect format in the console
*/
function gloadcallback() {
  if(g.status!="200"){
    console.log(g.status);
  }
}

var assert = require('assert');


describe('api response', function () {

        var address1 = ['Kanalstraße',60,'Münster'];
        var address2 = ['Mendelstraße',2,'Münster'];
        var address3 = ['Mecklenburger Straße',32,'Münster'];

        it('api response contains two coordinates', function () {
            assert.equal(geocoding(address1),2);
});
