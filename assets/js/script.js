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

init();

var APIKey = "0e46e20b49b1fd7b6821209d1fb54328";

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    var city = inputEl.value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function(response1) {
            if (response1.ok) {
            return response1.json();
            } else {
            alert("Please choose a valid city");
            return;
            }
        })

        .then(function(data1) {
            var lat = data1.coord.lat;
            var lon = data1.coord.lon;
            var oneAPICall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;

            fetch(oneAPICall)
            .then(function(response2) {
                return response2.json();
            })
            .then(function(data2) {
                var currCity = data1.name;
                var currDate = moment().format("L");
                var currIconCode = data1.weather[0].icon;
                var currIcon = "https://openweathermap.org/img/wn/" + currIconCode + ".png"
                var currTemp = data2.current.temp;
                var currWind = data2.current.wind_speed;
                var currHumidity = data2.current.humidity;
                var currUVI = data2.current.uvi;

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

                for (var i = 0; i < 5; i++) {
                    var frcstCardEl = document.createElement("div");
                    frcstCardEl.setAttribute("class", "frcst-cards");
                    frcstEl.appendChild(frcstCardEl);

                    var frcstDateEl = document.createElement("h4");
                    frcstDateEl.setAttribute("class", "frcst-dates");
                    frcstDateEl.textContent = moment().add(i + 1, "days").format("L");
                    frcstCardEl.appendChild(frcstDateEl);

                    var frcstWeatherEl = document.createElement("ul");
                    frcstWeatherEl.setAttribute("class", "frcst-weather");
                    frcstCardEl.appendChild(frcstWeatherEl);

                    var frcstIconEl = document.createElement("li");
                    frcstIconEl.setAttribute("class", "frcst-icons");
                    frcstWeatherEl.appendChild(frcstIconEl);

                    var frcstIconCode = data2.daily[i].weather[0].icon;
                    var frcstIcon = "https://openweathermap.org/img/wn/" + frcstIconCode + ".png"
                    var frcstImage = document.createElement("img");
                    frcstImage.setAttribute("src", frcstIcon);
                    frcstIconEl.appendChild(frcstImage);

                    var frcstTempEl = document.createElement("li");
                    frcstTempEl.setAttribute("class", "frcst-temps");
                    var frcstTemp = data2.daily[i].temp.day;
                    frcstTempEl.textContent = "Temp: " + frcstTemp + "\u00B0" + "F";
                    frcstWeatherEl.appendChild(frcstTempEl);

                    var frcstWindEl = document.createElement("li");
                    frcstWindEl.setAttribute("class", "frcst-winds");
                    var frcstWind = data2.daily[i].wind_speed;
                    frcstWindEl.textContent = "Wind: " + frcstWind + " MPH";
                    frcstWeatherEl.appendChild(frcstWindEl);

                    var frcstHumidityEl = document.createElement("li");
                    frcstHumidityEl.setAttribute("class", "frcst-humidities");
                    var frcstHumidity = data2.daily[i].humidity;
                    frcstHumidityEl.textContent = "Humidity: " + frcstHumidity + " \u0025";
                    frcstWeatherEl.appendChild(frcstHumidityEl);

                    if (frcstEl.hasChildNodes()) {
                        frcstEl.replaceChild(frcstCardEl, frcstEl.children[i + 1]);
                    }
                }

                frcstEl.setAttribute("style", "visibility: visible");

                var localStorageContent = localStorage.getItem("cities");

                var cities;
                if (localStorageContent === null) {
                    cities = [];
                } else {
                    cities = JSON.parse(localStorageContent);
                }

                cities.unshift(city);
                var citiesSliced = cities.slice(0,9);

                localStorage.setItem("cities", JSON.stringify(citiesSliced));

                var lastSearch = JSON.parse(localStorage.getItem("cities"));
                
                if (lastSearch !== null) {
                    var newBtn = document.createElement("button");
                    newBtn.setAttribute("class", "history-btns");
                    newBtn.setAttribute("value", lastSearch[0]);
                    newBtn.textContent = lastSearch[0];
                } else {
                    return;
                }

                if (historyEl.hasChildNodes()) {
                    historyEl.insertBefore(newBtn, historyEl.children[0]);
                } else {
                    historyEl.appendChild(newBtn);
                }

                if (lastSearch.length > 8) {
                    historyEl.removeChild(historyEl.children[8]);
                }

            })
        })
});

function init() {
    renderHistoryBtns();
}

function renderHistoryBtns() {

    var lastSearch = JSON.parse(localStorage.getItem("cities"));

    if (lastSearch !== null) {
        for (var i = 0; i < 8; i++) {
            var newBtn = document.createElement("button");
            newBtn.setAttribute("class", "history-btns");
            newBtn.setAttribute("value", lastSearch[i]);
            newBtn.textContent = lastSearch[i];
            historyEl.appendChild(newBtn);
            var btnValue = newBtn.getAttribute("value");
            if (btnValue === "undefined") {
                newBtn.setAttribute("style", "display: none");
            }
        } 
    } else {
            return;
    }
}

historyEl.addEventListener("click", function(event) {

    var historyCity = event.target.value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + historyCity + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function(response1) {
            return response1.json();
        })
        .then(function(data1) {
            var lat = data1.coord.lat;
            var lon = data1.coord.lon;
            var oneAPICall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;

            fetch(oneAPICall)
            .then(function(response2) {
                return response2.json();
            })
            .then(function(data2) {
                
                var currCity = data1.name;
                var currDate = moment().format("L");
                var currIconCode = data1.weather[0].icon;
                var currIcon = "https://openweathermap.org/img/wn/" + currIconCode + ".png"
                var currTemp = data2.current.temp;
                var currWind = data2.current.wind_speed;
                var currHumidity = data2.current.humidity;
                var currUVI = data2.current.uvi;

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

                for (var i = 0; i < 5; i++) {
                    var frcstCardEl = document.createElement("div");
                    frcstCardEl.setAttribute("class", "frcst-cards");
                    frcstEl.appendChild(frcstCardEl);

                    var frcstDateEl = document.createElement("h4");
                    frcstDateEl.setAttribute("class", "frcst-dates");
                    frcstDateEl.textContent = moment().add(i + 1, "days").format("L");
                    frcstCardEl.appendChild(frcstDateEl);

                    var frcstWeatherEl = document.createElement("ul");
                    frcstWeatherEl.setAttribute("class", "frcst-weather");
                    frcstCardEl.appendChild(frcstWeatherEl);

                    var frcstIconEl = document.createElement("li");
                    frcstIconEl.setAttribute("class", "frcst-icons");
                    frcstWeatherEl.appendChild(frcstIconEl);

                    var frcstIconCode = data2.daily[i].weather[0].icon;
                    var frcstIcon = "https://openweathermap.org/img/wn/" + frcstIconCode + ".png"
                    var frcstImage = document.createElement("img");
                    frcstImage.setAttribute("src", frcstIcon);
                    frcstIconEl.appendChild(frcstImage);

                    var frcstTempEl = document.createElement("li");
                    frcstTempEl.setAttribute("class", "frcst-temps");
                    var frcstTemp = data2.daily[i].temp.day;
                    frcstTempEl.textContent = "Temp: " + frcstTemp + "\u00B0" + "F";
                    frcstWeatherEl.appendChild(frcstTempEl);

                    var frcstWindEl = document.createElement("li");
                    frcstWindEl.setAttribute("class", "frcst-winds");
                    var frcstWind = data2.daily[i].wind_speed;
                    frcstWindEl.textContent = "Wind: " + frcstWind + " MPH";
                    frcstWeatherEl.appendChild(frcstWindEl);

                    var frcstHumidityEl = document.createElement("li");
                    frcstHumidityEl.setAttribute("class", "frcst-humidities");
                    var frcstHumidity = data2.daily[i].humidity;
                    frcstHumidityEl.textContent = "Humidity: " + frcstHumidity + " \u0025";
                    frcstWeatherEl.appendChild(frcstHumidityEl);

                    if (frcstEl.hasChildNodes()) {
                        frcstEl.replaceChild(frcstCardEl, frcstEl.children[i + 1]);
                    }
                }

                frcstEl.setAttribute("style", "visibility: visible");
            })
        })
})