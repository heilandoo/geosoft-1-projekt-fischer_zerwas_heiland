<h1><strong>Geosoftware 1 - Project </strong></h1>
<h4><strong> by Cornelius Zerwas, Ole Heiland, Magdalena Fischer</strong></h4>
<p> This Repository contains all the scripts for the project of the Geosoftware 1 course.<br/>
    The project contains five HTML pages. </p>
   
<p> An additional feature of this webapp is the quantification of the Corona-risk of the patients. This is measured by the public transport stations that a selected patient has shared with an infected person. As the infection risk of a patient that is caused by other persons in the public transport depends on the time for which these two people have shared a ride, this application consideres several risk-levels. The risk-levels are structured as follows:
    risklevel 0 -> 0 stations shared with an infected person
    risklevel 1 -> 1-10 stations shared with an infected person
    risklevel 2 -> 11-20 stations shared with an infected person
    risklevel 3 -> more than 20 stations shared with an infected person.
    
   
   </p>
   
<h2>Getting Started</h2>
<p> I used npm express and Mongodb for that project. Installing the server, set the main page to "mainIndex.html" and the start scripts to "node start.js"
    <br/><strong>Packages</strong><br/>
    npm install --express<br/>
    npm install --mongodb<br/>
    npm install --body-parser<br/>
    npm install --jquery<br/><br/>
    For the mapping and the geocoding I used Mapbox.<br/>
    --> Please fill your accessTokens into the scripts. Twice in "usermap.js", once in "map.js"
    </p>
    
<h2>For Testing</h2>
npm install --global mocha <br/>
npm install @turf/bearing <br/>
npm install @turf/distance <br/>
npm test
<h2>For Dockerization</h2>
install docker  <br/>
use Dockerfile and docker-compose.yml from this repository<br/>
or<br/>
pull from dockerHub: https://hub.docker.com/repository/docker/ma9dalen8/node-web-app<br/>
check if all images and containers are deleted <br/>
afterwards<br/> docker-compose up
<p></p>
