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


console.log("Moin. Willkommen in unserer COVID-19-Applikation.\n");


var ObjectId = require('mongodb').ObjectID;
let bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const port=3000;

const app = express();
app.use(express.json());


 /**
 *@function connectMongoDB
 *@desc function which creates a Connection to MongoDB. Retries every 3 seconds if no connection could be established.
 */

async function connectMongoDB() {
    try {
        var mongo_host  = process.env.MONGO_HOST || "localhost"
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://"+mongo_host+":27017", { useNewUrlParser: true });
        app.locals.db = await app.locals.dbConnection.db("coronaDB1");
        console.log("Using db: " + app.locals.db.databaseName);
    }
    catch (error) {
        console.dir(error);
        setTimeout(connectMongoDB, 3000);
    }
}
//Start connecting
connectMongoDB();


app.use('/clientPage', express.static(__dirname + '/clientPage'));
app.use('/doctorPage', express.static(__dirname + '/doctorPage'));
app.use('/loginCorApp', express.static(__dirname + '/loginCorApp'));
app.use('/save-input', bodyParser.json());
app.use('/delete-input', bodyParser.json());
app.use('/update-input', bodyParser.json());
app.use('/item', bodyParser.json());


//connects websites

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/loginCorApp/login.html');});

app.get('/register.html', (req, res) => {
  res.sendFile(__dirname+'/loginCorApp/register.html');});

app.get("/clientPage/dataOverview.html", (req, res) => {
  res.sendFile(__dirname+"/clientPage/dataOverview.html");});

app.get("/doctorPage/changeRisk.html", (req, res) => {
  res.sendFile(__dirname+"/doctorPage/changeRisk.html");});


//Returns all items stored in collection items
app.get("/item", (req,res) => {
    //Search for all items in mongodb
    app.locals.db.collection('items').find({}).toArray((error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});

// adds data to the database
app.post('/save-input', (req, res) => {
console.log("POST",req.body);
  app.locals.db.collection('items').insertOne(req.body);
});

// deletes data from the database
app.delete('/delete-input', (req, res)=> {
  console.log(req.body);
  app.locals.db.collection('items').deleteOne({"_id":ObjectId(req.body._id)});
  });

// updates rides and corona status data of the database
app.put('/update-input',(req, res)=>{
  app.locals.db.collection('items').updateOne({"_id":ObjectId(req.body._id)},
                              {$set:{['rides'] : req.body.rides, ['coronaStatus']:req.body.coronaStatus}});
});

// updates risk status data of the database
app.put('/update-risk',(req, res)=>{
  app.locals.db.collection('items').updateOne({"_id":ObjectId(req.body._id)},
                              {$set:{['risk'] : req.body.risk}});
});


app.listen(port,
   () => console.log(`Example app
      listening at http://localhost:${port}`));
