(function(app) {
	app.controller('ClientGatewayDialogController',
    ['$scope','$rootScope','$mdDialog','gateway','GatewayService','ClientService','MessageUtil',
    function ($scope,$rootScope, $mdDialog, gateway, GatewayService,ClientService, MessageUtil) {
  
        $scope.gateway = {};
        $scope.clients = [];
        $scope.types = [
          {id:0,name:"BASIC"},
          {id:1,name:"FORM"},
          {id:2,name:"DIGEST"},
          {id:3,name:"OAUTH"}
        ];
        $scope.promise = null;

        $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!gateway){
          $scope.gateway.name = "";
          $scope.gateway.url = "";
          $scope.gateway.username = "";
          $scope.gateway.password = "";
          $scope.gateway.auth_type = 0;
          $scope.gateway.digest = "";
        } else {
          $scope.gateway = angular.copy(gateway);
          $scope.gateway.client_id = Number($scope.gateway.client_id);
        }

        console.log("gateway", gateway);

        if($rootScope.user_type() == $rootScope.SYSTEM_ADMIN){
          $scope.promise = ClientService.index();

          $scope.promise.then(
              function(result){
                console.log("result",result);
                $scope.clients = result.data;
              },
              function(error){
                console.log("error",error);
                    MessageUtil.showError(error.data.message);
              }
          );
        }

        $scope.changeAuthType = function(type){
          $scope.gateway.auth_type = type;
        };

        $scope.save = function(){
          
            if($scope.gateway.id)
              $scope.promise = GatewayService.update($scope.gateway.id, $scope.gateway);
            else
              $scope.promise = GatewayService.store($scope.gateway);

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