(function(app) {
	app.factory('GatewayClientService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.getbyGatewayId = function (gatewaytid) {
            return $http.get(SERVER_BASE_URL + '/api/clientgatewayrelation/getbygatewaytidandcurrentuser/'+gatewaytid);
        };

        service.store = function(data){
            return $http.post(SERVER_BASE_URL + '/api/clientgatewayrelation',data);
        };

      
        service.update = function(id, data){
            return $http.put(SERVER_BASE_URL + '/api/clientgatewayrelation/'+id, data);
        }

       service.destroy = function(id){
            return $http.delete(SERVER_BASE_URL + '/api/clientgatewayrelation/'+id);
        }

        return service;
    }]);
})(meister);