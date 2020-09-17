//________________________________________________________________________________________________________________________________
//####################################please insert API key here##################################################################
var apiKey = 'yZ1g1aCLN8rvnPJdGaO697MpL44zvnU1aHx2IwgqNgA';

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
