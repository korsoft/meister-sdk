(function(app) {
	app.controller('EditProfileController',
    ['$scope','$rootScope','$mdToast','UserService','MessageUtil',
    function ($scope,$rootScope, $mdToast, UserService, MessageUtil) {
        
        $scope.user = {};
        $scope.repassword = '';
        $scope.promise = null;
        
        $scope.init = function(){
          console.log("EditProfileController init...");
          $scope.promise = UserService.show($rootScope.user_id());

          $scope.promise.then(
                  function(result) { 
                    console.log("result",result);
                      $scope.user = result.data;
                      $scope.user.password = "";
                  },
                  function(errorPayload) {
                      console.log('failure login', errorPayload);
                      MessageUtil.showError(errorPayload.data.message);
                  }
             );
        };

        $scope.update = function(){
          $scope.promise = UserService.update_my_user($rootScope.user_id(),$scope.user);

          $scope.promise.then(
              function(result){
                MessageUtil.showInfo("User was updated");
                $scope.user.password = "";
                $scope.repassword = "";
              },
              function(error){
                console.log('failure login', error);
                MessageUtil.showError(error.data.message);
              }
          );
        };
        
    }]);
})(meister);