(function(app) {
	app.controller('UserController',
    ['$scope', '$location','$mdToast','$mdDialog','UserService','MessageUtil',
    'SYSTEM_ADMIN','SYSTEM_INTEGRATOR','CLIENT_ADMIN','CLIENT_USER',
    function ($scope, $location, $mdToast, $mdDialog, UserService, MessageUtil, 
      SYSTEM_ADMIN,SYSTEM_INTEGRATOR,CLIENT_ADMIN,CLIENT_USER) {

        
        $scope.users = [];
        $scope.promise = null;
        
        $scope.filter = {
          show: false
        }

        $scope.query = {
          order: 'email',
          limit: 5,
          page: 1,
          filterByEmail:'',
          filterByFirstName:'',
          filterByLastName:''
        };

        $scope.limitOptions = [5, 10, 25, 50, 100];

        $scope.removeFilter = function(){
          $scope.filter.show = false;
          $scope.query.filterByEmail = "";
          $scope.query.filterByFirstName = "";
          $scope.query.filterByLastName = "";
        };

        $scope.init = function(){
          console.log("UserController init...");
          $scope.promise = UserService.index();

          $scope.promise.then(
                  function(result) { 
                    console.log("result",result);
                      $scope.users = result.data;
                  },
                  function(errorPayload) {
                      console.log('failure login', errorPayload);
                      MessageUtil.showError(errorPayload.data.message);
                  }
             );
        };

         $scope.add = function(ev, user) {
              $mdDialog.show({
                controller: 'UserDialogController',
                templateUrl: 'templates/user-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 user: null
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("User was created");
                $scope.init();
              }, function() {
               
              });
         };

         $scope.edit = function(ev, user) {
              $mdDialog.show({
                controller: 'UserDialogController',
                templateUrl: 'templates/user-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 user: user
               }
              })
              .then(function(result) {
                  MessageUtil.showInfo("User was updated");
                  $scope.init();
              }, function() {
               
              });
         };

         $scope.type = function(u){
             if(u.type == SYSTEM_ADMIN)
              return "SYSTEM_ADMIN";
            else {
               var t = _.find(u.clients, function(uc){
                  return uc.default;
               });
       

              if(t.role.value == SYSTEM_INTEGRATOR)
                return "SYSTEM_INTEGRATOR";
              else if(t.role.value == CLIENT_ADMIN)
                 return "CLIENT_ADMIN";
              else if(t.role.value == CLIENT_USER)
                return "CLIENT_USER";
            }
         };

         $scope.delete = function(ev, user){
            var confirm = $mdDialog.confirm()
                .title('You are about to delete the following')
                .htmlContent('User ' + user.name)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
               $scope.promise = UserService.destroy(user.id);
               $scope.promise.then(
                  function(result){
                    MessageUtil.showInfo("User was deleted");
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