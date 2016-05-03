(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('wunderAsyncService', wunderAsyncService);

    function wunderAsyncService($http) {

        var service = null;
        var weatherJSON = null;

        var wunderJSON = function () {
            return $http.get('http://api.wunderground.com/api/53f04aff77545973/forecast10day/q/19104.json');

        };

        return {
            wunderJSON: wunderJSON,
            formatWeather: formatWeather
        };


        function formatWeather(JSONdata) {

            var cleanJSON = {
                "weather": []
            };

            for (var i = 0; i < 7; i += 1) {

                var day = JSONdata.forecast.simpleforecast.forecastday[i];

                var date = day.date.month + "/" + day.date.day;
                var time = day.date.hour - 12 + ":00";
                var temperature = day.high.fahrenheit;
                var humidity = day.avehumidity;
                var windspeed = day.avewind.mph + " mph";
                var condition = day.conditions;

                var compiledJSON = {
                    "date": date,
                    "time": time,
                    "temperature": temperature,
                    "humidity": humidity,
                    "windspeed": windspeed,
                    "condition": condition,
                }

                cleanJSON.weather.push(compiledJSON);

            }

            return cleanJSON;

        }
    }

})();
