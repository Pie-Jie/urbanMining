int potPin1 = A0;
int potPin2 = A1;
int potPin3 = A2;
int potPin4 = A3;
int potPin5 = A4;
int potPin6 = A5;

int potWaarde1 = 0;
int potWaarde2 = 0;
int potWaarde3 = 0;
int potWaarde4 = 0;
int potWaarde5 = 0;
int potWaarde6 = 0;
  
void setup() {
  Serial.begin(115200);  
}

void loop() {
  potWaarde1 = analogRead(potPin1); 
  potWaarde2 = analogRead(potPin2); 
  potWaarde3 = analogRead(potPin3); 
  potWaarde4 = analogRead(potPin4); 
  potWaarde5 = analogRead(potPin5);
  potWaarde6 = analogRead(potPin6);
  
  Serial.print(potWaarde1);
  Serial.print("/");
  Serial.print(potWaarde2);
  Serial.print("/");
  Serial.print(potWaarde3);
  Serial.print("/");
  Serial.print(potWaarde4);
  Serial.print("/");
  Serial.print(potWaarde5);
  Serial.print("/");
  Serial.print(potWaarde6);
  
  Serial.print(":");
  Serial.flush();
}
