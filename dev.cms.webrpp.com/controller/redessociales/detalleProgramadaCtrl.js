'use strict';

define(['app'], function (app) {

app.register.controller('detalleProgramadaCtrl', [
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
    '$bytesToSize',
    '$insertJavascript',
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
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $bytesToSize,
        $insertJavascript
    ) {
        
        //FB
        // $insertJavascript.fb('2.5');

        var ng = $scope,
            nid = $routeParams.nid,
            positionMSj = CMSDATA.POSITIONMSJ,
            URL = {
                base: CMSDATA.GLOBAL.URLBASE,
                sesion: 'session',
                logout: 'session/logout',
                detalle: 'redessociales/leer_posts_detalle/'
            };

        // ---- INICIO SESION ---- // 
        ng.user = { pictureUrl: false };

        var rechazarSesion = function(){
            $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
            delete $localStorage.login;
            $preload.hide();
            $location.path('/');
        };

        var verificarSesion = function(){
            $preload.show();
            $login.get(URL.base + URL.sesion).then(
              function(data) {
                  var data = data;
                  if(data.status){
                      ng.user.pictureUrl = (data.response.foto=="")?false:data.response.foto+"?"+new Date().getTime();
                      verificarDetalle();
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

        // ---- FIN SESION ---- //
            
        // ---- INICIO DETALLE ---- //
        var obtenerDetalle = function(){
            $preload.show();
            $login.get(URL.base + URL.detalle+nid).then(
              function(response) {
                var data=response.response;
                if(response.status){
                  if(data){ // existe
                    inicializarObjetos();
                    angular.copy(data, ng.post);
                    $preload.hide();
                  }else{
                    $location.path('/redessociales/programadas');
                  }
                }else{
                            
                }
              },
              function(msgError) {
                
              }
            );
        };

        var verificarDetalle = function(){
            if(nid){ // EDITAR
              obtenerDetalle(nid);
            }else{ // AGREGAR
              inicializarObjetos();            
            }
        };

        var inicializarObjetos = function(){
            ng.post = {
                titulo: ''
            }    
        };

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
                    $http.post(URL.base + 'redessociales/facebook_actualizar_post', DATA).
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
                        $http.post(URL.base + 'redessociales/eliminar_post', DATA).
                        success(function(data) {
                            var data = data;
                            if(data.status){
                                // reviewHistory();
                                $timeout(function(){
                                    $preload.hide();
                                    $msj.show('Se eliminó correctamente el post.',positionMSj);
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

        // ---- FIN DETALLE ---- //

        ng.clicVolver = function(){ $location.path('/redessociales/programadas'); };

        var init=function(){
            verificarSesion();
        }();

    }
]);

});
