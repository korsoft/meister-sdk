(function(app) {
	app.directive('mainToolbar', function() {
		return {
			//scope: {},
			//controller: function($scope, $element, $attrs, $transclude) {},
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
