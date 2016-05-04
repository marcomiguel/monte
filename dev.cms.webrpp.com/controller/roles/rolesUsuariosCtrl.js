// Controller : List Roles

// 'use strict';

define(['app'], function (app) {

app.register.controller('rolesUsuariosCtrl', [
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
    '$scrollGo',
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$filter',
    '$log',
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
        $scrollGo,
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $filter,
        $log
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLVIEW = CMSDATA.GLOBAL.URLVIEW,
            URLLIST = 'listado.html',
            URLLOGIN = 'login.html',
            URLSESSION = 'session',
            URLUNIRTEMAS = '/tag/unificar',
            URLCLOSESESSION = 'session/logout',
            URLMODIFICARTEMA = 'tag/leer',
            URLLISTSITE = 'sitio/list',
            URLTEMAS = 'tag',
            URLUSERS = 'user',
            URLASIGNARROL = 'roles/asignar_rol',
            URLLEERROLUSUARIOS = 'roles/leer_rol_usuarios',
            DATA = {},
            TIMERESULT = 1000 / 4,
            TIMEWAITBTNDONE = 2000;

        //FLAG DISABLED SESSION
        var positionMSj = 'top right';
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;

        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
            function(data) {
                var data = data;
                if (data.status) {
                    ng.initList(data);
                    $preload.hide();
                } else {
                    $msj.show(CMSDATA.MSJ.MSJ0, CMSDATA.POSITIONMSJ);
                    delete $localStorage.login;
                    $preload.hide();
                    $location.path('/');
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ0, CMSDATA.POSITIONMSJ);
                delete $localStorage.login;
                $preload.hide();
                $location.path('/');
            }
        );

        //Close Session
        ng.closeSession = function() {
            $logout.get(URL + URLCLOSESESSION);
        };

        /*
        @init Vars
        */
        ng.layerSearch = false;
        ng.custom = true;
        ng.query = '';
        ng.letra = 'a';
        ng.coleccion = [];
        ng.coleccion_general = [];
        /*ng.seleccionArr = [];*/
        ng.objF = {
            filtroColeccion : '',
            filtroRol : '',
            filtroSeleccionTodos: false
        };

        ng.seleccionarTema = function(index, model, item){
          var item_o = angular.copy(item);
          if(model){
            item.rol = ng.rol.slug;
            if(ng.rol.usuarios.indexOf(item_o) == -1){
              if(angular.isDefined(item_o['seleccionado'])){
                delete item_o['seleccionado'];
              }
              if(angular.isDefined(item_o['rol'])){
                delete item_o['rol'];
              }
              ng.rol.usuarios.push(item_o);
            }
          }else{
            item.rol = "";
            for(var i=0; i < ng.rol.usuarios.length; i++){
              if(item_o.slug == ng.rol.usuarios[i].slug){
                ng.rol.usuarios.splice(i, 1);
                break;
              }
            }
          }
        };
        ng.abcdario = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
        "L", "LL", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
        "X", "Y", "Z"];
        ng.seleccionadoAbc = 0;
        ng.ordenAbc = function(abc, index){
            ng.seleccionadoAbc = index;
            ng.newsBusy = false;
            ng.msjBusy = false;
            ng.objF.filtroSeleccionTodos = false;
            ng.query = '';
            ng.objF.filtroColeccion = '';
            ng.letra = $filter('lowercase')(abc);
            var resultado = filter_word(ng.coleccion_general, 0, ng.letra);
            ng.coleccion = assign_rol(resultado);
        };
        ng.changeMultimediaFiltro = function($event){
            var $event = $event;
            if($event.which === 13) {
                ng.newsBusy = false;
                ng.msjBusy = false;
                ng.letra = '';
                ng.seleccionadoAbc = -1;
                ng.objF.filtroColeccion = '';
                ng.multimedias = [];
                ng.rol.usuarios = [];
                ng.obtenerUsuarios(undefined, 'reload');
            }
        };

        function filter_word(names, index, letter) {
          var filteredNames = names.filter(function(word) {
             return $filter('lowercase')(word['nombre'].charAt(index)) === letter;
          });
          return check_uncheck_users(filteredNames);
        }

        function check_uncheck_users(arr){
          angular.forEach(arr, function(v, k){
            v.seleccionado = false;
            for(var i=0; i < ng.rol.usuarios.length; i++){
              if(v.slug == ng.rol.usuarios[i].slug){
                v.seleccionado = true;
                break;
              }
            }
          });
          return arr;
        }

        function assign_rol(arr){
          angular.forEach(arr, function(v, k){
            for(var i=0; i < ng.roles.length; i++){
              for(var j=0; j < ng.roles[i].usuarios.length; j++){
                if(v.slug == ng.roles[i].usuarios[j].slug){
                  v.rol = ng.roles[i].slug;
                  break;
                }
              }
            }
          });
          return arr;
        }

        ng.backToList = function(){
          $location.path('/roles/');
        };

        ng.roles = [];
        ng.rol = {
          nombre: '', slug: '', usuarios: []
        };



        ng.mostrarRol=function(obj){
          ng.guardarRol();
          ng.rol = angular.copy(obj);
          check_uncheck_users(ng.coleccion);
        };
        /*
        @init Functions
        */
        //INIT FNC

        ng.initList = function(data) {

            //INFINITE SCROLL LIST
            ng.newsBusy = false;
            ng.msjBusy = false;
            //Click Guardar
            ng.obtenerUsuarios = function($event, tipo, nuevo) {
                var $event = $event, tipo = tipo, nuevo = nuevo;
                if (ng.newsBusy) return;
                ng.newsBusy = true;
                ng.msjBusy = false;
                if(tipo != 'infinite'){
                    ng.coleccion = [];
                }
                $http.get(URL + URLUSERS).success(function(data) {
                  var data = data;
                  if (data.status) {
                      var response = data.response;
                      ng.coleccion_general = response;
                      var arr_resultado = filter_word(response, 0, 'a');
                      ng.coleccion = assign_rol(arr_resultado);
                      ng.newsBusy = false;
                      msjBusy = false;
                      if(response.length <= 0){
                          ng.msjBusy = true;
                      }
                  } else {
                      $msj.show(CMSDATA.MSJ.MSJ92,CMSDATA.CMSDATA.POSITIONMSJ);
                      ng.newsBusy = false;
                      ng.msjBusy = true;
                  }
                }).error(function(data) {
                    ng.newsBusy = false;
                    $msj.show(CMSDATA.MSJ.MSJ92, CMSDATA.POSITIONMSJ);
                    ng.msjBusy = true;
                });
            };

            ng.leerRolUsuarios = function(){
              $http.get(URL + URLLEERROLUSUARIOS).success(function(data){
                var data = data;
                if (data.status) {
                  ng.roles = data.response;
                  if(ng.roles.length > 0){
                    ng.rol = ng.roles[0];
                  }
                  ng.obtenerUsuarios(undefined);
                } else {
                  $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
              }, function(msgError) {
                  $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
              );
            };

            //EDITAR TEMA
            ng.editarUsuario = function($event, item, $index){
                var $event = $event, DATA = item, $index = $index;
                ng.crearUsuario($event, item, $index);
            };

            //GUARDAR
            ng.guardarRol = function(){
              for(var i=0; i < ng.roles.length; i++){
                if(ng.rol.slug == ng.roles[i].slug){
                  ng.roles[i] = ng.rol;
                  break;
                }
              }
            };

            ng.guardarRoles = function(){
              ng.guardarRol();
              $http.post(URL + URLASIGNARROL, ng.roles).success(function(data, status, headers, config) {
                var data = data;
                if(data.status){
                  $msj.show(CMSDATA.MSJ.MSJ5, positionMSj);
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ95, positionMSj);
                }
              }).error(function(data, status, headers, config) {
                $msj.show(CMSDATA.MSJ.MSJ95, positionMSj);
              });
            };

            //ASOCIAR TEMAS
            ng.ASOCIAR = undefined;
            ng.asociar = function($event){
                var itemsSeleccionados = ng.rol.usuarios;
                $mdDialog.show({
                    targetEvent : $event,
                    templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/roles/usuarios.html',
                    controller : modalAsociacionCtrl,
                    locals: {
                        modal : {
                            selecionados: itemsSeleccionados,
                            rol_nombre: ng.rol.nombre
                        }
                    }
                })
                .then(function() {
                    if(ng.ASOCIAR){
                      ng.rol.usuarios = ng.ASOCIAR.selecionados;
                      check_uncheck_users(ng.coleccion);
                      $preload.hide();
                    }
                }, function() {
                    $mdDialog.cancel();
                });
                function modalAsociacionCtrl(scope, modal, $mdDialog){
                    scope.coleccion = angular.copy(modal.selecionados);
                    scope.rol_nombre = modal.rol_nombre;

                    scope.removeTag = function($event, item, index){
                        scope.coleccion.splice(index, 1);
                        if(scope.coleccion.length <= 0){
                            ng.ASOCIAR = {
                                selecionados : []
                            };
                        }
                    };
                    scope.cerrarModal = function(){
                        $mdDialog.cancel();
                    };
                    scope.accionModal = function(){
                        $preload.show();
                        ng.ASOCIAR = {
                            selecionados : scope.coleccion
                        };
                        $mdDialog.hide();
                    };
                }
            };

            //CREAR USUARIO
            ng.USUARIO = undefined;
            ng.crearUsuario = function($event, item, index){
                $mdDialog.show({
                    targetEvent : $event,
                    templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/roles/create-user.html',
                    controller : modalCrearUsuarioCtrl,
                    locals: {
                        modal : {
                            item: item
                        }
                    }
                }).then(function() {
                    if(ng.USUARIO){
                      if(ng.USUARIO.id){
                        //EDITAR -- filtrado
                        ng.coleccion[index].sitios = ng.USUARIO.sitios;
                        ng.coleccion[index].active = ng.USUARIO.active;
                      }else{
                        ng.coleccion_general.push({'slug': ng.USUARIO.username, 'nombre': ng.USUARIO.nombre, 'foto': ''});
                        ng.ordenAbc(ng.USUARIO.nombre[0], ng.abcdario.indexOf(ng.USUARIO.nombre[0]));
                      }
                      $preload.hide();
                    }
                }, function() {
                    $mdDialog.cancel();
                });

                function modalCrearUsuarioCtrl(scope, modal, $mdDialog){
                  var DATA = {},
                      URLLISTSITELIST = 'sitio/list',
                      URLPROFILE = 'user/profile',
                      URLCREATEUSER = 'user/crear',
                      URLSAVEUSER = 'user/guardar';
                  var positionMSj = 'top right';
                  var accionCrear = (!modal.item)?true:false;
                  scope.item = angular.copy(modal.item);
                  scope.user = {
                    username: '',
                    nombre: '',
                    email: '',
                    cargo: '',
                    password: '',
                    password2: '',
                    sitios : [],
                    active: 1
                  };
                  if(!accionCrear){
                    scope.user.username = scope.item.slug;
                    scope.user.sitios = angular.isDefined(scope.item.sitios)?scope.item.sitios:[];
                    scope.user.active = scope.item.active;
                  }
                  scope.cerrarModal = function(){
                      $mdDialog.cancel();
                  };
                  scope.saveProfile = function($event){
                    scope.saveProgress = true;
                    var url;
                    if(accionCrear){
                      url = URLCREATEUSER;
                      DATA = {
                          username : scope.user.username,
                          nombre: scope.user.nombre,
                          email: scope.user.email,
                          cargo: scope.user.cargo,
                          password: scope.user.password,
                          password2: scope.user.password2,
                          sitios: scope.user.sitios
                      };
                    }else{
                      url = URLSAVEUSER;
                      DATA = {
                          id: scope.user.username,
                          sitios: scope.user.sitios,
                          active: scope.user.active
                      };
                    }
                    $http.post(URL + url, DATA).success(function(data, status, headers, config) {
                      var data = data;
                      if(data.status){
                          ng.USUARIO = DATA;
                          scope.saveProgress = false;
                          $msj.show(CMSDATA.MSJ.MSJ5, positionMSj);
                          $mdDialog.hide();
                      }else{
                        $msj.show(CMSDATA.MSJ.MSJ41, positionMSj);
                        scope.saveProgress = false;
                      }
                    }).error(function(data, status, headers, config) {
                      $msj.show(CMSDATA.MSJ.MSJ41, positionMSj);
                      scope.saveProgress = false;
                    });
                  };

                  /* LISTA SITIO */
                  scope.sitios = [];
                  scope.listaSitios = function() {
                    //Sitios
                    $http.get(URL + URLLISTSITELIST).success(function(data){
                      var data = data;
                      if (data.status) {
                        scope.sitios = data.response;
                      } else {
                        $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                      }
                    }, function(msgError) {
                        $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                      }
                    );
                  };
                  scope.listaSitios();
                  /* END LISTA SITIO */

                  scope.toggle = function (item, list) {
                      var idx = list.indexOf(item);
                      if (idx > -1)
                          list.splice(idx, 1);
                      else {
                          list.push(item);
                          list.sort();
                      }
                  };

                  scope.exists = function (item, list) {
                      return list.indexOf(item) > -1;
                  };

                }
            };

            //SELECCIONAR TODOS
            ng.seleccionarTodos = function(_model){
              if(_model){
                angular.forEach(ng.coleccion, function(v,i){
                  if(!ng.coleccion[i].seleccionado && !angular.isDefined(ng.coleccion[i].rol)){
                    if(angular.isDefined(v.seleccionado)){ delete v.seleccionado; }
                    ng.rol.usuarios.push(angular.copy(v));
                    ng.coleccion[i].seleccionado = true;
                    ng.coleccion[i].rol = ng.rol.slug;
                  }
                });
              }else{
                angular.forEach(ng.coleccion, function(v,i){
                  ng.coleccion[i].seleccionado = false;
                  if(ng.rol.slug == ng.coleccion[i].rol){
                    ng.coleccion[i].rol = "";
                  }
                });
                var filteredNames = ng.rol.usuarios.filter(function(word) {
                   return $filter('lowercase')(word['nombre'].charAt(0)) !== ng.letra;
                });
                ng.rol.usuarios = filteredNames;
              }
            };

            //QUERY ENVIADO POR OTRA VISTA
            if($rootScope.buscarQueryTema){
                var rootBQuery = $rootScope.buscarQueryTema;
                ng.newsBusy = false;
                ng.msjBusy = false;
                ng.letra = '';
                ng.seleccionadoAbc = -1;
                ng.objF.filtroColeccion = '';
                ng.multimedias = [];
                ng.rol.usuarios = [];
                ng.query = rootBQuery.query;
                ng.obtenerUsuarios(undefined);
                $rootScope.buscarQueryTema = undefined;
            }else{
                //QUERY INICIO NORMAL
                ng.leerRolUsuarios();
            }

        };

    }
]);

});
