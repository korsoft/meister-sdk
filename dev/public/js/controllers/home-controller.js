(function(app) {
	app.controller('HomeController', ['$scope','$rootScope','$mdMenu','$mdToast','$mdDialog','MessageUtil',
		'GatewayService','$filter','$window','GatewayClientService','$timeout',
		function($scope, $rootScope, $mdMenu, $mdToast,$mdDialog,MessageUtil,GatewayService,$filter,$window,GatewayClientService,$timeout,bapiDialogController) {

		$scope.promise = null;
		$scope.gateways = [];
		$scope.gatewaySelectedId = null;
		$scope.gatewaySelected = null;
		$scope.treeOptions = {showIcon:true,expandOnClick:false};
		$scope.nodeSelected = null;
		$scope.nodeExpanded = null;
		var gatewayResponse = null;
		$scope.json = null;
		$scope.show_select_gateway = true;
		$scope.loading_tree = false;
		$scope.wrap={compression : "N",testRun:false,callMode:"S",callBack:""};
		$scope.jsonReq={};
		$scope.jsonResp={}
		$scope.opt={selectedIndex:0, show:false};
		$scope.json_global_string="";

		$scope.payload_json = {json: null, options: {mode: 'tree'}};
		$scope.payloadsTree = [];
		$scope.basicTree = [];
		$scope.styleSelected = null;
		$scope.styles = [];
		$scope.show_select_gateway = true;
		
		$scope.json_details = "";
		$scope.json_logs = [];
		$scope.json_logs_title = null;
		$scope.json_logs_content = null;
		$scope.json_logs_content_obj = null;

		$scope.json_logs_executes = [];
		$scope.json_logs_executes_title = null;
		
		$scope.tree_collapsible = false;
		$scope.tree_collapsible_execute =  false;
		$scope.hide_results =  false;
		$scope.json_invalid = null;

		$scope.url_details = "";
        $scope.edit={};
		$scope.edit.current_long_text="";
		$scope.edit.current_description="";
		$scope.add_endpoint = false;


		$scope.bapi = {};
		$scope.bapi_node_is_selected = false;
		$scope.style_template = {};
		$scope.client = {};
		var endpoints_names=[];
		var endpoints_main=[];
		$scope.node = null;
		$scope.parentNode = null;

		$scope.query = {
          limit: 10,
          page: 1
        };

        $scope.limitOptions = [10, 25, 50, 100];

        var PACKAGE_PATTERN_DEFAULT = /(^\$TMP$)|((^(Z|Y)[1-9A-Za-z]+(_[1-9A-Za-z]+)?))|((\/[1-9A-Za-z]+(\/[1-9A-Za-z_]+)(\/[1-9A-Za-z_]+)?(\/[1-9A-Za-z_]+)?)){1,30}/i;
        $scope.PACKAGE_PATTERN = PACKAGE_PATTERN_DEFAULT;
        $scope.CLASSNAME_PATTERN = /((^(Z|Y)[1-9A-Za-z]+(_[1-9A-Za-z]+)?))|((\/[1-9A-Za-z]+(\/[1-9A-Za-z_]+)(\/[1-9A-Za-z_]+)?(\/[1-9A-Za-z_]+)?)){1,30}/i;

        var stopMenu =function(e) {
        	if(e.target.getAttribute('class') !== "ace_text-input")
	      		e.preventDefault();
	    };
       
		angular.element( $window).on('contextmenu',stopMenu );
		$scope.$on('$destroy', function() {
		    angular.element($window).off('contextmenu', stopMenu);
		});
		
		
		$scope.hide_tree = function(){
			$scope.tree_collapsible = true;
		}

		$scope.show_tree = function(){
			$scope.tree_collapsible = false;
		}

		$scope.hide_tree_execute = function(){
			$scope.tree_collapsible_execute = true;
		}

		$scope.show_tree_execute = function(){
			$scope.tree_collapsible_execute = false;
		}

		$scope.endpointMainChanged = function(className){
			console.log("endpointMainChanged",className);
			if(className){
				if(className.toUpperCase().startsWith("Z")){
					$scope.PACKAGE_PATTERN = /(^\$TMP$|(^(Z)[1-9A-Za-z]+(_[1-9A-Za-z]+)?))/i;
				} else if(className.toUpperCase().startsWith("Y")){
					$scope.PACKAGE_PATTERN = /(^\$TMP$|(^(Y)[1-9A-Za-z]+(_[1-9A-Za-z]+)?))/i;
				} else if(className.toUpperCase().startsWith("/")){
					var sections = className.toUpperCase().split("/");
					var pattern_prefix = "";
					console.log("Split",sections);
					for(var i=0;i<(sections.length-1);i++){
						if(sections[i] && sections[i].length>0)
							pattern_prefix += "\\/" + sections[i];
					}
					$scope.PACKAGE_PATTERN = new RegExp("^(" + pattern_prefix + "\\/)[1-9A-Za-z]+(_[1-9A-Za-z]+)?$","i") 
				} else {
					$scope.PACKAGE_PATTERN = /ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ/; 
				}
			} else {
				$scope.PACKAGE_PATTERN = PACKAGE_PATTERN_DEFAULT;
			}
			console.log("Package PATTERN",$scope.PACKAGE_PATTERN);
		}

		$scope.mode_run = false;

		$scope.init = function(){

			console.log("home controller init...");

			$scope.promise = GatewayService.index();

			$scope.add_endpoint = false;

			$scope.promise.then(
				function(result){
					console.log("result",result);
                    $scope.gateways = result.data;


				},
				function(error){
					 console.log('failure', error);
                     MessageUtil.showError(error.data.message);
				}
			);
		};
	/*	$rootScope.$on("default_client_change",function(){
          $scope.init();
          $scope.basicTree = [];
          $scope.gatewaySelected = {};
        });*/

		$scope.isArray = function(what) {
			    return Object.prototype.toString.call(what) === '[object Array]';
		}

		$scope.build_tree = function(selectNodeConfig){
			$scope.add_endpoint = false;
			$scope.basicTree = [];
			var isMeister= $rootScope.isMeister();
			
			var rootNode = {
				name: $scope.gatewaySelected.name,
				image:'/public/images/root.png',
				children: []
			};
			$scope.mode_run = false;
			$scope.payloadsTree = [];
			$scope.payload_json = {json: null, options: {mode: 'tree'}};
			$scope.url_details = "";
			$scope.styleSelected = null;
			
			var style_counter = 1;

			$scope.basicTree.push(rootNode);
			console.log("Building tree",gatewayResponse);
			if(gatewayResponse && gatewayResponse.length > 0){
				$scope.json = gatewayResponse;
				var deletedProjects={
					name:"Logically Deleted",
					source:rootNode,
					image: '/public/images/trash.png',
					parent:rootNode,
					disabled:true,
					is_deleted:"",
					children:[]
				};

				$scope.bapi={
						name:"BAPI Processor",
						source:rootNode,
						image: '/public/images/bapi.png',
						parent:rootNode,
						disabled:false,
						is_deleted:"",
						type: "BAPI_BUTTON",
						children:[]
					};

				rootNode.children.push($scope.bapi);
				_.forEach($scope.json, function(node){		
				    if(node.MEISTER_OWN && 
				    	node.MEISTER_OWN=="X"
				    	&& !isMeister){
				    	return;
				    }	
				   
					var nodeItem = {
						name:node.PROJECT,
						source:node,
						image: '/public/images/project.png',
						parent: rootNode,
						is_deleted:  node.LOGICAL_DELETE,
						children: []
					};

					
					
					 /************************
					  * Data Style Simulator
					  */
					 var style_template= {
							name: "Style Library",
					 		image: '/public/images/template.png',
					 		type: "STYLE_TEMPLATE_PARENT",
					 		parent: node,
					 		expanded: false,
					 		children: []
					 }

					 var deletedStyle_template={
							name:"Logically Deleted",
							source:nodeItem,
							image: '/public/images/trash.png',
							disabled:true,
							parent:node,
							is_deleted:"",
							children:[]
						};		
					 
					 _.forEach(node.STYLE_LIB, function(styleSrc){
					 	var name = styleSrc.DESCRIPTION.length==0 ? 
					 	    styleSrc.PKY : styleSrc.DESCRIPTION;
					 	
						 var style = {
							name:name,
							source:styleSrc,
							type: "style_template",
							image: '/public/images/style_template.png',
							is_deleted:  styleSrc.LOGICAL_DELETE,
							parent: style_template
						 }

						if(style.is_deleted){
						    deletedStyle_template.children.push(style);
							if(deletedStyle_template.children.length==1){
	                          style_template.children.unshift(deletedStyle_template);
							}
						}else{
							style_template.children.push(style);
						}
						 
					});
					 
					 
					nodeItem.children.push(style_template);

					if(nodeItem.is_deleted){
						deletedProjects.children.push(nodeItem);
						if(deletedProjects.children.length==1){
                          rootNode.children.unshift(deletedProjects);
						}
					}else{
						rootNode.children.push(nodeItem);
					}

					var deletedModules={
						name:"Logically Deleted",
						source:nodeItem,
						image: '/public/images/trash.png',
						disabled:true,
						parent:rootNode,
						is_deleted:"",
						children:[]
					};					
					_.forEach(node.MODULES, function(module){
						if(module.MEISTER_OWN && 
					    	module.MEISTER_OWN=="X"
					    	&& !isMeister){
					    	return;
					    }
						var moduleItem = {
							name: module.NAME,
							source:module,
							image: '/public/images/module.png',
							parent:nodeItem,
							is_deleted:  module.LOGICAL_DELETE,
							children: []
						};
						
						
						if(moduleItem.is_deleted){
						    deletedModules.children.push(moduleItem);
							if(deletedModules.children.length==1){
	                          nodeItem.children.unshift(deletedModules);
							}
						}else{
							nodeItem.children.push(moduleItem);
						}
						var deletedEndpoints={
							name:"Logically Deleted",
							source:moduleItem,
							disabled:true,
							image: '/public/images/trash.png',
							parent:nodeItem,
							is_deleted:"",
							children:[]
						}
						_.forEach(module.ENDPOINTS, function(endpoint){
							if(endpoint.MEISTER_OWN && 
						    	endpoint.MEISTER_OWN=="X"
						    	&& !isMeister){
						    	return;
						    }
						    var is_selected = false;
						    //console.log("selectNodeConfig",selectNodeConfig);
						    if(selectNodeConfig){
						    	if(selectNodeConfig.type == "ENDPOINT"){
						    		is_selected = selectNodeConfig.value === endpoint.NAMESPACE;
						    	}
						    }
						    //console.log("is selected",is_selected);
							endpoints_names.push(endpoint.NAMESPACE);
							endpoints_main.push(endpoint.ENDPOINT_MAIN);
							var icon = imageEndpoint(endpoint);
							
							var endpointItem = {
								name: endpoint.NAMESPACE,
								source: endpoint,
								image: icon,
								expanded: false,
								selected:is_selected,
								parent:moduleItem,
								is_deleted:  endpoint.LOGICAL_DELETE,
								children: []
							};

							/*
							var params = {
								"endpoint":endpoint.NAMESPACE,
								"client_number":$scope.client.sap_numbers,
								"Json":""
							};

							GatewayService.execute_endpoint($scope.gatewaySelected.id,params).then(
								function(result){
									//console.log("'"+endpoint.NAMESPACE+"'",result);
								},
								function(error){
									console.log("ERROR:" + endpoint.NAMESPACE, error);
								}
							);*/
							
							if(endpointItem.is_deleted){
								deletedEndpoints.children.push(endpointItem);
								if(deletedEndpoints.children.length==1){
		                          moduleItem.children.unshift(deletedEndpoints);
								}
							}else{
								moduleItem.children.push(endpointItem);
							}	
							if(endpointItem.selected){
								$scope.nodeSelected = endpointItem;

							}						
							_.forEach(endpoint.STYLES, function(style){
								var styleItem = {
									name: style.NAME,
									source: style,
									image: '/public/images/styles.png',
									parent:endpointItem,
									expanded: false,
									is_deleted: style.LOGICAL_DELETE,
									children: []
								};
								endpointItem.children.push(styleItem);
							});
						});
					});
				});
				
				
			}

			$scope.$emit('selection-changed', $scope.nodeSelected);
			
		};

		$scope.executeGateway = function(selectNodeConfig){
			$scope.loading_tree = true;
			$scope.nodeSelected = null;
			$scope.nodeExpanded = null;
			$scope.json_invalid = null;
			$scope.show_select_gateway = false;
			$scope.mode_run = false;
			$scope.url_details = "";
			$scope.styleSelected = null;
			$scope.add_endpoint = false;
			if($scope.gatewaySelected.id){
				params={};
				if($scope.client.id){
					params.client_number = $scope.client.sap_number;
				}
				console.log(params);
				$scope.promise = GatewayService.execute($scope.gatewaySelected.id,params);
				$scope.promise.then(
					function(result){
						$scope.loading_tree = false;
						console.log("result",result);
	                     gatewayResponse = result.data;
	                      MessageUtil.showInfo("Gateway data loaded");
	                     $scope.build_tree(selectNodeConfig);
					},
					function(error){
						$scope.loading_tree = false;
						console.log('failure', error);
	                     MessageUtil.showError(error.data.message);
					}
				);
			}
		};

		$scope.changeGateway = function(id){
			$scope.gatewaySelectedId = id;
			$scope.add_endpoint = false;
			$scope.json_invalid = null;
			console.log("Gateway selected", $scope.gatewaySelectedId);
			$scope.gatewaySelected = _.find($scope.gateways,function(g){
				return id == g.id;
			});
			if($scope.gatewaySelected){
				$scope.client = {};
				GatewayClientService.getbyGatewayId($scope.gatewaySelectedId).then(function(result){
                   $scope.clients = result.data;
                   if($scope.clients.length){
                   	 $scope.client=$scope.clients[0].client;
                   }
		        });
			}
		};

		$rootScope.openActionsInNode = function($mdOpenMenu, $event){
			console.log("openActionsInNode",$event);
			console.log("mdOpenMenu",$mdOpenMenu);
		};

		$scope.openActionsInNodeTemp = function($mdOpenMenu, $event){
			console.log("openActionsInNodeTemp",$event);
		};

		$scope.clear_log_json_result = function(){
			$scope.json_details = "";
			$scope.json_logs = [];
			$scope.json_logs_title = null;
			$scope.json_logs_content = null;
			$scope.json_logs_content_obj = null;
		};

		$scope.$on('hide_bapi_node', function (e,params) {
			$scope.bapi_node_is_selected = false;
		});

		$scope.$on('execute-bapi-node', function(e, node){
			console.log("execute-bapi-node",node);
			$scope.execute(e, node, node.source.FUNCTION_NAME);
		});

		$scope.$on('bapi-node-selected', function(e, node){
			console.log("BAPI node selected",node);
			$scope.mode_run = false;
	     	$scope.add_endpoint = false;
	     	$scope.bapi_node_is_selected = false;
	     	$scope.nodeSelected = node;
	     	$scope.node = node;
	     	$scope.json_invalid = null;
	     	
		});

		$scope.$on('bapi-subnode-selected', function(e, node){
			console.log("BAPI Subnode selected",node);
			$scope.mode_run = false;
			$scope.json_invalid = null;
	     	$scope.add_endpoint = false;
	     	$scope.bapi_node_is_selected = false;
	     	$scope.node = node;
	     	$scope.nodeSelected = node;


		});

		$scope.$on('bapi-selected', function (e,node) {
	     	console.log("BAPI",node);
	     	$scope.mode_run = false;
	     	$scope.json_invalid = null;
	     	$scope.add_endpoint = false;
	     	$scope.bapi_node_is_selected = true;
	     	$scope.node = node;
	     	

	     	/*$mdDialog.show({
		      controller: 'BapiDialogController',
		      templateUrl: 'templates/bapi-dialog.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:false,
              escapeToClose: false,
              locals: {
                  GatewayService: GatewayService,
                  gatewayId: $scope.gatewaySelectedId,
                  bapi: $scope.bapi
               }
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });*/
	    });

	     $scope.$on('selection-changed', function (e, node) {
	     	console.log("Node selected",node);
	     	$scope.bapi_node_is_selected = false;
	     	$scope.node = node;
	     	$scope.nodeSelected = node;
	        $scope.payload_json = {json: null, options: {mode: 'tree'}};
	        $scope.url_details = "";
	        $scope.mode_run = false;
	        $scope.json_invalid = null;
	        $scope.styles = [];
	        $scope.styleSelected = null;

	     	if(!node || !node.source){
	     		return;
	     	}

	     	if(!node.type || (node.type !== "style_template" && (node.type !== "STYLE_TEMPLATE_PARENT")))
	     		$scope.add_endpoint = false;
	      
	        if(node.source.STYLES && node.source.STYLES.length>0){
	        	console.log("Styles",node.source.STYLES);
	        	$scope.styles = _.filter(node.children,function(n){
	        		return n.source.DIRECTION =="O";
	        	} );
	        	/*if($scope.styles.length>0){
	        		$scope.styleSelected = $scope.styles[0];
	        	    $scope.styleSelected.parent = node;
	        	}*/	        	
	        }
	        $scope.clear_log_json_result();
	        if($scope.nodeSelected.source.hasOwnProperty("JSON")){
	        	$scope.json_global_string=JSON.stringify(JSON.parse($scope.nodeSelected.source.JSON),null,"\t");
	        }
	    });

	    

	     $scope.$on('action-node-selected', function (e, obj) {
	        console.log("action-node-selected",obj);
	        if(obj.actionName=== "addProject")
	        	$scope.addProject(obj.sourceEvent,obj.node)
	        else if(obj.actionName === "addModule")
	        	$scope.addModule(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "addEndpoint")
	        	$scope.addEndpoint(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "add_style_lib")
	        	$scope.addStyle(obj.sourceEvent,obj.node.parent, null);
	        else if(obj.actionName == "execute")
	        	$scope.execute(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "execute_by_style")
	        	$scope.execute_by_style(obj.sourceEvent,obj.node);

    	});

	     $scope.$on('ondrop-node-style-to-library', function(e, obj){
	     	console.log("ondrop-node-style-to-library",obj);
	     	$scope.addStyle(e, obj.library.parent, obj.style);
	     });

	    $scope.$on('undelete-style-lib', function (e, obj) {
	        
            var json_to_send =  GatewayService.buildJsonByNewStyleTemplate($scope.json, obj.node.parent.parent, obj.node.source);
          	//delete json_to_send.STYLE_LIB[0].DESCRIPTION;
          	//delete json_to_send.STYLE_LIB[0].JSON;
          	//delete json_to_send.STYLE_LIB[0].LOGICAL_DELETE;
          	//delete json_to_send.STYLE_LIB[0].MEISTER_OWN;
          	//json_to_send.PKY = obj.node.source.PKY;
          	//json_to_send.FKY = obj.node.source.FKY;

            var params = {
             json: JSON.stringify(json_to_send),
             SDK_HINT:"RLD"
            };

            if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
            
            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Style un-deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
         
    	});

    	$scope.$on('delete-style-lib', function (e, obj) {
	       var json_to_send =  GatewayService.buildJsonByNewStyleTemplate($scope.json, obj.node.parent.parent, obj.node.source);
          	//delete json_to_send.STYLE_LIB[0].DESCRIPTION;
          	//delete json_to_send.STYLE_LIB[0].JSON;
          	//delete json_to_send.STYLE_LIB[0].LOGICAL_DELETE;
          	//delete json_to_send.STYLE_LIB[0].MEISTER_OWN;
          	//json_to_send.PKY = obj.node.source.PKY;
          	//json_to_send.FKY = obj.node.source.FKY;
            var params = {
             json: JSON.stringify(json_to_send),
             SDK_HINT:"SLD"
            };

            if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
            
            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Style deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
	        
    	});

    	$scope.$on('undelete-module-selected', function (e, obj) {
	        console.log("undelete-module-selected",obj);
	        var json_to_send =  GatewayService.buildJsonByNewModule($scope.json, obj.node.parent.source, obj.node.source);
          	console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"RLD"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

				$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Module un-deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
         
    	});


    	$scope.$on('check-if-undelete-module-selected', function (e, obj) {
	        console.log("undelete-module-selected",obj);

    	});

    	$scope.$on('delete-module-selected', function (e, obj) {
	        console.log("delete-module-selected",obj);
	        var json_to_send =  GatewayService.buildJsonByNewModule($scope.json, obj.node.parent.source, obj.node.source);
          	console.log("json_to_send",json_to_send);
	        var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"SLD"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


				$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Module deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
    	});

    	$scope.formatKey = function(key){
    		var keyFormat = key.replace("_"," ");
    		return keyFormat.charAt(0).toUpperCase() + keyFormat.slice(1).toLowerCase();
    	};

		$scope.$on('undelete-project-selected', function (e, obj) {
	        console.log("undelete-project-selected",obj);
	        var json_to_send =  GatewayService.buildJsonByNewProject($scope.json, obj.node.source);
          	delete json_to_send.MODULES;
          	delete json_to_send.STYLE_LIB;
          	console.log("json_to_send",json_to_send);
	         
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"RLD"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


				$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Project un-deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );

    	});

    	$scope.$on('delete-project-selected', function (e, obj) {
	        console.log("delete-project-selected",obj);
	        var json_to_send =  GatewayService.buildJsonByNewProject($scope.json, obj.node.source);
          	delete json_to_send.MODULES;
          	delete json_to_send.STYLE_LIB;
          	console.log("json_to_send",json_to_send);
	         
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"SLD"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


				$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Project deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );

    	});

    	$scope.$on('undelete-endpoint-deleted', function (e, obj) {
	        console.log("undelete-endpoint-deleted",obj);
	        var json_to_send =  GatewayService.buildJsonByNewEndpoint($scope.json, obj.node.parent.source, obj.node.source);
          	//if(json_to_send.MODULES[0].ENDPOINTS[0].STYLES.length==0)
          	delete json_to_send.MODULES[0].ENDPOINTS[0].STYLES;
          	console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"RLD"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

				$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Endpoint un-deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
         
    	});

    	$scope.$on('delete-endpoint-deleted', function (e, obj) {
	        console.log("delete-endpoint-deleted",obj);
	        var json_to_send =  GatewayService.buildJsonByNewEndpoint($scope.json, obj.node.parent.source, obj.node.source);
          	//if(json_to_send.MODULES[0].ENDPOINTS[0].STYLES.length==0)
          	delete json_to_send.MODULES[0].ENDPOINTS[0].STYLES;
          	
             console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"SLD"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


				$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Endpoint deleted");
	                  $scope.executeGateway();
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
         
    	});

    	$scope.$on('lock-endpoint', function (e, obj) {
	        console.log("lock-endpoint",obj);
	        
	        var json_to_send =  GatewayService.buildJsonByNewEndpoint($scope.json, obj.node.parent.source, obj.node.source);
          	
	        //if(json_to_send.MODULES[0].ENDPOINTS[0].STYLES.length==0)
          	delete json_to_send.MODULES[0].ENDPOINTS[0].STYLES;
          	
             console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"SLK"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


	            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Endpoint locked");
	                  obj.node.source.LOCKED="X";
	                  obj.node.image = imageEndpoint(obj.node.source);
	                  obj.node.is_lock=true;
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
         
    	});

    	$scope.$on('unlock-endpoint', function (e, obj) {
	        console.log("unlock-endpoint",obj);
	        
	        obj.node.is_lock=false;

	        var json_to_send =  GatewayService.buildJsonByNewEndpoint($scope.json, obj.node.parent.source, obj.node.source);
          	//json_to_send.MODULES[0].ENDPOINTS[0].STYLES = [];
          	
          	 //if(json_to_send.MODULES[0].ENDPOINTS[0].STYLES.length==0)
          	delete json_to_send.MODULES[0].ENDPOINTS[0].STYLES;

             console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"RLK"
	          };

	          if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}


	            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  MessageUtil.showInfo("Endpoint unlocked");
	                  obj.node.source.LOCKED="";
	                  obj.node.image = imageEndpoint(obj.node.source);
	                  },
	                function(error){
	                  console.log("error",error);
	                  MessageUtil.showError(error.data.message);
	                }
	              );
         
    	});

    	$scope.$on('refresh-module', function (e, obj) {
	        console.log("refresh-module",obj);
	        var projects = $scope.basicTree[0].children;

	        _.forEach(projects, function(projectsItm){
	        	var modules = projectsItm.children;
	        	_.forEach(modules, function(modulesItm){
	        		if(modulesItm.nodeId===obj){
	        			modulesItm.is_deleted=false;
	        		}
	        	});
	        });
    	});

    	$scope.$on('refresh-project', function (e, obj) {
	        console.log("refresh-project",obj);
	        console.log("basicTree",$scope.basicTree[0].children);
	        var projects = $scope.basicTree[0].children;

	        _.forEach(projects, function(projectsItm){
        		if(projectsItm.nodeId===obj){
        			projectsItm.is_deleted=false;
        		}
	        });
    	});

	     $scope.addModule = function(ev, parentNode){
	     	$scope.mode_run = false;
	     	$scope.json_invalid = null;
	     	$mdDialog.show({
                controller: 'ModuleDialogController',
                templateUrl: 'templates/module-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 module: null,
                 parentNode: parentNode,
                 gateway: $scope.gatewaySelected,
                 json: $scope.json,
                 client: $scope.client
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Module was created");
                $scope.executeGateway();
              }, function() {
               
              });
	     };
	     
	     $scope.addProject= function(ev, parentNode){
		     	$scope.mode_run = false;
		     	$scope.json_invalid = null;
		     	$mdDialog.show({
	                controller: 'ProjectDialogController',
	                templateUrl: 'templates/project-dialog-form.html',
	                parent: angular.element(document.body),
	                targetEvent: ev,
	                clickOutsideToClose:false,
	                escapeToClose: false,
	                locals: {
	                 project: null,
	                 parentNode: parentNode,
	                 gateway: $scope.gatewaySelected,
	                 json: $scope.json,
	                 client: $scope.client
	               }
	              })
	              .then(function(result) {
	                MessageUtil.showInfo("Project was created");
	                $scope.executeGateway();
	              }, function() {
	               
	              });
		     };

	     /*$scope.addEndpoint = function(ev, parentNode){
	     	$scope.mode_run = false;
	     	$scope.add_endpoint = true;
	     	$scope.style_template = _.find(parentNode.parent.children, function(item){
	     		return item.type === "STYLE_TEMPLATE_PARENT";
	     	});
	     	console.log("style Library",$scope.style_template);
	     	$mdDialog.show({
                controller: 'EndpointDialogController',
                templateUrl: 'templates/endpoint-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 endpoint: null,
                 parentNode: parentNode,
                 gateway: $scope.gatewaySelected,
                 json: $scope.json,
                 endpoints_names: endpoints_names,
                 endpoints_main: endpoints_main,
                 style_library: $scope.style_template
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Endpoint was created");
                $scope.executeGateway();
              }, function() {
               
              });
	     };*/

	     $scope.$on('add-endpoint-closed', function (e, data) {
	     	console.log("add-endpoint-closed",data);
	        $scope.add_endpoint = false;
	    });

	     $scope.$on('add-endpoint-saved', function (e, data) {
	     	console.log("add-endpoint-saved",data);
	        $scope.add_endpoint = false;
	        MessageUtil.showInfo("Endpoint was created");
	        var nodeSelectedConfig = {
	        	type: "ENDPOINT",
	        	value: data.endpoint.NAMESPACE
	        };
            $scope.executeGateway(nodeSelectedConfig);
	    });

	     $scope.addEndpoint = function(ev, parentNode){
	     	$scope.mode_run = false;
	     	$scope.json_invalid = null;
	     	$scope.add_endpoint = true;
	     	$scope.parentNode  =parentNode;
	     	console.log("style Library",$scope.style_template);
	     	/*$mdDialog.show({
                controller: 'EndpointDialogController',
                templateUrl: 'templates/endpoint-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 endpoint: null,
                 parentNode: parentNode,
                 gateway: $scope.gatewaySelected,
                 json: $scope.json,
                 endpoints_names: endpoints_names,
                 endpoints_main: endpoints_main,
                 
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Endpoint was created");
                $scope.executeGateway();
              }, function() {
               
              });*/
	     };
  		$scope.addStyle = function(ev, parentNode, style){
  			$scope.mode_run = false;
  			$scope.json_invalid = null;
	     	$mdDialog.show({
                controller: 'StyleDialogController',
                templateUrl: 'templates/style-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 style: style,
                 parentNode: parentNode,
                 gateway: $scope.gatewaySelected,
                 json: $scope.json,
                 client:$scope.client
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Style was created");
                $scope.executeGateway();
              }, function() {
               
              });
	     };

	     $scope.$watch('payload_json.json_string', function () {
			//$scope.payload_json.json = JSON.parse(newValue);
			if($scope.payload_json.json_string)
			{
				try{
					//remove space in keys
					var str_obj = $scope.payload_json.json_string.replace(/"([\w\s]+)":/g, function (m) {
					    return m.replace(/\s+/g, '');
					});
					$scope.payload_json.json = JSON.parse(str_obj);
					$scope.payload_json.json_test=true;
					console.log(JSON.parse(str_obj));

				}catch (e) {
					$scope.payload_json.json_test=false;
			        return false;
			    }
			}
		 });

	     $scope.execute = function(event, node, name){

			var params = {"endpoint":node.name};
			if(name)
				params.endpoint = name;

			var node={};
			$scope.payload_json = {json: null, options: {mode: 'tree'}};
			$scope.json_logs_executes_title=null;
			$scope.mode_run = true;
			/*if($scope.styleSelected){
				console.log("Style selected",$scope.styleSelected);
				params.style = $scope.styleSelected.name
			}*/
			if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

			/*if($scope.styleSelected)
				node = $scope.styleSelected.parent;
			else*/
				node = $scope.nodeSelected;

			$scope.styleSelected = null;
			$scope.promise = GatewayService.execute_endpoint($scope.gatewaySelected.id,params);
			$scope.promise.then(
				function(result){
					console.log("result",result);
					$scope.json_logs_executes_title = null;
					if(node.source.TYPE && node.source.TYPE=="L"){
						$scope.opt.selectedIndex=0;
						$scope.opt.show=true;
						$scope.jsonReq=result.data.data.REQUEST;
						$scope.jsonResp=result.data.data.RESPONSE;
						$scope.payload_json.json = $scope.jsonReq; //angular.fromJson(result.data.data.d.results[0].Json);
						$scope.payload_json.json_string =JSON.stringify($scope.jsonReq,null, '\t');            
					}else{
						$scope.opt.selectedIndex=0;
						$scope.opt.show=false;
						$scope.payload_json.json = result.data.data; //angular.fromJson(result.data.data.d.results[0].Json);
						$scope.payload_json.json_string =JSON.stringify(result.data.data,null, '\t');
					}
					$scope.payload_json.json_test = true;
					
					
				},
				function(error){
					console.log('failure', error);
                    MessageUtil.showError(error.data.message);
				}
			);
		};
		
		$scope.editorLoaded=function()
		{
			console.log("broascastng");
			$scope.$broadcast('md-resize-textarea')
		}

		$scope.execute_by_style = function(event, node){
			console.log("execute_by_style",$scope.basicTree);
			$scope.styleSelected = node;
			$scope.execute(event, node.parent);
		};

		$scope.downloadJSON = function () {
			var blob = new Blob([$filter('json')($scope.json_logs_content, 2)], { type:"application/json;charset=utf-8;" });			
			var downloadLink = angular.element('<a></a>');
            downloadLink.attr('href',window.URL.createObjectURL(blob));
            downloadLink.attr('download', 'result.json');
			downloadLink[0].click();
		};


		$scope.execute_details = function(event){
			var node = null;
			$scope.hide_results = false;
			$scope.json_invalid = null;
			if($scope.styleSelected)
				node = $scope.styleSelected.parent;
			else
				node = $scope.nodeSelected;

			console.log("Execute details event",node);
			var params = {
				"endpoint": node.name,
				"json": JSON.stringify($scope.payload_json.json,null,""),
				"Test_Run":"",
				"Asynch":"",
				"Queued":"",
				"BPM":"",
			};

			if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

			if($scope.styleSelected){
				params["style"] = $scope.styleSelected.name;
			}
			
			if($scope.wrap.compression!="N")
				params.compression=$scope.wrap.compression;


			if($scope.wrap.testRun)
				params.Test_Run="X";
		
			
			switch($scope.wrap.callMode){
				case "A":
				  params.Asynch="X";
				  break;
				case "Q":
				  params.Queued="X";
				  break;
				case "B":
				  params.BPM="X";
				  break;
			}

			var execution_time = new Date();
			$scope.promise = GatewayService.execute_endpoint($scope.gatewaySelected.id,params);
			$scope.promise.then(
				function(result){
					console.log("result",result);
					
					var end_time = new Date();
					var difference = end_time-execution_time;
					$scope.url_details = result.data.url;
					var json_text_title = "RUNTIME: " + moment().format('MMMM DD YYYY, h:mm:ss a');
					if(result.data.compression=="O" || result.data.compression=="B"){
						var binData = new Uint8Array(result.data.data);
					   
					    // Pako magic
					    var data  = pako.inflate(binData);

					    // Convert gunzipped byteArray back to ascii string:
					    
						json=(String.fromCharCode.apply(null, new Uint16Array(data)));
						json_text_content = angular.fromJson(json); //$filter('json')(angular.fromJson(json));
					    
					}
					else{
			   		   json_text_content = result.data.data;//$filter('json')(result.data.data, 2);
					}

					console.log("json_text_content",json_text_content);

					var json_text_item = {
						title:json_text_title + " - Time Execution: " + (difference/1000) + " seconds" ,
						content:json_text_content
					};

					var json_execute_text_item = {
						title:node.name+"-"+json_text_title,
						nodeSelected : node,
						opt: $scope.opt,
						selectedIndex: $scope.opt.selectedIndex,
						payload_json: angular.copy( $scope.payload_json),
						styleSelected: $scope.styleSelected
					};

					$scope.json_logs_title = json_text_item.title;
					$scope.json_logs_content = json_text_item.content;
					$scope.json_logs_content_obj = result.data.data; //angular.fromJson(result.data.data.d.results[0].Json);
					$scope.json_logs.push(json_text_item);

					$scope.json_logs_executes.push(json_execute_text_item);

					//$scope.json_details += "<span class=\"title-log-result\">" + json_text_title + ": Result</span><br/>";
					//$scope.json_details += "<span class=\"content-log-result\"> <code><pre>"+json_text_content+"</pre></code></span><br/><br/>";
					/*$mdDialog.show({
		                controller: 'ResponseEndpointExecutionDialogController',
		                templateUrl: 'templates/response-endpoint-execution.html',
		                parent: angular.element(document.body),
		                targetEvent: event,
		                clickOutsideToClose:false,
		                escapeToClose: false,
		                locals: {
		                 json: angular.fromJson(result.data.data.d.results[0].Json)
		               }
		              });*/
				},
				function(error){

					console.log('failure', error);
                    MessageUtil.showError(error.data.message);
                    if(error.data.Json){
                    	$scope.json_invalid = error.data.Json; //angular.fromJson(result.data.data.d.results[0].Json);
					}
				}
			);
		};

		$scope.changeJsonLogExecute = function(log){
			console.log("changeJsonLogExecute",log);
			var item_selected = _.find($scope.json_logs_executes,function(i){return i.title === log});
			if(item_selected){
				$scope.nodeSelected =item_selected.nodeSelected;
				$scope.opt = item_selected.opt;
				$scope.payload_json = angular.copy(item_selected.payload_json);
				$scope.styleSelected = item_selected.styleSelected;
				console.log($scope.payload_json);
				$scope.query = {
		          limit: 10,
		          page: 1
		        };
			}
		}

		$scope.changeJsonLog = function(log){
			console.log("changeJsonLog",log);
			$scope.json_logs_title = log;
			var item_selected = _.find($scope.json_logs,function(i){return i.title === log});
			if(item_selected){
				$scope.json_logs_content = item_selected.content;
				$scope.json_logs_content_obj = angular.fromJson(item_selected.content);
				$scope.query = {
		          limit: 10,
		          page: 1
		        };
			}
		}

        $scope.json_to_string = function(obj){
        	return JSON.stringify(obj,null,"\t");
        };

        $scope.json_to_object = function(value){
        	try{
        		return JSON.parse(value);
        	}catch(e){
        		return {};
        	}

	    }

		$scope.onLoadJson = function (instance) {
            instance.expandAll();
        };

         $scope.changeStyle = function(style){
        	$scope.styleSelected = style;
        	$scope.styleSelected.parent = $scope.nodeSelected;
        	console.log("changeStyle",$scope.styleSelected);
        };

        $scope.setRequest= function(){
			$scope.payload_json.json = $scope.jsonReq;
			$scope.payload_json.json_string =JSON.stringify($scope.jsonReq,null, '\t');
        }

        $scope.setResponse = function(){
        	$scope.payload_json.json = $scope.jsonResp;
			$scope.payload_json.json_string =JSON.stringify($scope.jsonResp,null, '\t');
        }
        
        $scope.editLongText = function(node,index){
        	if(node.source.LOCKED)
        		return;
        	$scope.edit.current_long_text= node.source.LONG_TEXT;
        	node.source["LONG_TEXT"+index]={"$edit":true};

        	$timeout(function(){
        		$window.document.getElementById('elementF').focus();
        	});        
        }

        $scope.cancelLongText = function(node,index){
        	delete node.source["LONG_TEXT"+index];
        }

        $scope.saveLongText = function(node,index,current_long_text){
        	var original=node.source.LONG_TEXT;
        	node.source.LONG_TEXT = current_long_text;
        	delete node.source["LONG_TEXT"+index];
        	var json_to_send =  GatewayService.buildJsonByNewEndpoint($scope.json, node.parent.source, node.source);
            delete json_to_send.MODULES[0].ENDPOINTS[0].STYLES;
            console.log("json_to_send",json_to_send);
	        var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"ELT"
	        };
	        if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

			$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	        $scope.promise.then(
	                function(result){
	                  console.log("result",result);
	                  
	                  },
	                function(error){
	                  console.log("error",error);
	                  node.source.LONG_TEXT=original;
	                  MessageUtil.showError(error.data.message);
	                }
	              );
        }


        $scope.editDescription = function(node){
        	$scope.edit.current_description= node.source.DESCRIPTION;
        	node.$edit=true;
        	$timeout(function(){
        		$window.document.getElementById('elementF').focus();
        	});        	
        }

        $scope.cancelDescription = function(node,index){
        	node.$edit=false;
        }

        $scope.saveDescription = function(node,current_description){
        	var original = node.source.DESCRIPTION;
        	node.source.DESCRIPTION = current_description;

        	delete node["$edit"];
        	var json_to_send =  GatewayService.buildJsonByNewStyleTemplate($scope.json, node.parent.parent, node.source);
          
            console.log("json_to_send",json_to_send);
	        var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"ELT"
	        };
	        if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

			$scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	        $scope.promise.then(
	                function(result){
	                   console.log("result",result);
	                   node.name = current_description;
	               
	                  },
	                function(error){
	                  console.log("error",error);
	                  node.source.DESCRIPTION = original;
	                  MessageUtil.showError(error.data.message);
	                }
	              );
        }
        
        var imageEndpoint = function(e){
        	if(e.LOCKED && e.LOCKED==="X")
			{
				if(e.TYPE == "L")
					return '/public/images/dendpoint_l.png';
				else
					return '/public/images/dendpoint.png';
			}else{
				if(e.TYPE == "L")
					return '/public/images/endpoint_l.png';
				else
					return '/public/images/endpoint.png';					
			}
        }

        $scope.sizeView = function(){
        	if(!$scope.mode_run || $scope.json_logs.length==0 || $scope.hide_results){
        		return $scope.tree_collapsible ? 95 : 70;
        	}else{
        		return $scope.tree_collapsible ? 45 : 35;
        	}

        }

        $scope.sizeViewExecute = function(){
        	if($scope.tree_collapsible && $scope.tree_collapsible_execute ){
        		return 90;
        	}else if($scope.tree_collapsible && !$scope.tree_collapsible_execute ) {
        		return 50;
        	}if(!$scope.tree_collapsible && $scope.tree_collapsible_execute){
                return 70;
        	}else{
                return 35;
        	}

        }

        $scope.hideResults= function(){
        	$scope.hide_results = true;
        }

	}]);
})(meister);
