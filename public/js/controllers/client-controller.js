(function(app) {
	app.controller('ClientController',
    ['$scope', '$location','$mdToast','$mdDialog','ClientService','MessageUtil',
    function ($scope, $location, $mdToast, $mdDialog, ClientService, MessageUtil) {
        
        $scope.clients = [];
        $scope.promise = null;
        
        $scope.filter = {
          show: false
        }

        $scope.query = {
          order: 'name',
          limit: 5,
          page: 1,
          filter:''
        };

        $scope.limitOptions = [5, 10, 25, 50, 100];

        $scope.removeFilter = function(){
          $scope.filter.show = false;
          $scope.query.filter = "";
        };

        $scope.init = function(){
          console.log("ClientController init...");
          $scope.promise = ClientService.index();

          $scope.promise.then(
                  function(result) { 
                    console.log("result",result);
                      $scope.clients = result.data;
                  },
                  function(errorPayload) {
                      console.log('failure login', errorPayload);
                      MessageUtil.showError(errorPayload.data.message);
                  }
             );
        };

         $scope.add = function(ev, client) {
              $mdDialog.show({
                controller: 'ClientDialogController',
                templateUrl: 'templates/client-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 client: null
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Client was created");
                $scope.init();
              }, function() {
               
              });
         };

         $scope.edit = function(ev, client) {
              $mdDialog.show({
                controller: 'ClientDialogController',
                templateUrl: 'templates/client-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 client: client
               }
              })
              .then(function(result) {
                  MessageUtil.showInfo("Client was updated");
                  $scope.init();
              }, function() {
               
              });
         };

         $scope.delete = function(ev, client){
            var confirm = $mdDialog.confirm()
                .title('You are about to delete the following')
                .htmlContent('Client ' + client.name)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
               $scope.promise = ClientService.destroy(client.id);
               $scope.promise.then(
                  function(result){
                    MessageUtil.showInfo("Client was deleted");
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