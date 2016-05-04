// Controller : List Streaming

// 'use strict';

define(['app'], function (app) {

app.register.controller('streamingCtrl', [
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
//        $q,
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
                URLSESSION = 'session',
                URLCLOSESESSION = 'session/logout',
                URLPLAYER = 'player',
                URLRESTRI = URLPLAYER + '/tiempo',
                URLCONFIG = URLPLAYER + '/config',
                URLLISTSITELIST = 'sitio/list';
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

        ng.currentObj = {sitio: "", sitio_url: "", tipo: "", fuentes: [], restrictions: []};
        ng.days = {1: 'Lunes', 2: 'Martes', 3: 'Miercoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 0: 'Domingo'};
        ng.timePickerOptions = {step: 20, timeFormat: 'H:i', appendTo: 'body'};
        ng.items = [
            {'slug': 1, 'nombre': 'Lunes'},
            {'slug': 2, 'nombre': 'Martes'},
            {'slug': 3, 'nombre': 'Miércoles'},
            {'slug': 4, 'nombre': 'Jueves'},
            {'slug': 5, 'nombre': 'Viernes'},
            {'slug': 6, 'nombre': 'Sábado'},
            {'slug': 0, 'nombre': 'Domingo'}
        ];
        ng.tipos = [
            {'slug': 'radio', 'nombre': 'Radio'},
            {'slug': 'cabina', 'nombre': 'Cabina'},
            {'slug': 'tv', 'nombre': 'TV'},
            {'slug': 'livestream', 'nombre': 'Livestream'}
        ];

        ng.sitios = []; //Bar Tool
        //Sites

        $cacheService.get(URL + URLLISTSITELIST).then(
                function (data) {
                    var data = data;
                    if (data.status) {
                        ng.sitios = data.response;
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                    }
                },
                function (msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
        );

        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
                function (data) {
                    var data = data;
                    if (data.status) {
                        ng.user.pictureUrl = (data.response.foto == "") ? false : data.response.foto + "?" + new Date().getTime();
                        ng.initList(data);
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                        delete $localStorage.login;
                        $preload.hide();
                        $location.path('/');
                    }
                },
                function (msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                    delete $localStorage.login;
                    $preload.hide();
                    $location.path('/');
                }
        );

        ng.changeSitio = function () {
            angular.forEach(ng.sitios, function (v) {
                if (v.slug == ng.currentObj.sitio) {
                    ng.currentObj.sitio_url = v.url;
                }
            });
        };

        //Close Session
        ng.closeSession = function () {
            $logout.get(URL + URLCLOSESESSION);
        };

        //INIT FNC
        ng.toggleRight = function (r) {
            ng.clearRestriction();
            var data = angular.copy(r);
            //limpiar campos de nueva restriccion
            ng.editConfig = true;

            ng.config = {start_time: null, end_time: null, selected: []};

            ng.currentObj = {sitio: "", sitio_url: "", tipo: "", fuentes: [], restrictions: []};
            ng.currentObj.pid = data.pid;
            ng.currentObj.sitio = data.sitio;
            ng.currentObj.sitio_url = data.sitio_url;
            ng.currentObj.tipo = data.tipo;
            ng.currentObj.restrictions = data.tiempo;

            angular.forEach(data.media, function (item) {
                ng.currentObj.fuentes.push({'file': item});
            });

            $mdSidenav('right').toggle();
        };

        ng.openCreateStreaming = function ($event) {
            ng.editConfig = false;
            ng.config = {start_time: null, end_time: null, selected: []};
            ng.currentObj = {sitio: "", sitio_url: "", tipo: "", fuentes: [], restrictions: []};
            $mdSidenav('right').toggle();
        };

        ng.close = function () {
            ng.editConfig = false;
            $mdSidenav('right').close();
        };

        ng.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1)
                list.splice(idx, 1);
            else {
                list.push(item);
                list.sort();
            }
        };

        ng.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        ng.currentObj.fuentes
        var getIndex = function (item, list) {
            var idx = -1;
            var item_id = item.sitio + '_' + item.tipo;
            for (var i in list) {
                idx++;
                if (list[i].id == item_id) {
                    return idx;
                }
            }
            return idx;
        };

        ng.clearFuentes = function () {
            angular.forEach(ng.currentObj.fuentes, function (v, k) {
                if (v.file === "") {
                    ng.currentObj.fuentes.splice(k, 1);
                }
            });
        };

        ng.saveConfig = function () {
            ng.saveProgress = true;
            ng.clearFuentes();
            if (ng.currentObj.sitio && ng.currentObj.tipo && ng.currentObj.fuentes.length > 0) {
                var data = null;
                if (ng.currentObj.pid) {
                    data = {'pid': ng.currentObj.pid, 'tipo': ng.currentObj.tipo, 'sitio': ng.currentObj.sitio, 'sitio_url': ng.currentObj.sitio_url, 'data': ng.currentObj.fuentes};
                } else {
                    data = {'tipo': ng.currentObj.tipo, 'sitio': ng.currentObj.sitio, 'sitio_url': ng.currentObj.sitio_url, 'data': ng.currentObj.fuentes};
                }
                $http.post(URL + URLCONFIG, data).success(function (data, status, headers, config) {
                    var data = data;
                    if (data.status) {                     
                        var idx = getIndex(ng.currentObj, ng.players);
                        var obj = ng.players[idx];
                        obj.tipo = ng.currentObj.tipo;
                        obj.sitio = ng.currentObj.sitio;
                        obj.sitio_url = ng.currentObj.sitio_url;
                        obj.media = [];
                        angular.forEach(ng.currentObj.fuentes, function (v, k) {
                            obj.media.push(v.file);
                        });
                        sort_channels();
                        ng.saveProgress = false;
                        $msj.show(data.response.op, positionMSj);
                        get_players();
                    } else {
                        $msj.show(data.response.op, positionMSj);
                        ng.saveProgress = false;
                    }
                }).error(function (data, status, headers, config) {
                    $msj.show(CMSDATA.MSJ.MSJ59, positionMSj);
                    ng.saveProgress = false;
                });
            } else {
                $msj.show(CMSDATA.MSJ.MSJ91, positionMSj);
            }
        };

        ng.validateRestriction = function () {
            var ret = true;
            angular.forEach(ng.currentObj.restrictions, function (item) {
                if (item.start_time && item.end_time && item.selected.length > 0) {

                } else {
                    ng.edit_element = true;
                    $msj.show("Favor validar bloqueo, completar informacion.", positionMSj);
                    ng.config.start_time = new Date(item.start_time);
                    ng.config.end_time = new Date(item.end_time);
                    ng.config.selected = item.selected;
                    ret = false;
                    return false;
                }
            });
            return ret;
        };

        ng.clearRestriction = function () {
            ng.config = {start_time: null, end_time: null, selected: []};
            ng.edit_element = false;
        };

        ng.addRestriction = function () {
            if (ng.config.start_time && ng.config.end_time && ng.config.selected.length > 0) {
                ng.currentObj.restrictions.push({
                    start_time: ng.config.start_time,
                    end_time: ng.config.end_time,
                    selected: ng.config.selected
                });
                ng.config = {start_time: null, end_time: null, selected: []};
            }
        };

        ng.saveRestriction = function () {

            if (ng.config.start_time && ng.config.end_time && ng.config.selected.length == 0) {
                $msj.show("Debe seleccionar los dias de bloqueo.", positionMSj);
//            } else if (ng.config.start_time || ng.config.end_time || ng.config.selected.length > 0) {
//                $msj.show("Debe completar la restriccion o click en limpiar para continuar.", positionMSj);
            } else {
                if (ng.validateRestriction()) {
                    ng.clearRestriction();
                    ng.saveProgress = true;
                    $http.post(URL + URLRESTRI, {'pid': ng.currentObj.pid, 'data': ng.currentObj.restrictions}).
                            success(function (data, status, headers, config) {

                                if (data.status) {
                                    var idx = getIndex(ng.currentObj, ng.players);
                                    console.log("idx: " + idx);
                                    var obj = ng.players[idx];
                                    console.log(obj);
                                    obj.tiempo = ng.currentObj.restrictions;
                                    ng.saveProgress = false;
                                    $msj.show(data.response.op, positionMSj);
                                    get_players();
                                } else {
                                    $msj.show(data.response.op, positionMSj);
                                    ng.saveProgress = false;
                                }

                            }).error(function (data, status, headers, config) {
                        $msj.show(CMSDATA.MSJ.MSJ59, positionMSj);
                        ng.saveProgress = false;
                    });
                }
            }
        };

        ng.editRestriction = function (index, obj) {
            ng.config = obj;
            ng.config.start_time = new Date(obj.start_time);
            ng.config.end_time = new Date(obj.end_time);
            ng.edit_element = true;
        };

        ng.deleteRestriction = function (index) {
            ng.currentObj.restrictions.splice(index, 1);
        };

        ng.addSource = function () {
            ng.currentObj.fuentes.push({"file": ""});
        };

        ng.deleteSource = function (idx) {
            ng.currentObj.fuentes.splice(idx, 1);
        };

        ng.initList = function (data) {
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
        };

        //OPEN PERFIL
        ng.openPerfil = function ($event, name) {
            $location.path('/perfil');
        };

        ng.openApps = function ($event, name) {
            var _name = name;
            $location.path(_name);
        };




        var get_players = function () {
            ng.players = [];
            ng.media = '';
            ng.playerMedia = [];

            var players_url = URL + URLPLAYER;
            ng.players = [];
            $http.get(players_url).success(function (data) {
                if (data.status) {
                    if (data.response.length > 0) {
                        angular.forEach(data.response, function (v, k) {
                            ng.playerMedia = [];
                            angular.forEach(v.media, function (v, k) {
                                ng.media = {'file': v};
                                ng.playerMedia.push(ng.media);
                            });
                            v.sources = ng.playerMedia;
                            ng.players.push(v);
                        });
                    }
                    sort_channels();
                }
            });
        };

        var sort_channels = function () {
            ng.channels = {'radio': [], 'cabina': [], 'tv': [], 'livestream': []};

            angular.forEach(ng.players, function (item) {
                item.image = "";
                item.primary = "html5";
                item.height = "100%";
                item.width = "100%";
                item.autostart = false;
                item.skin = {"name": "bekle"};
                if (item.tipo)
                    ng.channels[item.tipo].push(item);
            });
        };
    }]);

});
