(function () {
    'use strict';

    angular
        .module('app.landing')
        .controller('landingController', landingController);

    landingController.$inject = ['wunderAsyncService', '$timeout'];

    function landingController(wunderAsyncService, $timeout) {
        var vm = this;
    }

})();