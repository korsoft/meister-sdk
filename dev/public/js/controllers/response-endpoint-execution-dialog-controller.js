(function(app) {
	app.controller('ResponseEndpointExecutionDialogController',
    ['$scope', 'json',
    function ($scope, json) {
        
        $scope.json = json;
        
        $scope.cancel = function() {
           $mdDialog.cancel();
        };
        
        $scope.pretty_payload_json = function (obj) {
            return angular.toJson(obj, true);
        }

        
    }]);
})(meister);