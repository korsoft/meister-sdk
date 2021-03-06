(function(app) {
	app.factory('UserService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.index = function () {
            return $http.get(SERVER_BASE_URL + '/api/users');
        };

        service.store = function(data){
            return $http.post(SERVER_BASE_URL + '/api/users',data);
        };

        service.show = function(id){
            return $http.get(SERVER_BASE_URL + '/api/users/'+id);
        }

        service.update = function(id, data){
            return $http.put(SERVER_BASE_URL + '/api/users/'+id, data);
        }

       service.destroy = function(id){
            return $http.delete(SERVER_BASE_URL + '/api/users/'+id);
        }

        service.types = function(){
            return $http.get(SERVER_BASE_URL + '/api/types');
        }

        service.update_my_user = function(id, data){
            return $http.put(SERVER_BASE_URL + '/api/users/'+id+'/update_my_user', data);
        }

        service.changeDefault = function(client_id){
            return $http.post(SERVER_BASE_URL + '/api/users/changedefault/'+client_id);
        };

        return service;
    }]);
})(meister);