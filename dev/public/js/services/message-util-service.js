(function(app) {
	app.factory('MessageUtil',
    ['$mdToast',
    function ($mdToast) {
        var service = {};

        service.showError = function (message) {
             $mdToast.show(
                $mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .theme('error-toast')
                        .hideDelay(3000)
                    );
        };

        service.showInfo = function (message) {
             $mdToast.show(
                $mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .hideDelay(3000)
                    );
        };

        
        return service;
    }]);
})(meister);