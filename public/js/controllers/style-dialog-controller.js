(function(app) {
	app.controller('StyleDialogController',
    ['$scope','$mdDialog','style','parentNode','gateway', 'json','GatewayService','MessageUtil',
    function ($scope, $mdDialog, style, parentNode, gateway, json, GatewayService, MessageUtil) {
  
        $scope.style = {};
       
        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!style){
          $scope.style.PKY = "";
          $scope.style.DIRECTION = "";
          $scope.style.NAME = "";
          $scope.style.JSON = "";
        } else {
          $scope.style = angular.copy(style);
        }

       console.log("Style", style);
        console.log("ParenNode", parentNode);


        $scope.save = function(){

          var json_to_send =  GatewayService.buildJsonByNewStyle(json, parentNode.source, $scope.style);
          
          var params = {
            json: JSON.stringify(json_to_send)
          };

            $scope.promise = GatewayService.execute_changes(gateway.id, params);
            
            $scope.promise.then(
                function(result){
                  console.log("result",result);
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