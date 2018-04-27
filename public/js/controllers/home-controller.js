(function(app) {
	app.controller('HomeController', ['$scope','$rootScope','$mdMenu','$mdToast','$mdDialog','MessageUtil',
		'GatewayService','$filter',
		function($scope, $rootScope, $mdMenu, $mdToast,$mdDialog,MessageUtil,GatewayService,$filter) {

		$scope.promise = null;
		$scope.gateways = [];
		$scope.gatewaySelectedId = null;
		$scope.gatewaySelected = null;
		$scope.treeOptions = {showIcon:false,expandOnClick:false};
		$scope.nodeSelected = null;
		$scope.nodeExpanded = null;
		var gatewayResponse = null;
		$scope.json = null;
		$scope.show_select_gateway = true;
		$scope.loading_tree = false;

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
		$scope.url_details = "";

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

		$scope.isArray = function(what) {
			    return Object.prototype.toString.call(what) === '[object Array]';
		}

		$scope.build_tree = function(){

			$scope.basicTree = [];
			var rootNode = {
				name: $scope.gatewaySelected.name,
				children: []
			};
			$scope.mode_run = false;
			$scope.payloadsTree = [];
			$scope.payload_json = {json: null, options: {mode: 'tree'}};
			$scope.url_details = "";
			$scope.styleSelected = null;

			$scope.basicTree.push(rootNode);
			console.log("Building tree",gatewayResponse);
			if(gatewayResponse && gatewayResponse.d && gatewayResponse.d.results 
				&& gatewayResponse.d.results.length > 0){
				$scope.json = angular.fromJson(gatewayResponse.d.results[0].Json);
				console.log("Json",$scope.json);
				_.forEach($scope.json, function(node){
					 var nodeItem = {
						name:node.PROJECT,
						source:node,
						children: []
					};
					rootNode.children.push(nodeItem);
					_.forEach(node.MODULES, function(module){
						var moduleItem = {
							name: module.NAME,
							source:module,
							children: []
						};
						nodeItem.children.push(moduleItem);
						_.forEach(module.ENDPOINTS, function(endpoint){
							var endpointItem = {
								name: endpoint.NAMESPACE,
								source: endpoint,
								expanded: false,
								children: []
							};
							moduleItem.children.push(endpointItem);
							_.forEach(endpoint.STYLES, function(style){
								var styleItem = {
									name: style.NAME,
									source: style,
									expanded: false,
									children: []
								};
								endpointItem.children.push(styleItem);
							});
						});
					});
				});
				
				
			}
		};

		$scope.changeGateway = function(id){
			$scope.loading_tree = true;
			$scope.gatewaySelectedId = id;
			$scope.nodeSelected = null;
			$scope.nodeExpanded = null;
			$scope.show_select_gateway = false;
			$scope.mode_run = false;
			$scope.url_details = "";
			$scope.styleSelected = null;
			
			console.log("Gateway selected", $scope.gatewaySelectedId);
			$scope.gatewaySelected = _.find($scope.gateways,function(g){
				return id == g.id;
			});
			$scope.promise = GatewayService.execute(id);
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
                 json: $scope.json
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

	     $scope.execute = function(event, node){
			console.log("Execute event for endpoint",node);
			var params = {"endpoint":node.name};
			$scope.mode_run = true;
			$scope.promise = GatewayService.execute_endpoint($scope.gatewaySelected.id,params);
			$scope.promise.then(
				function(result){
					console.log("result",result);
					$scope.payload_json.json = result.data.data; //angular.fromJson(result.data.data.d.results[0].Json);
				},
				function(error){
					console.log('failure', error);
                    MessageUtil.showError(error.data.message);
				}
			);
		};

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
			var execution_time = new Date();
			$scope.promise = GatewayService.execute_endpoint($scope.gatewaySelected.id,params);
			$scope.promise.then(
				function(result){
					console.log("result",result);
					var end_time = new Date();
					var difference = end_time-execution_time;
					$scope.url_details = result.data.url;
					var json_text_title = "RUNTIME: " + moment().format('MMMM DD YYYY, h:mm:ss a');
					var json_text_content = $filter('json')(result.data.data, 2);

					var json_text_item = {
						title:json_text_title + " - Time Execution: " + (difference/1000) + " seconds" ,
						content:json_text_content
					};

					$scope.json_logs_title = json_text_item.title;
					$scope.json_logs_content = json_text_item.content;
					$scope.json_logs_content_obj = result.data.data; //angular.fromJson(result.data.data.d.results[0].Json);
					$scope.json_logs.push(json_text_item);

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

		$scope.changeJsonLog = function(log){
			console.log("changeJsonLog",log);
			$scope.json_logs_title = log;
			var item_selected = _.find($scope.json_logs,function(i){return i.title === log});
			if(item_selected){
				$scope.json_logs_content = item_selected.content;
			}
		}

        $scope.json_to_string = function(obj){
        	return JSON.stringify(obj);
        };

		$scope.onLoadJson = function (instance) {
            instance.expandAll();
        };

         $scope.changeStyle = function(style){
        	$scope.styleSelected = style;
        	$scope.styleSelected.parent = $scope.nodeSelected;
        	console.log("changeStyle",style);
        };

	}]);
})(meister);
