(function(app) {
  app.controller('BapiDialogController',
    ['$scope','GatewayService','MessageUtil',
    function ($scope, GatewayService,MessageUtil) {

      $scope.selector="O";
      $scope.selection="";

     var upperCaseFirstLetterEachWord = function(string){
      var words = string.toLowerCase().split(" ");
      var result  = "";
      _.each(words,function(word){
        result += word.charAt(0).toUpperCase() + word.slice(1) + " ";
      });
      return result;
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

            console.log("gatewayId",$scope.gatewaySelectedId);
            console.log("params",params);

            $scope.promise = GatewayService.execute_endpoint($scope.gatewaySelectedId, params);
            
            $scope.promise.then(
                function(result){
                  $scope.bapi.children.splice(0,$scope.bapi.children.length);
                  console.log("result",result);
                  if(result.data && result.data.data){
                    _.each(result.data.data,function(row){
                      if(row.EXPLORER){
                        _.each(row.EXPLORER,function(item){
                          var node = false;
                          _.each(item, function(value, key, obj){
                              if(node === false){
                                  node = {
                                      name:value,
                                      source:item,
                                      //image: '/public/images/bapi.png',
                                      parent:$scope.bapi,
                                      disabled:false,
                                      type: "BAPI_NODE",
                                      children:[]
                                 };
                                 $scope.bapi.children.push(node);
                              } else if(value != ""){
                                var key_words = key.split("_").join(" ");
                                var subnode = {
                                    name: upperCaseFirstLetterEachWord(key_words) + ':"' + value + '"',
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
                  },
                function(error){
                  console.log("error",error);
                  MessageUtil.showError(error.data.message);
                }
              );
      };
    }]);
})(meister);