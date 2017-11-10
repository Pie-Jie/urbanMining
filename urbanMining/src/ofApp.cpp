#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    serial.setup(1, 115200);
    ofSetVerticalSync(true);
    ofSetFrameRate(60);
    ofSetWindowShape(1920, 1080);
    isfullscreen = false;
    ofSetBackgroundColor(0, 0, 0);
    
    sender.setup("localhost", 8001);
}

//--------------------------------------------------------------
void ofApp::update(){
    getData();
}

//--------------------------------------------------------------
void ofApp::draw(){

}

void ofApp::getData(){
    
    // Getting serial data from arduino, !! later on: wireless !!
    
    char charByte;
    string validMessage = "";
    
    bool seperatorFound = false;
    
    if (serial.available()) {
        tmpBuffer = "";
        
        while(serial.available() > 0) {
            charByte = serial.readByte();
            
            if(charByte == ':') {
                if(!seperatorFound) {
                    tmpBuffer = "";
                    seperatorFound = true;
                } else {
                    validMessage = tmpBuffer;
                    seperatorFound = false;
                    p = ofSplitString(validMessage, "/");
                }
            } else {
                tmpBuffer += ofToString(charByte);
            }
        }
        serial.flush();
    }
    
    // Send data to server (receiver)
    if(validMessage != "") {
        for(int i = 0; i < p.size(); i++) {
            ofxOscMessage m;
            
            // set address
            m.setAddress("/data/" + ofToString(i));
            
            // set the value
            m.addIntArg(ofToInt(p[i]));
            
            // send the value to selected address
            sender.sendMessage(m, false);
            
        }
    }
    
    
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
