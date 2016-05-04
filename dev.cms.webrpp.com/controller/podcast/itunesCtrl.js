'use strict';

define(['app'], function (app) {

  app.register.controller('itunesCtrl', 
    [
      '$scope', 
      '$rootScope', 
      '$location', 
      '$preload', 
      '$http', 
      '$mdDialog', 
      '$msj', 
      '$timeout', 
      '$logout', 
      '$login', 
      '$localStorage',
      function (
        $scope, 
        $rootScope, 
        $location, 
        $preload, 
        $http, 
        $mdDialog, 
        $msj, 
        $timeout, 
        $logout, 
        $login, 
        $localStorage) {
  	
        var ng=$scope;

        var URL = {
          base: CMSDATA.GLOBAL.URLBASE,
          sesion:'session',
          logout:'session/logout',
          itunes:'https://itunes.apple.com/search'
        };

        var inicializarObjetos=function(){
          ng.txtBuscar='';
          //listas
          ng.lista=[];
          ng.previsualizar='';
        };

        // ---- INICIO SESION ---- //
        ng.user = { pictureUrl: false };
        
        var rechazarSesion=function(){
          $msj.show(CMSDATA.MSJ.MSJ0, CMSDATA.POSITIONMSJ);
          delete $localStorage.login;
          $preload.hide();
          $location.path('/');
        };
        
        var verificarSesion=function(){
          $preload.show();
          $login.get(URL.base + URL.sesion).then(
            function(data) {
                var data = data;
                if(data.status){
                    ng.user.pictureUrl = (data.response.foto=="")?false:data.response.foto+"?"+new Date().getTime();
                    inicializarObjetos();
                    $preload.hide();
                }else{
                  rechazarSesion();          
                }
            },
            function(msgError) {
                rechazarSesion();
            }
          );
        };

        //Close Session
        ng.disabledCloseSession = false;
        ng.closeSession = function() {
          $logout.get(URL.base + URL.logout);
        };

        // ---- FIN SESION ---- //

        // ---- INICIO HEADER ---- //
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
            $event.preventDefault();
            ng.resetLayerSearch();
            buscarEvento();
        };
        ng.resetLayerSearch = function(){
            $frm = angular.element('#contentSearch');
            ng.formOptionSearch = false;
            $frm.removeClass('focus');
            ng.layerSearch = false;
            ng.custom = true;
        };

        ng.filterText = '';
        var fechaDesdeGlobal = (new Date()).adjustDate(-2190); //6Años
        ng.filterFrom = fechaDesdeGlobal; //-365 DAYs
        ng.filterTo = CMSDATA.FILTER.hasta;

        // ---- FIN HEADER ---- //

        // ---- INICIO LISTADO ITUNES ---- //
        ng.listaCanciones=[];
        ng.buscarItunes=function(){
          // ng.listaCanciones=[];
          var onSearchComplete = function(response){
              console.log(response, 'rrrr');
              var items = response.data.results;
              if(items.length > 0){
                  for (var i = 0; i < items.length; i++) {
                      ng.listaCanciones.push(items[i]);
                      console.log(items[i], 'iii');
                  }
                  // ng.newsAfter = data.last_cursor;
                  ng.newsBusy = false;
                  ng.showLoadListNew = false;
                  ng.msjBusy = false;
              }else{
                  $msj.show(CMSDATA.MSJ.MSJ18, CMSDATA.POSITIONMSJ);
                  ng.newsBusy = false;
                  ng.msjBusy = true;
              }

          }
          var onError = function(reason){
              console.log(resason,'eeeeee');
          }
          $http.jsonp(URL.itunes, {
              params: {
                  'callback': 'JSON_CALLBACK',
                  'term': ng.txtBuscar,
                  'limit': 6
              }
          // returns a promise. when returned, .then perform action..
          }).then(onSearchComplete, onError)
        };
        // ---- FIN LISTADO ITUNES ---- //

        ng.count=0;
        ng.cambiarPrevisualizar=function($event,urlCancion){
          $event.preventDefault();
          ng.count++;
          var result_container=angular.element('#resultados');
          $('.player').remove();
          $('<audio class="player" id="player-'+ng.count+'" controls autoplay></audio>').insertBefore(result_container);
          $('#player'+ng.count).children().remove();
          $('#player-'+ng.count).append('<source src="'+urlCancion+'" type="audio/mp4">').get(0).play();
          ng.previsualizar=urlCancion;
        };

        // Scroll Infinito //
        var TIMERESULT = 1000/2;
        ng.newsBusy = false;
        ng.newsAfter = '';
        ng.msjBusy = false;
        var limitNews = 0;
        ng.newsNextPage = function() {
            if (ng.newsBusy) return;
            ng.newsBusy = true;
            ng.msjBusy = false;
            console.log('aaaaaaa');
            // $http.post(URL.base + URL.evento.detalle + '?cursor=' + ng.newsAfter, nid).
            // success(function(data) {
            //     var data = data;
            //     $timeout(function(){
            //         if(data.status){
            //             var items = data.response[0].incidencias;
            //             if(items.length > 0){
            //                 for (var i = 0; i < items.length; i++) {
            //                     ng.evento.incidencias.push(items[i]);
            //                 }
            //                 ng.newsAfter = data.last_cursor;
            //                 ng.newsBusy = false;
            //                 ng.showLoadListNew = false;
            //                 msjBusy = false;
            //             }else{
            //                 $msj.show(CMSDATA.MSJ.MSJ18,positionMSj);
            //                 ng.newsBusy = false;
            //                 ng.msjBusy = true;
            //             }
            //         }else{
            //             // noValidForm();
            //             ng.msjBusy = false;
            //         }
            //     },TIMERESULT);
            // }).error(function(data) {
            //     $timeout(function(){
            //         // noValidForm();
            //         ng.msjBusy = false;
            //     },TIMERESULT);
            // });
          
            ng.buscarItunes();

        };
        // /Scroll Infinito //


        var init=function(){
          verificarSesion();
        }();
  	
      }
    ]
  );

});