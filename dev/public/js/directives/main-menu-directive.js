(function(app) {
	app.directive('mainMenu', function() {
		return {
			//scope: {},
			//controller: function($scope, $element, $attrs, $transclude) {},
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
