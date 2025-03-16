/*
Name: Sophia Franco
Assignment: Week 8 - Weather 
Description: Results display the temperature & weather based on user's input (latitude and longitude).
Date: 3/10/2025
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Displays index.html of root path
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Invoked after hitting submit in the HTML form
app.post("/", function (req, res) {
  // Takes in latitude and longitude from the HTML form
  const latitude = String(req.body.latInput);
  const longitude = String(req.body.lonInput);
  console.log("Latitude: " + latitude);
  console.log("Longitude: " + longitude);

  // Build up the URL for the JSON query, API Key is secret and needs to be obtained by signup
  const units = "imperial"; // or 'metric' for Celsius
  const apiKey = "f8196efaf8ed3e3c13c78471fa20869d"; // replace with your actual API key
  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  // This gets the data from OpenWeather API
  https.get(url, function (response) {
    console.log(response.statusCode);

    // Get individual items from OpenWeather API
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const weatherDescription = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const cloudiness = weatherData.clouds.all;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // Displays the output of the results -- weather results
      res.write("<h1>The weather is " + weatherDescription + "</h1>");
      res.write(
        "<h2>The Temperature at latitude " +
          latitude +
          " and longitude " +
          longitude +
          " is " +
          temp +
          " °F</h2>"
      );
      res.write("<h3>Humidity: " + humidity + "%</h3>");
      res.write("<h3>Wind Speed: " + windSpeed + " m/s</h3>");
      res.write("<h3>Cloudiness: " + cloudiness + "%</h3>");
      res.write('<img src="' + imageURL + '" alt="Weather Icon">');
      res.send();
    });
  });
});

// Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
