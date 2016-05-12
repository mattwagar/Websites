(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('forecastAsyncService', forecastAsyncService);

        forecastAsyncService.$inject = ['$http', 'conditionService'];

    function forecastAsyncService($http, conditionService) {

        var service = null;
        var weatherJSON = null;

        var forecastJSON = function(){
        return $http.jsonp('https://api.forecast.io/forecast/9e36aadb4e202eb424c4d98f37978eb5/39.9566,-75.1899' +'?callback=JSON_CALLBACK');


        };

        return {
            forecastJSON: forecastJSON,
            formatWeather: formatWeather
        };


        function formatWeather(JSONdata) {

            var cleanJSON = {
                "weather": []
            };

            for (var i = 0; i < 7; i += 1) {

                var day = JSONdata.daily.data[i];
                var unixDate = new Date(day.time*1000);

                var month = unixDate.getMonth()+1;



                var date = month + "/" + unixDate.getDate();
                var time = unixDate.getHours()+":00";
                var temperature = Math.round(day.temperatureMax);
                var humidity = parseInt(day.humidity * 100);
                var windspeed = Math.round(day.windSpeed);
                var condition = conditionService.forecastCondition(day.icon);

                var compiledJSON = {
                    "date": date,
                    "time": time,
                    "temperature": temperature,
                    "humidity": humidity,
                    "windspeed": windspeed,
                    "condition": condition
                };

                cleanJSON.weather.push(compiledJSON);

            }

            return cleanJSON;

        }

    }

})();
