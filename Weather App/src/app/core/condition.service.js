(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('conditionService', conditionService);

    function conditionService() {

        var clear = function() {
            return "Clear";
        }
        var partlyCloudy = function() {
            return "Partly Cloudy";
        }
        var overcast = function() {
            return "Overcast";
        }
        var rain = function() {
            return "Rain";
        }
        var tStorm = function() {
            return "Chance of a Thunderstorm";
        }

        return {
            wunderCondition: wunderCondition,
            forecastCondition: forecastCondition,
            yahooCondition: yahooCondition,
            wwonlineCondition: wwonlineCondition
        }

        function wunderCondition(condition) {
            if (condition === "Partly Cloudy") {
                return partlyCloudy();
            }
            if (condition === "Chance of Rain") {
                return overcast();
            }
            if (condition === "Rain") {
                return rain();
            }
            if (condition === "Clear") {
                return clear();
            }
            if (condition === "Chance of a Thunderstorm") {
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
            if (condition === "Rain" || condition === "Showers") {
                return rain();
            }
            if (condition === "Clear") {
                return clear();
            }
            if (condition === "Thunder Storm") {
                return tStorm();
            }
        }

        function wwonlineCondition(condition) {
            if (condition === "Cloudy ") {
                return partlyCloudy();
            }
            if (condition === "Overcast ") {
                return overcast();
            }
            if (condition === "Light rain shower") {
                return rain();
            }
            if (condition === "Sunny") {
                return clear();
            }
            if (condition === "Patchy light rain in area with thunder") {
                return tStorm();
            }
        }


    }

})();