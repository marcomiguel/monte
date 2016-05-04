// 'use strict';

define(['app'], function (app) {

app.register.controller('campeonatosDetalleCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$msj', '$timeout', '$logout', '$login', '$localStorage', '$routeParams',
function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $msj, $timeout, $logout, $login, $localStorage, $routeParams) {
	var ng=$scope;
  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    sesion:'session',
    logout:'session/logout',
    campeonato:{
      detalle:'/eventos/leer_campeonato/',
      guardar:'/eventos/guardar_campeonato/'
    }
  };
  var positionMSj = CMSDATA.POSITIONMSJ;

  var nid = $routeParams.nid;

  // ---- INICIO SESION ---- // 
  ng.user = { pictureUrl: false };
  var rechazarSesion=function(){
    $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
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

  var inicializarObjetos=function(){
    ng.campeonato={
      id:'',
      nombre:''
    };
  };

  var obtenerDetalle=function(){
    $preload.show();
    $login.get(URL.base + URL.campeonato.detalle+nid).then(
      function(response) {
        var data=response.response;
        if(response.status){
          if(data){ // evento existe
            inicializarObjetos();
            angular.copy(data, ng.campeonato);
            $preload.hide();
          }else{
            $location.path('/eventos/campeonatos');
          }
        }else{
                    
        }
      },
      function(msgError) {
        
      }
    );
  };

  var verificarDetalle=function(){
    if(nid){ // EDITAR
      obtenerDetalle(nid);
    }else{ // AGREGAR
      inicializarObjetos();
    }
  };

  ng.guardarCampeonato = function(){
    $preload.show();
    $http.post(URL.base + URL.campeonato.guardar+nid, ng.campeonato).
      success(function(response) {
        $preload.hide();
        if(response.status){
          ng.campeonato.id=response.response;
          $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
        }else{
          $preload.hide();
        }
      }).error(function(response) {
          $preload.hide();
          $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
    });
  };

  //FORM
  ng.formOptionSearch = false;
  ng.layerSearch = false;
  $body = angular.element('body');
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
      ng.refresRootDataSearch();

      //RESET LAYER SEARCH
      ng.resetLayerSearch();
      $rootScope.datasearchOutPage = $rootScope.datasearch;
      $location.path('/publicador');
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

  //Close Session
  ng.disabledCloseSession = false;
  ng.closeSession = function() {
    $logout.get(URL.base + URL.logout);
  };

  ng.clicVolver = function(){ $location.path('/eventos/campeonatos'); };

  var init=function(){
    verificarSesion();
  }();
	
}]);

});