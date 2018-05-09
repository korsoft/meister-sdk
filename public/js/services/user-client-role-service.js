(function(app) {
	app.factory('UserClientRoleService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.getByUserId = function ($userId) {
            return $http.get(SERVER_BASE_URL + '/api/clientuserrole/byuserid/'+$userId);
        };

        service.store = function(data){
            return $http.post(SERVER_BASE_URL + '/api/clientuserrole',data);
        };

      
        service.update = function(id, data){
            return $http.put(SERVER_BASE_URL + '/api/clientuserrole/'+id, data);
        }

       service.destroy = function(id){
            return $http.delete(SERVER_BASE_URL + '/api/clientuserrole/'+id);
        }

        return service;
    }]);
})(meister);