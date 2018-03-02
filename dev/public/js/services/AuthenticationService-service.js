(function(app) {
	app.factory('AuthenticationService',
    ['OAuth',
    function (OAuth) {
        var service = {};

        service.Login = function (user, pass) {
            return OAuth.getAccessToken({username:user,password:pass,email:user});
        };

        service.Logout = function(){
        	return OAuth.revokeToken();
        };
 
        return service;
    }])
 
})(meister);
