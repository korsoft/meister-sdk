(function(app) {
	app.controller('RequestLogsController',
    ['$scope','$rootScope', '$location','$mdToast','$mdDialog','MessageUtil','RequestLogService',
    function ($scope,$rootScope,$location,$mdToast,$mdDialog,MessageUtil,RequestLogService) {
    	 $scope.logs = [];
         $scope.promise = null;
         
         $scope.total = 0;
         

         $scope.query = {
           limit: 5,
           page: 1,
         };

         $scope.limitOptions = [5, 10,15,20];
        
        /*String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };*/

         /*$scope.format = function(json){
        	 //json = json.replace('\"','"');
        	 try{
        		 var obj = JSON.parse(json);
        		 return JSON.stringify(obj,null,"\t").replace(/\\/g,"");
        		 
        	 }catch (e)
        	 {
        		 return json;
        	 }
           //return json.replaceAll("\\t","").replaceAll("\\\"","\"");
         }*/


         $scope.init = function(){
           console.log("Request log init...");
           $scope.promise = RequestLogService.index($scope.query);

           $scope.promise.then(
                   function(result) { 
                     console.log("result",result);
                       $scope.logs = result.data.data;
                       $scope.total = result.data.total;
                       console.log("total",$scope.total );
                       console.log("size:",memorySizeOf($scope.logs));
                   },
                   function(errorPayload) {
                       console.log('failure', errorPayload);
                       MessageUtil.showError(errorPayload.data.message);
                   }
              );
         };

        $scope.deleteAll = function(){
          console.log("Delete all...");
           $scope.promise = RequestLogService.deleteAll();

           $scope.promise.then(
                   function(result) { 
                     console.log("result",result);
                      $scope.init();
                      MessageUtil.showInfo("Log errors deleted");
                   },
                   function(errorPayload) {
                       console.log('failure', errorPayload);
                       MessageUtil.showError(errorPayload.data.message);
                   }
              );
         };

         var memorySizeOf = function(obj) {
            var bytes = 0;

            function sizeOf(obj) {
                if(obj !== null && obj !== undefined) {
                    switch(typeof obj) {
                    case 'number':
                        bytes += 8;
                        break;
                    case 'string':
                        bytes += obj.length * 2;
                        break;
                    case 'boolean':
                        bytes += 4;
                        break;
                    case 'object':
                        var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                        if(objClass === 'Object' || objClass === 'Array') {
                            for(var key in obj) {
                                if(!obj.hasOwnProperty(key)) continue;
                                sizeOf(obj[key]);
                            }
                        } else bytes += obj.toString().length * 2;
                        break;
                    }
                }
                return bytes;
            };

            function formatByteSize(bytes) {
                if(bytes < 1024) return bytes + " bytes";
                else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
                else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
                else return(bytes / 1073741824).toFixed(3) + " GiB";
            };

            return formatByteSize(sizeOf(obj));
        };
        
    }]);
})(meister);