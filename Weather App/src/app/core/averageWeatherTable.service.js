(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('averageWeatherService', averageWeatherService);

  function averageWeatherService(){

    return {
        averageWeather: averageWeather
    };

    function averageCondition(condition_arr){

      var clear = 0,
      rain = 0,
      overcast = 0,
      tstorm = 0,
      pcloudy = 0;

      for (var i in condition_arr){
        switch(condition_arr[i]){
          case "Clear":
            clear +=1;
            break;
          case "Rain":
            rain +=1;
            break;
          case "Overcast":
            overcast +=1;
            break;
          case "Partly Cloudy":
            pcloudy +=1;
            break;
          case "Thunderstorm":
            tstorm +=1;
            break;
          default:
            break;
          }
        }

      var most = Math.max(clear, rain, overcast, pcloudy, tstorm);

      if(most === clear){
        return "Clear";
      }
      else if(most === rain){
        return "Rain";
      }
      else if(most === overcast){
        return "Overcast";
      }
      else if(most === pcloudy){
        return "Partly Cloudy";
      }
      else if(most === tstorm){
        return "Thunderstorm";
      }
    }


    function averageWeather(jsondata, day_num) {

        var cleanJSON = {
            "weather": []
        };

        for (var i = 0; i < 7; i += 1) {

            var wunderground = jsondata.wunderground.weather[i];
            var forecastio = jsondata.forecastio.weather[i];
            var yahoo = jsondata.yahoo.weather[i];
            var wwonline = jsondata.wwonline.weather[i];

            var all_conditions = [wunderground.condition, forecastio.condition, yahoo.condition, wwonline.condition];

            var date = wunderground.date;
            var time = "00:00";
            var temperature = parseInt((parseInt(wunderground.temperature) + parseInt(forecastio.temperature) + parseInt(yahoo.temperature) + parseInt(wwonline.temperature))/4);
            var humidity = parseInt((parseInt(wunderground.humidity) + parseInt(forecastio.humidity) + parseInt(wwonline.humidity))/3);
console.log(humidity);
            var windspeed = parseInt((parseInt(wunderground.windspeed) + parseInt(forecastio.windspeed) + parseInt(wwonline.windspeed))/3);
            var condition = averageCondition(all_conditions);

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
