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

         $scope.limitOptions = [5, 10, 25, 50, 100];
         
         $scope.format = function(json){
        	 json.replace('\"','"');
        	 try{
        		 var obj = JSON.parse(json);
        		 return JSON.stringify(obj,null,"\t").replace(/\\/g,"");
        		 
        	 }catch (e)
        	 {
        		 return json;
        	 }
         }


         $scope.init = function(){
           console.log("Request log init...");
           $scope.promise = RequestLogService.index($scope.query);

           $scope.promise.then(
                   function(result) { 
                     console.log("result",result);
                       $scope.logs = result.data.data;
                       $scope.total = result.data.total;
                       console.log("total",$scope.total );
                   },
                   function(errorPayload) {
                       console.log('failure', errorPayload);
                       MessageUtil.showError(errorPayload.data.message);
                   }
              );
         };
        
    }]);
})(meister);