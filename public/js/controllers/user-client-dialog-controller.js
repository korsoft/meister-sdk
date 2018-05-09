(function(app) {
	app.controller('UserClientDialogController',
    ['$scope','user', '$location','$mdToast','$mdDialog','UserClientRoleService','UserService','ClientService',
    'MessageUtil','SYSTEM_ADMIN',
    function ($scope,user, $location, $mdToast, $mdDialog, UserClientRoleService,UserService,ClientService, 
      MessageUtil,SYSTEM_ADMIN) {
      
      $scope.userClients= [];  
      $scope.types = [];
      $scope.clients = [];
      $scope.client_id = 0;
      $scope.type = 0;
      $scope.user = user;

      UserService.types().then(
            function(result){
              $scope.types = _.filter( result.data, function(t){
                 return (t.id!=SYSTEM_ADMIN);
              });
            },
            function(error){
              console.log("error",error);
              MessageUtil.showError(error.data.message);
            }
      );

      $scope.init = function (){
        UserClientRoleService.getByUserId(user.id).then(function(result){
           console.log(result);
           $scope.userClients = result.data;
        });
      }
      $scope.init();
     
      ClientService.index().then(
          function(result){
            $scope.clients = result.data;
          },
          function(error){
            console.log("error",error);
            MessageUtil.showError(error.data.message);
      });
    
        
          $scope.delete = function(ev, client){
            var confirm = $mdDialog.confirm()
                .title('You are about to delete the following')
                .htmlContent('User ' + client.name)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
               $scope.promise = UserClientRoleService.destroy(client.id);
               $scope.promise.then(
                  function(result){
                    MessageUtil.showInfo("User was deleted");
                   
                  },
                  function(error){
                    MessageUtil.showError(error.data.message);
                  }
                );
            }, function() {
              
            });
         };

     $scope.add = function(){

        if($scope.client_id && $scope.type){
          var params = { client_id: $scope.client_id,
            user_id: $scope.user.id,
            role_id: $scope.type,
            default: 0
          }
          UserClientRoleService.store(params).then(
            function(result){
                MessageUtil.showInfo("Relation created");
                $scope.init();
            },function(error){
              MessageUtil.showError(error.data.message);
            }
          );
        }
     }

     $scope.edit = function(e,c){
        c.$edit=true;
        c.$typeValue = c.role.value;
     }

     $scope.cancel = function(e,c){
        c.$edit=false;
     }

     $scope.save = function(e,c){
        c.$edit=false;
        c.role_id = c.$typeValue;
        UserClientRoleService.update(c.id,c).then(
            function(result){
                MessageUtil.showInfo("Permission updated");
                $scope.init();
            },function(error){
              MessageUtil.showError(error.data.message);
            }
        );
     }

      $scope.delete = function(e,c){
        c.$edit=false;
        UserClientRoleService.destroy(c.id).then(
            function(result){
                MessageUtil.showInfo("Permission deleted");
                $scope.init();
            },function(error){
              MessageUtil.showError(error.data.message);
            }
        );
     }

     $scope.close = function() {
           $mdDialog.cancel();
      };

        
    }]);
})(meister);