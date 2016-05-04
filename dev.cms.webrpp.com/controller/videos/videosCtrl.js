// Controller : Create News

// 'use strict';

define(['app'], function (app) {

app.register.controller('videosCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$anchorScroll',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$create',
    'Slug',
    '$msj',
    '$sce',
    '$scrollGo',
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$filter',
    '$log',
    function(
        $scope,
        $rootScope,
        $http,
        $document,
        $location,
        $anchorScroll,
        $preload,
        $mdDialog,
        $mdToast,
        $timeout,
        $create,
        Slug,
        $msj,
        $sce,
        $scrollGo,
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $filter,
        $log
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLVIEW = CMSDATA.GLOBAL.URLVIEW,
            URLLIST = 'listado.html',
            URLLOGIN = 'login.html',
            URLSESSION = 'session',
            URLPREVIEW = 'noticias/vistaprevia',
            DATA = {},
            TIMERESULT = 1000 / 4,
            TIMEWAITBTNDONE = 2000;

        //VAR TOOLS
        var positionMSj = 'top right';
        //SEARCH
        ng.filterText = CMSDATA.FILTER.texto;
        ng.filterFrom = CMSDATA.FILTER.desde; //-30 DAYs
        ng.filterTo = CMSDATA.FILTER.hasta;
        //FLAG DISABLED SESSION
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;

        //DIMENSION IMAGEN | VIDEO | AUDIO UPLOAD
        ng.widthMedia = CMSDATA.DIMENSION16x9.widthLarge;
        ng.heightMedia = CMSDATA.DIMENSION16x9.heightLarge;

        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
            function(data) {
                var data = data;
                if (data.status) {
                    ng.initList(data);
                    $preload.hide();
                } else {
                    $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                    delete $localStorage.login;
                    $preload.hide();
                    $location.path('/');
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                delete $localStorage.login;
                $preload.hide();
                $location.path('/');
            }
        );

        //Close Session
        ng.closeSession = function() {
            $logout.get(URL + URLCLOSESESSION);
        };

        /*
        @init Vars
        */

        /*
        @init Functions
        */
        //INIT FNC
        ng.initList = function(data) {
            ng.formOptionSearch = false;
            ng.layerSearch = false;
            ng.custom = true;

        };

    }
]);

});
