(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('averageWeatherService', averageWeatherService);

  function averageWeatherService(){

    return {
        formatWeather: formatWeather
    };


    function averageWeather(jsondata, day_num) {

        var cleanJSON = {
            "weather": []
        };

        for (var i = 0; i < 7; i += 1) {

            var wunderground = jsondata.wunderground.weather[i];
            var forecastio = jsondata.forecastio.weather[i];
            var yahoo = jsondata.yahoo.weather[i];
            var wwonline = jsondata.wwonline.weather[i];

            var date = wunderground.date
            var time = "00:00"
            var temperature = (wunderground.temperature + forecastio.temperature + yahoo.temperature + wwonline.temperature)/4;
            var humidity = (wunderground.humidity + forecastio.humidity + wwonline.humidity)/3;
            var windspeed = (wunderground.humidity + forecastio.humidity + wwonline.humidity)/3;
            var condition = conditionService.wunderCondition(day.conditions);

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
