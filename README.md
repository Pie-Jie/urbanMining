# URBAN MINING :: SYNFOCYCLE 

We are using a rent bike in the city of Brussels to create music in Pure Data (extended) depending on its location, altitude and speed while driving. 
The city of Brussels functions as a sound box which is visualized in a processing application. The data from the Particle Electron is received by a Node.js Client and is sent to an Heroku application which sends the data back to other clients who are connecting.

## Contains

### Branding

This contains our logo and casing for this project.

### Client

A local Node.js client which receives data from the Particle Electron, sends it to the Heroku server and receives it back from that server.

### Music

A pure data project which playes notes with a beat depending on the gps data (altitude, longitude, latitude and km/h).

### Particle 

We decided to use a Particle Electron (IoT) because it has a built-in cellular antenna. This way we can send data over cellular towers and receive gps coördinates, altitude and speed of the bicyclist.

### Server

This Node.js server is deployed on an Heroku application. It receives the gps-data from the client and sends it back to all connected clients.

### Visualisation

A simplified 3D map created in Processing which visualizes the created route by the bicyclist. It receives its gps-data from one of the clients.


## Link to Heroku application

https://synfocycle.herokuapp.com/
