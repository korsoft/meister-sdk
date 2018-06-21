(function(app) {
	app.controller('EndpointDialogController',
    ['$scope','$mdDialog','endpoint','parentNode','gateway','json','GatewayService','MessageUtil','endpoints_names','endpoints_main','style_library',
    function ($scope, $mdDialog, endpoint, parentNode, gateway,json, GatewayService, MessageUtil,endpoints_names,endpoints_main,style_library) {
        $scope.endpoint = {};
        $scope.parentNode = {};
        $scope.page=1;
        $scope.valid = false;
        $scope.uniqueName=false;
        $scope.band_i=1;
        $scope.band_o=1;
        $scope.style_library = angular.copy(style_library);

        $scope.promise = null;
         $scope.cancel = function() {
           $mdDialog.cancel();
        };

        console.log("style_library",style_library);
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

         $scope.format_json = function(style){
          style.source.$JSON = JSON.stringify(JSON.parse(style.source.JSON),null,"\t");
        };

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
          $scope.endpoint.STYLES = [{PKY:"",DIRECTION:"I",NAME:"Default",JSON:"",CLASS_NAME:"",BAND:false},{PKY:"",DIRECTION:"O",NAME:"Default",JSON:"",CLASS_NAME:"",BAND:false} ];
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
          $scope.band_i++;
          $scope.endpoint.STYLES.push({PKY:"",DIRECTION:"I",NAME:"",JSON:"",CLASS_NAME:"",BAND: $scope.band_i>1});
        }

        $scope.deleteStyle = function (index) {
          if($scope.endpoint.STYLES[i].DIRECTION==="I"){
        	  $scope.band_i--;
          }
          if($scope.endpoint.STYLES[i].DIRECTION==="O"){
        	  $scope.band_o--;
          }
          $scope.endpoint.STYLES.splice(index, 1);
        }
        
        $scope.verifyStyles = function(){
    		var band_o=false, band_i=false;
    		_foreach($scope.endpoint.STYLES,function(itm){
    			if(itm.DIRECTION==="I"){
    				$scope.band_i=true;
    			}
    			if(itm.DIRECTION==="O"){
    				$scope.band_o=true;
    			}
    		});
    		
    		console.log("Verifyng value" )
    	
        }
        
        $scope.directionChanged = function(style){
        	var i=0,o=0;
        	_foreach($scope.endpoint.STYLES,function(itm){
        		if(itm.DIRECTION==="I"){
        			i++;
        		}
        		
        		if(itm.DIRECTION==="O"){
        			o++;
        		}
        	});
        	
        	$scope.band_i=i;
        	$scope.band_o=o;
        	console.log("Style Direction: " +style.DIRECTION + "$scope.band_o: " + $scope.band_o + "$scope.band_i" + $scope.band_i);
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