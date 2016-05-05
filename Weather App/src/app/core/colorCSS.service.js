(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('colorCSS', colorCSS);

    function colorCSS() {

        return {
            applyColor: applyColor,
            tempColor: tempColor,
            humidColor: humidColor
        };
        function applyColor(formattedWeather){
          var color = { "temp": [],
                        "humid": []};
          for (var i in formattedWeather) {
              color.temp.push(tempColor(formattedWeather[i].temperature));
              color.humid.push(humidColor(formattedWeather[i].humidity));
          }
          console.log(color);
          return color;
        }





        function tempColor(temp_num) {
            var round5 = 0;

            var f = temp_num * 2;
            f /= 10;
            f = Math.round(f);
            f *= 5;

            switch (f) {
                case 5:
                    return '#84D9FF';
                    break;
                case 10:
                    return '#7DEBFE';
                    break;
                case 15:
                    return '#76FEFB';
                    break;
                case 20:
                    return '#6FFEE3';
                    break;
                case 25:
                    return '#68FDC9';
                    break;
                case 30:
                    return '#61FDAC';
                    break;
                case 35:
                    return '#5AFD8D';
                    break;
                case 40:
                    return '#53FC6C';
                    break;
                case 45:
                    return '#4FFC4C';
                    break;
                case 50:
                    return '#67FC45';
                    break;
                case 55:
                    return '#80FB3E';
                    break;
                case 60:
                    return '#9CFB37';
                    break;
                case 65:
                    return '#BAFB30';
                    break;
                case 70:
                    return '#DAFA2A';
                    break;
                case 75:
                    return '#FAF723';
                    break;
                case 80:
                    return '#FAD21C';
                    break;
                case 85:
                    return '#F9AB15';
                    break;
                case 90:
                    return '#F9810E';
                    break;
                case 95:
                    return '#F95507';
                    break;
                case 100:
                    return '#F92801';
                    break;
                default:
                    return;
            }
        }
        function humidColor(humid_num) {
            var round5 = 0;

            var f = humid_num * 2;
            f /= 10;
            f = Math.round(f);
            f *= 5;

            switch (f) {
                case 5:
                    return '#FFFFFF';
                    break;
                case 10:
                    return '#F1FBFB';
                    break;
                case 15:
                    return '#E4F7F7';
                    break;
                case 20:
                    return '#D6F3F3';
                    break;
                case 25:
                    return '#BBEBEC';
                    break;
                case 30:
                    return '#AEE7E8';
                    break;
                case 35:
                    return '#A1E3E4';
                    break;
                case 40:
                    return '#93DFE1';
                    break;
                case 45:
                    return '#86DBDD';
                    break;
                case 50:
                    return '#78D7D9';
                    break;
                case 55:
                    return '#6BD3D5';
                    break;
                case 60:
                    return '#5DCFD2';
                    break;
                case 65:
                    return '#50CBCE';
                    break;
                case 70:
                    return '#43C7CA';
                    break;
                case 75:
                    return '#35C3C6';
                    break;
                case 80:
                    return '#28BFC3';
                    break;
                case 85:
                    return '#1ABBBF';
                    break;
                case 90:
                    return '#0DB7BB';
                    break;
                case 95:
                    return '#00B4B8';
                    break;
                case 100:
                    return '#00878A';
                    break;
                default:
                    return;
            }
        }
    }

})();
