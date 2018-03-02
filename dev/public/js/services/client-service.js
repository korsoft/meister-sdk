(function(app) {
	app.factory('ClientService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.index = function () {
            return $http.get(SERVER_BASE_URL + '/api/clients');
        };

        service.store = function(data){
            return $http.post(SERVER_BASE_URL + '/api/clients',data);
        };

        service.show = function(id){
            return $http.get(SERVER_BASE_URL + '/api/clients/'+id);
        }

        service.update = function(id, data){
            return $http.put(SERVER_BASE_URL + '/api/clients/'+id, data);
        }

       service.destroy = function(id){
            return $http.delete(SERVER_BASE_URL + '/api/clients/'+id);
        }

        return service;
    }]);
})(meister);