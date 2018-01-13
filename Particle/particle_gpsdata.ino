#include <TinyGPS++.h>

TinyGPSPlus gps;

void sendGpsData();

static const uint32_t GPSBaud = 9600;
const unsigned long PUBLISH_TIMER = 500;
unsigned long lastPublish = 0;

void setup()
{
  Serial.begin(115200);
  Serial1.begin(GPSBaud);  
}

void loop(){
    while(Serial1.available() > 0) {
        if(gps.encode(Serial1.read())){
            sendGpsData();
        }
    }
}

void sendGpsData(){
    if(millis() - lastPublish >= PUBLISH_TIMER){
        lastPublish = millis();
        if(Particle.connected() && gps.location.isValid()){
            String gpsData = String(gps.location.lat()) + "/" + String(gps.location.lng()) + "/" + String(gps.altitude.meters()) + "/" + String(gps.speed.kmph());
            Particle.publish("gpsData", gpsData, PRIVATE);
        } else {
            Serial.println("No GPS data received: check wiring");
          }
    }
}