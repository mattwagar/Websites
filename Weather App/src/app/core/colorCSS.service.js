(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('colorCSS', colorCSS);

    function colorCSS() {

        return {
            applyColor: applyColor,
            tempColor: tempColor,
            humidColor: humidColor,
            windColor: windColor,
            conditionColor: conditionColor
        };

        function applyColor(formattedWeather) {
            var color = {
                "date": ['#ff9999', '#ffcc99', '#ffff99', '#b3ff99', '#99e6ff', '#b399ff', '#e699ff'],
                "temp": [],
                "humid": [],
                "windspeed": [],
                "condition": []
            };
            for (var i in formattedWeather) {
                color.temp.push(tempColor(formattedWeather[i].temperature));
                color.humid.push(humidColor(formattedWeather[i].humidity));
                color.windspeed.push(windColor(formattedWeather[i].windspeed));
                color.condition.push(conditionColor(formattedWeather[i].condition));
            }
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
                case 10:
                    return '#7DEBFE';
                case 15:
                    return '#76FEFB';
                case 20:
                    return '#6FFEE3';
                case 25:
                    return '#68FDC9';
                case 30:
                    return '#61FDAC';
                case 35:
                    return '#5AFD8D';
                case 40:
                    return '#53FC6C';
                case 45:
                    return '#4FFC4C';
                case 50:
                    return '#67FC45';
                case 55:
                    return '#80FB3E';
                case 60:
                    return '#9CFB37';
                case 65:
                    return '#BAFB30';
                case 70:
                    return '#DAFA2A';
                case 75:
                    return '#FAF723';
                case 80:
                    return '#FAD21C';
                case 85:
                    return '#F9AB15';
                case 90:
                    return '#F9810E';
                case 95:
                    return '#F95507';
                case 100:
                    return '#F92801';
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
                case 10:
                    return '#F1FBFB';
                case 15:
                    return '#E4F7F7';
                case 20:
                    return '#D6F3F3';
                case 25:
                    return '#BBEBEC';
                case 30:
                    return '#AEE7E8';
                case 35:
                    return '#A1E3E4';
                case 40:
                    return '#93DFE1';
                case 45:
                    return '#86DBDD';
                case 50:
                    return '#78D7D9';
                case 55:
                    return '#6BD3D5';
                case 60:
                    return '#5DCFD2';
                case 65:
                    return '#50CBCE';
                case 70:
                    return '#43C7CA';
                case 75:
                    return '#35C3C6';
                case 80:
                    return '#28BFC3';
                case 85:
                    return '#1ABBBF';
                case 90:
                    return '#0DB7BB';
                case 95:
                    return '#00B4B8';
                case 100:
                    return '#00878A';
                default:
                    return;
            }
        }
    }

    function windColor(wind_num) {

        switch (wind_num) {
            case 0:
                return '#FFFFFF';
            case 1:
                return '#FFFFFF';
            case 2:
                return '#F5FBF1';
            case 3:
                return '#ECF7E4';
            case 4:
                return '#E3F3D6';
            case 5:
                return '#DAF0C9';
            case 6:
                return '#D1ECBB';
            case 7:
                return '#C8E8AE';
            case 8:
                return '#BFE4A1';
            case 9:
                return '#B6E193';
            case 10:
                return '#ADDD86';
            case 11:
                return '#A3D978';
            case 12:
                return '#9AD56B';
            case 13:
                return '#91D25D';
            case 14:
                return '#88CE50';
            case 15:
                return '#7FCA43';
            case 16:
                return '#76C635';
            case 17:
                return '#6DC328';
            case 18:
                return '#64BF1A';
            case 19:
                return '#5BBB0D';
            case wind_num >= 20:
                return '#52B800';
            default:
                return;
        }
    }

    function conditionColor(condition) {

        switch (condition) {
            case "Clear":
                return '#FFFF66';
            case "Partly Cloudy":
                return '#a9c6d9';
            case "Overcast":
                return '#a6a6b4';
            case "Rain":
                return '#616cff';
            case "Thunderstorm":
                return '#be7ffc';
            default:
                return '#cae3b7';
        }
    }
})();
