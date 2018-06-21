(function(app) {
	app.controller('StyleDialogController',
    ['$scope','$mdDialog','style','parentNode','gateway', 'json','GatewayService','MessageUtil',
    function ($scope, $mdDialog, style, parentNode, gateway, json, GatewayService, MessageUtil) {
  
        $scope.style = {};
       
        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        if(!style){
          $scope.style.PKY = "";
          $scope.style.DESCRIPTION = "";
          $scope.style.NAME = "";
          $scope.style.JSON = "";
        } else {
          $scope.style = angular.copy(style);
        }

        console.log("Style", style);

        $scope.changeJSON=function(e){
          try{
            jj = JSON.parse($scope.style.JSON);
            if(Object.keys(jj).length>0)
            {
              $scope.valid=true;
            }else{
              $scope.valid=false;
            }                  
          }catch(ee){
            $scope.valid=false;
          }
        }

        $scope.save = function(){

          var json_to_send =  GatewayService.buildJsonByNewStyleTemplate(json, parentNode.source, $scope.style);
          
          var params = {
            json: JSON.stringify(json_to_send),
            SDK_HINT:"ADS"
          };

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