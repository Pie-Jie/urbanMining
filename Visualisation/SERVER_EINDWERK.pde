import peasy.*;
import peasy.org.apache.commons.math.*;
import peasy.org.apache.commons.math.geometry.*;

import netP5.*;
import oscP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

PeasyCam camera;

ArrayList<Coordinates> bikerCoordinates = new ArrayList<Coordinates>();
float minimumLatitude, maximumLatitude;
float minimumLongitude, maximumLongitude;
float minimumHeight, maximumHeight;
float tempAlt, tempLat, tempLong;
boolean tempAltGet, tempLatGet, tempLongGet;
float x, y, z;
int zScale = 500;
int sphereSize = 5;
int sphereScale = 1;
boolean firstMessage = true;
void setup(){
  oscP5 = new OscP5(this, 1234); //listening at port 12000
  size(800,800, P3D);
  //fullScreen(P3D);
  camera = new PeasyCam(this, width/2, height/2, 0, 100);
  camera.setMinimumDistance(200);
  camera.setMaximumDistance(4000);
}

void draw(){
  background(255);
  noFill();
  stroke(255, 0, 0);
  strokeWeight(3);
  strokeJoin(ROUND);
  beginShape();
  for(int i = 0; i < bikerCoordinates.size(); i++){
    x = map(bikerCoordinates.get(i).latitude, minimumLatitude, maximumLatitude, 10, width-10);
    y = map(bikerCoordinates.get(i).longitude, minimumLongitude, maximumLongitude, 10, height-10);
    z = map(bikerCoordinates.get(i).heightAboveSeaLevel, minimumHeight, maximumHeight, -zScale, zScale);
    vertex(x, y, z);
  }
  endShape();
  if(bikerCoordinates.size()>0){
  int currentPos = bikerCoordinates.size()-1;
  float sphereX = map(bikerCoordinates.get(currentPos).latitude, minimumLatitude, maximumLatitude, 10, width-10);
  float sphereY = map(bikerCoordinates.get(currentPos).longitude, minimumLongitude, maximumLongitude, 10, height-10);
  float sphereZ = map(bikerCoordinates.get(currentPos).heightAboveSeaLevel, minimumHeight, maximumHeight, -zScale, zScale);
  translate(sphereX, sphereY, sphereZ);
  sphere(sphereSize);
  }
  sphereSize += sphereScale;
  if(sphereSize > 20 || sphereSize < 5){
    sphereScale *= -1;
  }
  fill(0); 
}


void oscEvent(OscMessage message) {
  String pattern = message.addrPattern();
  if(pattern.equals("/altitude")){
    tempAlt = message.get(0).floatValue();
    tempAltGet = true;
  }
  if(pattern.equals("/latitude")){
    tempLat = message.get(0).floatValue();
    tempLatGet = true;
  }
  if(pattern.equals("/longitude")){
    tempLong = message.get(0).floatValue();
    tempLongGet = true;
  }
  if(tempAltGet && tempLatGet && tempLongGet && tempAlt != 0 && tempLat != 0 && tempLong != 0){
    addCoordinates();
    tempAltGet = false;
    tempLatGet = false;
    tempLongGet = false;
  }
}

void addCoordinates(){
  float latitude = tempLat;
  float longitude = tempLong;
  float bikeHeight = tempAlt;
  int time = hour()*3600+ minute()*60 + second();
    
  bikerCoordinates.add(new Coordinates(latitude, longitude, bikeHeight, time));
  if(firstMessage){
    minimumLatitude = latitude;
    maximumLatitude = latitude;
    minimumLongitude = longitude;;
    maximumLongitude = longitude;
    minimumHeight = bikeHeight;
    maximumHeight = bikeHeight;
    firstMessage=false;
  }
}

class Coordinates {
  float latitude;
  float longitude;
  float heightAboveSeaLevel;
  int time;
  
  
  Coordinates(float tempLatitude, float tempLongitude, float tempHeight, int tempTime){
    latitude = tempLatitude;
    longitude = tempLongitude;
    heightAboveSeaLevel = tempHeight;
    time = tempTime;
    
    
    if(tempLatitude < minimumLatitude){
      minimumLatitude = tempLatitude;
    } else if (tempLatitude > maximumLatitude){
      maximumLatitude = tempLatitude;
    }
    if(tempLongitude < minimumLongitude){
      minimumLongitude = tempLongitude;
    } else if (tempLongitude > maximumLongitude){
      maximumLongitude = tempLongitude;
    }
    if(tempHeight < minimumHeight){
      minimumHeight = tempHeight;
    } else if (tempHeight > maximumHeight){
      maximumHeight = tempHeight;
    }
  }
  
}