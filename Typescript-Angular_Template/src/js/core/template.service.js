(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('templateService', templateService);
    function templateService() {
        return {
            example: example
        };
        function example(number) {
            return number;
        }
    }
})();
//# sourceMappingURL=template.service.js.map