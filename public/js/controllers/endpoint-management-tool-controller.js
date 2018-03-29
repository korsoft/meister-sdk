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

		$scope.endpointsTree = [];
		$scope.payloadsTree = [];

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
			
			var rootNode = {
				name: 'root',
				children: []
			};

			$scope.endpointsTree.push(rootNode);

			console.log("Building tree",gatewayResponse);
			if(gatewayResponse && gatewayResponse.d && gatewayResponse.d.results 
				&& gatewayResponse.d.results.length > 0){
				$scope.json = angular.fromJson(gatewayResponse.d.results[0].Json);
				console.log("Json",$scope.json);
				_.forEach($scope.json, function(node){
					_.forEach(node.MODULES, function(module){
						_.forEach(module.ENDPOINTS, function(endpoint){
							var endpointItem = {
								name: endpoint.NAMESPACE,
								source: endpoint,
								expanded: false,
								children: []
							};
							rootNode.children.push(endpointItem);
						});
					});
				});
				
				
			}

			var payloadNode = {
				name: 'Payloads',
				children: [
					{name:'Full', children: [{name:'Request',children:[]},{name:'Response',children:[]}]},
					{name:'Ipad', children: []}
				]
			};
			$scope.payloadsTree.push(payloadNode);
		};

		$scope.changeGateway = function(id){
			console.log("changeGateway",id);
			$scope.loading_tree = true;
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