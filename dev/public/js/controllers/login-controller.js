(function(app) {
	app.controller('LoginController',
    ['$scope', '$rootScope', '$location','$mdToast', '$cookies','AuthenticationService','MessageUtil',
    function ($scope, $rootScope, $location, $mdToast, $cookies, AuthenticationService, MessageUtil) {
        
        $cookies.remove('meister-sdk-token');

        $scope.login = function () {
            $scope.promise =  AuthenticationService.Login($scope.username, $scope.password);

            $scope.promise.then(
                  function(result) { 
                      console.log("Login",result);
                       $location.path('/');
                  },
                  function(errorPayload) {
                      console.log('failure login', errorPayload);
                      MessageUtil.showError('The user credentials were incorrect');
                  }
             );

        };
    }]);
})(meister);
