//________________________________________________________________________________________________________________________________
//####################################please insert API key here##################################################################
var apiKey = 'yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA';


// testing whether API request works
var assert = require('assert');
var chai=require('chai'),
  chaiHTTP=require('chai-http');
  chai.use(chaiHTTP);

var expect = chai.expect;


describe('api response', function () {

        var coordinates=[7.622795, 51.959817];
        var resource ='https://transit.router.hereapi.com/v8/departures?apiKey='+apiKey+'&in='+coordinates+'&radius=1000';

        it('api is valid', function (done) {
          chai.request(resource)
          .get('/')
          .end(function(err, res) {
            expect(res).to.have.status(200);
            done();
          });
          });
});




// testing of database connection

var mongoose = require('mongoose');
var request  = require('request');

describe('Access to DB', function(){

        it('successfully connected', function(done){
          mongoose.connect('mongodb://localhost:27017/coronaDB1',{ useNewUrlParser: true });
          mongoose.connection.once('open', function () {

            if(mongoose.connection.readyState==1){
              console.log('readyState equals 1');
              done();}

            else{
              console.log('not properly connected');}

    }).on('error', function () {
        console.log('Connection error : ', error);
    });
});
});
