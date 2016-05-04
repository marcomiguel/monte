// 'use strict';

define(['app'], function (app) {

app.register.controller('eventosListadoCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$msj', '$timeout', '$logout', '$login', '$localStorage',
function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $msj, $timeout, $logout, $login, $localStorage) {
	var ng=$scope;
  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    sesion:'session',
    logout:'session/logout',
    obtener: 'eventos/index',
    eliminar:'eventos/eliminar/',
    buscar:'eventos/buscar_evento/',
    campeonatos:{
      listar:'/eventos/lista_campeonatos/'
    }
  };
  var positionMSj = CMSDATA.POSITIONMSJ;
  ng.urlEscudos=CMSDATA.GLOBAL.URLESCUDO;
	ng.eventos = {};
  ng.listaResultado=[];

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
                obtenerEventos();
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

  ng.activoItem='hoy';
  ng.menuleft=[
    {
      title: 'Eventos del día',
      icon: 'alarm',
      active : 'hoy'
    },
    {
      title: 'Eventos próximos',
      icon: 'alarm_add',
      active : 'proximo'
    },
    {
      title: 'Eventos pasado',
      icon: 'alarm_off',
      active : 'pasado'
    }
  ];

	var obtenerEventos = function(){
    ng.eventos = {};
    // $preload.show();
    ng.searchLoad=true;
    $http.get(URL.base + URL.obtener).success(function(response){
        var data=response.response;
        if(response.status){
          angular.copy(data, ng.eventos);
          // $preload.hide();
          ng.searchLoad=false;
        }
    });
  };

  ng.listaCampeonatos=[];

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

  ng.searchLoad=false;

  ng.mostrarHoy=true;
  ng.mostrarProximo=false;
  ng.mostrarPasado=false;
  ng.mostrarResultado=false;

  ng.mostrarEventos=function(cuando){
    ng.activoItem=cuando;
    switch(cuando){
      case 'hoy':
        ng.mostrarHoy=true;
        ng.mostrarProximo=false;
        ng.mostrarPasado=false;
        ng.mostrarResultado=false;
        break;
      case 'proximo':
        ng.mostrarHoy=false;
        ng.mostrarProximo=true;
        ng.mostrarPasado=false;
        ng.mostrarResultado=false;
        break;
      case 'pasado':
        ng.mostrarHoy=false;
        ng.mostrarProximo=false;
        ng.mostrarPasado=true;
        ng.mostrarResultado=false;
        break;
      case 'resultado':
        ng.mostrarHoy=false;
        ng.mostrarProximo=false;
        ng.mostrarPasado=false;
        ng.mostrarResultado=true;
        break;  
    }
  }

  ng.mostrarVistaDetalle = function($event, nid){
    $preload.show();
    $rootScope.objMerge = undefined;
    // editar o agregar
    nid?$location.path('/eventos/detalle/'+nid):$location.path('/eventos/detalle/');
  };

  ng.mostrarVistaCampeonato = function($event){
    $preload.show();
    $location.path('/eventos/campeonato/');
  };

  ng.mostrarVistaEquipo = function($event){
    $preload.show();
    $location.path('/eventos/equipo/');
  };

  ng.mostrarListaEquipos = function($event){
    $preload.show();
    $location.path('/eventos/equipos/');
  };

  ng.mostrarListaCampeonatos = function($event){
    $preload.show();
    $location.path('/eventos/campeonatos/');
  };

  //Eliminar
  ng.openDeleteNew = function($event, evento, index) {
      var $event = $event, index = index;
      var confirmDelete = $mdDialog.confirm({
          title: 'Confirmación',
          content: '¿Está seguro que desea eliminar el Evento "'+evento.titulo+'"?',
          ok: 'Aceptar',
          cancel: 'Cancelar'
      });
      $mdDialog
      .show( confirmDelete ).then(function() {
          //OK
          $preload.show();
          deleteNewInList(evento, index);
      })
      .finally(function() {
          //Close alert
          confirmDelete = undefined;
      });
  };

  var deleteNewInList = function(evento, index){
      var index = index;
      if(evento._id){
          //Edit noticia
          $http.delete(URL.base + URL.eliminar + evento._id).
          success(function(data) {
              var data = data;
              
              if(data.status){
                  if(ng.mostrarHoy) ng.eventos.hoy.splice(index,1)
                  if(ng.mostrarProximo) ng.eventos.proximos.splice(index,1)
                  if(ng.mostrarPasado) ng.eventos.pasados.splice(index,1)
                  $preload.hide();
              }else{
                  $preload.hide();
                  $msj.show(data.message,positionMSj);
              }
          }).error(function(data) {
              $preload.hide();
              $msj.show(CMSDATA.MSJ.MSJ8,positionMSj);
          });
      }else{
          //Create nueva noticia
          $preload.hide();
          $msj.show(CMSDATA.MSJ.MSJ8,positionMSj);
      }
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

  ng.enumCategoria={
    DEPORTE:{id:1,descripcion:'Deporte'},
    EVENTO:{id:2,descripcion:'Evento'}
  };

  ng.enumEstado={
    CREADO:{id:1,descripcion:'Creado',slug:'Publicado'},
    ELIMINADO:{id:2,descripcion:'Eliminado',slug:'Eliminado'}
  };

  var buscarEvento=function(){
    ng.listaResultado=[];
    var data={
      texto:(ng.filterText)?ng.filterText:'',
      categoria:(ng.filterCategoria)?ng.filterCategoria:'',
      campeonato:(ng.filterCampeonato)?ng.filterCampeonato:'',
      equipo:(ng.filterEquipo)?ng.filterEquipo:'',
      estado:(ng.filterEstado)?ng.filterEstado:'',
      desde:(ng.filterFrom)?ng.filterFrom:fechaDesdeGlobal,
      hasta:(ng.filterTo)?ng.filterTo:''
    };
    ng.searchLoad=true;
    ng.mostrarEventos('resultado');
    $http.post(URL.base + URL.buscar, data).
      success(function(response) {
        $preload.hide();
        if(response.status){
          var data=response.response;
          angular.forEach(data,function(value,key){
            ng.listaResultado.push(value);
          });
          ng.searchLoad=false;  
        }else{
          $preload.hide();
        }
      }).error(function(response) {
        $preload.hide();
        $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
    });
  };

  ng.buscarEnter = function($event, suceso){
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      ng.resetLayerSearch();
      buscarEvento();
    }
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