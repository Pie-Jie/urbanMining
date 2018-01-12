var bikerCoordinates = [];
var minimumLatitude, maximumLatitude = 0;
var minimumLongitude, maximumLongitude = 0;
var minimumHeight, maximumHeight = 0;
var x, y, z = 0;
var zScale = 500;
var firstMessage = true;

var socket = io();

socket.on('connection', function() {
    console.log('Connected to synfocycle');
});

socket.on('settings', function(settings){
    console.log('init settings');
    var el = document.getElementById('settings');
    var str = '<ul class="collection with-header">';
          str+='<li class="collection-header"><h4>SETTINGS</h4></li>';

    for (var param in settings.params) {
        if (settings.params.hasOwnProperty(param)) {
            settings[param] = settings.params[param];
        }
    }

    delete settings.params;

    for (var variable in settings) {
        if (settings.hasOwnProperty(variable)) {
            str+='<li class="collection-item">';
            str+='<b>'+variable+'</b> '+settings[variable];
            str+='</li>';
        }
    }
    str+="</ul>";
    el.innerHTML = str;
});

socket.on('state', function(state) {
    var el = document.getElementById('state');
    var str = '<ul class="collection with-header">';
            str+='<li class="collection-header"><h4>STATE</h4></li>';

    for (var variable in state) {
        if (state.hasOwnProperty(variable)) {
            str+='<li class="collection-item">';
            str+='<b>'+variable+'</b> '+state[variable];
            str+='<b>test '+variable+'</b> '+state[variable];
            str+='<input type="range" id="test5" value="'+state[variable]*1000+'" min="0" max="1000" />';
            str+='<b>'+Date()+'</b>';
            str+='</li>';
        }
    }
    str+="</ul>";
    el.innerHTML = str;
});

function setup(){
    createCanvas(640, 480, WEBGL);
    //fullScreen(P3D);
}

function draw(){
    background(255);
    noFill();
    stroke(0);
    strokeWeight(5.0);
    //strokeJoin(ROUND);
    beginShape();
    for(var i = 0; i < bikerCoordinates.length; i++){
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
}


    //void oscEvent(OscMessage message) {
    //  
    //  float latitude = message.get(0).floatValue();
    //  float longitude = message.get(1).floatValue();
    //float bikeHeight = message.get(2).floatValue();
    //int time = hour()*3600+ minute()*60 + second();
    //  
    //  bikerCoordinates.add(new Coordinates(latitude, longitude, bikeHeight, time));
    //  
    //  if(firstMessage){
    //    minimumLatitude = latitude;
    //    maximumLatitude = latitude;
    //    minimumLongitude = longitude;;
    //    maximumLongitude = longitude;
    //    minimumHeight = bikeHeight;
    //    maximumHeight = bikeHeight;
    //    firstMessage=false;
    //  }
    //  
    //}


class Coordinates {
    constructor(tempLatitude, tempLongitude, tempHeight, tempTime){
        this.latitude = tempLatitude;
        this.longitude = tempLongitude;
        this.heightAboveSeaLevel = tempHeight;
        this.time = tempTime;
        
        
        if(tempLatitude < minimumLatitude) {
            minimumLatitude = tempLatitude;
        } else if (tempLatitude > maximumLatitude) {
            maximumLatitude = tempLatitude;
        }
        if(tempLongitude < minimumLongitude) {
            minimumLongitude = tempLongitude;
        } else if (tempLongitude > maximumLongitude) {
            maximumLongitude = tempLongitude;
        }
        if(tempHeight < minimumHeight) {
            minimumHeight = tempHeight;
        } else if (tempHeight > maximumHeight) {
            maximumHeight = tempHeight;
        }
    }
      
}
            
        