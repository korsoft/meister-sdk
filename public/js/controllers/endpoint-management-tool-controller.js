(function(app) {
	app.controller('EndpointManagementToolController', 
		['$scope','$mdToast','$mdDialog','MessageUtil','GatewayService',
		function($scope, $mdToast,$mdDialog,MessageUtil,GatewayService) {

		$scope.promise = null;
		$scope.gateways = [];
		$scope.gatewaySelectedId = null;
		$scope.gatewaySelected = null;
		$scope.treeOptions = {showIcon:false,expandOnClick:false};
		$scope.nodeSelected = null;
		$scope.nodeExpanded = null;
		var gatewayResponse = null;
		$scope.json = null;
		$scope.payload_json = {json: null, options: {mode: 'tree'}};
		$scope.endpointsTree = [];
		$scope.payloadsTree = [];

		$scope.styleSelected = null;
		$scope.styles = [];
		$scope.show_select_gateway = true;
		$scope.json_details = "";
		$scope.url_details = "";

		$scope.loading_tree = false;

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
			console.log("build_tree...");
			$scope.endpointsTree = [];
			$scope.payloadsTree = [];
			$scope.payload_json = {json: null, options: {mode: 'tree'}};
			$scope.json_details = "";
			$scope.url_details = "";
			$scope.styleSelected = null;
			var rootNode = {
				name: $scope.gatewaySelected.name,
				children: []
			};
			$scope.endpointsTree.push(rootNode);
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
									parent: endpointItem,
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
			console.log("changeGateway",id);
			$scope.loading_tree = true;
			$scope.url_details = "";
			$scope.gatewaySelectedId = id;
			$scope.nodeSelected = null;
			$scope.nodeExpanded = null;
			$scope.styleSelected = null;
			console.log("Gateway selected", $scope.gatewaySelectedId);
			$scope.show_select_gateway = false;
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

		$scope.execute = function(event, node){
			console.log("Execute event for endpoint",node);
			var params = {"endpoint":node.name};
			$scope.json_details = "";
			$scope.promise = GatewayService.execute_endpoint($scope.gatewaySelected.id,params);
			$scope.promise.then(
				function(result){
					console.log("result",result);
					$scope.payload_json.json = angular.fromJson(result.data.data.d.results[0].Json);
				},
				function(error){
					console.log('failure', error);
                    MessageUtil.showError(error.data.message);
				}
			);
		};

		$scope.execute_by_style = function(event, node){
			console.log("execute_by_style",$scope.endpointsTree);
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
				"json": JSON.stringify($scope.payload_json.json,null,"    "),
				"style": $scope.styleSelected ? $scope.styleSelected.name : 'DEFAULT'
			};
			$scope.promise = GatewayService.execute_endpoint($scope.gatewaySelected.id,params);
			$scope.promise.then(
				function(result){
					console.log("result",result);
					$scope.url_details = result.data.url;
					$scope.json_details = angular.fromJson(result.data.data.d.results[0].Json);
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

		$scope.pretty_payload_json = function (obj) {
            return angular.toJson(obj, true);
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

	     $scope.$on('selection-changed', function (e, node) {
	        console.log("Node selected",node);
	        $scope.payload_json = {json: null, options: {mode: 'tree'}};
	        $scope.url_details = "";
	        $scope.nodeSelected = node;
	        $scope.styles = [];
	        $scope.styleSelected = null;
	        $scope.json_details = "";
	        if(node.source.STYLES && node.source.STYLES.length>0){
	        	console.log("Styles",node.source.STYLES);
	        	$scope.styles = node.children;
	        	$scope.styleSelected = node.children[0];
	        	$scope.styleSelected.parent = node;
	        }

	    });

	     $scope.$on('expanded-state-changed', function (e, node) {
	        console.log("Expanded node",node);
	        $scope.nodeExpanded = node;
	        //console.log(node.expanded);
    	});

	     
	}]);
})(meister);