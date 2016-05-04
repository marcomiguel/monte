// Controller : List Roles

// 'use strict';

define(['app'], function (app) {

app.register.controller('rolesCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$http',
    '$timeout',
//    '$q',
    '$preload',
    '$msj',
    '$login',
    '$localStorage',
    '$logout',
    '$menuleft',
    '$mdDialog',
    '$cacheService',
    '$mdSidenav',
    'Slug',
    'permissions',
    function (
            $scope,
            $rootScope,
            $location,
            $http,
            $timeout,
//        $q,
            $preload,
            $msj,
            $login,
            $localStorage,
            $logout,
            $menuleft,
            $mdDialog,
            $cacheService,
            $mdSidenav,
            Slug,
            permissions
            ) {

        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
                URLSESSION = 'session',
                URLCLOSESESSION = 'session/logout',
                URLPLAYER = 'player',
                URLRESTRI = URLPLAYER + '/tiempo',
                URLCONFIG = URLPLAYER + '/config',
                URLLISTSITELIST = 'sitio/list',
                URLROLACCIONES = 'roles/acciones/',
                URLGUARDARROL = 'roles/guardar_roles_acciones',
                URLLEERROLACCIONES = 'roles/leer_roles_acciones',
                DATA = {},
                TIMERESULT = 1000 / 2;
        //VARS TOOLS
        var positionMSj = 'top right';
        //FLAG DISABLED SESSION
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;

        //PROFILE PICTURE
        ng.user = {pictureUrl: false};
        console.log("LOADED !!!");
        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
                function (data) {
                    var data = data;
                    if (data.status) {
                        ng.user.pictureUrl = (data.response.foto == "") ? false : data.response.foto + "?" + new Date().getTime();
                        ng.initList(data);
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                        delete $localStorage.login;
                        $preload.hide();
                        $location.path('/');
                    }
                },
                function (msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                    delete $localStorage.login;
                    $preload.hide();
                    $location.path('/');
                }
        );

        ng.activoItem='roles';

        ng.templates = [];
        $http.get(URL + URLROLACCIONES).success(function(data){
          var data = data;
          if(data.status){
            ng.templates = data.response;
            leerRolAcciones();
          }else{
            $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
          }
        }).error(function(data) {
          $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
        });

        ng.rol = {nombre: "", slug: "", acciones: {}};
        ng.roles = [];

        var leerRolAcciones = function(){
          $http.get(URL + URLLEERROLACCIONES).success(function(data){
            var data = data;
            if(data.status){
              ng.roles = data.response;
            }else{
              $msj.show(CMSDATA.MSJ.MSJ97,positionMSj);
            }
          }).error(function(data) {
            $msj.show(CMSDATA.MSJ.MSJ97,positionMSj);
          });
        };

        ng.addRol = function(){
          if(ng.rol.nombre){
            var nuevo_rol = angular.copy(ng.rol);
            nuevo_rol.slug = Slug.slugify(nuevo_rol.nombre);
            ng.roles.push(nuevo_rol);
            ng.rol = {nombre: "", slug: "", acciones: {}};
          }
        };

        ng.clickSave = function(){
          $http.post(URL + URLGUARDARROL, ng.roles).success(function(data, status, headers, config) {
            var data = data;
            if(data.status){
              $msj.show(CMSDATA.MSJ.MSJ5, positionMSj);
            }else{
              $msj.show(CMSDATA.MSJ.MSJ98, positionMSj);
            }
          }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ98, positionMSj);
          });
        };

        /* LISTA SITIO */
        ng.sitios = [];
        ng.listaSitios = function() {
          //Sitios
          $cacheService.get(URL + URLLISTSITELIST).then(
            function(data) {
                var data = data;
                if (data.status) {
                  ng.sitios = data.response;
                } else {
                  $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
            }
          );
        };
        /* END LISTA SITIO */

        //Plantillas
        ng.toggle_template = function (item, rol_idx) {
          var acciones = ng.roles[rol_idx].acciones;
          if (item in acciones){
            delete acciones[item];
          } else {
            acciones[item] = [];
            for (var i = 0; i < ng.templates.length; i++) {
              if(ng.templates[i].slug == item){
                //marcar acciones como marcadas
                angular.forEach(ng.templates[i].acciones, function(v,k){
                  var temp_idx = acciones[item].indexOf(v.slug);
                  if(temp_idx == -1)
                    acciones[item].push(v.slug);
                });
                break;
              }
            }
          }
        };
        ng.exists_template = function (item, rol_idx) {
          return item in ng.roles[rol_idx].acciones;
        };
        ng.toggle_action = function (template, item, rol_idx) {
          //verificar cantidad de items
          var acciones = ng.roles[rol_idx].acciones;
          if(template in acciones){
            //agregar o quitar Acciones
            var idx = acciones[template].indexOf(item);
            if (idx > -1){
              acciones[template].splice(idx, 1);
            } else {
              acciones[template].push(item);
            }
            if(acciones[template].length < 1){
              if(template in acciones){
                delete acciones[template];
              }
            }
          }else{
            acciones[template] = [item];
          }
        };
        ng.exists_action = function (template, item, rol_idx) {
          if(template in ng.roles[rol_idx].acciones){
            return ng.roles[rol_idx].acciones[template].indexOf(item) > -1;
          }else{
            return false;
          }
        };

        //Close Session
        ng.closeSession = function () {
            $logout.get(URL + URLCLOSESESSION);
        };

        ng.initList = function (data) {
            //FORM
            ng.custom = true;
            //OPEN PANEL APPS
            ng.showPanel = false;
            ng.openPanel = function ($event) {
                ng.togglePanel = ng.togglePanel === false ? true : false;
                if (ng.togglePanel) {
                    ng.showPanel = false;
                } else {
                    ng.showPanel = true;
                }
            };
            //OPEN PANEL MODULES
            ng.showPanel2 = false;
            ng.openPanel2 = function ($event) {
                ng.togglePanel2 = ng.togglePanel2 === false ? true : false;
                if (ng.togglePanel2) {
                    ng.showPanel2 = false;
                } else {
                    ng.showPanel2 = true;
                }
            };
        };

        //OPEN PERFIL
        ng.openPerfil = function ($event, name) {
            $location.path('/perfil');
        };

        ng.openApps = function ($event, name) {
            var _name = name;
            $location.path(_name);
        };

        ng.navegarA = function(item, $event){
            $location.path(item);
        };

    }]);

});
