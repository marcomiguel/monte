// Controller : LSITADO DE TEMAS

// 'use strict';

define(['app'], function (app) {

app.register.controller('temadeldiaCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$msj',
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
        $preload,
        $mdDialog,
        $mdToast,
        $timeout,
        $msj,
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
            URLUNIRTEMAS = '/tag/unificar',
            URLCLOSESESSION = 'session/logout',
            URLMODIFICARTEMA = 'tag/leer',
            URLLISTSITE = 'sitio/list',
            URLSEARCHTAG = 'tag/search/',
            URLSAVESEARCHTHEME = 'tag/guardartema',
            URLSAVEREAD = 'tag/portadatemas_leer/',
            URLTEMAS = 'tag',
            DATA = {},
            TIMERESULT = 1000 / 4,
            TIMEWAITBTNDONE = 2000;

        //FLAG DISABLED SESSION
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;

        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
            function(data) {
                var data = data;
                if (data.status) {
                    ng.initList(data);
                    $preload.hide();
                } else {
                    $msj.show(CMSDATA.MSJ.MSJ0, CMSDATA.POSITIONMSJ);
                    delete $localStorage.login;
                    $preload.hide();
                    $location.path('/');
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ0, CMSDATA.POSITIONMSJ);
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
        ng.layerSearch = false;
        ng.custom = true;
        /*
        @init Functions
        */
        //INIT FNC
        $scrollGo.go('#contentbodycenter');
        ng.initList = function(data) {

            ng.changeMultimediaFiltro = function($event){
                var $event = $event;
                if($event.which === 13) {
                    var query = ng.query;
                    $rootScope.buscarQueryTema = { query: query };
                    ng.backToList();
                }
            };

            //LIST SITES
            ng.sitio = undefined;
            ng.sitios = [];
            ng.cargaSitios = function() {
                //Sites
                $cacheService.get(URL + URLLISTSITE)
                .then(
                    function (data) {
                        var data = data;
                        if(data.status){
                            //SITE
                            var response = data.response;
                            ng.sitios = response;
                            ng.sitios.unshift({
                                _id: 'ninguna',
                                nombre: 'Ninguna',
                                slug: 'ninguna'
                            })
                            ng.sitio = response[1];
                            ng.cambiarSitio(undefined);
                        }else{
                            $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
                        }
                    },
                    function(msgError) {
                        $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
                    }
                );
            };
            ng.cargaSitios();

            //CMABIAR SITIO
            ng.cambiarSitio = function($event){
                if(ng.sitio.slug === 'ninguna'){
                    //NINGUNA
                    ng.temaDia = [];
                    ng.temasDia = [];
                }else{
                    //CAMBIO DE SITIO
                    var DATA = {
                        sitio : ng.sitio
                    };
                    $preload.show();
                    //$http.post(URL + URLSAVESEARCHTHEME, DATA).
                    $http.get(URL + URLSAVEREAD + ng.sitio.slug).
                    success(function(data) {
                        var data = data;
                        if (data.status) {
                            // console.log(data, 'data');
                            ng.temasDia = (data.response.tags)?data.response.tags:[];
                            ng.searchText2 = '';
                            $preload.hide();
                        } else {
                            $msj.show(CMSDATA.MSJ.MSJ71, CMSDATA.POSITIONMSJ);
                            $preload.hide();
                        }
                    }).error(function(data) {
                        $msj.show(CMSDATA.MSJ.MSJ71, CMSDATA.POSITIONMSJ);
                        $preload.hide();
                    });
                }
            };

            ng.temaDia = [];
            ng.temasDia = [];
            /*
            ng.cargaTemasDia = function(){
                $http.get(URL + URLSEARCHTAG + '').
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        console.log(data, 'data');
                        ng.temasDia = data.response;
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ69, CMSDATA.POSITIONMSJ);
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ69, CMSDATA.POSITIONMSJ);
                });
            };
            ng.cargaTemasDia();
            */

            //Autocomplete

            ng.selectedItem  = null;
            ng.searchText2 = null;
            ng.querySearch   = function(query){
              return $http.get(URL + URLSEARCHTAG + query)
              .then(function(result){
                return $.map(result.data.response, function (n, i) { return n.nombre; ng.$digest(); });
              })
            };

            ng.changeQuerySearch = function(item){
                // console.log(item, 'item');
                var chip = item;
                if(chip || chip.length > 0){
                    ng.temasDia.push({
                      nombre: chip,
                      slug : chip.split(' ').join('-').toLowerCase()
                    });
                    ng.searchText2 = '';
                }
            };
            ng.clickChipLegend = function(item, $index){
                ng.temasDia.splice($index, 1);
            };

            //PUBLISH TAGS
            ng.guardarTemasDia = function($event){
                var DATA = {
                    sitio : ng.sitio,
                    temas_dia : ng.temasDia
                };
                $preload.show();
                $http.post(URL + URLSAVESEARCHTHEME, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        // console.log(data, 'data');
                        $msj.show(CMSDATA.MSJ.MSJ72, CMSDATA.POSITIONMSJ);
                        $preload.hide();
                        //ng.temasDia = data.response;
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ70, CMSDATA.POSITIONMSJ);
                        $preload.hide();
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ70, CMSDATA.POSITIONMSJ);
                    $preload.hide();
                });
            };

            ng.backToList = function(){
                $location.path('/temas');
            };

            $scope.dragoverCallback = function(event, index, external, type) {
                $scope.logListEvent('dragged over', event, index, external, type);
                // Disallow dropping in the third row. Could also be done with dnd-disable-if.
                return index < 10;
            };

            $scope.dropCallback = function(event, index, item, external, type, allowedType) {
                $scope.logListEvent('dropped at', event, index, external, type);
                if (external) {
                    if (allowedType === 'itemType' && !item.label) return false;
                    if (allowedType === 'containerType' && !angular.isArray(item)) return false;
                }
                return item;
            };

            $scope.logEvent = function(message, event) {
                // console.log(message, '(triggered by the following', event.type, 'event)');
                // console.log(event);
            };

            $scope.logListEvent = function(action, event, index, external, type) {
                var message = external ? 'External ' : '';
                message += type + ' element is ' + action + ' position ' + index;
                $scope.logEvent(message, event);
            };

            $scope.model=[];

            // Generate initial model
            for (var i = 1; i <= 3; ++i) {
                console.log(i,'iiii');
                $scope.model.push({label: "Item A" + i});
            }

            // Model to JSON for demo purpose
            $scope.$watch('model', function(model) {
                $scope.modelAsJson = angular.toJson(model, true);
            }, true);

        };

    }
]);

});
