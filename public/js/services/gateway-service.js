(function(app) {
	app.factory('GatewayService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.index = function () {
            return $http.get(SERVER_BASE_URL + '/api/clientgateways');
        };

        service.store = function(data){
            return $http.post(SERVER_BASE_URL + '/api/clientgateways',data);
        };

        service.show = function(id){
            return $http.get(SERVER_BASE_URL + '/api/clientgateways/'+id);
        }

        service.update = function(id, data){
            return $http.put(SERVER_BASE_URL + '/api/clientgateways/'+id, data);
        }

       service.destroy = function(id){
            return $http.delete(SERVER_BASE_URL + '/api/clientgateways/'+id);
        }

        service.test_connection = function(id){
            return $http.get(SERVER_BASE_URL + '/api/clientgateways/'+id+'/test_connection');
        };

        service.execute = function(id){
            return $http.get(SERVER_BASE_URL + '/api/clientgateways/'+id+'/execute');
        };

        return service;
    }]);
})(meister);
