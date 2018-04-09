(function(app) {
	app.controller('EndpointDialogController',
    ['$scope','$mdDialog','endpoint','parentNode','gateway','json','GatewayService','MessageUtil',
    function ($scope, $mdDialog, endpoint, parentNode, gateway,json, GatewayService, MessageUtil) {
  
        $scope.endpoint = {};
        $scope.parentNode = {};

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
          $scope.endpoint.Payload_styles = [];
        } else {
          $scope.endpoint = angular.copy(endpoint);
        }

        $scope.parentNode = parentNode;
        console.log("Endpoint", endpoint);
        console.log("ParenNode", parentNode);


        $scope.save = function(){

          var json_to_send =  GatewayService.buildJsonByNewEndpoint(json, parentNode.source, $scope.endpoint);
          
          var params = {
            json: JSON.stringify(json_to_send)
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
        
    }]);
})(meister);