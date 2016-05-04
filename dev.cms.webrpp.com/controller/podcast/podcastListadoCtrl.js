// 'use strict';

define(['app'], function (app) {

app.register.controller('podcastListadoCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$msj', '$timeout', '$logout', '$login', '$localStorage',
function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $msj, $timeout, $logout, $login, $localStorage) {
	
  var ng=$scope;

  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    sesion:'session',
    logout:'session/logout',
    listar: 'podcast',
    eliminar:'podcast/eliminar/',
    // buscar:'eventos/buscar_evento/'
  };

  var inicializarObjetos=function(){
    //listas
    ng.lista=[];
    
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
              obtenerLista();
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

  // ---- INICIO HEADER ---- //
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

  // ---- INICIO LISTADO ---- // 

  var obtenerLista = function(){
    ng.lista = [];
    // $preload.show();
    ng.searchLoad=true;
    $http.get(URL.base + URL.listar).success(function(response){
        var data=response.response;
        if(response.status){
          angular.copy(data, ng.lista);
          // $preload.hide();
          ng.searchLoad=false;
        }
    });
  };

  // ---- FIN LISTADO ---- //

  //Eliminar
  ng.openDeleteNew = function($event, item, index) {
      var $event = $event, index = index;
      var confirmDelete = $mdDialog.confirm({
          title: 'Confirmación',
          content: '¿Está seguro que desea eliminar el Podcast "'+item.nombre+'"?',
          ok: 'Aceptar',
          cancel: 'Cancelar'
      });
      $mdDialog
      .show( confirmDelete ).then(function() {
          //OK
          $preload.show();
          deleteNewInList(item, index);
      })
      .finally(function() {
          //Close alert
          confirmDelete = undefined;
      });
  };

  var deleteNewInList = function(item, index){
      var index = index;
      if(item.pcid){
          //Edit noticia
          $http.delete(URL.base + URL.eliminar + item.pcid).
          success(function(data) {
              var data = data;
              if(data.status){
                  ng.lista.splice(index,1)
                  $preload.hide();
              }else{
                  $preload.hide();
                  $msj.show(data.message,CMSDATA.POSITIONMSJ);
              }
          }).error(function(data) {
              $preload.hide();
              $msj.show(CMSDATA.MSJ.MSJ8,CMSDATA.POSITIONMSJ);
          });
      }else{
          //Create nueva noticia
          $preload.hide();
          $msj.show(CMSDATA.MSJ.MSJ8,CMSDATA.POSITIONMSJ);
      }
  };


  ng.mostrarVistaDetalle = function($event, nid){
    $preload.show();
    // editar o agregar
    nid?$location.path('/podcast/detalle/'+nid):$location.path('/podcast/detalle/');
  };

  //Close Session
  ng.disabledCloseSession = false;
  ng.closeSession = function() {
    $logout.get(URL.base + URL.logout);
  };

  var init=function(){
    verificarSesion();
  }();
	
}]);

});