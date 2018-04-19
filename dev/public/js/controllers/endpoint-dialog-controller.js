(function(app) {
	app.controller('EndpointDialogController',
    ['$scope','$mdDialog','endpoint','parentNode','gateway','json','GatewayService','MessageUtil',
    function ($scope, $mdDialog, endpoint, parentNode, gateway,json, GatewayService, MessageUtil) {
  
        $scope.endpoint = {};
        $scope.parentNode = {};
        $scope.page=1;

        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!endpoint){
          $scope.endpoint.PKY = "";
          $scope.endpoint.NAMESPACE = "";
          $scope.endpoint.LONG_TEXT = "";
          $scope.endpoint.ENDPOINT_MAIN = "";
          $scope.endpoint.HANDLER = "";
          $scope.endpoint.BUS_NAME = "";
          $scope.endpoint.TYPE = "";
          $scope.endpoint.VERSION = "";
          $scope.endpoint.LOCKED = "";
          $scope.endpoint.PACKAGE = "";
          $scope.endpoint.TRANSPORT = "";
          $scope.endpoint.STYLES = [{PKY:"",DIRECTION:"I",NAME:"Default",JSON:"",CLASS_NAME:""}];
        } else {
          $scope.endpoint = angular.copy(endpoint);
        }

        $scope.parentNode = parentNode;
        console.log("Endpoint", endpoint);
        console.log("ParenNode", parentNode);


        $scope.save = function(){

          var json_to_send =  GatewayService.buildJsonByNewEndpoint(json, parentNode.source, $scope.endpoint);
          
          var params = {
            json: angular.toJson(json_to_send)
          };

            $scope.promise = GatewayService.execute_changes(gateway.id, params);
            
            $scope.promise.then(
                function(result){
                  console.log("result",result);
                  /*var endpointItem = {
                      name: $scope.endpoint.NAMESPACE,
                      source: $scope.endpoint,
                      expanded: false,
                      children: []
                    };
                  parentNode.children.push(endpointItem);
                  */
                    $mdDialog.hide(result);
                  },
                function(error){
                  console.log("error",error);
                  MessageUtil.showError(error.data.message);
                }
              );
         
        };

        $scope.changePage = function (page){
          $scope.page=page;
        }

        $scope.addStyle = function () {
          $scope.endpoint.STYLES.push({PKY:"",DIRECTION:"",NAME:"",JSON:"",CLASS_NAME:""});
        }

        $scope.deleteStyle = function (index) {
          $scope.endpoint.STYLES.splice(index, 1);
        }

        $scope.checkUniqueName= function () {
          var counts = [];
        //  console.log($scope.endpoint.Payload_styles[0]);
          for(var i = 0; i < $scope.endpoint.STYLES.length; i++) {
              if(counts[$scope.endpoint.STYLES[i].NAME+$scope.endpoint.STYLES[i].DIRECTION] === undefined) {
                  counts[$scope.endpoint.STYLES[i].NAME+$scope.endpoint.STYLES[i].DIRECTION] = 1;
              } else {
                  return true;
              }
          }
          return false;
        }
        
    }]);
})(meister);