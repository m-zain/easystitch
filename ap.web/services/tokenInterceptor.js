﻿define(['app'], function (app) {
    app.factory('tokenInterceptor', [
        '$q', '$window', '$location',
        function ($q, $window, $location) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    }
                    return config;
                },

                requestError: function (rejection) {
                    return $q.reject(rejection);
                },

                /* Set Authentication.isAuthenticated to true if 200 received */
                response: function (response) {
                    if (response != null && response.status == 200 && $window.sessionStorage.token && !global.isAuthenticated) {
                        global.isAuthenticated = true;
                    }
                    return response || $q.when(response);
                },

                /* Revoke client authentication if 401 is received */
                responseError: function (rejection) {
                    if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || global.isAuthenticated)) {
                        delete $window.sessionStorage.token;
                        global.isAuthenticated = false;
                        $location.path("/login");
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
});