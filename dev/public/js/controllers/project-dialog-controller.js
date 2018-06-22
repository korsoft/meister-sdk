(function(app) {
	app.controller('ProjectDialogController',
    ['$scope','$mdDialog','project','parentNode','gateway', 'json','GatewayService','MessageUtil',
    function ($scope, $mdDialog, project, parentNode, gateway, json, GatewayService, MessageUtil) {
  
        $scope.project= {};
       
        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!project){
          $scope.project.PKY = "";
          $scope.project.NAME = "";
        } else {
          $scope.project = angular.copy(project);
        }

        console.log("Project", project);
        console.log("ParenNode", parentNode);


        $scope.save = function(){

         console.log("Saving Project");
         
        };
        
    }]);
})(meister);