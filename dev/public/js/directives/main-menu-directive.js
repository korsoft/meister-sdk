(function(app) {
	app.directive('mainMenu', function() {
		return {
			//scope: {},
			controller: function($scope,$rootScope, $element, $attrs, $transclude) {
				var init= function(){
				    $scope.user_type = $rootScope.user_type();
				}
				init();
				$rootScope.$on("default_client_change",function(){
					init();
				});
			},
			//require: 'ngModel',
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			//template: '<p>Hola Mundo!!</p>'
			templateUrl: 'templates/main-menu.html',
			//replace: true,
			//transclude: true,
			//link: function($scope, elem, attrs, controller) {}
		};
	});
})(meister);
