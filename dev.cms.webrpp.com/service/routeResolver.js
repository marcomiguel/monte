'use strict';

define([], function () {

    var services = angular.module('routeResolverServices', []);

    services.provider('routeResolver', function () {

        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
            var viewsDirectory = 'view/',
                controllersDirectory = 'controller/',

            setBaseDirectories = function (viewsDir, controllersDir) {
                viewsDirectory = viewsDir;
                controllersDirectory = controllersDir;
            },

            getViewsDirectory = function () {
                return viewsDirectory;
            },

            getControllersDirectory = function () {
                return controllersDirectory;
            };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();

        this.route = function (routeConfig) {

            var resolve = function (path, baseName, alternativeName, secure, slug, action) {
                if (!path) path = '';
                var routeDef = {};
                routeDef.permission = { 'slug': slug, 'action': (action) ? action : 'index' };
                routeDef.templateUrl = alternativeName ? routeConfig.getViewsDirectory() + path + alternativeName + '.html' : routeConfig.getViewsDirectory() + path + baseName + '.html';
                routeDef.controller = baseName + 'Ctrl';
                routeDef.secure = (secure) ? secure : false;
                routeDef.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [routeConfig.getControllersDirectory() + path + baseName + 'Ctrl.js'];
                        return resolveDependencies($q, $rootScope, dependencies);
                    }]
                };

                return routeDef;
            },

            resolveDependencies = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
                require(dependencies, function () {
                    defer.resolve();
                    $rootScope.$apply()
                });

                return defer.promise;
            };

            return {
                resolve: resolve
            }
        }(this.routeConfig);

    });

});
