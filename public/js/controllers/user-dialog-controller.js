(function(app) {
	app.controller('UserDialogController',
    ['$scope','$rootScope','$mdDialog','user','ClientService','UserService','MessageUtil',
    function ($scope, $rootScope, $mdDialog, user, ClientService, UserService, MessageUtil) {
  
        $scope.user = {};
        $scope.types = [];
        $scope.clients = [];
        $scope.promise = null;

        $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!user){
          $scope.user.email = "";
          $scope.user.first_name = "";
          $scope.user.last_name = "";
          $scope.user.type = $rootScope.CLIENT_USER;
          $scope.user.client_id = null;
        } else
            $scope.user = angular.copy(user);

           console.log("User", user);


        if($rootScope.user_type() == $rootScope.SYSTEM_ADMIN){
           ClientService.index().then(
              function(result){
                $scope.clients = result.data;
                if(!$scope.user.id)
                  $scope.user.client_id = result.data[0].id;
              },
              function(error){
                console.log("error",error);
                MessageUtil.showError(error.data.message);
              }
            );
        } else {
          $scope.clients = [$rootScope.user_client().client];
          $scope.user.client_id = $rootScope.user_client().client.id;
        }


        UserService.types().then(
            function(result){
              $scope.types = result.data;
            },
            function(error){
              console.log("error",error);
              MessageUtil.showError(error.data.message);
            }
          );


       

        $scope.save = function(){
          
            if($scope.user.id)
              $scope.promise = UserService.update($scope.user.id, $scope.user);
            else
              $scope.promise = UserService.store($scope.user);

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