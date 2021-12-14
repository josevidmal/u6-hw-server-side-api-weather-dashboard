var inputEl = document.getElementById("search");
var searchBtn = document.getElementById("search-btn");
var historyEl = document.getElementById("history-div");
var todayEl = document.getElementById("today-section");
var currCityDateEl = document.getElementById("curr-city-date");
var currIconEl = document.getElementById("curr-icon");
var currTempEl = document.getElementById("curr-temp");
var currWindEl = document.getElementById("curr-wind");
var currHumidityEl = document.getElementById("curr-humidity");
var currUviEl = document.getElementById("curr-uvi");
var currUviSpan = document.getElementById("uvi");
var frcstEl = document.getElementById("frcst-section");


var APIKey = "0e46e20b49b1fd7b6821209d1fb54328";

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    var city = inputEl.value;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function(response1) {
            return response1.json();
        })
        .then(function(data1) {
            console.log(data1);
            var lat = data1.coord.lat;
            var lon = data1.coord.lon;
            console.log(lat, lon);
            var oneAPICall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;

            fetch(oneAPICall)
            .then(function(response2) {
                return response2.json();
            })
            .then(function(data2) {
                console.log(data2);
                
                var currCity = data1.name;
                var currDate = moment().format("L");
                var currIconCode = data1.weather[0].icon;
                var currIcon = "http://openweathermap.org/img/wn/" + currIconCode + ".png"
                var currTemp = data2.current.temp;
                var currWind = data2.current.wind_speed;
                var currHumidity = data2.current.humidity;
                var currUVI = data2.current.uvi;
                console.log(currTemp, currWind, currHumidity, currUVI);

                currCityDateEl.textContent = currCity + " " + currDate;
                currIconEl.setAttribute("src", currIcon);
                currCityDateEl.appendChild(currIconEl);
                currTempEl.textContent = "Temp: " + currTemp + "\u00B0" + "F";
                currWindEl.textContent = "Wind: " + currWind + " MPH";
                currHumidityEl.textContent = "Humidity: " + currHumidity + " \u0025";
                currUviEl.textContent = "UV Index: ";
                currUviSpan.textContent = currUVI;
                currUviEl.appendChild(currUviSpan);

                if (currUVI <= 2.99) {
                    currUviSpan.setAttribute("style", "background-color: green");
                } if (currUVI >= 3 && currUVI <= 5.99) {
                    currUviSpan.setAttribute("style", "background-color: yellow");
                } if (currUVI >= 6) {
                    currUviSpan.setAttribute("style", "background-color: red");
                }

                todayEl.setAttribute("style", "visibility: visible");



            })
        })
    
});
