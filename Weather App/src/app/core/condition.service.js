(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('conditionService', conditionService);

    function conditionService() {

        var clear = function() {
            return "Clear";
        };
        var partlyCloudy = function() {
            return "Partly Cloudy";
        };
        var overcast = function() {
            return "Overcast";
        };
        var rain = function() {
            return "Rain";
        };
        var tStorm = function() {
            return "Thunderstorm";
        };

        return {
            wunderCondition: wunderCondition,
            forecastCondition: forecastCondition,
            yahooCondition: yahooCondition,
            wwonlineCondition: wwonlineCondition,
            videoCondition: videoCondition
        };

        function wunderCondition(condition) {
            if (condition === "Partly Cloudy") {
                return partlyCloudy();
            }
            if (condition === "Mostly Cloudy" || condition === "Overcast") {
                return overcast();
            }
            if (condition === "Rain" || condition === "Chance of Rain") {
                return rain();
            }
            if (condition === "Clear") {
                return clear();
            }
            if (condition === "Chance of a Thunderstorm" || condition === "Thunderstorm") {
                return tStorm();
            }
        }

        function forecastCondition(condition) {
            if (condition === "partly-cloudy-day" || condition === "partly-cloudy-night") {
                return partlyCloudy();
            }
            if (condition === "cloudy") {
                return overcast();
            }
            if (condition === "rain") {
                return rain();
            }
            if (condition === "clear-day" || condition === "clear-night") {
                return clear();
            }
            if (condition === "thunder-storm") {
                return tStorm();
            }
        }

        function yahooCondition(condition) {
            if (condition === "Partly Cloudy") {
                return partlyCloudy();
            }
            if (condition === "Mostly Cloudy") {
                return overcast();
            }
            if (condition === "Rain" || condition === "Showers" || condition === "Scattered Showers") {
                return rain();
            }
            if (condition === "Clear" || condition === "Mostly Sunny") {
                return clear();
            }
            if (condition === "Thunder Storm" || condition === "Scattered Thunderstorms") {
                return tStorm();
            }
        }

        function wwonlineCondition(condition) {
            if (condition === "Cloudy "|| condition === "Partly Cloudy ") {
                return partlyCloudy();
            }
            if (condition === "Overcast ") {
                return overcast();
            }
            if (condition === "Moderate or heavy rain shower" || condition === "Light rain shower" || condition === "Light rain" || condition === "Shower" || condition === "Moderate rain" || condition === "Light drizzle" || condition === "Patchy rain nearby" || condition === "Heavy rain") {
                return rain();
            }
            if (condition === "Sunny") {
                return clear();
            }
            if (condition === "Patchy light rain in area with thunder" || condition === "Moderate or heavy rain in area with thunder" || condition === "Thundery outbreaks in nearby") {
                return tStorm();
            }
        }

        function videoCondition(condition){
          switch(condition){
            case "Clear":
              return 'content/videos/Into-The-Woods.mp4';
            case "Partly Cloudy":
              return 'content/videos/Sky-High.mp4';
            case "Overcast":
              return;
            case 'Rain':
              return 'content/videos/Puddle.mp4';
            case 'Thunderstorm':
              return 'content/videos/thunderStorm.mp4';
          }
        }


    }

})();
