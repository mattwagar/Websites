var template;
(function (template) {
    'use strict';
    angular
        .module('app.landing')
        .directive('mwTemplate', mwTemplate);
    function mwTemplate() {
        return {
            templateUrl: 'app/landing/directives/template.html',
            restrict: 'E',
            controller: GraphController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {}
        };
    }
    GraphController.$inject = [];
    function GraphController() {
        var vm = this;
    }
})(template || (template = {}));

//# sourceMappingURL=template.directive.js.map
