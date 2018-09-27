(function(app) {
  app.controller('BapiDialogController',
    ['$scope','$mdDialog','gatewayId','GatewayService','MessageUtil',
    function ($scope, $mdDialog,gatewayId,GatewayService,MessageUtil) {

      $scope.selector="O";
      $scope.selection="";
      
      $scope.cancel = function(e,c){
        console.log("cancel");
        c.$edit=false;
      }

      $scope.close = function() {
           console.log("close");
           $mdDialog.cancel();
      };

      $scope.send = function() {
           var json = {
                "SELECTOR":$scope.selector,
                "SELECTION":$scope.selection
              };

           var params = {
            "endpoint":"Meister.SDK.Bapi.Lookup",
            "json": JSON.stringify(json)
            }

            console.log("gatewayId",gatewayId);
            console.log("params",params);

            $scope.promise = GatewayService.execute_endpoint(gatewayId, params);
            
            $scope.promise.then(
                function(result){
                  console.log("result",result);
                  $mdDialog.cancel(); 
                  },
                function(error){
                  console.log("error",error);
                  MessageUtil.showError(error.data.message);
                }
              );
      };
    }]);
})(meister);