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

        service.execute_changes = function(id,params){
            return $http.post(SERVER_BASE_URL + '/api/clientgateways/'+id+'/execute',params);
        };

        service.buildJsonByNewEndpoint = function(json, parentNode, endpoint){
            console.log("buildJsonByNewEndpoint...");
            console.log("json",json);
            console.log("parentNode",parentNode);
            console.log("endpoint",endpoint);
            var json_to_send = {};
            _.forEach(json, function(project){
                console.log("project",project);
                json_to_send.PKY = project.PKY;
                json_to_send.PROJECT = project.PROJECT;
                json_to_send.MODULES = [];
                var module = _.find(project.MODULES, function(m){
                    return m.PKY == parentNode.PKY;
                });
                console.log("module",module);
                if(module){
                    var moduleItem = {
                      PKY: module.PKY,
                      NAME: module.NAME,
                      DATE:module.DATE.split("-").join(""),
                      ENDPOINTS: []
                    };
                    endpoint.STYLES = [
                        //{PKY:"",DIRECTION:"O",NAME:"Default",JSON:{NUMBER:""},CLASS_NAME:""},
                        {PKY:"",DIRECTION:"I",NAME:"Default",JSON:{NUMBER:""},CLASS_NAME:""}
                    ];
                    moduleItem.ENDPOINTS.push(endpoint);
                    json_to_send.MODULES.push(moduleItem);
                    return false;
                }
            });
            return json_to_send;
        };

        return service;
    }]);
})(meister);
