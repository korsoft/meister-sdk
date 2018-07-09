(function(app) {
	app.directive('treeActions', ['$rootScope', function($rootScope) {

		return {
			
			controller: function($scope){
				$rootScope.onDropNodeInTree = function($event,$data,node){
                                console.log("onDrop",$data);
                                if(node.type=='STYLE_TEMPLATE_PARENT' ){
                                    console.log("it's supported STYLE LIBRARY");
                                    $scope.$emit('ondrop-node-style-to-library', {"actionName":'ondrop-node-style-to-library',"library":node,"style":$data,"sourceEvent":$event});
                                }
                            }
                            $rootScope.emitActionNodeSelected = function(actionName,node,event){
                                $scope.$emit('action-node-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitDeleteStyleSelected = function(actionName,node,event){
                                $scope.$emit('delete-node-style-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitUndeleteEndPointSelected = function(actionName,node,event){
                                $scope.$emit('undelete-endpoint-deleted', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            
                            $rootScope.emitLockEndPointSelected = function(actionName,node,event){
                                $scope.$emit('lock-endpoint', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            $rootScope.emitUnLockEndPointSelected = function(actionName,node,event){
                                $scope.$emit('unlock-endpoint', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitDeleteEndPointSelected = function(actionName,node,event){
                                $scope.$emit('delete-endpoint-deleted', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitDeleteStyleLibSelected = function(actionName,node,event){
                                $scope.$emit('delete-style-lib', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitUndeleteStyleLibSelected = function(actionName,node,event){
                                $scope.$emit('undelete-style-lib', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitUndeleteModuleSelected = function(actionName,node,event){
                                $scope.$emit('undelete-module-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            
                            $rootScope.emitDeleteModuleSelected = function(actionName,node,event){
                                $scope.$emit('delete-module-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            } 


                            $rootScope.emitUndeleteProjectSelected = function(actionName,node,event){
                                $scope.$emit('undelete-project-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            
                            $rootScope.emitDeleteProjectSelected = function(actionName,node,event){
                                $scope.$emit('delete-project-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.canBeDeleted = function(node){
                                var canbe = true;
                                _.forEach(node.children,function(itm){
                                    if(itm.source && itm.source.LOGICAL_DELETE!="X")
                                    {
                                        canbe=false;
                                        return false;
                                    }
                                });
                                
                                return canbe;
                            }

                            $rootScope.showMenu = function (node) {


                                    if(node.type=="STYLE_TEMPLATE_PARENT")
                                        return true
                                    
                                   if(!node.parent)
                                       return true;
                                   if((node.parent.source && node.parent.source.STYLES) || 
                                            (node.type=='style_template' && !node.source)){
                                        return false;
                                    }
                                   
                                    return true;
                            }

			},
			//require: 'ngModel',
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			template: '' 
				+ '<md-list flex layout="row" layout-align="left center">'
				+ $rootScope.MENU_ITEM_TREE.replace(/md-menu-item/g,"md-list-item")
          		+ '</md-list>'
			//replace: true,
			//transclude: true,
			//link: function($scope, elem, attrs, controller) {}
		};
	}]);
})(meister);
