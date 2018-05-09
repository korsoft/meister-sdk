(function(app) {
	app.directive('mainToolbar', function() {
		return {
			//scope: {},
			controller: function($scope,$rootScope, $element, $attrs, $transclude) {
				

				var init= function(){
				   $scope.clients = $rootScope.clients();
				   $scope.default_client =  $rootScope.user_client();
				   $scope.showMenu = ($rootScope.user_type() !=$rootScope.SYSTEM_ADMIN);
				};
				init();

				$rootScope.$on("default_client_change",function(){
					init();
				});
				
			},
			//require: 'ngModel',
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			//template: '<p>Hola Mundo!!</p>'
			templateUrl: 'templates/main-toolbar.html',
			//replace: true,
			//transclude: true,
			//link: function($scope, elem, attrs, controller) {}
		};
	});
})(meister);
