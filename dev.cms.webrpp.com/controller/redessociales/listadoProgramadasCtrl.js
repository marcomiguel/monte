'use strict';

define(['app'], function (app) {

  app.register.controller('listadoProgramadasCtrl', [
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
    '$popup',
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
      $log,
      $popup
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
        URLLIST = 'listado.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLLISTNEWS = 'redessociales/posts/programado',
        URLEDITNEWS = 'noticias/leer/',
        URLHIGHLIGHT = 'destacadas/',
        URLCOVERS = 'destacadas/list/',
        URLLISTSITE = 'sitio/list',
        URLLISTAUTHOR = 'user',
        URLLISTCATEGORY = 'categoria/index/',
        URLSEARCHITEMS = 'noticias/?suggest=',
        DATA = {},
        TIMERESULT = 1000/2;

        //FORM
        ng.formOptionSearch = false;
        ng.layerSearch = false;
        var $body = angular.element('body');
        ng.custom = true;
        ng.btnOpenFilter = function($event){
            var $elm = angular.element($event.target),
            $frm = angular.element('#contentSearch');
            ng.custom = ng.custom === false ? true: false;
            if(ng.custom){
                ng.formOptionSearch = false;
                $frm.removeClass('focus');
                ng.layerSearch = false;
                //$body.css('overflow', 'visible');
            }else{
                ng.formOptionSearch = true;
                $frm.addClass('focus');
                ng.layerSearch = true;
                //$body.css('overflow', 'hidden');
            }
        };
        ng.hideLayer = function($event){
            var $elm = angular.element($event.target);
            //RESET LAYER SEARCH
            ng.resetLayerSearch();
        };

        ng.searchFilterNews = function($event){
            //REFRESH rootScope DATASEARCH
            ng.refresRootDataSearch('self');

            //RESET LAYER SEARCH
            ng.resetLayerSearch();

            $event.preventDefault();
            //$body.css('overflow', 'visible');
        };
        ng.resetLayerSearch = function(){
            $frm = angular.element('#contentSearch');
            ng.formOptionSearch = false;
            $frm.removeClass('focus');
            ng.layerSearch = false;
            ng.custom = true;
        };

        //AUTOCOMPLETE SEARCH
        ng.getItemsSearch = function($event, searchText){
            return $http.get(URL + URLSEARCHITEMS + searchText).then(function(response){
                return response.data.response; // USUALLY response.data
            })
        };

        //LIST SITES
        ng.filterSite = undefined;
        ng.filterSites = [];
        ng.loadSite = function() {
            //Sites
            $cacheService.get(URL + URLLISTSITE)
            .then(
                function (data) {
                    var data = data;
                    if(data.status){
                        //SITE
                        ng.filterSites = data.response;
                        ng.filterSites.unshift({
                            nombre: 'Grupo RPP',
                            slug : 'grupo-rpp'
                        });
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ17, CMSDATA.POSITIONMSJ);
                    }
                },
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ17, CMSDATA.POSITIONMSJ);
                }
            );
        };
        ng.loadSite();

        //WATCH $rootScope DATA SEARCH
        ng.DATA = {
            texto: '',
            sitio: '',
            desde: CMSDATA.FILTER.desde,
            hasta: CMSDATA.FILTER.hasta
        };

        //INFINITE SCROLL LIST NEWS
        ng.newsItems = [];
        ng.newsBusy = false;
        ng.newsAfter = '';
        ng.msjBusy = false;
        var limitNews = 0;
        ng.disabledSearch = false;
        ng.total_rows = undefined;
        ng.newsNextPage = function(type){
            if (ng.newsBusy) return;
            ng.newsBusy = true;
            ng.msjBusy = false;
            ng.disabledSearch = true;
            $http.post(URL + URLLISTNEWS + '?cursor=' + ng.newsAfter, ng.DATA).
            success(function(data) {
                //$timeout(function(){
                    if(data.status){
                        var items = data.response;
                        if(type==="search"){ng.total_rows = data.total_rows;}
                        if(items.length > 0){
                            for (var i = 0; i < items.length; i++) {
                                ng.newsItems.push(items[i]);
                            }
                            //ng.newsAfter = (ng.newsItems[ng.newsItems.length-1]).nid;
                            ng.newsAfter = data.last_cursor;
                            ng.newsBusy = false;
                            ng.showLoadListNew = false;
                            ng.msjBusy = false;
                            ng.disabledSearch = false;
                        }else{
                            $msj.show(CMSDATA.MSJ.MSJ18, CMSDATA.POSITIONMSJ);
                            //ng.newsAfter = (ng.newsItems[ng.newsItems.length-1]).nid;
                            ng.newsBusy = false;
                            ng.msjBusy = true;
                            ng.disabledSearch = false;
                        }
                    }else{
                        noValidForm();
                        ng.msjBusy = false;
                        ng.disabledSearch = false;
                    }
                //},TIMERESULT);
            }).error(function(data) {
                //$timeout(function(){
                    noValidForm();
                    // ng.msjBusy = false;
                    ng.disabledSearch = false;
                //},TIMERESULT);
            });
        };

        var tiggerSearch = function(DATA){
            ng.DATA = DATA;
            ng.newsItems = [];
            ng.newsBusy = false;
            ng.newsAfter = '';
            var limitNews = 0;
            ng.newsNextPage('search');
        };

        tiggerSearch(ng.DATA);

        ng.openRSShare = function($event, post, type){
            var post = post, type = type, DATA = { id : post._id, message : post.message, page_id : post.page_id };
            switch (type) {
                case 'share':
                    var closeCallback = function(){ return false; };
                    var permalink = post.permalink, permalink = post.permalink, page_id = 'rpp' + page_id;
                    $popup.open(permalink, page_id, '1000', '500', closeCallback);
                    break;
                case 'edit':
                    $preload.show();
                    var DATA = DATA;
                    $http.post(URL + 'redessociales/facebook_actualizar_post', DATA).
                    success(function(data) {
                        var data = data;
                        if(data.status){
                            // reviewHistory();
                            $timeout(function(){
                                $preload.hide();
                                $msj.show('Se actualizo el texto del post correctamente.',positionMSj);
                                // obtenerDetalle(nid);
                            },1500);
                        }
                        $preload.hide();
                    }).error(function(err) {
                        $preload.hide();
                        $msj.show('Ocurrio un error al actualizar.',CMSDATA.POSITIONMSJ);
                    });
                    break;
                case 'delete':
                    var DATA = DATA;
                    var $event = $event;
                    var confirmDeleteRS = $mdDialog.confirm({
                        title: 'Confirmación',
                        content: '¿Está seguro que desea eliminar?',
                        ok: 'Aceptar',
                        cancel: 'Cancelar'
                    });
                    $mdDialog
                    .show( confirmDeleteRS ).then(function() {
                        //OK
                        $preload.show();
                        $http.post(URL + 'redessociales/eliminar_post', DATA).
                        success(function(data) {
                            var data = data;
                            if(data.status){
                                // reviewHistory();
                                $timeout(function(){
                                    $preload.hide();
                                    $msj.show('Se eliminó correctamente el post.',CMSDATA.POSITIONMSJ);
                                },1500);
                            }
                            $preload.hide();
                        }).error(function(err) {
                            $preload.hide();
                            $msj.show('Ocurrio un error al eliminar.',CMSDATA.POSITIONMSJ);
                        });
                    })
                    .finally(function() {
                        //Close alert
                        confirmDeleteRS = undefined;
                    });
                    break;
                default:
            }
        };

        ng.mostrarVistaDetalle = function($event, nid){
            // editar o agregar
            nid ? $location.path('/redessociales/programada/'+nid) : $location.path('/redessociales/programada/');
        };

    }
]);

});
