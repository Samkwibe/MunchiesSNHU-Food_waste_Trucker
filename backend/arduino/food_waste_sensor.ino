#include <ArduinoJson.h>

// Replace with actual sensor pins and libraries
const int weightSensorPin = A0;
const int humiditySensorPin = A1;
const int pHSensorPin = A2;
const int fullnessSensorPin = A3;

void setup()
{
    Serial.begin(9600);
}

void loop()
{
    // Example sensor readings (Replace with actual sensor code)
    float weight = analogRead(weightSensorPin) * (10.0 / 1023.0); // Example conversion
    float humidity = analogRead(humiditySensorPin) * (100.0 / 1023.0);
    float pH = analogRead(pHSensorPin) * (14.0 / 1023.0);
    int fullness = map(analogRead(fullnessSensorPin), 0, 1023, 0, 100);

    // JSON format
    StaticJsonDocument<200> doc;
    doc["weight"] = weight;
    doc["humidity"] = humidity;
    doc["pH"] = pH;
    doc["fullness"] = fullness;

    // Send JSON over Serial
    serializeJson(doc, Serial);
    Serial.println();

    delay(5000); // Send data every 5 seconds
}
