(function(app) {
	app.controller('EndpointController',
    ['$scope','GatewayService','MessageUtil',
    function ($scope, GatewayService, MessageUtil) {
        $scope.page=1;
        $scope.valid = false;
        $scope.uniqueName=false;
        $scope.band_i=1;
        $scope.band_o=1;
        var gateway = null;
        var json = null;
        var endpoints_names = null;
        var endpoints_main = null;
        var parentNode = {};
        $scope.endpoint = {};

        $scope.init = function(endpoint, pn, gtw, jso, endpointsnames,endpointsmain){
          parentNode = pn;
          gateway = gtw;
          json = jso;
          endpoints_names = endpointsnames;
          endpoints_main = endpointsmain;
          console.log("EndpointController-->parentNode",parentNode);

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

          console.log("Endpoint", endpoint);
        console.log("ParenNode", $scope.parentNode);

        }

        $scope.promise = null;
        
        $scope.cancel = function() {
            $scope.$emit('add-endpoint-closed', {});
        };

       
        $scope.$watch('endpoint.NAMESPACE',  function () {
          var band = true;
          $scope.uniqueName=true;
          _.forEach(endpoints_names,function(item){
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

        $scope.dropValidate = function(target, source) {
          console.log("target",target);
          console.log("source",source);
          return !source.NAME;
      };

       $scope.onDrop = function($event,$data, style){
        console.log("onDrop",$data);
        if(!$data.DIRECTION)
          style.JSON = JSON.stringify(JSON.parse($data.JSON),null,"\t");
        else
          style.JSON = "";
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

        

        
        
        $scope.check_json = function(){

          console.log("json",json);
          if(JSON.parse(json))
            return true;
          else
            return false;
        }

        $scope.save = function(){
          console.log("Save",$scope.endpoint);
          var localEndpoint = angular.copy($scope.endpoint);
          _.each(localEndpoint.STYLES,function(s){
              delete s.BAND;
              //remove spaces in keys
              var obj = angular.fromJson(s.JSON.replace(/"([\w\s]+)":/g, function (m) {
                  return m.replace(/\s+/g, '');
              }));
              s.JSON = angular.toJson(obj);
          });

          console.log("localEndpoint",localEndpoint);

          localEndpoint.HANDLER = localEndpoint.HANDLER.toUpperCase();
          localEndpoint.ENDPOINT_MAIN = localEndpoint.ENDPOINT_MAIN.toUpperCase();
          localEndpoint.PACKAGE = localEndpoint.PACKAGE.toUpperCase();

          var json_to_send =  GatewayService.buildJsonByNewEndpoint(json, parentNode.source, localEndpoint);
          
          var params = {
            json: angular.toJson(json_to_send)
          };

          console.log("json_to_send",params);

        
            $scope.promise = GatewayService.execute_changes(gateway.id, params);
            
            $scope.promise.then(
                function(result){
                  console.log("result",result);
                  $scope.$emit('add-endpoint-saved', {"parentNode":parentNode,"endpoint":localEndpoint});
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
          $scope.endpoint.STYLES.push({PKY:"",DIRECTION:"O",NAME:"",JSON:"",CLASS_NAME:"",BAND: $scope.band_i>1});
        }

        $scope.deleteStyle = function (index) {
          if($scope.endpoint.STYLES[index].DIRECTION==="I"){
        	  $scope.band_i--;
          }
          if($scope.endpoint.STYLES[index].DIRECTION==="O"){
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
        if(!$scope.endpoint.STYLES)
          return false;

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