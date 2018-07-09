(function(app) {
	app.controller('MainController', ['$scope','$rootScope','$cookies','$location','$timeout',
		'$mdSidenav','$mdMenu','$state','SYSTEM_ADMIN','SYSTEM_INTEGRATOR','CLIENT_ADMIN','CLIENT_USER',
		'AuthenticationService','UserService',
		function($scope,$rootScope,$cookies,$location,$timeout, $mdSidenav,$mdMenu, $state, 
			SYSTEM_ADMIN, SYSTEM_INTEGRATOR, CLIENT_ADMIN, CLIENT_USER, AuthenticationService,UserService) {
		
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

		 $rootScope.user_client = function(){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data){
		 		token_data = angular.fromJson(token_data);
		 		return token_data.user_default_client;
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

		$rootScope.clients = function(){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data){
		 		token_data = angular.fromJson(token_data);
		 		return token_data.user_clients;
		 	}

		 	return [];
		};

		$rootScope.isMeisterUser = function(node){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data && node.source.MEISTER_OWN && node.source.MEISTER_OWN=="X"){
		 		token_data = angular.fromJson(token_data);
		 		return  (token_data.user_type==$rootScope.SYSTEM_ADMIN || 
			 			(token_data.user_email.endsWith("@s4meister.com")
			 			 || token_data.user_email.endsWith("@gameister.com")
			 			));
		 	}

		 	return true;
		};

		$rootScope.isMeister = function(){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data ){
		 		token_data = angular.fromJson(token_data);
		 		return  (token_data.user_type==$rootScope.SYSTEM_ADMIN || 
			 			(token_data.user_email.endsWith("@s4meister.com")
			 			 || token_data.user_email.endsWith("@gameister.com")
			 			));
		 	}

		 	return false;
		};


		 $rootScope.setClientAndType = function(client_user){
		 	var token_data = $cookies.get('meister-sdk-token');
		 	if(token_data){
		 		console.log("change default"+client_user.client_id);
		 		UserService.changeDefault(client_user.client_id).then(function(){
                	token_data = angular.fromJson(token_data);
                	client_user.default=1;
			 		token_data.user_default_client=client_user;
			 		token_data.user_type = client_user.role.value;		
			 		_.each(token_data.user_clients,function(uc){
			 			if(uc.id==client_user.id)
			 				uc.default=1;
			 			else
			 				uc.default=0;
			 		}) 		
			 		$cookies.put('meister-sdk-token',angular.toJson(token_data));
			 		$rootScope.$broadcast('default_client_change', {});

                });
		 		
		 	}
		 };

	    $rootScope.transition = 'fade-in';
	}]);
})(meister);
