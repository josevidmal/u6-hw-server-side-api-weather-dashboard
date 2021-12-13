var inputEl = document.getElementById("search");
var searchBtn = document.getElementById("search-btn");
var historyEl = document.getElementById("history-div");
var todayEl = document.getElementById("today-section");
var frcstEl = document.getElementById("frcst-section");

var APIKey = "0e46e20b49b1fd7b6821209d1fb54328";

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    var city = inputEl.value;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat, lon);
            var oneAPICall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

            fetch(oneAPICall)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
            })
        })
    
});
