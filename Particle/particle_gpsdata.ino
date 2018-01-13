#include <TinyGPS++.h>

TinyGPSPlus gps;

//forward declareted, compiler loves you
void sendGpsData();

//Set a fixed baud rate of 9600 (bits/s)
static const uint32_t GPSBaud = 9600;

// fixed int of 500(ms) for the timer
const unsigned long PUBLISH_TIMER = 500;

// Just a fancy name for an int, which has an extended size variable for number storage, and stores 32bits(4 bytes)
unsigned long lastPublish = 0;

void setup(){
    Serial.begin(115200);
    Serial1.begin(GPSBaud);  
}

void loop(){
    // feed gps data to our device with encode and call our function
    while(Serial1.available() > 0) {
        if(gps.encode(Serial1.read())){
            sendGpsData();
        }
    }
}

void sendGpsData(){
    // check if we have published in the past 0.5s
    if(millis() - lastPublish >= PUBLISH_TIMER){
        lastPublish = millis();
        // checks if particle is connected and gps data is up-to-date
        if(Particle.connected() && gps.location.isValid()){
            //Put the data into a string and publish
            String gpsData = String(gps.location.lat()) + "/" + String(gps.location.lng()) + "/" + String(gps.altitude.meters()) + "/" + String(gps.speed.kmph());
            Particle.publish("gpsData", gpsData, PRIVATE);
        } else {
            //If something went wrong you will see it in the serial monitor
            Serial.println("No GPS data received: check wiring");
            Particle.publish("Error 404", "gps data not found", PRIVATE);
          }
    }
}