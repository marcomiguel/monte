// 'use strict';

define(['app'], function (app) {

app.register.controller('campeonatosListadoCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$msj', '$timeout', '$logout', '$login', '$localStorage', '$bytesToSize',
function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $msj, $timeout, $logout, $login, $localStorage, $bytesToSize) {
	var ng=$scope;
  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    sesion:'session',
    logout:'session/logout',
    campeonatos:{
      listar:'/eventos/lista_campeonatos/'
    }
  };
  var positionMSj = CMSDATA.POSITIONMSJ;

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
              listarCampeonatos();
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

  ng.listaCampeonatos=[];
  ng.filtroColeccion='';

  var listarCampeonatos=function(){
    $preload.show();
    $login.get(URL.base + URL.campeonatos.listar).then(
      function(response) {
        if(response.status){
          var data=response.response
          angular.forEach(data, function(val,key){
            ng.listaCampeonatos.push(val);
          });
          $preload.hide();
        }else{
                    
        }
      },
      function(msgError) {
        
      }
    );
  };

  ng.mostrarVistaDetalle = function($event, nid){
    $preload.show();
    $rootScope.objMerge = undefined;
    // editar o agregar
    nid?$location.path('/eventos/campeonato/'+nid):$location.path('/eventos/campeonato/');
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

  ng.clicVolver = function(){ $location.path('/eventos/'); };

  ng.mostrarVistaEditarEquipo=function(idEquipo){
    $preload.show();
    // editar o agregar
    idEquipo?$location.path('/eventos/equipo/'+idEquipo):$location.path('/eventos/equipo/');
  };

  var init=function(){
    verificarSesion();
  }();
	
}]);

});