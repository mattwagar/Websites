(function () {
    'use strict';

    angular
        .module('app.landing')
        .directive('d3graph', d3graph);

    function d3graph() {
        return {
            templateUrl: 'app/landing/directives/d3graphDirective.html',
            restrict: 'E',
            controller: d3GraphController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                weather: '='
            }
        };
    }

    d3GraphController.$inject = ['$scope', 'averageWeatherService', 'd3f'];

    function d3GraphController($scope, averageWeatherService, d3f) {
        var vm = this;


        console.log(d3f);

        var wdata;


        console.log(wdata);
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the datef / time
        var parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var temparea = d3.area()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d.datef); })
            .y0(height)
            .y1(function (d) { return y(d.temperature); });
        var humidarea = d3.area()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d.datef); })
            .y0(height)
            .y1(function (d) { return y(d.humidity); });
        var windarea = d3.area()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d.datef); })
            .y0(height)
            .y1(function (d) { return y(d.windspeed); });

        // define the line
        var templine = d3.line()
            .curve(d3.curveBasis)
            // .curve(d3.curveCatmullRomOpen)
            .x(function (d) { return x(d.datef); })
            .y(function (d) { return y(d.temperature); });

        var humidline = d3.line()
            .curve(d3.curveBasis)
            // .curve(d3.curveCatmullRomOpen)
            .x(function (d) { return x(d.datef); })
            .y(function (d) { return y(d.humidity); });

        var windline = d3.line()
            .curve(d3.curveBasis)
            // .curve(d3.curveCatmullRomOpen)
            .x(function (d) { return x(d.datef); })
            .y(function (d) { return y(d.windspeed); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.selectAll("#d3").append("svg")
            .attr("width", width + margin.left + margin.right + 30)
            .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var drawData = function (data) {
            // format the data
            data.forEach(function (d) {
                d.datef = new Date(d.date + '/2017');
                // d.datef = parseTime(d.datef);
                d.temperature = +d.temperature;
            });

            // Scale the range of the data
            // x.domain(data.map(function (d) { return d.datef; }));
            x.domain(d3.extent(data, function (d) {
                return d.datef;
            }));
            y.domain([0, 100]);

            // Add the valueline path.
            var dataNest = d3.nest()
                .key(function (d) { return d.name; })
                .entries(data);
            var space = width / dataNest.length;


            svg.append("path")
                .datum(data)
                .attr("class", "humidarea")
                .attr("d", humidarea);

            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "humidline")
                .attr("d", humidline);

            svg.append("path")
                .datum(data)
                .attr("class", "temparea")
                .attr("d", temparea);

            svg.append("path")
                .data([data])
                .attr("class", "templine")
                .attr("d", templine);

            svg.append("path")
                .datum(data)
                .attr("class", "windarea")
                .attr("d", windarea);

            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "windline")
                .attr("d", windline);

            // Add the X Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(7));

            // Add the Y Axis
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("class", "temparea")
                .attr("x", 100)  // space legend
                .attr("y", height + (margin.bottom / 2) + 55)
                .text("Temperature (℉)");
            svg.append("text")
                .attr("class", "humidarea")
                .attr("x", width-200)  // space legend
                .attr("y", height + (margin.bottom / 2) + 55)
                .text("Humidity (%)");
            svg.append("text")
                .attr("class", "windarea")
                .attr("x", 400)  // space legend
                .attr("y", height + (margin.bottom / 2) + 55)
                .text("Wind Speed (mph)");
        };

        $scope.$watch('vm.weather', function (before, after) {
            wdata = vm.weather.weather;
            drawData(wdata);
        }, true);




    }
})();
