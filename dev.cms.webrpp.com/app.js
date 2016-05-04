'use strict';

var permissionList;

define(['service/routeResolver'], function () {
  var app = angular.module('RPPApp', [
    'routeResolverServices',
    'ngRoute',
    'ngMaterial',
    'ngMdIcons',
    'ngDraggable',
    'dndLists',
    'scDateTime',
    'ui.timepicker',
    'slugifier',
    'ngtimeago',
    'nsPopover',
    'angularUtils.directives.dirPagination',
    'ngMap',
    'ngStorage',
    'angular-cache',
    'ui.tinymce',
    'localytics.directives',
    'wu.masonry',
    'timer',
    'highcharts-ng'
  ]);

  //Theme Material
  app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('blue',{
        'default': '700'
      })
  });

  //AJAx CORS
  app.config(function($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
      //$httpProvider.interceptors.push('errorInterceptor');
  });

  /*app.factory('errorInterceptor', ['$q', '$rootScope', '$location', '$injector', function ($q, $rootScope, $location, $injector) {
    return {
        request: function (config) {
          console.log(config, 'request');
          return config || $q.when(config);
        },
        requestError: function(request){
          console.log(request, 'requestError');
          return $q.reject(request);
        },
        response: function (response) {
          if(response && response.status === 200){
            var positionMSj = 'top right';
            var $msj = $injector.get("$msj");
            $msj.show(response.statusText, positionMSj);
            //alert(response.statusText);
          }
          return response || $q.when(response);
        },
        responseError: function (response) {
          if (response && response.status === 404) {
            console.log('error 404');
          }
          if (response && response.status >= 500) {
            console.log('error 500');
          }
          return $q.reject(response);
        }
    };
  }]);*/

  app.run(function ($rootScope, $templateCache, $timeout, $location, $localStorage, $mdDialog, $logout, permissions, $route, $msj) {
      permissions.setPermissions(permissionList);
      //GLOBAL
      var $body = angular.element('body');
      var divMsjGlobal = angular.element('#msjGlobal');
      var positionMSj = 'top right';
      $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
          var params = $route.current.$$route;
          //VALIDAR SI SLUG NO TIENE
            if(params && 'permission' in params){
              if(angular.isDefined(params.permission.slug)){
                if(!permissions.hasPermission(params.permission.slug , params.permission.action)){
                  $location.path('/acceso-denegado/');
                }
              }
            }
          //UNBIND DOCUMENT SCROLL
          angular.element(document).unbind('scroll');
          $body.removeClass('body-preload');
          if(CMSDATA.MSJGENERAL){
              divMsjGlobal.fadeIn('slow');
              divMsjGlobal.html(CMSDATA.MSJGENERALTEXT);
              $timeout(function () {
                  divMsjGlobal.fadeOut('slow');
              }, CMSDATA.MSJGENERALTIME);
          }
      });
      $rootScope.$on('$routeChangeStart', function (e, current, pre) {
          if (typeof(current) !== 'undefined'){
              //REMOVE CACHE
              $templateCache.remove(current.templateUrl);
          }
          $body.addClass('body-preload');
          if(CMSDATA.MSJGENERAL){
              divMsjGlobal.fadeOut('slow');
          }
      });

      //LOAD CONTENT
      $rootScope.$on('$viewContentLoaded', function() {
          //CLOSE DIALOG
          $mdDialog.hide();
          //$templateCache.removeAll();
          var ngTail = $rootScope.$$childTail;
          //OPEN PERFIL
          $timeout(function(){
              $rootScope.preloader = true;
              var sidebarleft = angular.element('#sidebarleft');
              var sidebarright = angular.element('#sidebarright');
              var contentbodycenter = angular.element('#contentbodycenter');
              var addClassSidebar = function(){
                  sidebarleft.addClass('nosidebar');
                  sidebarright.addClass('fullsidebar');
                  contentbodycenter.addClass('fullcenter');
              };
              var removeClassSidebar = function(){
                  sidebarleft.removeClass('nosidebar');
                  sidebarright.removeClass('fullsidebar');
                  contentbodycenter.removeClass('fullcenter');
              };

              if($localStorage.menuleft){
                  addClassSidebar();
              }else{
                  removeClassSidebar();
              }
              ngTail.toggleSidebarLeft = function(){
                  if(sidebarleft.hasClass('nosidebar')){
                      removeClassSidebar();
                      $localStorage.menuleft =  false;
                  }else{
                      addClassSidebar();
                      $localStorage.menuleft =  true;
                  }
              };
              ngTail.openBase = function(){
                  $location.path('/publicador');
              };
              ngTail.openPerfil = function($event, name){
                  $location.path('/perfil');
              };
              ngTail.openApps = function($event, name){
                  var _name = name;
                  $location.path(_name);
              };
              var URL = {
                BASE: CMSDATA.GLOBAL.URLBASE,
                URLSESSION:'session',
                URLCLOSESESSION:'session/logout'
              };
              //CLOSE SESSION GLOBAL
              ngTail.closeSession = function(){
                  $logout.get(URL.BASE + URL.URLCLOSESESSION);
              };
              //MSJ REFRESH
              angular.element('body > md-toast').remove();
          }, 1000);

      });

  });

  //ROUTING

  app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider','$httpProvider', '$provide',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider,$httpProvider, $provide) {

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            var route = routeResolverProvider.route;

            //path - baseName - alternativeName - secure - slug - action
            $routeProvider
                .when('/', route.resolve('login/', 'login', 'login', false))
                .when('/publicador', route.resolve('publicador/', 'listado', 'listado', false, 'noticias'))
                .when('/publicador/noticia/', route.resolve('publicador/', 'createNew', 'createnew', false, 'noticias', 'crear'))
                .when('/publicador/noticia/:nid', route.resolve('publicador/', 'createNew', 'createnew', false, 'noticias', 'leer'))
                .when('/perfil', route.resolve('perfil/', 'perfil', 'perfil', false, 'user', 'profile'))
                .when('/portadas', route.resolve('portadas/', 'portadas', 'portadas', false, 'destacadas'))
                .when('/portadas/:tipo/:sitio', route.resolve('portadas/', 'portadas', 'portadas', false, 'destacadas'))
                .when('/portadas/:tipo/:sitio/:seccion', route.resolve('portadas/', 'portadas', 'portadas', false, 'destacadas'))
                .when('/portadas/:tipo/:sitio/:seccion/:seccionb', route.resolve('portadas/', 'portadas', 'portadas', false, 'destacadas'))
                .when('/audios', route.resolve('audios/', 'audios', 'audios', false, 'elementos', 'index'))
                .when('/videos', route.resolve('videos/', 'videos', 'videos', false, 'elementos', 'index'))
                .when('/fotos', route.resolve('fotos/', 'fotos', 'fotos', false, 'elementos', 'index'))
                .when('/oido-social', route.resolve('oidosocial/', 'list', 'list', false, 'socialtv'))
                .when('/oido-social/detalle/', route.resolve('oidosocial/', 'detail', 'detail', false, 'socialtv', 'lista'))
                .when('/oido-social/detalle/:nid', route.resolve('oidosocial/', 'detail', 'detail', false, 'socialtv', 'lista'))
                .when('/ticker', route.resolve('ticker/', 'ticker', 'ticker', false, 'ticker'))
                .when('/temas', route.resolve('temas/', 'temas', 'temas', false, 'tag'))
                .when('/temas/detalle', route.resolve('temas/', 'detalle', 'detalle', false, 'tag', 'guardar'))
                .when('/temas/detalle/:nid', route.resolve('temas/', 'detalle', 'detalle', false, 'tag', 'leer'))
                .when('/temas/temadeldia', route.resolve('temas/', 'temadeldia', 'temadeldia', false, 'tag', 'portadatemas_leer'))
                .when('/alertas', route.resolve('alertas/', 'alert', 'list', false, 'alert'))
                .when('/alerta/detalle/', route.resolve('alertas/', 'alertDetail', 'detail', false, 'alert', 'alert'))
                .when('/alerta/detalle/:nid', route.resolve('alertas/', 'alertDetail', 'detail', false, 'alert', 'id'))
                .when('/streaming', route.resolve('streaming/', 'streaming', 'streaming', false, 'player'))
                .when('/livestreaming', route.resolve('streaming/', 'livestreaming', 'livestreaming', false))
                .when('/estadisticas', route.resolve('estadisticas/', 'estadisticas', 'listado', false))
                .when('/eventos', route.resolve('eventos/', 'eventosListado', 'listado', false, 'eventos'))
                .when('/eventos/detalle/', route.resolve('eventos/', 'eventosDetalle', 'detalle', false, 'eventos'))
                .when('/eventos/detalle/:nid', route.resolve('eventos/', 'eventosDetalle', 'detalle', false, 'eventos', 'leer'))
                .when('/eventos/campeonatos/', route.resolve('eventos/', 'campeonatosListado', 'listado_campeonatos', false, 'eventos'))
                .when('/eventos/campeonato/', route.resolve('eventos/', 'campeonatosDetalle', 'campeonato', false, 'eventos'))
                .when('/eventos/campeonato/:nid', route.resolve('eventos/', 'campeonatosDetalle', 'campeonato', false, 'eventos', 'leer_campeonato'))
                .when('/eventos/equipos/', route.resolve('eventos/', 'equiposListado', 'listado_equipos', false, 'eventos'))
                .when('/eventos/equipo/', route.resolve('eventos/', 'equiposDetalle', 'equipo', false, 'eventos'))
                .when('/eventos/equipo/:nid', route.resolve('eventos/', 'equiposDetalle', 'equipo', false, 'eventos', 'leer_equipo'))
                .when('/podcast', route.resolve('podcast/', 'podcastListado', 'listado', false, 'podcast'))
                .when('/podcast/detalle', route.resolve('podcast/', 'podcastDetalle', 'detalle', false, 'podcast'))
                .when('/podcast/detalle/:nid', route.resolve('podcast/', 'podcastDetalle', 'detalle', false, 'podcast', 'id'))
                .when('/roles', route.resolve('roles/', 'roles', 'roles', false, 'roles'))
                .when('/roles/entidades/', route.resolve('roles/', 'rolesEntidades', 'roles-entidades', false, 'roles'))
                .when('/roles/usuarios/', route.resolve('roles/', 'rolesUsuarios', 'roles-usuarios', false, 'roles'))
                .when('/redessociales/', route.resolve('redessociales/', 'redessociales', 'redessociales', false, 'roles'))
                .when('/redessociales/publicadas', route.resolve('redessociales/', 'listadoPublicadas', 'listado-publicadas', false, 'roles'))
                .when('/redessociales/publicada/', route.resolve('redessociales/', 'detallePublicada', 'detalle-publicada', false, 'roles'))
                .when('/redessociales/publicada/:nid', route.resolve('redessociales/', 'detallePublicada', 'detalle-publicada', false, 'roles'))
                .when('/redessociales/programadas', route.resolve('redessociales/', 'listadoProgramadas', 'listado-programadas', false, 'roles'))
                .when('/redessociales/programada/', route.resolve('redessociales/', 'detalleProgramada', 'detalle-programada', false, 'roles'))
                .when('/redessociales/programada/:nid', route.resolve('redessociales/', 'detalleProgramada', 'detalle-programada', false, 'roles'))
                .when('/redessociales/programadas', route.resolve('redessociales/', 'listadoProgramadas', 'listado-programadas', false, 'roles'))
                .when('/redessociales/fotos', route.resolve('redessociales/', 'listadoFotos', 'listado-fotos', false, 'roles'))
                .when('/redessociales/foto/', route.resolve('redessociales/', 'agregarFoto', 'agregar-foto', false, 'roles'))
                .when('/redessociales/foto/:nid', route.resolve('redessociales/', 'detalleFoto', 'detalle-foto', false, 'roles'))
                .when('/redessociales/videos', route.resolve('redessociales/', 'listadoVideos', 'listado-videos', false, 'roles'))
                .when('/redessociales/video/', route.resolve('redessociales/', 'agregarVideo', 'agregar-video', false, 'roles'))
                .when('/redessociales/video/:nid', route.resolve('redessociales/', 'detalleVideo', 'detalle-video', false, 'roles'))
                .when('/elecciones', route.resolve('elecciones/', 'listadoEncuestas', 'listado-encuestas', false, 'sondeos'))
                .when('/elecciones/encuesta/', route.resolve('elecciones/', 'detalleEncuesta', 'detalle-encuesta', false, 'sondeos'))
                .when('/elecciones/encuesta/:nid', route.resolve('elecciones/', 'detalleEncuesta', 'detalle-encuesta', false, 'sondeos'))
                .when('/elecciones/encuesta/:nid', route.resolve('elecciones/', 'detalleEncuesta', 'detalle-encuesta', false, 'sondeos'))
                .when('/elecciones/presidenciales/', route.resolve('elecciones/', 'presidenciales', 'conteo-presidenciales', false, 'sondeos'))
                .when('/elecciones/congresales/', route.resolve('elecciones/', 'congresales', 'conteo-congresales', false, 'sondeos'))
                .when('/elecciones/parlamento-andino/', route.resolve('elecciones/', 'parlamentoAndino', 'parlamento-andino', false, 'sondeos'))
                .when('/acceso-denegado/', route.resolve('autenticacion/', 'autenticacion', 'denegado'))
                .otherwise({ redirectTo: '/' });

     }]);

    return app;

});
