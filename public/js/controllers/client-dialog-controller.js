(function(app) {
	app.controller('ClientDialogController',
    ['$scope','$mdDialog','client','ClientService','MessageUtil',
    function ($scope, $mdDialog, client, ClientService, MessageUtil) {
  
        $scope.client = {};
        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!client){
          $scope.client.name = "";
          $scope.client.sap_number = "";
        }
        else
          $scope.client = angular.copy(client);

        console.log("Client", client);

        $scope.save = function(){
          
            if($scope.client.id)
              $scope.promise = ClientService.update($scope.client.id, $scope.client);
            else
              $scope.promise = ClientService.store($scope.client);

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