(function(app) {
	app.controller('HomeController', ['$scope','$mdToast','$mdDialog','MessageUtil','GatewayService',
		function($scope, $mdToast,$mdDialog,MessageUtil,GatewayService) {

		$scope.promise = null;
		$scope.gateways = [];
		$scope.gatewaySelectedId = null;
		$scope.gatewaySelected = null;
		$scope.treeOptions = {showIcon:false,expandOnClick:false};
		$scope.nodeSelected = null;
		$scope.nodeExpanded = null;
		$scope.show_select_gateway = true;
		var gatewayResponse = null;
		$scope.json = null;

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

			$scope.basicTree = [];
			var rootNode = {
				name: $scope.gatewaySelected.name,
				children: []
			};
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

	     $scope.addModule = function(ev, parentNode){
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
	}]);
})(meister);
