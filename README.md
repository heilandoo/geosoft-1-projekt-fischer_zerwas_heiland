<h1><strong>Geosoftware 1 - Project </strong></h1>
<h4><strong> by Cornelius Zerwas, Ole Heiland, Magdalena Fischer</strong></h4>

<p><strong> github-Link: https://github.com/heilandoo/geosoft-1-projekt-fischer_zerwas_heiland </strong></p>


<p> This Repository contains all the scripts for the project of the Geosoftware 1 course.<br/><br/>
    The project contains five HTML pages. Besides registration-pages, this application contains seperate interfaces for doctors and for patients. <br/><br/>
    In general, this application aims at monitoring the Corona infection risk and the Corona test status of patients. Patients are supposed to document their public transportation rides containing departure, destination and date. Doctors are authorized to modify the Corona status of their patients. In addition, they are able to categorize the patients rides as contaminated. By doing so, it is possible to monitor which people are exposed to an infection risk as they shared a ride with an infected person. All in all, this application is supposed to help to fight against the Corona pandemic. </p>

<h3> Special Feature</h3>
<p> An additional feature of this webapp is the quantification of the Corona-risk of the patients. This is measured by the public transport stations that a selected patient has shared with an infected person. As the infection risk of a patient that is caused by other persons in the public transport depends on the time for which these two people have shared a ride, this application consideres several risk-levels.<br/>The risk-levels are structured as follows:<br/><br/>
    risklevel 0 -> 0 stations shared with an infected person<br/>
    risklevel 1 -> 1-10 stations shared with an infected person<br/>
    risklevel 2 -> 11-20 stations shared with an infected person<br/>
    risklevel 3 -> more than 20 stations shared with an infected person.<br/><br/>
This scale is also shown on the webpage and marked as a question mark symbol.    
   </p>
   
<h2>Getting Started</h2>
<p> We used npm express and Mongodb for that project. Installing the server, set the main page to "login.html" and the scripts to "start" : "node start.js" and to "test": "mocha".<br/>
    <br/><strong>Packages</strong><br/>
    npm install express<br/>
    npm install mongodb<br/>
    npm install body-parser<br/>
    npm install jquery<br/><br/>
    npm start<br/>
    
   For the mapping and the geocoding we used Mapbox.<br/>
     -> information on how to get an accessToken for Mapbox can be found on:<br/>
     https://docs.mapbox.com/help/how-mapbox-works/access-tokens/ <br/>
   For the public transport API requests we used Here.<br/>
     -> information on how to get an API-key for Here can be found on: <br/> https://developer.here.com/documentation/authentication/dev_guide/topics/api-key-credentials.html <br/>
     
     
   <strong> --> Please fill your accessToken and the API-key into the scripts. This is necessary to be applied to "dataOverview.js", "addData.js" and "changeRisk.js". </strong><br/>
    </p>
    

<h2>For Dockerization</h2>

use Dockerfile and docker-compose.yml from this repository<br/>
docker-compose up --build <br/><br/>
<strong> wait until the mongo container is started and the database is connected </strong>


<h2>For Testing</h2>

We used Mocha for testing.<br/>

npm install global mocha <br/>
npm install chai <br/>
npm install chai-http <br/>
npm install assert <br/>
npm install mongoose <br/>
npm install request <br/><br/>
npm test



<h2>Frameworks and External Libraries</h2>
We make use of:<br/>
Bootstrap<br/>
JQuery<br/>
Leaflet<br/>
Popper<br/>
