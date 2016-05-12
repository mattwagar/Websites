(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('wwonlineAsyncService', wwonlineAsyncService);

    wwonlineAsyncService.$inject = ['$http', 'conditionService'];

    function wwonlineAsyncService($http, conditionService) {

        var service = null;
        var weatherJSON = null;

        var wwonlineJSON = function() {
            return $http.get('http://api.worldweatheronline.com/premium/v1/weather.ashx?key=23cbfc0353e947f8b39195226160805&q=19104&num_of_days=7', {
                transformResponse: function(data) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    return json;
                }
            });
        };

        return {
            wwonlineJSON: wwonlineJSON,
            formatWeather: formatWeather
        };


        function formatWeather(JSONdata) {

            var cleanJSON = {
                "weather": []
            };

            for (var i = 0; i < 7; i += 1) {

                var day = JSONdata.weather[i];

                var d1 = parseInt(day.date.substring(5, 7));

                var d2 = parseInt(day.date.substring(day.date.length - 2, day.date.length));

                var date = d1 + "/" + d2;
                var time = "N/A";
                var temperature = day.maxtempF;
                var humidity = day.hourly[4].humidity;
                var windspeed = parseInt(day.hourly[4].windspeedMiles);
                var condition = conditionService.wwonlineCondition(day.hourly[4].weatherDesc);

                var compiledJSON = {
                    "date": date,
                    "time": time,
                    "temperature": temperature,
                    "humidity": humidity,
                    "windspeed": windspeed,
                    "condition": condition,
                };

                cleanJSON.weather.push(compiledJSON);

            }

            return cleanJSON;

        }
    }

})();
