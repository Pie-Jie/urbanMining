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
float x, y, z;
int zScale = 500;
boolean firstMessage = true;
void setup(){
  oscP5 = new OscP5(this, 12000); //listening at port 12000
  size(800,800, P3D);
  //fullScreen(P3D);
  camera = new PeasyCam(this, width/2, height/2, 0, 100);
  camera.setMinimumDistance(200);
  camera.setMaximumDistance(4000);
}

void draw(){
   background(255);
   noFill();
   stroke(0);
strokeWeight(5);
strokeJoin(ROUND);
   beginShape();
  for(int i = 0; i < bikerCoordinates.size(); i++){
    x = map(bikerCoordinates.get(i).latitude, minimumLatitude, maximumLatitude, 10, width-10);
    y = map(bikerCoordinates.get(i).longitude, minimumLongitude, maximumLongitude, 10, height-10);
    z = map(bikerCoordinates.get(i).heightAboveSeaLevel, minimumHeight, maximumHeight, -zScale, zScale);
    
    vertex(x, y, z);
    
  }
  endShape();
  stroke(255, 0 ,0);
  line(0, 0, 0, 1000, 0, 0);
  stroke(0, 255, 0);
  line(0, 0, 0, 0, 1000, 0);
  stroke(0,0,255);
  line(0,0,0, 0,0,1000);
  
  textSize(32);
  if(bikerCoordinates.size()>0){
  println(bikerCoordinates.get((bikerCoordinates.size()-1)).latitude);  
  }
  fill(0);
  text("Hello", 10, 30); 
  
}


void oscEvent(OscMessage message) {
  
  float latitude = message.get(0).floatValue();
  float longitude = message.get(1).floatValue();
float bikeHeight = message.get(2).floatValue();
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