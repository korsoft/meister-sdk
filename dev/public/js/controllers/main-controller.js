(function(app) {
	app.controller('MainController', ['$scope','$rootScope','$cookies','$location','$timeout',
		'$mdSidenav','$mdMenu','$state','SYSTEM_ADMIN','SYSTEM_INTEGRATOR','CLIENT_ADMIN','CLIENT_USER','AuthenticationService',
		function($scope,$rootScope,$cookies,$location,$timeout, $mdSidenav,$mdMenu, $state, 
			SYSTEM_ADMIN, SYSTEM_INTEGRATOR, CLIENT_ADMIN, CLIENT_USER, AuthenticationService) {
		
		console.log("MainController init");
		$rootScope.toggleLeft = buildToggler('left');
    	$rootScope.toggleRight = buildToggler('right');
    	$rootScope.SYSTEM_ADMIN = SYSTEM_ADMIN;
    	$rootScope.CLIENT_ADMIN = CLIENT_ADMIN;
    	$rootScope.CLIENT_USER = CLIENT_USER;
    	$rootScope.SYSTEM_INTEGRATOR = SYSTEM_INTEGRATOR;
    	
    	
	    function buildToggler(componentId) {
	      return function() {
	        $mdSidenav(componentId).toggle();
	      };
	    }

	     $rootScope.openMenu = function($mdOpenMenu,ev) {
		      $mdOpenMenu(ev);
		 };

		 $rootScope.logout = function(){
		 	//$cookies.remove('meister-sdk-token');
		 	AuthenticationService.Logout().then(
		 		function(result){
		 			console.log("Logout successful",result);
		 			$location.path('/login');
		 		},
		 		function(error){
		 			console.log(error);
		 		}
		 		); 
		 	
		 };

		 $rootScope.user_type = function(){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data){
		 		token_data = angular.fromJson(token_data);
		 		return token_data.user_type;
		 	}

		 	return -1;
		 };

		 $rootScope.user_id = function(){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data){
		 		token_data = angular.fromJson(token_data);
		 		return token_data.user_id;
		 	}

		 	return 0;
		 };

	    $rootScope.transition = 'fade-in';
	}]);
})(meister);
