  // Controller : List Roles

  // 'use strict';

  define(['app'], function (app) {

  app.register.controller('rolesEntidadesCtrl', [
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
              Slug
              ) {
          var ng = $scope;

          //GLOBALS
          var URL = CMSDATA.GLOBAL.URLBASE,
                  URLSESSION = 'session',
                  URLCLOSESESSION = 'session/logout',
                  URLLISTSITELIST = 'sitio/list',
                  URLLISTCATEGORYMULTIPLE = 'categoria/noticia/';
                  DATA = {},
                  URLTORNEOS = 'destacadas/deportes_torneos',
                  URLFUENTES = 'noticias/fuentes',
                  URLDESTACADASSECCIONES = 'destacadas/secciones/',
                  URLDESTACADASESPECIALES = 'destacadas/especiales/',
                  URLGUARDARROL = 'roles/guardar_roles_entidades',
                  URLLEERROLENTIDADES = 'roles/leer_roles_entidades',
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

          ng.rol = {nombre: "", slug: "", entidades: {}};
          ng.roles = [];

          ng.activoItem='entidades';

          ng.entidades = {
            "sitios": {
              "nombre": "Sitios",
              "slug": "sitios",
              "items": []
            },
            "alerta-tipos": {
              "nombre": "Tipos (Alertas)",
              "slug": "alerta-tipos",
              "items": []
            },
            "campeonatos": {
              "nombre": "Campeonatos",
              "slug": "campeonatos",
              "items": []
            },
            "categorias": {
              "nombre": "Categorías",
              "slug": "categorias",
              "items": []
            },
            "noticia-tipos": {
              "nombre": "Tipos (Noticias)",
              "slug": "noticia-tipos",
              "items": []
            },
            "fuente": {
              "nombre": "Fuente",
              "slug": "fuente",
              "items": []
            },
            "portada-tipos": {
              "nombre": "Tipos ( Portadas)",
              "slug": "portada-tipos",
              "items": []
            },
            "secciones": {
              "nombre": "Secciones",
              "slug": "secciones",
              "items": []
            },
            "temas-especiales": {
              "nombre": "Temas especiales",
              "slug": "temas-especiales",
              "items": []
            },
            "eventos": {
              "nombre": "Eventos",
              "slug": "eventos",
              "items": []
            }
          };

          //Close Session
          ng.closeSession = function () {
              $logout.get(URL + URLCLOSESESSION);
          };

          ng.initList = function (data) {

            ng.sitios_seleccionados = {};
            /* LISTA SITIOS */
            ng.listaSitios = function() {
              $cacheService.get(URL + URLLISTSITELIST).then(
                function(data) {
                    var data = data;
                    if (data.status) {
                      ng.entidades["sitios"].items = data.response;
                      angular.forEach(data.response, function(v, k){
                        //Listar categorias, secciones, temas
                        ng.listaCategorias(v.slug);
                        ng.listaSecciones(v.slug);
                        ng.listaTemas(v.slug);
                      });
                    } else {
                      $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                    }
                },
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
              );
            };
            ng.listaSitios();
            /* END LISTA SITIO */

            /* LISTA TIPOS DE ALERTAS */
            //ng.entidades["alerta-tipos"].items = $cacheService.getTiposAlertas();
            /* END LISTA ALERTAS*/

            /* LISTA CAMPEONATOS */
            /*$http.get(URL + URLTORNEOS).success(function(data) {
              var data = data;
              if(data.status){
                var response = data.response;
                if(response.length > 0){
                  ng.entidades["campeonatos"].items = response;
                }
              }else{
                $msj.show(data.error.message, positionMSj);
              }
            }).error(function(data) {
              $timeout(function(){
                $preload.hide();
              },TIMERESULT);
            });*/
            /* END CAMPEONATOS */

            /* LISTA CATEGORIAS */
            ng.entidades["categorias"].items = {};
            ng.lista_secciones = {};
            ng.listaCategorias = function(v){
              $http.get(URL + URLLISTCATEGORYMULTIPLE + v).success(function(data){
                var data = data;
                if(data.status){
                  var response = data.response;
                  if(response.length > 0){
                    ng.entidades["categorias"].items[v] = response;
                    //guardar todas las secciones
                    angular.forEach(response, function(value, key){
                      if(!angular.isDefined(ng.lista_secciones[v]))
                        ng.lista_secciones[v] = [];
                      if(ng.lista_secciones[v].indexOf(value.seccion) == -1)
                        ng.lista_secciones[v].push(value.seccion);
                    });
                    ng.lista_secciones[v].sort();
                  }
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
                }
              }).error(function(data) {
                $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
              });
              //console.log(ng.secciones);
            };

            ng.marcarCategoriasPorSeccion = function(rol_idx, seccion, sitio_id){
              var categorias = ng.entidades["categorias"].items[sitio_id];
              var entidades = ng.roles[rol_idx].entidades;
              angular.forEach(categorias, function(value, k){
                if(value.seccion == seccion){
                  if(!('categorias' in entidades))
                    entidades['categorias'] = {};
                  if(!(sitio_id in entidades['categorias']))
                    entidades['categorias'][sitio_id] = [];
                  var temp_idx = entidades['categorias'][sitio_id].indexOf(value);
                  if(temp_idx == -1){
                    entidades['categorias'][sitio_id].push(value);
                  }
                }
              });
            };

            ng.obj = {"filtroCat": {}};

            /* END CATEGORIAS*/

            /* LISTA TIPO DE NOTICIAS */
            /*ng.listaTiposNoticias = function(){
              tipos = $cacheService.getTypeContent();
              tipos.shift();
              ng.entidades["noticia-tipos"].items = tipos;
            };
            ng.listaTiposNoticias();*/
            /* END LISTA TIPO DE NOTICIAS */

            /* LISTA FUENTES */
            /*ng.loadFuente = function() {
              $cacheService.get(URL + URLFUENTES).then(
                function (data) {
                  var data = data;
                  if(data.status){
                    //CATEGORY
                    ng.entidades["fuente"].items = data.response;
                  }else{
                    $msj.show(CMSDATA.MSJ.MSJ34,positionMSj);
                  }
                },
                function(msgError) {
                  $msj.show(CMSDATA.MSJ.MSJ34,positionMSj);
                }
              );
            };
            ng.loadFuente();*/
            /* END LISTA FUENTES */

            /* LISTA TIPOS DE PORTADAS */
            //ng.entidades["portada-tipos"].items = $cacheService.getTiposPortadas();
            /* END LISTA DE TIPOS DE PORTADAS */

            /* LISTA DE SECCIONES */
            ng.entidades["secciones"].items = {};
            ng.listaSecciones = function(v){
              $http.get(URL + URLDESTACADASSECCIONES + v).success(function(data){
                var data = data;
                if(data.status){
                  var response = data.response;
                  if(response.length > 0){
                    ng.entidades["secciones"].items[v] = response;
                  }
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
                }
              }).error(function(data) {
                $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
              });
            };
            /* END LISTA DE SECCIONES */

            /* LISTA DE TEMAS */
            ng.entidades["temas-especiales"].items = {};
            ng.listaTemas = function(v){
              $http.get(URL + URLDESTACADASESPECIALES + v).success(function(data){
                var data = data;
                if(data.status){
                  var response = data.response;
                  if(response.length > 0){
                    ng.entidades["temas-especiales"].items[v] = response;
                  }
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
                }
              }).error(function(data) {
                $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
              });
            };
            /* END LISTA DE TEMAS */

            /* LISTA DE EVENTOS */
            //ng.entidades["eventos"].items = $cacheService.getTiposEventos();
            /* END LISTA DE EVENTOS */

            //Plantillas
            ng.toggle_template = function (item, rol_idx, entidad_idx) {
              var entidades = ng.roles[rol_idx].entidades;
              if (item in entidades){
                delete entidades[item];
                if(item == 'sitios'){
                  ng.sitios_seleccionados = {}; //esconder checkbox de cat, sec y temas.
                  delete entidades['categorias'];
                  delete entidades['secciones'];
                  delete entidades['temas-especiales'];
                }
              } else {
                if(!(rol_idx in ng.sitios_seleccionados))
                  ng.sitios_seleccionados[rol_idx] = [];
                if(entidad_idx=='categorias' || entidad_idx=='secciones' || entidad_idx=='temas-especiales'){
                  entidades[item] = {};
                  angular.forEach(ng.entidades[entidad_idx].items, function(v,k){
                    if(ng.sitios_seleccionados[rol_idx].indexOf(k) != -1){
                      if(!(k in entidades[item])){
                        entidades[item][k] = [];
                      }
                      angular.forEach(v, function(value, index){
                        var temp_idx = entidades[item][k].indexOf(value);
                        if(temp_idx == -1){
                          entidades[item][k].push(value);
                        }
                      });
                    }
                  });
                }else{
                  entidades[item] = [];
                  angular.forEach(ng.entidades[entidad_idx].items, function(v,k){
                    var temp_idx = entidades[item].indexOf(v);
                    if(temp_idx == -1){
                      entidades[item].push(v);
                      if(item == 'sitios'){
                        if(ng.sitios_seleccionados[rol_idx].indexOf(v.slug) == -1)
                          ng.sitios_seleccionados[rol_idx].push(v.slug);
                      }
                    }
                  });
                }
              }
            };
            ng.exists_template = function (item, rol_idx) {
              return item in ng.roles[rol_idx].entidades;
            };
            ng.toggle_item = function (template, item, rol_idx) {
              //verificar cantidad de items
              var entidades = ng.roles[rol_idx].entidades;
              if(!(rol_idx in ng.sitios_seleccionados))
                ng.sitios_seleccionados[rol_idx] = [];
              if(template in entidades){
                //agregar o quitar Acciones
                var idx = ng.item_index(template, item.slug, rol_idx);
                if (idx > -1){
                  entidades[template].splice(idx, 1);
                  if(template == 'sitios'){
                    if('categorias' in entidades){
                      delete entidades['categorias'][item.slug];
                      if(!entidades['categorias'][0])
                        delete entidades['categorias'];
                    }
                    if('secciones' in entidades){
                      delete entidades['secciones'][item.slug];
                      if(!entidades['secciones'][0])
                        delete entidades['secciones'];
                    }
                    if('temas-especiales' in entidades){
                      delete entidades['temas-especiales'][item.slug];
                      if(!entidades['temas-especiales'][0])
                        delete entidades['temas-especiales'];
                    }
                    if(ng.sitios_seleccionados[rol_idx].indexOf(item.slug) != -1){
                      ng.sitios_seleccionados[rol_idx].splice(ng.sitios_seleccionados[rol_idx].indexOf(item.slug), 1);
                    }
                  }
                } else {
                  entidades[template].push(item);
                  if(template == 'sitios'){
                    if(ng.sitios_seleccionados[rol_idx].indexOf(item.slug) == -1){
                      ng.sitios_seleccionados[rol_idx].push(item.slug);
                    }
                  }
                }
                if(entidades[template].length < 1){
                  if(template in entidades){
                    delete entidades[template];
                  }
                }
              }else{
                entidades[template] = [item];
                if(template == 'sitios'){
                  ng.sitios_seleccionados[rol_idx].push(item.slug);
                }
              }
            };
            ng.exists_item = function (template, slug, rol_idx) {
              if(template in ng.roles[rol_idx].entidades){
                for(var i in ng.roles[rol_idx].entidades[template]){
                  if(ng.roles[rol_idx].entidades[template][i].slug == slug){
                    return true; break;
                  }
                }
                return false;
              }else{
                return false;
              }
            };
            ng.item_index = function (template, slug, rol_idx) {
              var idx = -1;
              if(template in ng.roles[rol_idx].entidades){
                for(var i in ng.roles[rol_idx].entidades[template]){
                  if(ng.roles[rol_idx].entidades[template][i].slug == slug){
                    return i;
                  }
                }
              }
              return idx;
            };

            //{{ Sub Items: categories, secciones, temas especiales }}
            ng.toggle_subitem = function (template, item, rol_idx, sitio_id) {
              //verificar cantidad de items
              var entidades = ng.roles[rol_idx].entidades;
              if(!(template in entidades))
                entidades[template] = {};
              if(!(sitio_id in entidades[template]))
                entidades[template][sitio_id] = [];
              var elem_sitios = entidades[template][sitio_id];
              var idx = ng.subitem_index(template, item.slug, rol_idx, sitio_id);
              if (idx > -1){
                elem_sitios.splice(idx, 1);
              } else {
                elem_sitios.push(item);
              }
              if(elem_sitios.length < 1){
                delete entidades[template][sitio_id];
              }
              if(!elem_sitios[0]){
                delete entidades[template];
              }
            };
            ng.exists_subitem = function (template, slug, rol_idx, sitio_id) {
              var entidades = ng.roles[rol_idx].entidades;
              if(!(template in entidades))
                return false;
              if(!(sitio_id in entidades[template]))
                return false;

              for(var i in ng.roles[rol_idx].entidades[template][sitio_id]){
                if(ng.roles[rol_idx].entidades[template][sitio_id][i].slug == slug){
                  return true;
                }
              }
              return false;
            };

            ng.subitem_index = function (template, slug, rol_idx, sitio_id) {
              var idx = -1;
              if(template in ng.roles[rol_idx].entidades){
                for(var i in ng.roles[rol_idx].entidades[template][sitio_id]){
                  if(ng.roles[rol_idx].entidades[template][sitio_id][i].slug == slug){
                    return i;
                  }
                }
              }
              return idx;
            };

            ng.exists = function (item, list) {
              if(list)
                return list.indexOf(item) > -1;
            };

            ng.leerRolEntidades = function(){
              $http.get(URL + URLLEERROLENTIDADES).success(function(data){
                var data = data;
                if (data.status) {
                  ng.roles = data.response;
                  //settear los sitios_seleccionados
                  angular.forEach(ng.roles, function(rol, ridx){
                    //debe tener un sitio
                    if('sitios' in rol['entidades']){
                      ng.sitios_seleccionados[ridx] = [];
                      angular.forEach(rol['entidades']['sitios'], function(sitio, sidx){
                        ng.sitios_seleccionados[ridx].push(sitio.slug);
                      });
                    }else{
                      rol.entidades = {};
                    }
                  });
                } else {
                  $msj.show(CMSDATA.MSJ.MSJ81, positionMSj);
                }
              }, function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ81, positionMSj);
              }
              );
            };
            ng.leerRolEntidades();

            ng.addRol = function(){
              if(ng.rol.nombre){
                var nuevo_rol = angular.copy(ng.rol);
                nuevo_rol.slug = Slug.slugify(nuevo_rol.nombre);
                ng.roles.push(nuevo_rol);
                ng.rol = {nombre: "", slug: "", entidades: {}};
              }
            };

            ng.guardarRoles = function(){
              $http.post(URL + URLGUARDARROL, ng.roles).success(function(data, status, headers, config) {
                var data = data;
                if(data.status){
                  $msj.show(CMSDATA.MSJ.MSJ5, positionMSj);
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ82, positionMSj);
                }
              }).error(function(data, status, headers, config) {
                $msj.show(CMSDATA.MSJ.MSJ82, positionMSj);
              });
            };

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
