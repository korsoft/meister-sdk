var meister = angular.module('meister', ['ngMaterial', 'ngAnimate','ngSanitize', 'ngMessages',
 'ngAria', 'ui.router','ngCookies','md.data.table','chart.js','TreeWidget','angular-oauth2']);

meister.constant('SERVER_BASE_URL', "http://localhost:8000");
meister.constant('CLIENT_SECRET_KEY',"GzkU62Ruwo29riFgJHVDPw377k8hYu5dXXYxgYSR");
meister.constant('SYSTEM_ADMIN',99);
meister.constant('CLIENT_ADMIN',49);
meister.constant('CLIENT_USER',29);


(function(app) {
    app.config(['$stateProvider', '$urlRouterProvider','OAuthProvider','OAuthTokenProvider','SERVER_BASE_URL','CLIENT_SECRET_KEY', 
        function($stateProvider, $urlRouterProvider, OAuthProvider, OAuthTokenProvider, SERVER_BASE_URL, CLIENT_SECRET_KEY) {

        OAuthTokenProvider.configure({
            name: 'meister-sdk-token',
              options: {
                secure: false
              }
        });
        
        OAuthProvider.configure({
              baseUrl: SERVER_BASE_URL,
              clientId: '2',
              clientSecret: CLIENT_SECRET_KEY, // optional
              grantPath: '/api/login',
              revokePath: '/api/logout'
        });

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('login', {
		url: '/login',
		templateUrl: 'partials/login-partial.html',
		controller: 'LoginController'
	})

	.state('home', {
            url: '/home',
            templateUrl: 'partials/home-partial.html',
            controller: 'HomeController'
        })
        .state('clients', {
            url: '/clients',
            templateUrl: 'partials/clients-partial.html',
            controller: 'ClientController'
        })
        .state('users', {
            url: '/users',
            templateUrl: 'partials/users-partial.html',
            controller: 'UserController'
        })
        .state('edit-profile', {
            url: '/edit-profile',
            templateUrl: 'partials/edit-profile-partial.html',
            controller: 'EditProfileController'
        })
        .state('gateways', {
            url: '/gateways',
            templateUrl: 'partials/client-gateways-partial.html',
            controller: 'ClientGatewayController'
        });

    }]).run(['$rootScope', '$location','$mdToast','OAuth',
    function ($rootScope, $location,$mdToast,OAuth) {

        
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !OAuth.isAuthenticated()) {
                $location.path('/login');
            }
        });

        $rootScope.$on('oauth:error', function(event, rejection) {
          // Ignore `invalid_grant` error - should be catched on `LoginController`.
          if ('invalid_grant' === rejection.data.error) {
            return;
          }

          // Refresh token when a `invalid_token` error occurs.
          if ('invalid_token' === rejection.data.error) {
            return OAuth.getRefreshToken();
          }

          console.log("oauth:error", rejection.data.error);

          $mdToast.show(
                          $mdToast.simple()
                            .textContent(rejection.data.error)
                            .position('top' )
                            .highlightClass('md-warn')
                            .hideDelay(3000)
                        );

          // Redirect to `/login` with the `error_reason`.
          return $location.path('/login');
        });
    }]);
})(meister);
