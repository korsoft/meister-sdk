(function(app) {
	app.controller('GatewayClientsDialogController',
    ['$scope','gateway', '$location','$mdToast','$mdDialog','GatewayClientService','ClientService',
    'MessageUtil','SYSTEM_ADMIN',
    function ($scope,gateway, $location, $mdToast, $mdDialog, GatewayClientService,ClientService, 
      MessageUtil,SYSTEM_ADMIN) {
      
      $scope.gatewayClients= [];  
      $scope.types = [];
      $scope.clients = [];
      $scope.client_id = 0;
      $scope.type = 0;
      $scope.gateway = gateway;


      $scope.init = function (){
        GatewayClientService.getbyGatewayId(gateway.id).then(function(result){
           console.log(result);
           $scope.gatewayClients = result.data;
        });
      }
      $scope.init();
     
      ClientService.index().then(
          function(result){
            $scope.clients = result.data;
          },
          function(error){
            console.log("error",error);
            MessageUtil.showError(error.data.error);
      });
    
        
          $scope.delete = function(ev, client){
            var confirm = $mdDialog.confirm()
                .title('You are about to delete the following')
                .htmlContent('User ' + client.name)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
               $scope.promise = UserClientRoleService.destroy(client.id);
               $scope.promise.then(
                  function(result){
                    MessageUtil.showInfo("User was deleted");
                   
                  },
                  function(error){
                    MessageUtil.showError(error.data.error);
                  }
                );
            }, function() {
              
            });
         };

     $scope.add = function(){
        if($scope.client_id ){
          var params = { client_id: $scope.client_id,
            gateway_id: $scope.gateway.id
          }
          GatewayClientService.store(params).then(
            function(result){
                MessageUtil.showInfo("Relation created");
                $scope.init();
            },function(error){
              console.log(error);
              MessageUtil.showError(error.data.error);
            }
          );
        }
     }


  
      $scope.delete = function(e,c){
        c.$edit=false;
        GatewayClientService.destroy(c.id).then(
            function(result){
                MessageUtil.showInfo("Client relation deleted");
                $scope.init();
            },function(error){
              MessageUtil.showError(error.data.error);
            }
        );
     }

     $scope.close = function() {
           $mdDialog.cancel();
      };

        
    }]);
})(meister);