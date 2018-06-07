(function(app) {
	app.controller('EndpointDialogController',
    ['$scope','$mdDialog','endpoint','parentNode','gateway','json','GatewayService','MessageUtil','endpoints_names','endpoints_main',
    function ($scope, $mdDialog, endpoint, parentNode, gateway,json, GatewayService, MessageUtil,endpoints_names,endpoints_main) {
        $scope.endpoint = {};
        $scope.parentNode = {};
        $scope.page=1;
        $scope.valid = false;
        $scope.uniqueName=false;

        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        $scope.$watch('endpoint.NAMESPACE',  function () {
          var band = true;
          $scope.uniqueName=true;
          _.forEach(endpoints_names,function(item){
            console.log("item "+item + " value "+ $scope.endpoint.NAMESPACE + " logic ", item==$scope.endpoint.NAMESPACE);
            if(item==$scope.endpoint.NAMESPACE){
              $scope.uniqueName=false;
            }
          });

          
        });

        $scope.$watch('endpoint.ENDPOINT_MAIN',  function () {
          var band = true;
          $scope.uniqueMain=true;
          _.forEach(endpoints_main,function(item){
            if(item==$scope.endpoint.ENDPOINT_MAIN){
              $scope.uniqueMain=false;
            }
          });

        });

        $scope.changeJSON=function(e){
          for(var i=0; i<$scope.endpoint.STYLES.length;i++)
          {

            if($scope.endpoint.STYLES[i].JSON.length>0){
              try
              {
                jj = JSON.parse($scope.endpoint.STYLES[i].JSON);
                if(Object.keys(jj).length>0)
                {
                  $scope.valid=true;
                }else{
                  $scope.valid=false;
                }
                
              }catch(ee)
              {
                $scope.valid=false;
                break;
              }
            }else{
              $scope.valid=false;
            }
          }

        }

        if(!endpoint){
          $scope.endpoint.PKY = "";
          $scope.endpoint.NAMESPACE = "";
          $scope.endpoint.LONG_TEXT = "";
          $scope.endpoint.ENDPOINT_MAIN = "";
          $scope.endpoint.HANDLER = "";
          $scope.endpoint.BUS_NAME = "";
          $scope.endpoint.TYPE = "";
          $scope.endpoint.VERSION = "";
          $scope.endpoint.LOCKED = "";
          $scope.endpoint.PACKAGE = "";
          $scope.endpoint.TRANSPORT = "";
          $scope.endpoint.STYLES = [{PKY:"",DIRECTION:"I",NAME:"Default",JSON:"",CLASS_NAME:""}];
        } else {
          $scope.endpoint = angular.copy(endpoint);
        }

        $scope.parentNode = parentNode;
        console.log("Endpoint", endpoint);
        console.log("ParenNode", parentNode);

        $scope.check_json = function(){

          console.log("json",json);
          if(JSON.parse(json))
            return true;
          else
            return false;
        }

        $scope.save = function(){

          var json_to_send =  GatewayService.buildJsonByNewEndpoint(json, parentNode.source, $scope.endpoint);
          
          var params = {
            json: angular.toJson(json_to_send)
          };

            $scope.promise = GatewayService.execute_changes(gateway.id, params);
            
            $scope.promise.then(
                function(result){
                  console.log("result",result);
                  /*var endpointItem = {
                      name: $scope.endpoint.NAMESPACE,
                      source: $scope.endpoint,
                      expanded: false,
                      children: []
                    };
                  parentNode.children.push(endpointItem);
                  */
                    $mdDialog.hide(result);
                  },
                function(error){
                  console.log("error",error);
                  MessageUtil.showError(error.data.message);
                }
              );
         
        };

        $scope.changePage = function (page){
          $scope.page=page;
        }

        $scope.addStyle = function () {
          $scope.endpoint.STYLES.push({PKY:"",DIRECTION:"",NAME:"",JSON:"",CLASS_NAME:""});
        }

        $scope.deleteStyle = function (index) {
          $scope.endpoint.STYLES.splice(index, 1);
        }


        $scope.checkUniqueName= function () {
          var counts = [];
        //  console.log($scope.endpoint.Payload_styles[0]);
          for(var i = 0; i < $scope.endpoint.STYLES.length; i++) {
              if(counts[$scope.endpoint.STYLES[i].NAME+$scope.endpoint.STYLES[i].DIRECTION] === undefined) {
                  counts[$scope.endpoint.STYLES[i].NAME+$scope.endpoint.STYLES[i].DIRECTION] = 1;
              } else {
                  return true;
              }
          }
          return false;
        }

        
    }]);
})(meister);