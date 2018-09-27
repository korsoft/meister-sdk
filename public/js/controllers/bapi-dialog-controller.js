(function(app) {
  app.controller('BapiDialogController',
    ['$scope','$mdDialog','gatewayId','bapi','GatewayService','MessageUtil',
    function ($scope, $mdDialog,gatewayId,bapi,GatewayService,MessageUtil) {

      $scope.selector="O";
      $scope.selection="";
      
      $scope.cancel = function(e,c){
        console.log("cancel");
        c.$edit=false;
      }

      $scope.close = function() {
           console.log("close");
           $mdDialog.cancel();
      };

      $scope.send = function() {
           var json = {
                "SELECTOR":$scope.selector,
                "SELECTION":$scope.selection
              };

           var params = {
            "endpoint":"Meister.SDK.Bapi.Lookup",
            "json": JSON.stringify(json)
            }

            console.log("gatewayId",gatewayId);
            console.log("params",params);

            $scope.promise = GatewayService.execute_endpoint(gatewayId, params);
            
            $scope.promise.then(
                function(result){
                  bapi.children.splice(0,bapi.children.length);
                  console.log("result",result);
                  if(result.data && result.data.data){
                    _.each(result.data.data,function(row){
                      if(row.EXPLORER){
                        _.each(row.EXPLORER,function(item){
                          var node = false;
                          _.each(item, function(value, key, obj){
                              if(node === false){
                                  node = {
                                      name:'"'+ key + '":"' + value + '"',
                                      source:item,
                                      //image: '/public/images/bapi.png',
                                      parent:bapi,
                                      disabled:false,
                                      type: "BAPI_NODE",
                                      children:[]
                                 };
                                 bapi.children.push(node);
                              } else if(value != ""){
                                var subnode = {
                                    name:'"'+ key + '":"' + value + '"',
                                    source:item,
                                    //image: '/public/images/bapi.png',
                                    parent:node,
                                    disabled:false,
                                    type: "BAPI_SUBNODE",
                                    children:[]
                                };
                                node.children.push(subnode);
                              }
                          });

                        });
                      }
                      return;
                    });
                  }
                  $mdDialog.cancel(); 
                  },
                function(error){
                  console.log("error",error);
                  MessageUtil.showError(error.data.message);
                }
              );
      };
    }]);
})(meister);