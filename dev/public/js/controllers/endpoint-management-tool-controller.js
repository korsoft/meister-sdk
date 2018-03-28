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
				children: [
				{name:'Meister.EndPoint.LookUP',children:[]},
				{name:'Meister.BAPI.LookUp',children:[]},
				{name:'Meister.Report.Manager',children:[]}
				]
			};

			var payloadNode = {
				name: 'Payloads',
				children: [
					{name:'Full', children: [{name:'Request',children:[]},{name:'Response',children:[]}]},
					{name:'Ipad', children: []}
				]
			};
			$scope.endpointsTree.push(rootNode);
			$scope.payloadsTree.push(payloadNode);
		};

		$scope.changeGateway = function(id){
			console.log("changeGateway",id);
			$scope.gatewaySelectedId = id;
			$scope.build_tree();
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