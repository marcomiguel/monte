// 'use strict';

define(['app'], function (app) {

app.register.controller('equiposDetalleCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$msj', '$timeout', '$logout', '$login', '$localStorage', '$bytesToSize', '$routeParams',
function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $msj, $timeout, $logout, $login, $localStorage, $bytesToSize, $routeParams) {
	var ng=$scope;
  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    sesion:'session',
    logout:'session/logout',
    upload:'eventos/subir_escudo/',
    campeonato:{
      listar:'eventos/lista_campeonatos/'
    },
    equipo:{
      detalle:'/eventos/leer_equipo/',
      guardar:'/eventos/guardar_equipo/'
    }
  };
  var positionMSj = CMSDATA.POSITIONMSJ;
  ng.urlEscudos=CMSDATA.GLOBAL.URLESCUDO;

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

  var obtenerDetalle=function(){
    $preload.show();
    $login.get(URL.base + URL.equipo.detalle+nid).then(
      function(response) {
        var data=response.response;
        if(response.status){
          if(data){ // evento existe
            inicializarObjetos();
            listarCampeonatos();
            angular.copy(data, ng.equipo);
            
            $preload.hide();
          }else{
            $location.path('/eventos/equipos');
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
      listarCampeonatos();
    }
  };

  var inicializarObjetos=function(){
    ng.listaCampeonatos=[];
    ng.equipo={
      id:'',
      nombre:'',
      escudo:'',
      idcampeonato:null
    };
  };

  var listarCampeonatos=function(){
    $preload.show();
    $login.get(URL.base + URL.campeonato.listar).then(
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

  var guardarImagen = function(data,idxIncidencia){
      $preload.show();
      $http.post(URL.base+URL.upload, data, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined} /* multipart/form-data */
      }).
      success(function(data) {
          var data = data;
          if(data.status){
              var response = data.response[0];
              var url = response.url;
              ng.showThumbData = true;
              ng.isDeleteThumb = true;
              // ng.srcThumbData = url;
              $timeout(function () {
                $msj.show(CMSDATA.MSJ.MSJ56, positionMSj);
                $preload.hide();
                if(idxIncidencia===''){ // agregar imagen
                  ng.equipo.escudo=url;
                }else{ // editar imagen
                  ng.evento.incidencias[idxIncidencia].foto=url;
                  ng.evento.incidencias[idxIncidencia].mostrarImagen=false;
                  ng.publicarEvento();
                }
              }, 1000);
          }else{
              $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
              $preload.hide();
          }
      }).error(function(data) {
          $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
          $preload.hide();
      });
        
  };

  var formdata = new FormData();

  ng.agregarImagen = function(idxIncidencia){
      var elm = angular.element('#add-img--cover');
      var thumbData = elm.parent().prev('.loadThumbData');
      elm.parent().prev('.loadThumbData').val('');
      var fileUpload = document.getElementById("file-upload");
      var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.png)$");
      
      $timeout(function() {
        thumbData.trigger('click');
        elm.parent().prev('.loadThumbData').off('change').on('change', function(evt){
          var file = evt.currentTarget.files[0];
          formdata.append('file', file);

          var img = document.createElement("img");
          img.classList.add("img-escudo");
          img.file = file;
          var preview=angular.element('#add-img--cover');

          // if (regex.test(fileUpload.value.toLowerCase())) {
            var reader = new FileReader();
            reader.onload = (function(aImg) {
              return function(e) { 
                aImg.src = e.target.result;
                aImg.onload = function () {
                  var height = this.height;
                  var width = this.width;
                  if (height != 400 || width != 400) {
                      $msj.show('Agregue una imagen de 400 píxeles por 400 píxeles', positionMSj);
                      return false;
                  }
                  
                  angular.element('.img-escudo').remove();
                  preview[0].appendChild(aImg);
                  return true;
                };
              }; 
            })(img);
            reader.readAsDataURL(file);
          // }else{
          //   $msj.show('Agregue una imagen en formato .png', positionMSj);
          // }

           
        });
      }, 0);
  };

  ng.guardarEquipo = function(){
    formdata.append('id', ng.equipo.id);
    formdata.append('nombre', ng.equipo.nombre);
    formdata.append('idcampeonato', ng.equipo.idcampeonato);
    $preload.show();
    $http.post(URL.base + URL.equipo.guardar, formdata, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined} /* multipart/form-data */
      }).
      success(function(response) {
        $preload.hide();
        if(response.status){
          ng.equipo.id=response.response;
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

  ng.clicVolver = function(){ $location.path('/eventos/equipos'); };

  var init=function(){
    verificarSesion();
  }();
	
}]);

});