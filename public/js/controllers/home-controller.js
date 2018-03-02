(function(app) {
	app.controller('HomeController', ['$scope',
		function($scope) {
		
    	$scope.treeOptions = {showIcon:false,expandOnClick:true};
    	$scope.basicTree=[{
	        name: "Node 1",
	        children: [{
	            name: "Node 1.1",
	            children:[{name:"Node 1.1.1"},{name: "Node 1.1.2"}]
	        }]},{
	        name: "Node 2",
	        children: [{name: "Node 2.1"},{name: "Node 2.2"}]
	    }];

	     $scope.$on('selection-changed', function (e, node) {
	        console.log("Node selected",node);
	        $scope.selectedNode = node;
	    });

	     $scope.$on('expanded-state-changed', function (e, node) {
	        console.log("Expanded node",node);
	        $scope.expandedNode = node;
	        //console.log(node.expanded);
    	});

  
	}]);
})(meister);
