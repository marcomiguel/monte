'use strict';

define(['app'], function (app) {

app.register.controller('listadoVideosCtrl', [
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
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$popup',
    function (
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
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $popup
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
        URLLIST = 'listado.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLLISTNEWS = 'redessociales/posts_videos',
        URLEDITNEWS = 'noticias/leer/',
        URLHIGHLIGHT = 'destacadas/',
        URLCOVERS = 'destacadas/list/',
        URLLISTSITE = 'sitio/list',
        URLLISTAUTHOR = 'user',
        URLLISTCATEGORY = 'categoria/index/',
        URLSEARCHITEMS = 'noticias/?suggest=',
        DATA = {},
        TIMERESULT = 1000/2;
        
        ng.mostrarVistaDetalle = function($event, nid){
            // editar o agregar
            nid ? $location.path('/redessociales/video/'+nid) : $location.path('/redessociales/video/');
        };

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
                            $msj.show(CMSDATA.MSJ.MSJ18,positionMSj);
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
                default:
            }
        };

    }
    ]);
});
