(function(app) {
	app.controller('ClientGatewayController',
    ['$scope', '$location','$mdToast','$mdDialog','MessageUtil','GatewayService',
    function ($scope,$location,$mdToast,$mdDialog,MessageUtil,GatewayService) {
        
        $scope.gateways = [];
        $scope.promise = null;
        
        $scope.filter = {
          show: false
        }

        $scope.query = {
          order: 'name',
          limit: 5,
          page: 1,
          filterByName:''
        };

        $scope.limitOptions = [5, 10, 25, 50, 100];

        $scope.removeFilter = function(){
          $scope.filter.show = false;
          $scope.query.filterByName = "";
        };

        $scope.init = function(){
          console.log("ClientGatewayController init...");
          $scope.promise = GatewayService.index();

          $scope.promise.then(
                  function(result) { 
                    console.log("result",result);
                      $scope.gateways = result.data;
                  },
                  function(errorPayload) {
                      console.log('failure', errorPayload);
                      MessageUtil.showError(errorPayload.data.message);
                  }
             );
        };

         $scope.add = function(ev, gateway) {
              $mdDialog.show({
                controller: 'ClientGatewayDialogController',
                templateUrl: 'templates/client-gateway-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 gateway: null
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Gateway was created");
                $scope.init();
              }, function() {
               
              });
         };

         $scope.edit = function(ev, gateway) {
              $mdDialog.show({
                controller: 'ClientGatewayDialogController',
                templateUrl: 'templates/client-gateway-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 gateway: gateway
               }
              })
              .then(function(result) {
                  MessageUtil.showInfo("Gateway was updated");
                  $scope.init();
              }, function() {
               
              });
         };

         $scope.delete = function(ev, gateway){
            var confirm = $mdDialog.confirm()
                .title('You are about to delete the following')
                .htmlContent('Gateway ' + gateway.name)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
               $scope.promise = GatewayService.destroy(gateway.id);
               $scope.promise.then(
                  function(result){
                    MessageUtil.showInfo("Gateway was deleted");
                    $scope.init();
                  },
                  function(error){
                    MessageUtil.showError(error.data.message);
                  }
                );
            }, function() {
              
            });
         };

        
    }]);
})(meister);