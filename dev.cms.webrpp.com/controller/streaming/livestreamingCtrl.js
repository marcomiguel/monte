// Controller : List Streaming

// 'use strict';

define(['app'], function (app) {

app.register.controller('livestreamingCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$http',
    '$timeout',
//    '$q',
    '$preload',
    '$msj',
    '$login',
    '$localStorage',
    '$logout',
    '$menuleft',
    '$mdDialog',
    '$cacheService',
    '$mdSidenav',
    function (
            $scope,
            $rootScope,
            $location,
            $http,
            $timeout,
            //$q,
            $preload,
            $msj,
            $login,
            $localStorage,
            $logout,
            $menuleft,
            $mdDialog,
            $cacheService,
            $mdSidenav
            ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLPLAYER = 'api/streaming',
            DATA = {},
            TIMERESULT = 1000 / 2;
        //VARS TOOLS
        var positionMSj = 'top right';
        //FLAG DISABLED SESSION
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;
//        console.log(nghome, 'nghome');

        //PROFILE PICTURE
        ng.user = {pictureUrl: false};
        ng.config = {start_time: null, end_time: null, selected: []};

        ng.tipos = [
            {'slug': 'radio', 'nombre': 'Radio'},
            {'slug': 'cabina', 'nombre': 'Cabina'},
            {'slug': 'tv', 'nombre': 'TV'},
            {'slug': 'livestream', 'nombre': 'Livestream'}
        ];

        ng.sitios = []; //Bar Tool

        //Review Session
        ng.user.pictureUrl = false;

        var get_players = function () {
            ng.players = [];
            ng.playerMedia = [];

            $http.get(URL + URLPLAYER).success(function (data) {
                if (data.status) {
                    if (data.response.length > 0) {
                        angular.forEach(data.response, function (v, k) {

                            var arr_media = [];
                            angular.forEach(v.media, function (o, ki) {
                                arr_media.push({'file': o});
                            });

                            ng.playerMedia = [];
                            var item = {};
                            angular.forEach(v.media, function (f, l) {
                                if(l==0){
                                  item = angular.copy(v);
                                  item.sources = arr_media;
                                  ng.playerMedia.push(item);
                                }
                                item = {};
                                item.image = "https://s3.amazonaws.com/dev-procesos/streaming/" + f.replace(/:/g, ".").replace(/\//g, "_")+".png";
                                ng.playerMedia.push(item);
                            });
                            ng.players.push({'tipo': v.tipo, 'signals': ng.playerMedia});
                        });
                    }
                    sort_channels();
                }
            });
        };

        get_players();

        //FORM
        ng.custom = true;
        //OPEN PANEL APPS
        ng.showPanel = false;
        ng.openPanel = function ($event) {
            ng.togglePanel = ng.togglePanel === false ? true : false;
            if (ng.togglePanel) {
                ng.showPanel = false;
            } else {
                ng.showPanel = true;
            }
        };
        //OPEN PANEL MODULES
        ng.showPanel2 = false;
        ng.openPanel2 = function ($event) {
            ng.togglePanel2 = ng.togglePanel2 === false ? true : false;
            if (ng.togglePanel2) {
                ng.showPanel2 = false;
            } else {
                ng.showPanel2 = true;
            }
        };

        //OPEN PERFIL
        ng.openPerfil = function ($event, name) {
            $location.path('/perfil');
        };

        ng.openApps = function ($event, name) {
            var _name = name;
            $location.path(_name);
        };

        var sort_channels = function () {
            ng.channels = {'radio': [], 'cabina': [], 'tv': [], 'livestream': []};
            angular.forEach(ng.players, function (item) {

              if(item.signals && item.signals[0]){
                item.signals[0].primary = "html5";
                item.signals[0].height = "100%";
                item.signals[0].width = "100%";
                item.signals[0].autostart = false;
                item.signals[0].skin = {"name": "bekle"};
              }
              if (item.tipo)
                  ng.channels[item.tipo].push(item);
            });
        };
    }]);

});
