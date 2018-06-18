(function(app) {
	app.controller('HomeController', ['$scope','$rootScope','$mdMenu','$mdToast','$mdDialog','MessageUtil',
		'GatewayService','$filter','$window','GatewayClientService',
		function($scope, $rootScope, $mdMenu, $mdToast,$mdDialog,MessageUtil,GatewayService,$filter,$window,GatewayClientService) {

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
		$scope.wrap={compression : "N"};
		$scope.jsonReq={};
		$scope.jsonResp={}
		$scope.opt={selectedIndex:0, show:false};

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
		$scope.json_logs_executes_content = null;
		$scope.json_logs_executes_content_obj = null;

		$scope.url_details = "";


		$scope.client = {};
		var endpoints_names=[];
		var endpoints_main=[];

        var stopMenu =function(e) {
        	if(e.target.getAttribute('class') !== "ace_text-input")
	      		e.preventDefault();
	    };
       
		angular.element( $window).on('contextmenu',stopMenu );
		$scope.$on('$destroy', function() {
		    angular.element($window).off('contextmenu', stopMenu);
		});
		
		

		$scope.mode_run = false;

		$scope.init = function(){

			console.log("home controller init...");

			$scope.promise = GatewayService.index();

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

		$scope.build_tree = function(){

			$scope.basicTree = [];
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
				console.log("Json",$scope.json);
				_.forEach($scope.json, function(node){
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
							 name: "STYLE_LIB",
					 		image: '/public/images/template.png',
					 		type: "style_template",
					 		children: []
					 }
					 
					 _.forEach(node.STYLE_LIB, function(styleSrc){
						 var style = {
							name:styleSrc.PKY,
							source:styleSrc,
							type: "style_template",
							image: '/public/images/style_template.png',
							is_deleted:  styleSrc.LOGICAL_DELETE,
							parent: style_template
						 }
						 style_template.children.push(style);
					});
					 
					 
					 nodeItem.children.push(style_template);
					 
					rootNode.children.push(nodeItem);
					_.forEach(node.MODULES, function(module){
						var moduleItem = {
							name: module.NAME,
							source:module,
							image: '/public/images/module.png',
							parent:nodeItem,
							is_deleted:  module.LOGICAL_DELETE,
							children: []
						};
						nodeItem.children.push(moduleItem);
						_.forEach(module.ENDPOINTS, function(endpoint){
							endpoints_names.push(endpoint.NAMESPACE);
							endpoints_main.push(endpoint.ENDPOINT_MAIN);
							var icon = "";
							console.log("endpoint",endpoint);
							if(endpoint.TYPE == "L")
								icon = '/public/images/endpoint_l.png';
							else
								icon = '/public/images/endpoint.png';
							var endpointItem = {
								name: endpoint.NAMESPACE,
								source: endpoint,
								image: icon,
								expanded: false,
								parent:moduleItem,
								is_deleted:  endpoint.LOGICAL_DELETE,
								children: []
							};
							moduleItem.children.push(endpointItem);
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
		};

		$scope.executeGateway = function(){
			$scope.loading_tree = true;
			$scope.nodeSelected = null;
			$scope.nodeExpanded = null;
			$scope.show_select_gateway = false;
			$scope.mode_run = false;
			$scope.url_details = "";
			$scope.styleSelected = null;
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
	                     $scope.build_tree();
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

	     $scope.$on('selection-changed', function (e, node) {
	     	console.log("Node selected",node);
	        $scope.payload_json = {json: null, options: {mode: 'tree'}};
	        $scope.url_details = "";
	        $scope.nodeSelected = node;
	        $scope.mode_run = false;
	        $scope.styles = [];
	        $scope.styleSelected = null;
	        if(!node.source){
	     		$scope.nodeSelected = null;
	     		return;
	     	}
	        $scope.nodeSelected = node;
	        if(node.source.STYLES && node.source.STYLES.length>0){
	        	console.log("Styles",node.source.STYLES);
	        	$scope.styles = node.children;
	        	$scope.styleSelected = node.children[0];
	        	$scope.styleSelected.parent = node;
	        }
	    });

	     $scope.$on('action-node-selected', function (e, obj) {
	        console.log("action-node-selected",obj);
	        if(obj.actionName === "addModule")
	        	$scope.addModule(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "addEndpoint")
	        	$scope.addEndpoint(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "addStyle")
	        	$scope.addStyle(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "execute")
	        	$scope.execute(obj.sourceEvent,obj.node);
	        else if(obj.actionName == "execute_by_style")
	        	$scope.execute_by_style(obj.sourceEvent,obj.node);
    	});

	    $scope.$on('undelete-node-style-selected', function (e, obj) {
	        console.log("undelete-node-selected",obj);
	        obj.node.is_deleted=false;
    	});

    	$scope.$on('delete-node-style-selected', function (e, obj) {
	        console.log("delete-node-selected",obj);
	        obj.node.is_deleted=true;
	        
    	});

    	$scope.$on('undelete-module-selected', function (e, obj) {
	        console.log("undelete-module-selected",obj);
	        obj.node.is_deleted=false;
	        $scope.$emit('refresh-project', obj.node.parentId);
    	});


    	$scope.$on('check-if-undelete-module-selected', function (e, obj) {
	        console.log("undelete-module-selected",obj);
	        obj.node.is_deleted=false;
    	});

    	$scope.$on('delete-module-selected', function (e, obj) {
	        console.log("delete-module-selected",obj);
	        obj.node.is_deleted=true;
    	});


		$scope.$on('undelete-project-selected', function (e, obj) {
	        console.log("undelete-project-selected",obj);
	        obj.node.is_deleted=false;
    	});

    	$scope.$on('delete-project-selected', function (e, obj) {
	        console.log("delete-project-selected",obj);
	        obj.node.is_deleted=true;
    	});

    	$scope.$on('undelete-endpoint-deleted', function (e, obj) {
	        console.log("undelete-endpoint-deleted",obj);
	        _.forEach(obj.node.children,function(itm){
	        	itm.is_deleted=false;
	        }); 
	        obj.node.is_deleted=false;
	        $scope.$emit('refresh-module', obj.node.parentId);
    	});

    	$scope.$on('delete-endpoint-deleted', function (e, obj) {
	        console.log("delete-endpoint-deleted",obj);
	        _.forEach(obj.node.children,function(itm){
	        	itm.is_deleted=true;
	        }); 
	        obj.node.is_deleted=true;

	        var json_to_send =  GatewayService.buildJsonByNewEndpoint($scope.json, obj.node.parent.source, obj.node.source);
          	json_to_send.MODULES[0].ENDPOINTS[0].STYLES = [];
          	
             console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"SLD"
	          };



	            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
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
          	json_to_send.MODULES[0].ENDPOINTS[0].STYLES = [];
          	
             console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"SLK"
	          };



	            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
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
          	json_to_send.MODULES[0].ENDPOINTS[0].STYLES = [];
          	
             console.log("json_to_send",json_to_send);
	          var params = {
	            json: angular.toJson(json_to_send),
	            SDK_HINT:"RLK"
	          };



	            $scope.promise = GatewayService.execute_changes($scope.gatewaySelectedId, params);
	            
	            $scope.promise.then(
	                function(result){
	                  console.log("result",result);
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

	     $scope.$on('selection-changed', function (e, node) {
	        console.log("Node selected",node);
	        $scope.payload_json = {json: null, options: {mode: 'tree'}};
	        $scope.url_details = "";
	        $scope.nodeSelected = node;
	        $scope.styles = [];
	        $scope.mode_run = false;
	        $scope.styleSelected = null;
	        if(!node.source){
	     		$scope.nodeSelected = null;
	     		return;
	     	}
	     	$scope.nodeSelected = node;
	        if(node.source.STYLES && node.source.STYLES.length>0){
	        	console.log("Styles",node.source.STYLES);
	        	$scope.styles = node.children;
	        	$scope.styleSelected = node.children[0];
	        	$scope.styleSelected.parent = node;
	        }
	    });

	     $scope.addModule = function(ev, parentNode){
	     	$scope.mode_run = false;
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
                 json: $scope.json
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Module was created");
                $scope.changeGateway($scope.gatewaySelectedId);
              }, function() {
               
              });
	     };

	     $scope.addEndpoint = function(ev, parentNode){
	     	$scope.mode_run = false;
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
                 endpoints_main: endpoints_main
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Endpoint was created");
                $scope.changeGateway($scope.gatewaySelectedId);
              }, function() {
               
              });
	     };
  
  		$scope.addStyle = function(ev, parentNode){
  			$scope.mode_run = false;
	     	$mdDialog.show({
                controller: 'StyleDialogController',
                templateUrl: 'templates/style-dialog-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                escapeToClose: false,
                locals: {
                 style: null,
                 parentNode: parentNode,
                 gateway: $scope.gatewaySelected,
                 json: $scope.json
               }
              })
              .then(function(result) {
                MessageUtil.showInfo("Style was created");
                $scope.changeGateway($scope.gatewaySelectedId);
              }, function() {
               
              });
	     };

	     $scope.$watch('payload_json.json_string', function () {
			//$scope.payload_json.json = JSON.parse(newValue);
			if($scope.payload_json.json_string)
			{
				try{
					$scope.payload_json.json = JSON.parse($scope.payload_json.json_string);
					$scope.payload_json.json_test=true;
					console.log(JSON.parse($scope.payload_json.json_string));

				}catch (e) {
					$scope.payload_json.json_test=false;
			        return false;
			    }
			}
		 });

	     $scope.execute = function(event, node){
		
			var params = {"endpoint":node.name};
			var node={};
			$scope.payload_json = {};
			$scope.json_logs_executes_title=null;
			$scope.mode_run = true;
			if($scope.styleSelected){
				params.style = $scope.styleSelected.name
			}
			if($scope.client.id){
				params.client_number = $scope.client.sap_number;
			}

			if($scope.styleSelected)
				node = $scope.styleSelected.parent;
			else
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


		$scope.execute_details = function(event){
			var node = null;
			
			if($scope.styleSelected)
				node = $scope.styleSelected.parent;
			else
				node = $scope.nodeSelected;

			console.log("Execute details event",node);
			var params = {
				"endpoint": node.name,
				"json": JSON.stringify($scope.payload_json.json,null,""),
				"style": $scope.styleSelected ? $scope.styleSelected.name : 'DEFAULT'
			};
			if($scope.wrap.compression!="N")
				params.compression=$scope.wrap.compression;

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
						json_text_content = $filter('json')(angular.fromJson(json));
					    
					}
					else{
			   		   json_text_content = $filter('json')(result.data.data, 2);
					}

					var json_text_item = {
						title:json_text_title + " - Time Execution: " + (difference/1000) + " seconds" ,
						content:json_text_content
					};

					var json_execute_text_item = {
						title:node.name+"-"+json_text_title,
						nodeSelected : node,
						opt: $scope.opt,
						selectedIndex: $scope.opt.selectedIndex,
						payload_json: $scope.payload_json,
						styleSelected: $scope.styleSelected
					};

					$scope.json_logs_title = json_text_item.title;
					$scope.json_logs_content = json_text_item.content;
					$scope.json_logs_content_obj = result.data.data; //angular.fromJson(result.data.data.d.results[0].Json);
					$scope.json_logs.push(json_text_item);

					$scope.json_logs_executes_title = json_execute_text_item.title;
					$scope.json_logs_executes_content = json_text_item.content;
					$scope.json_logs_excutes_content_obj = result.data.data; //angular.fromJson(result.data.data.d.results[0].Json);
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
				}
			);
		};

		$scope.changeJsonLogExecute = function(log){
			var item_selected = _.find($scope.json_logs_executes,function(i){return i.title === log});
			if(item_selected){
				$scope.nodeSelected =item_selected.nodeSelected;
				$scope.opt = item_selected.opt;
				$scope.payload_json = item_selected.payload_json;
				$scope.styleSelected = item_selected.styleSelected;
				console.log($scope.styleSelected);
			}
		}

		$scope.changeJsonLog = function(log){
			console.log("changeJsonLog",log);
			$scope.json_logs_title = log;
			var item_selected = _.find($scope.json_logs,function(i){return i.title === log});
			if(item_selected){
				$scope.json_logs_content = item_selected.content;
				$scope.json_logs_content_obj = angular.fromJson(item_selected.content);
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
        
        

	}]);
})(meister);
