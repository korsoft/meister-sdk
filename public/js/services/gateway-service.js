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

        service.execute = function(id,params){
            return $http({url: SERVER_BASE_URL + '/api/clientgateways/'+id+'/execute', 
                 method: "GET",
                 params: params});
        };

        service.execute_changes = function(id,params){
            return $http.post(SERVER_BASE_URL + '/api/clientgateways/'+id+'/execute',params);
        };

        service.execute_endpoint = function(id,params){
            return $http.post(SERVER_BASE_URL + '/api/clientgateways/'+id+'/execute_endpoint',params);
        };

        service.buildJsonByNewProject = function(json,project){
            console.log("buildJsonByNewProject...");
            console.log("json",json);
            console.log("project",project);
            var json_to_send = {};

            json_to_send.PKY = project.PKY ? project.PKY : "";
            json_to_send.PROJECT = project.PROJECT;
            json_to_send.LOGICAL_DELETE = project.LOGICAL_DELETE;
            json_to_send.MEISTER_OWN = project.MEISTER_OWN;
            json_to_send.MODULES = [];
            json_to_send.STYLE_LIB = [];    
            return json_to_send;
        };

        service.buildJsonByNewModule = function(json, parentNode,module){
            console.log("buildJsonByNewEndpoint...");
            console.log("json",json);
            console.log("parentNode",parentNode);
            console.log("module",module);
            var json_to_send = {};

            var project = _.find(json, function(p){
                return p.PKY == parentNode.PKY;
            });

            if(project){
                console.log("project",project);
                json_to_send.PKY = project.PKY;
                json_to_send.PROJECT = project.PROJECT;
                json_to_send.LOGICAL_DELETE = project.LOGICAL_DELETE;
                json_to_send.MEISTER_OWN = project.MEISTER_OWN;
                json_to_send.MODULES = [];
                 var moduleItem = {
                      PKY: module.PKY,
                      FKY:project.PKY,
                      NAME: module.NAME,
                      LOGICAL_DELETE: module.LOGICAL_DELETE,
                      MEISTER_OWN: module.MEISTER_OWN,
                      DATE: moment(module.DATE).format('YYYYMMDD')
                      //ENDPOINTS: module.ENDPOINTS
               };
                json_to_send.MODULES.push(moduleItem);
            }
            return json_to_send;
        };

        service.buildJsonByNewEndpoint = function(json, parentNode, endpoint){
            console.log("buildJsonByNewEndpoint...");
            console.log("json",json);
            console.log("parentNode",parentNode);
            console.log("endpoint",endpoint);
            var json_to_send = {};
            var project = _.find(json, function(p){
                return p.PKY == parentNode.FKY;
            });
            if(project){
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
                      FKY:project.PKY,
                      NAME: module.NAME,
                      DATE:module.DATE.split("-").join(""),
                      MEISTER_OWN:  module.MEISTER_OWN,
                      LOGICAL_DELETE:  module.LOGICAL_DELETE,
                      ENDPOINTS: []
                    };
                    endpoint.FKY = module.PKY;
                    moduleItem.ENDPOINTS.push(angular.copy(endpoint));
                    json_to_send.MODULES.push(moduleItem);
                }
            }
            return json_to_send;
        };

        service.buildJsonByNewStyle = function(json, parentNode, style){
            console.log("buildJsonByNewStyle...");
            console.log("json",json);
            console.log("parentNode",parentNode);
            console.log("style",style);
            var json_to_send = {};

            var project = _.find(json, function(p){
                return p.PKY == parentNode.source.parent.FKY;
            });
            if(project){

                 json_to_send.PKY = project.PKY;
                json_to_send.PROJECT = project.PROJECT;
                json_to_send.MODULES = [];

                var module = _.find(project.MODULES, function(m){
                    return m.PKY == parentNode.FKY;
                });
                console.log("project",project);

               
               if(module){
                 var moduleItem = {
                      PKY: module.PKY,
                      NAME: module.NAME,
                      DATE:module.DATE.split("-").join(""),
                      MEISTER_OWN:  module.MEISTER_OWN,
                      LOGICAL_DELETE:  module.LOGICAL_DELETE,
                      ENDPOINTS: []
                    };
                    var endpoint = _.find(m.ENDPOINTS, function(e){
                        return e.PKY == parentNode.PKY;
                    });
                   
                    if(endpoint){

                    endpoint.STYLES = [];
                    endpoint.STYLES.push(style);
                    moduleItem.ENDPOINTS.push(endpoint);
                    json_to_send.MODULES.push(moduleItem);
                    
                    }
                }
            
            };
            return json_to_send;
        };

        service.buildJsonByNewStyleTemplate = function(json, parentNode, style){
            var json_to_send = {};
            var project = _.find(json, function(p){
                return p.PKY == parentNode.PKY;
            });
          
            console.log("project",project);
            json_to_send.PKY = project.PKY;
            json_to_send.PROJECT = project.PROJECT;
            json_to_send.STYLE_LIB = [];
            style.FKY = project.PKY;
            

            json_to_send.STYLE_LIB.push(style);
               
           
         
            return json_to_send;
        };

        return service;
    }]);
})(meister);
