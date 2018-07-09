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
          $scope.style.JSON = "";
        } else {
          $scope.style = angular.copy(style);
          $scope.style.PKY = "";
          $scope.style.DESCRIPTION = "";
          $scope.style.JSON = JSON.stringify(JSON.parse($scope.style.JSON),null,"\t");
          delete $scope.style.CLASS_NAME;
          delete $scope.style.DIRECTION;
          delete $scope.style.FKY;
          delete $scope.style.LOGICAL_DELETE;
          delete $scope.style.MEISTER_OWN;
          delete $scope.style.NAME;
        }

        console.log("Style", $scope.style);
        console.log("Parent", parentNode);

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

          $scope.style.JSON = $scope.style.JSON.replace(/"([\w\s]+)":/g, function (m) {
                  return m.replace(/\s+/g, '');
              });

          var json_to_send =  GatewayService.buildJsonByNewStyleTemplate(json, parentNode, $scope.style);
           console.log("json_to_send",json_to_send);

          var params = {
            json: JSON.stringify(json_to_send,null,""),
            SDK_HINT:"ADS"
          };

          console.log("params",params);

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