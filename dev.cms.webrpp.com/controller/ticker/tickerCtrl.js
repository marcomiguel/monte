// Controller : Create News

// 'use strict';

define(['app'], function (app) {

app.register.controller('tickerCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$create',
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
        $create,
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
            URLCLOSESESSION = 'session/logout',
            URLTICKER = 'ticker',
            URLTICKERSAVE = 'ticker/guardar',
            URLTICKERPUBLISH = 'ticker/publicar',
            DATA = {},
            TIMERESULT = 1000 / 4,
            URLLISTSITELIST = 'sitio/list',
            TIMEWAITBTNDONE = 2000;

        //VAR TOOLS
        var positionMSj = 'top right';
        //SEARCH
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

        ng.ticker = {
            url : ''
        };

        var reviewList = function(index){
            var index = index;
            angular.element('.ul-draggable-ticker .bg-list--id').removeClass('bg-list--id');
            angular.element('#item-id--list' + index).addClass('bg-list--id');
        }

        //INIT FNC
        ng.sitio = null;
        ng.sitios = [];
        ng.listaSitios = function() {
          //Sitios
          $cacheService.get(URL + URLLISTSITELIST).then(function(data) {
            var data = data;
            if (data.status) {
                //SITE
                angular.forEach(data.response, function(v, k){
                  if(v.slug == 'rpp' || v.slug == 'capital'){
                    if(ng.sitios.length==0){
                      ng.sitio = v;
                    }
                    ng.sitios.push(v);
                  }
                });
            } else {
                $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
            }
          }, function(msgError) {
              $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
            }
          );
        };
        ng.listaSitios();

        ng.initList = function(data) {
            ng.formOptionSearch = false;
            ng.layerSearch = false;
            ng.custom = true;

            ng.tickers = [];
            /* OBTENER DATA X SITIO */
            var listaXSitio = function(sitio) {
                var _id = sitio.slug;
                $http.get(URL + 'ticker/?id=' + _id + '/tvticker').
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        var response = data.response;
                        var feed = response.feed;
                        var url = response.url;
                        ng.ticker.url = url;
                        for (var i = 0; i < feed.length; i++) {
                            if (feed[i].drag) {
                                delete feed[i].drag;
                            }
                        }
                        ng.tickers = (feed)?feed:[];
                        $preload.hide();
                        $msj.show(CMSDATA.MSJ.MSJ60,positionMSj);
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ61,positionMSj);
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ61,positionMSj);
                });
            };
            listaXSitio(ng.sitio);
            ng.obtenerDataXSitio = function(){
                $preload.show();
                var _sitio = ng.sitio;
                listaXSitio(_sitio);
            };
            /* END LISTA SECCIONES */

            //CLONE ELEMENT FOR DRAG
            var fileClone = { ticket : '' };
            ng.fileClone = fileClone;
            //DRAG START
            $rootScope.$on('draggable:start', function(evt, obj) {
                var obj = obj,
                    evt = evt;
                var hideClone = function() {
                    ng.fileClone = fileClone;
                    angular.element('#zone-clone').hide();
                };
                var data = obj.data;
                if (data && data.hasOwnProperty('drag')) {
                    ng.fileClone = data;
                } else {
                    hideClone();
                }
            });
            //DRAG END
            $rootScope.$on('draggable:end', function(event, obj, c) {
                var obj = obj;
                ng.fileClone = fileClone;
                angular.element('#zone-clone').show();
                ng.$digest();
            });

            //Reordenamiento Drag and Drop
            ng.onDropComplete = function(index, obj, evt) {
                var obj = obj,
                    index = index,
                    evt = evt;
                if (obj.drag) {
                    ng.tickers[index] = obj;
                    delete ng.tickers[index].drag;
                } //else {
                    //var otherObj = ng.tickers[index];
                    //var otherIndex = ng.tickers.indexOf(obj);
                    //ng.tickers[index] = obj;
                    //ng.tickers[otherIndex] = otherObj;
                //}
                $timeout(function(){
                    reviewList(index);
                },0);

            };
            ng.onDropCompleteOrder = function(index, obj, evt) {
                var obj = obj,
                    index = index,
                    evt = evt;
                if (obj.drag) {
                    delete obj.drag;
                }
                var otherObj = ng.tickers[index];
                var otherIndex = ng.tickers.indexOf(obj);
                if(otherIndex === -1){
                    ng.tickers.splice(index, 0, obj);
                }else{
                    ng.tickers.splice(otherIndex, 1);
                    ng.tickers.splice(index, 0, obj);
                }
                reviewList(index);
            };
            ng.deleteItem = function($event, index, item){
                var index = index, $event = $event;
                var confirmDelete = $mdDialog.confirm({
                    title: 'Confirmación',
                    content: '¿Está seguro que desea eliminar?',
                    ok: 'Aceptar',
                    cancel: 'Cancelar'
                });
                $mdDialog
                .show( confirmDelete ).then(function() {
                    //OK
                    item.drag = 'ticker';
                    if(item.tipo != 'ticker') { /*ng.$broadcast('msgTickerDeleted', item);*/ };
                    if($('#item-id--list' + index).hasClass('bg-list--id')){
                        reviewList(-1);
                    }
                    ng.tickers.splice(index, 1);

                })
                .finally(function() {
                    //Close alert
                    confirmDelete = undefined;
                });
            };
            //SEARCH TICKERS
            ng.$broadcast('triggerBuscarPortadas', true);

            ng.inputEdit = function($event, ind) {
                var $event = $event;
                var elm = angular.element($event.currentTarget);
                var _in = elm.children('.input-edit-inner');
                var _out = elm.children('.input-edit-outer');
                _in.addClass('ng-hide');
                _out.removeClass('ng-hide');
                _out.find('textarea').off('blur').focus().on('blur', function() {
                    _in.removeClass('ng-hide');
                    _out.addClass('ng-hide');
                });
            };

            //ADD TICKER
            ng.tickerNew = '';
            ng.addTicket = function($event){
                var _ticker = ng.tickerNew;
                if(_ticker.length > 1){
                    var _date = new Date();
                    var _obj = {
                        codigo: Math.floor(Math.random()*10001),
                        drag: 'ticker',
                        fecha: $filter('date')(new Date(_date), 'yyyy/MM/dd HH:mm:ss'),
                        sitio: {slug: 'grupo-rpp', nombre: 'Grupo RPP'},
                        ticker: _ticker,
                        tipo: 'ticker',
                        titulo: '',
                        url: ''
                    }
                    ng.tickers.unshift(_obj);
                    ng.tickerNew = '';
                }else{
                    var confirmDelete2 = $mdDialog.confirm({
                        title: 'Confirmación',
                        content: 'Ingresa un texto al TICKER, para poder agregarlo.',
                        ok: 'Aceptar',
                        cancel: 'Cancelar'
                    });
                    $mdDialog
                    .show( confirmDelete2 ).then(function() {
                        //OK
                        confirmDelete2 = undefined;
                    })
                    .finally(function() {
                        //Close alert
                        confirmDelete2 = undefined;
                    });
                }
            };
            ng.enterClick = function($event){
                if ($event.which === 13){
                    ng.addTicket($event);
                }
            };
            /* OPTIONS GENERAL */
            //OBJETO NOTICIAS PORTADA
            var refreshObj = function(){
                //ng.newsObj = (ng.tickers)?ng.tickers:null;
                ng.newsObj = {
                    sitio : ng.sitio,
                    feed: (ng.tickers)?ng.tickers:null
                };
            };

            //Click Guardar
            ng.clickSave = function($event) {
                var $event = $event;
                refreshObj();
                var DATA = ng.newsObj;
                $preload.show();
                $http.post(URL + URLTICKERSAVE, DATA).
                success(function(data) {
                    var data = data;
                    //$timeout(function(){
                    if (data.status) {
                        $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
                        $preload.hide();
                    }
                    //},TIMERESULT);
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ6, positionMSj);
                });
            };

            //PUBLISH
            ng.clickPublish = function($event, type) {
                var $event = $event;
                refreshObj();
                var DATA = ng.newsObj;
                $preload.show();
                $http.post(URL + URLTICKERPUBLISH, DATA).
                success(function(data) {
                    var data = data;
                    //$timeout(function(){
                    if (data.status) {
                        $msj.show(CMSDATA.MSJ.MSJ9,positionMSj);
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ50,positionMSj);
                        $preload.hide();
                    }
                    //},TIMERESULT);
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ50, positionMSj);
                });
            };

            //END FUNCTIONS
        };

    }
]);

});
