/*
	@license Angular TreeWidget version 1.0.1
	ⓒ 2016 Alex Suleap https://github.com/AlexSuleap/agular-tree-widget
	License: MIT
*/

(function (angular) {
    'use strict';

    var MENU_ITEM =  ''
                + '<md-menu-item ng-if="node && !node.parent">'
                + ' <md-button  '
                + '      ng-click="$root.emitActionNodeSelected(\'addProject\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'note_add\'"></md-icon> Add Project'
                + '  </md-button>'
                + '</md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent  && node.source.MODULES && !node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button  '
                + '      ng-click="$root.emitActionNodeSelected(\'addModule\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'note_add\'"></md-icon> Add module'
                + '  </md-button>'
                + '</md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.source.MODULES && !node.is_deleted && $root.canBeDeleted(node) && $root.isMeisterUser(node)">'
                + ' <md-button '
                + '      ng-click="$root.emitDeleteProjectSelected(\'delete_project\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'delete\'"></md-icon> Delete'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.source.MODULES && node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button '
                + '      ng-click="$root.emitUndeleteProjectSelected(\'delete_project\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'restore_from_trash\'"></md-icon> Undelete'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.source.ENDPOINTS && !node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button '
                + '      ng-click="$root.emitActionNodeSelected(\'addEndpoint\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'note_add\'"></md-icon> Add endpoint'
                + '  </md-button>'
                + '</md-menu-item>'
                + '  <md-menu-item ng-if="node && node.parent && node.source.ENDPOINTS && !node.is_deleted && $root.canBeDeleted(node) && $root.isMeisterUser(node)">'
                + ' <md-button'
                + '      ng-click="$root.emitDeleteModuleSelected(\'delete_module_selected\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'delete\'"></md-icon> Delete'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.source.ENDPOINTS && node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button'
                + '      ng-click="$root.emitUndeleteModuleSelected(\'undelete_module_selected\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'restore_from_trash\'"></md-icon> Undelete'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.source.STYLES && !node.is_deleted && !node.source.LOCKED && $root.isMeisterUser(node)">'
                + ' <md-button '
                + '      ng-click="$root.emitLockEndPointSelected(\'lock_endpoint\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'lock\'"></md-icon> Lock'
                + '  </md-button>'
                + '</md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.source.STYLES && !node.is_deleted && node.source.LOCKED && $root.isMeisterUser(node)">'
                + ' <md-button '
                + '      ng-click="$root.emitUnLockEndPointSelected(\'unlock_endpoint\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'lock_open\'"></md-icon> UnLock'
                + '  </md-button>'
                + '</md-menu-item>'
                + '         <md-menu-item ng-if="node && node.parent && node.source.STYLES && node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button  '
                + '      ng-click="$root.emitUndeleteEndPointSelected(\'undelete_endpoint_deleted\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'restore_from_trash\'"></md-icon> Undelete'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '         <md-menu-item ng-if="node  && node.source.STYLES && !node.is_deleted">'
                + ' <md-button  '
                + '      ng-click="$root.emitActionNodeSelected(\'execute\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'send\'"></md-icon> Execute'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '         <md-menu-item ng-if="node && node.parent && node.source.STYLES && !node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button  '
                + '      ng-click="$root.emitDeleteEndPointSelected(\'delete_endpoint_deleted\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'delete\'"></md-icon> Delete'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '         <md-menu-item ng-if="node.parent && !node.type && !node.source.MODULES && !node.source.ENDPOINTS && !node.source.STYLES && !node.is_deleted && $root.showMenu(node)">'
                + ' <md-button  '
                + '      ng-click="$root.emitActionNodeSelected(\'execute_by_style\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'send\'"></md-icon> Execute'
                + '  </md-button>'
                + '         </md-menu-item>'
                + '<md-menu-item ng-if="node.parent && !node.type && !node.source.MODULES && !node.source.ENDPOINTS && !node.source.STYLES && !node.is_deleted && $root.isMeisterUser(node) &&  $root.showMenu(node)">'
                + ' <md-button  '
                + '      ng-click="$root.emitDeleteStyleSelected(\'deleting_node\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'delete\'"></md-icon> Delete'
                + '  </md-button>'
                + '</md-menu-item>'
                + '<md-menu-item ng-if="node  && node.type && node.type==\'STYLE_TEMPLATE_PARENT\' ">'
                + ' <md-button'
                + '      ng-click="$root.emitActionNodeSelected(\'add_style_lib\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'note_add\'"></md-icon> Add style'
                + '  </md-button>'
                + '</md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.type && node.type==\'style_template\' && !node.is_deleted && $root.canBeDeleted(node) && $root.isMeisterUser(node) && $root.showMenu(node)">'
                + ' <md-button'
                + '      ng-click="$root.emitDeleteStyleLibSelected(\'delete_style_lib_selected\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'delete\'"></md-icon> Delete'
                + '  </md-button>'
                + '</md-menu-item>'
                + '<md-menu-item ng-if="node && node.parent && node.type && node.type==\'style_template\' && node.is_deleted && $root.isMeisterUser(node)">'
                + ' <md-button'
                + '      ng-click="$root.emitUndeleteStyleLibSelected(\'undelete_style_lib_selected\',node,$event)" '
                + ' >'
                + '     <md-icon ng-bind="\'restore_from_trash\'"></md-icon> Undelete'
                + '  </md-button>'
                + '</md-menu-item>';
    
                
    angular.module('TreeWidget', ['ngAnimate', 'RecursionHelper','ang-drag-drop'])
        .directive('tree', ['$rootScope', function ($rootScope) {
            return {
                restrict: "E",
                scope: { nodes: '=', options: '=?' },
                template: "<md-list flex layout='row' layout-align='top right'>" + MENU_ITEM.replace(/md-menu-item/g,"md-list-item") + "</md-list><treenode nodes='nodes' oncontextmenu='return false' tree='nodelist' options='options'></treenode>",
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        pre: function (scope) {

                            $rootScope.onDropNodeInTree = function($event,$data,node){
                                console.log("onDrop",$data);
                                if(node.type=='STYLE_TEMPLATE_PARENT' ){
                                    console.log("it's supported STYLE LIBRARY");
                                    scope.$emit('ondrop-node-style-to-library', {"actionName":'ondrop-node-style-to-library',"library":node,"style":$data,"sourceEvent":$event});
                                }
                            }
                            $rootScope.emitActionNodeSelected = function(actionName,node,event){
                                scope.$emit('action-node-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitDeleteStyleSelected = function(actionName,node,event){
                                scope.$emit('delete-node-style-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitUndeleteEndPointSelected = function(actionName,node,event){
                                scope.$emit('undelete-endpoint-deleted', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            
                            $rootScope.emitLockEndPointSelected = function(actionName,node,event){
                                scope.$emit('lock-endpoint', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            $rootScope.emitUnLockEndPointSelected = function(actionName,node,event){
                                scope.$emit('unlock-endpoint', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitDeleteEndPointSelected = function(actionName,node,event){
                                scope.$emit('delete-endpoint-deleted', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitDeleteStyleLibSelected = function(actionName,node,event){
                                scope.$emit('delete-style-lib', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitUndeleteStyleLibSelected = function(actionName,node,event){
                                scope.$emit('undelete-style-lib', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }

                            $rootScope.emitUndeleteModuleSelected = function(actionName,node,event){
                                scope.$emit('undelete-module-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            
                            $rootScope.emitDeleteModuleSelected = function(actionName,node,event){
                                scope.$emit('delete-module-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            } 


                            $rootScope.emitUndeleteProjectSelected = function(actionName,node,event){
                                scope.$emit('undelete-project-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
                            }
                            
                            $rootScope.emitDeleteProjectSelected = function(actionName,node,event){
                                scope.$emit('delete-project-selected', {"actionName":actionName,"node":node,"sourceEvent":event});
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


                            scope.node = null;
                            scope.$on('selection-changed', function (e, node) {
                                scope.node = node;
                            });
                            scope.nodelist = [];
                            scope.options = scope.options || (scope.options = { showIcon: true, expandOnClick: false, multipleSelect: false });
                            scope.count = 0;
                            function generateNodeList(nodes, parent) {
                                if (nodes != undefined) {
                                    if (nodes.length > 0) {
                                        for (var i = 0; i < nodes.length ; i++) {
                                            var node = nodes[i];

                                            //Generate node ids if no ids are defined
                                            if (node.nodeId === undefined) {
                                                node.nodeId = (Math.random() * 10) + 1;//"tree-node-" + scope.count;
                                                scope.count++;
                                            }

                                            //expanded all the nodes
                                            if (node.expanded === undefined && node.children != undefined) {
                                                node.expanded = true;
                                            }
                                            if (parent != undefined) {
                                                node.parentId = parent.nodeId;
                                            }
                                            if (scope.nodelist.indexOf(node) == -1) {
                                                scope.nodelist.push(node);
                                            }
                                            generateNodeList(node.children, node);
                                        }
                                    }
                                }
                            }

                            scope.$watch(function () {
                                generateNodeList(scope.nodes);
                            });
                        }
                    }
                }
            }
        }])
        .filter('nodeFilter', ['$filter', function ($filter) {

            return function (nodes, filter) {
                var recursiveFilter = function (nodes, filter) {
                    var filtered = [];
                    angular.forEach(nodes, function (node) {
                        if ($filter('filter')([node], filter).length > 0) {
                            filtered.push(node);
                        } else if (angular.isArray(node.children) && node.children.length > 0) {
                            var internal = recursiveFilter(node.children, filter);
                            if (internal.length > 0) {
                                filtered.push(node);
                            }
                        }
                    });
                    return filtered;
                };
                return recursiveFilter(nodes, filter);
            }

        }])
        .directive('treenode', ['RecursionHelper','$timeout', 
            function (RecursionHelper,$timeout) {
            return {
                restrict: "E",
                scope: { nodes: '=', tree: '=', options: '=?' },
                template: '<ul ng-class="{\'tree\':nodes[0].parent,\'special-tree\':!nodes[0].parent}" oncontextmenu="return false" >'
                + '<li ng-repeat="node in nodes | nodeFilter:options.filter track by node.nodeId"class="node" id="{{::node.nodeId}}" >'
                + '<i class="tree-node-ico pointer" ng-if="node.children && node.children.length>0" ng-class="{\'tree-node-expanded\': node.expanded && (node.children | nodeFilter:options.filter).length > 0,\'tree-node-collapsed\':!node.expanded && (node.children | nodeFilter:options.filter).length > 0}" ng-click="toggleNode(node)"></i>'
                + '<span class="node-title pointer" ng-click="selectNode(node, $event)" ng-class="{\'disabled\':node.disabled}" ui-draggable="node.parent && !node.type && !node.source.MODULES && !node.source.ENDPOINTS && !node.source.STYLES && !node.is_deleted" drag="node.source" ui-on-Drop="$root.onDropNodeInTree($event,$data,node)">'
                + '<span><i class="tree-node-ico" ng-if="options.showIcon" ng-class="{\'tree-node-image\':node.children, \'tree-node-leaf\':!node.children}" ng-style="node.image && {\'background-image\':\'url(\'+node.image+\')\'}"></i>'
                + '     <span class="node-name" tabindex="{{::(node.focusable ? 0 : -1)}}" ng-class="{selected: node.selected&& !node.disabled}">'
                + ' <span ng-if="!$root.showMenu(node)">{{node.name}}</span>'
                + ' <md-menu ng-if="$root.showMenu(node)">'
                + '     <span ng-click="$mdMenu.open()"  ng-mouseup="openMenu($mdOpenMenu,$event,node)">'
                + '       {{node.name}}'
                + '     </span>'
                + '     <md-menu-content  oncontextmenu="return false" >'
                + MENU_ITEM
                + ' </md-menu-content>'
                + ' </md-menu>'
                + '         <span ng-if="node.badge != null" class="label" ng-class="node.badge.type">{{node.badge.title}}</span>'
                + '     </span>'
                + '</span>'
                + '</span>'
                + '<treenode ng-if="node.children && node.expanded" nodes=\'node.children\' tree="tree" options="options"></treenode>'
                + '</li>'
                + '</ul>',
                compile: function (element) {
                    return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
                        function cleanAllSelectedExcept(node) {
                            angular.forEach(scope.tree, function (item) {
                                if (node != item)
                                    item.selected = false;
                            });
                        }

                        function getSelectedNodes() {
                            return scope.tree.filter(function (item) { return item.selected; });
                        }

                        
                        //Select node
                        scope.selectNode = function (node, $event) {
                            if (node.disabled) { return; }

                            
                            var selectedNode;
                            if (scope.options.multipleSelect === true) {
                                node.selected = !node.selected;
                                selectedNode = getSelectedNodes();
                            } else if (scope.options.multipleSelect === 'ctrlKey' || scope.options.multipleSelect === 'altKey') {
                                if ($event[scope.options.multipleSelect]) {
                                    node.selected = !node.selected;
                                } else {
                                    node.selected = true;
                                    cleanAllSelectedExcept(node);
                                }
                                selectedNode = getSelectedNodes();
                            } else {
                                node.selected = true;
                                cleanAllSelectedExcept(node);
                                selectedNode = node;
                            }
                            scope.$emit('selection-changed', selectedNode);
                            if (scope.options.onSelectNode) {
                                scope.options.onSelectNode(selectedNode);
                            }

                            if (scope.options.expandOnClick) {
                                if (node.children != undefined) {
                                    node.expanded = !node.expanded;
                                    scope.$emit('expanded-state-changed', node);
                                    if (scope.options.onExpandNode) {
                                        scope.options.onExpandNode(node);
                                    }
                                }
                            }
                        }

                        //Expand collapse node
                        scope.toggleNode = function (node) {
                            if (node.children != undefined) {
                                node.expanded = !node.expanded;
                                scope.$emit('expanded-state-changed', node);
                                if (scope.options.onExpandNode) {
                                    scope.options.onExpandNode(node);
                                }
                            }
                        }

                        
                        scope.openMenu = function (menu,e,node) {
                            if(e.which==3){
                                var itemSelected = getSelectedNodes();
                                e.preventDefault();
                                e.stopPropagation();
                                if(itemSelected.length==1 &&
                                    itemSelected[0].nodeId==node.nodeId ){
                                    menu(e);
                                    $timeout(function() {
                                        var element = document.getElementsByClassName('md-menu-backdrop');
                                        element[0].oncontextmenu = function() {
                                          return false;
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        }]);

})(angular);
