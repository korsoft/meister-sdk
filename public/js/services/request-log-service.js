(function(app) {
	app.factory('RequestLogService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.index = function (params) {
            return $http.get(SERVER_BASE_URL + '/api/requestlogs',{"params":params});
        };


        service.deleteAll = function () {
            return $http.delete(SERVER_BASE_URL + '/api/requestlogs/all');
        };


        return service;
    }]);
})(meister);