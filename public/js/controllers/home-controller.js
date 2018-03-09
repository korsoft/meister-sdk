(function(app) {
	app.controller('HomeController', ['$scope','$mdToast','$mdDialog','MessageUtil','GatewayService',
		function($scope, $mdToast,$mdDialog,MessageUtil,GatewayService) {

		$scope.promise = null;
		$scope.gateways = [];
		$scope.gatewaySelectedId = null;
		$scope.gatewaySelected = null;
		$scope.treeOptions = {showIcon:false,expandOnClick:true};
		$scope.nodeSelected = null;
		$scope.nodeExpanded = null;
		var gatewayResponse = null;

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

		var build_tree = function(){
			$scope.basicTree = [];
			var rootNode = {
				name: $scope.gatewaySelected.name,
				children: []
			};
			$scope.basicTree.push(rootNode);
			console.log("Building tree",gatewayResponse);
			if(gatewayResponse && gatewayResponse.d && gatewayResponse.d.results 
				&& gatewayResponse.d.results.length > 0){
				var json = angular.fromJson(gatewayResponse.d.results[0].Json);
				console.log("Json",json);
				_.forEach(json, function(node){
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
			$scope.gatewaySelectedId = id;
			$scope.nodeSelected = null;
			$scope.nodeExpanded = null;
			console.log("Gateway selected", $scope.gatewaySelectedId);
			$scope.gatewaySelected = _.find($scope.gateways,function(g){
				return id == g.id;
			});
			$scope.promise = GatewayService.execute(id);
			$scope.promise.then(
				function(result){
					console.log("result",result);
                     gatewayResponse = result.data;
                      MessageUtil.showInfo("Gateway data loaded");
                     build_tree();
				},
				function(error){
					console.log('failure', error);
                     MessageUtil.showError(error.data.message);
				}
			);
		};

	     $scope.$on('selection-changed', function (e, node) {
	        console.log("Node selected",node);
	        $scope.nodeSelected = node;
	    });

	     $scope.$on('expanded-state-changed', function (e, node) {
	        console.log("Expanded node",node);
	        $scope.nodeExpanded = node;
	        //console.log(node.expanded);
    	});

  
	}]);
})(meister);
