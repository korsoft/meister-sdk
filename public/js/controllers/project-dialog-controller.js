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
          $scope.project.PROJECT = "";
        } else {
          $scope.project = angular.copy(project);
        }

        console.log("Project", project);
        console.log("ParenNode", parentNode);


        $scope.save = function(){

         console.log("Saving Project",$scope.project);
         
         var json_to_send =  GatewayService.buildJsonByNewProject(json, $scope.project);
         
         delete json_to_send.MODULES;
         delete json_to_send.STYLE_LIB;
         
          var params = {
            json: JSON.stringify(json_to_send)
          };

          console.log("Params",params);
           
            $scope.promise = GatewayService.execute_changes(gateway.id, params);
            
            $scope.promise.then(
                function(result){
                  console.log("result",result);
                  $mdDialog.hide(result);
                  },
                function(error){
                  console.log("error",error);
                  MessageUtil.showError(error.data.message);
                }
              );
         
        };
        
    }]);
})(meister);