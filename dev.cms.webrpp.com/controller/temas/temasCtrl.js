// Controller : LSITADO DE TEMAS

// 'use strict';

define(['app'], function (app) {
app.register.controller('temasCtrl', [
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
        ng.query = '';
        ng.letra = 'a';
        ng.coleccion = [];
        ng.seleccionArr = [];
        ng.objF = {
            filtroColeccion : ''
        };
        ng.filtroSeleccionTodos = false;
        //Refresh Obj
        var refreshObj = function(){
            ng.newsObj = {
                query : ng.query,
                letra : ng.letra
            };
        };
        ng.seleccionarTema = function(index, model, item){
            if(model){
                ng.seleccionArr.push(item)
            }else{
                var otroItem = ng.seleccionArr.indexOf(item);
                ng.seleccionArr.splice(otroItem, 1);
            }
        };
        ng.abcdario = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
        "L", "LL", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
        "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        ng.seleccionadoAbc = 0;
        ng.ordenAbc = function(abc, index){
            ng.seleccionadoAbc = index;
            ng.coleccion = [];
            ng.newsBusy = false;
            ng.newsAfter = '';
            ng.msjBusy = false;
            ng.query = '';
            ng.objF.filtroColeccion = '';
            ng.letra = $filter('lowercase')(abc);
            ng.obtenerMultimedia(undefined)
        };
        ng.changeMultimediaFiltro = function($event){
            var $event = $event;
            if($event.which === 13) {
                ng.newsBusy = false;
                ng.newsAfter = '';
                ng.msjBusy = false;
                ng.letra = '';
                ng.seleccionadoAbc = -1;
                ng.objF.filtroColeccion = '';
                ng.multimedias = [];
                ng.seleccionArr = [];
                ng.obtenerMultimedia(undefined, 'reload');
            }
        };
        /*
        @init Functions
        */
        //INIT FNC

        ng.initList = function(data) {

            //INFINITE SCROLL LIST
            ng.newsBusy = false;
            ng.newsAfter = '';
            ng.msjBusy = false;
            //Click Guardar
            ng.obtenerMultimedia = function($event, tipo, nuevo) {
                var $event = $event, tipo = tipo, nuevo = nuevo;
                if (ng.newsBusy) return;
                ng.newsBusy = true;
                ng.msjBusy = false;
                refreshObj();
                var DATA = ng.newsObj;
                if(tipo != 'infinite'){
                    ng.coleccion = [];
                    ng.seleccionArr = [];
                }
                $http.post(URL + URLTEMAS + '?cursor=' + ng.newsAfter, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        var response = data.response;
                        for (var i = 0; i < response.length; i++) {
                            response[i].seleccionado = false;
                            ng.coleccion.push(response[i]);
                        }
                        ng.newsAfter = data.last_cursor;
                        ng.newsBusy = false;
                        msjBusy = false;
                        if(response.length <= 0){
                            ng.msjBusy = true;
                        }
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ51,CMSDATA.CMSDATA.POSITIONMSJ);
                        ng.newsBusy = false;
                        ng.msjBusy = true;
                    }
                }).error(function(data) {
                    ng.newsBusy = false;
                    $msj.show(CMSDATA.MSJ.MSJ51, CMSDATA.POSITIONMSJ);
                    ng.msjBusy = true;
                });
            };

            //ng.obtenerMultimedia(undefined);

            ng.newsNextPage = function() {
                ng.obtenerMultimedia(undefined, 'infinite');
            };

            //EDITAR TEMA
            ng.editarTag = function($event, item, $index){
                var $event = $event, DATA = item, $index = $index;
                $preload.show();
                var _id = (DATA._id)?DATA._id:'';
                $location.path('/temas/detalle/' + _id);
                /*$http.post(URL + URLMODIFICARTEMA, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        var response = data.response;
                        response.imagen_branding = (angular.isDefined(response.imagen_branding))?response.imagen_branding:false;
                        response.keyword = (angular.isDefined(response._id))?response._id:"";
                        $rootScope.objTema = {
                            data: { item : item, index : $index },
                            response : response,
                            type : 'editar'
                        }; //Editar
                        $location.path('/temas/detalle');
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ65,CMSDATA.CMSDATA.POSITIONMSJ);
                        $preload.hide();
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ65, CMSDATA.POSITIONMSJ);
                    $preload.hide();
                });*/
            };

            //ASOCIAR TEMAS
            ng.ASOCIAR = undefined;
            ng.asociar = function($event){
                var itemsSeleccionados = ng.seleccionArr;
                $mdDialog.show({
                    targetEvent : $event,
                    templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/temas/asociar.html',
                    controller : modalAsociacionCtrl,
                    locals: {
                        modal : {
                            selecionados: itemsSeleccionados
                        }
                    }
                })
                .then(function() {
                    if(ng.ASOCIAR){
                        ng.seleccionArr = angular.copy(ng.ASOCIAR.selecionados);
                        //UNIR
                        if(ng.ASOCIAR.ir){
                            var DATA = ng.seleccionArr;
                            $http.post(URL + URLUNIRTEMAS, DATA).
                            success(function(data) {
                                var data = data;
                                if (data.status) {
                                    var response = data.response;
                                    console.log(response, 'response');
                                    var _id = (response._id)?response._id:'';
                                    $location.path('/temas/detalle/' + _id);
                                    //$rootScope.objTema = { data : undefined, response: response, type : 'unir' }; //Edit
                                    //$location.path('/temas/detalle');
                                    $preload.hide();
                                } else {
                                    $msj.show(CMSDATA.MSJ.MSJ62,CMSDATA.CMSDATA.POSITIONMSJ);
                                    $preload.hide();
                                }
                            }).error(function(data) {
                                $msj.show(CMSDATA.MSJ.MSJ62, CMSDATA.POSITIONMSJ);
                                $preload.hide();
                            });
                        }
                    }
                }, function() {
                    $mdDialog.cancel();
                });
                function modalAsociacionCtrl(scope, modal, $mdDialog){
                    scope.coleccion = modal.selecionados;
                    angular.forEach(scope.coleccion, function(vector, index){
                        if(index === 0){
                            scope.coleccion[index].primario = true;
                        }else{
                            scope.coleccion[index].primario = false;
                        }
                    });
                    scope.radioColeccion = 0;
                    scope.removeTag = function($event, item, index){
                        if(index === scope.radioColeccion){
                            scope.radioColeccion = 0;
                        }
                        scope.coleccion.splice(index, 1);
                        delete item.primario;
                        var otroItem = ng.coleccion.indexOf(item);
                        ng.coleccion[otroItem].seleccionado = false;
                        if(scope.coleccion.length <= 0){
                            ng.ASOCIAR = {
                                selecionados : [],
                                ir : false
                            };
                            $mdDialog.hide();
                        }
                    };
                    scope.cerrarModal = function(){
                        $mdDialog.cancel();
                    };
                    scope.accionModal = function(){
                        $preload.show();
                        angular.forEach(scope.coleccion, function(vector, index){
                            if(index === scope.radioColeccion){
                                scope.coleccion[index].primario = true;
                            }else{
                                scope.coleccion[index].primario = false;
                            }
                        });
                        ng.ASOCIAR = {
                            selecionados : scope.coleccion,
                            ir : true
                        };
                        $mdDialog.hide();
                    };
                }
            };

            //SELECCIONAR TODOS
            ng.seleccionarTodos = function(_model){
                if(_model){
                    angular.forEach(ng.coleccion, function(v,i){
                        ng.coleccion[i].seleccionado = true;
                        ng.seleccionarTema(i, true, v);
                    });
                }else{
                    angular.forEach(ng.coleccion, function(v,i){
                        ng.coleccion[i].seleccionado = false;
                        ng.seleccionarTema(i, false, v);
                    });
                }
            };

            ng.clickTemaDelDia = function($event){
                $preload.show();
                $location.path('/temas/temadeldia');
            };

            //QUERY ENVIADO POR OTRA VISTA
            if($rootScope.buscarQueryTema){
                var rootBQuery = $rootScope.buscarQueryTema;
                ng.newsBusy = false;
                ng.newsAfter = '';
                ng.msjBusy = false;
                ng.letra = '';
                ng.seleccionadoAbc = -1;
                ng.objF.filtroColeccion = '';
                ng.multimedias = [];
                ng.seleccionArr = [];
                ng.query = rootBQuery.query;
                ng.obtenerMultimedia(undefined);
                $rootScope.buscarQueryTema = undefined;
            }else{
                //QUERY INICIO NORMAL
                ng.obtenerMultimedia(undefined);
            }

        };

    }
]);

});
