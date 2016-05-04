// Controller : Create News

// 'use strict';

define(['app'], function (app) {

app.register.controller('portadasCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$anchorScroll',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$create',
    'Slug',
    '$msj',
    '$sce',
    '$scrollGo',
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$filter',
    '$log',
    '$interval',
    '$window',
    '$bytesToSize',
    'permissions',
    function(
        $scope,
        $rootScope,
        $http,
        $document,
        $location,
        $anchorScroll,
        $preload,
        $mdDialog,
        $mdToast,
        $timeout,
        $create,
        Slug,
        $msj,
        $sce,
        $scrollGo,
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $filter,
        $log,
        $interval,
        $window,
        $bytesToSize,
        permissions
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLVIEW = CMSDATA.GLOBAL.URLVIEW,
            URLLIST = 'listado.html',
            URLLOGIN = 'login.html',
            URLSESSION = 'session',
            URLPREVIEW = 'noticias/vistaprevia',
            URLPREVIEWDETACADA = 'noticias/vistapreviadestacada',
            URLSAVE = 'noticias/guardar',
            URLPUBLISH = 'noticias/publicar',
            URLREVISIONS = 'noticias/revisiones/',
            URLHIGHLIGHT = 'destacadas/',
            URLCOVERS = 'destacadas/list/',
            URLDESTACADASGUARDAR = 'destacadas/guardar',
            URLLISTCATEGORY = 'categoria/index/',
            URLLISTCATEGORYMULTIPLE = 'categoria/noticia/',
            URLPREVIEWCOVERS = 'noticias/vistapreviadestacada',
            URLCOVEREDIT = 'destacadas/noticias?slug=',
            URLDESTACADASSECCIONES = 'destacadas/secciones/',
            URLDESTACADASESPECIALES = 'destacadas/especiales/',
            URLSEARCHITEMS = 'noticias/?suggest=',
            URLCLOSESESSION = 'session/logout',
            URLEDITNEWS = 'noticias/leer/',
            URLLISTAUTHOR = 'user',
            URLLISTSITE = 'sitio',
            URLLISTSITELIST = 'sitio/list',
            URLLISTTHUMBS = 'noticias/imagenportada/',
            URLOADIMG = 'noticias/cargarimagen',
            URLVALIDPUBLISH = 'noticias/validar',
            URLFUENTES = 'noticias/fuentes',
            URLDELETE = 'noticias/eliminar/',
            URLLEERPORTADAS = 'destacadas/leer',
            URLPUBLICARDESTACADAS = 'destacadas/publicar',
            URLTAGSEARCH = 'tag/search/',
            URLTORNEOS = 'destacadas/deportes_torneos',
            URLLISTATEMAS = 'destacadas/get_data',
            URLGUARDARTEMAS = 'destacadas/set_data',
            URLLISTEVENTS = 'eventos/seleccionar',
            URLPLAYER = 'player',
            URLPORTADADEFAULT = '/portadas/secciones/rpp/home',
            URLPORTADAACTIVITY = '/destacadas/actividades',
            URLMODIFICACIONPORTADA = '/destacadas/ping',
            URLPODCASTLIST = '/podcast/',
            URLPODCASTDETAIL = '/podcast/id/',
            URLSUBIRELEMENTOS = 'elementos/subir_multimedia',
            DATA = {},
            TIMERESULT = 1000 / 4,
            TIMEWAITBTNDONE = 2000;

        var tipoxUrl = $routeParams.tipo;
        var sitioxUrl = $routeParams.sitio;
        var seccionxUrl = "";
        if(tipoxUrl&&sitioxUrl)
          seccionxUrl = sitioxUrl +'/'+ $routeParams.seccion + ($routeParams.seccionb?'/'+$routeParams.seccionb:'');
          if(angular.isDefined(tipoxUrl)){
            if(!permissions.hasPermission('destacadas', tipoxUrl)){
              $location.path('/acceso-denegado/');
            }
          }

        var stop;
        var refreshTime = 10;

        //VAR TOOLS
        var positionMSj = 'top right';
        //SEARCH
        ng.filterText = CMSDATA.FILTER.texto;
        ng.filterFrom = CMSDATA.FILTER.desde; //-30 DAYs
        ng.filterTo = CMSDATA.FILTER.hasta;
        //FLAG DISABLED SESSION
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;

        //PROFILE PICTURE
        ng.user = { pictureUrl: false, username: "" };

        //DIMENSION IMAGEN | VIDEO | AUDIO UPLOAD
        ng.widthMedia = CMSDATA.DIMENSION16x9.widthLarge;
        ng.heightMedia = CMSDATA.DIMENSION16x9.heightLarge;

        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
            function(data) {
                var data = data;
                if (data.status) {
                    $localStorage.login =  data.response;
                    ng.user.pictureUrl = (data.response.foto=="")?false:data.response.foto+"?"+new Date().getTime();
                    ng.user.username = data.response.username;
                    //VERIFICAR LA URL QUE INGRESA
                    if(!tipoxUrl||!sitioxUrl){
                      $location.path(URLPORTADADEFAULT); return;
                    }
                    ng.initList(data);
                    $preload.hide();
                } else {
                    $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
                    delete $localStorage.login;
                    $preload.hide();
                    $location.path('/');
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
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
        //Items
        ng.publicidad = {'cabecera': false, 'medio': false, 'cronologico_2': false};
        ng.encuesta = {'cabecera': false, 'medio': false, 'cronologico_2': false};
        ng.envivo = {
          'cabecera': {'estado': false, 'embed': {'codigo': '', 'tipo': '', 'sitio': ''}, 'evento': {}, 'streaming':''},
          'medio': {'estado': false, 'embed': {'codigo': '', 'tipo': '', 'sitio': ''}, 'evento': {}, 'streaming':''}
        };
        ng.destacadas = {'portada': [], 'cabecera': [], 'medio': [], 'cronologico_2': []};
        ng.podcast = {'campana_cabecera': [], 'cabecera': [], 'campana_cuerpo': [], 'medio': [], 'cronologico_2': []};
        ng.portadas_tipo = [{'tipo': 'secciones'}, {'tipo': 'secciones'}, {'tipo': 'secciones'}, {'tipo': 'secciones'}];
        ng.portadas_tipo_seccion = {'secciones': [], 'especiales': []};
        ng.portada = {
            titulo: null,
            descripcion: null,
            tags: null,
            sitio: null,
            seccion: null,
            tipo: null,
            destacadas: [],
            tag: null,
            tag2: null,
            tag3: null,
            cronologico_1: null,
            cronologico_2: null,
            lateral_1: null,
            lateral_2: null,
            lateral_3: null,
            lateral_4: null,
            lateral_5: null,
            lateral_6: null,
            lateral_7: null,
            lateral_8: null,
            lateral_9: null,
            cabecera: null,
            medio: null,
            campana_cabecera: null,
            campana_cuerpo: null,
            torneo: null,
            portadas: []
        };
        //Cantidades
        ng.cantidad_noticias_max = 15;
        //Autocomplete TAGS
        ng.selectedItem  = null;
        ng.searchText1    = null;
        //Tipos de tags
        ng.tag_tipos = {
          'solo_titular': {nombre: 'Solo titular', slug: 'solo_titular', tamano: 1 },
          'solo_foto': {nombre: 'Solo foto', slug: 'solo_foto', tamano: 2 },
          'estandar': {nombre: 'Estándar', slug: 'estandar', tamano: 1 },
          'foto_ancho': {nombre: 'Foto a lo ancho', slug: 'foto_ancho', tamano: 2},
          'widget': {nombre: 'Widget', slug: 'widget', tamano: 3},
          'video': {nombre: 'Video', slug: 'video', tamano: 2 }
        };
        ng.objF = {filtroColeccion: "", tamanoColeccion: ""};
        ng.cantidad = {
          tag : 1,
          tag2 : 1,
          tag3: 1,
          cabecera : 3,
          campana_cabecera : 3,
          campana_cuerpo : 3,
          medio : 3,
          cronologico_1 : 3,
          cronologico_2 : 3,
          lateral_1 : 3,
          lateral_2 : 3,
          lateral_3 : 3,
          lateral_4 : 3,
          lateral_5 : 3,
          lateral_6 : 3,
          lateral_7 : 3,
          lateral_8 : 3,
          lateral_9 : 3
        };
        ng.lista = {
          campana_cabecera: [],
          cabecera: [],
          campana_cuerpo: [],
          medio: [],
          cronologico_1: [],
          cronologico_2: [],
          tag: [],
          tag2: [],
          tag3: [],
          lateral_1 : [],
          lateral_2 : [],
          lateral_3 : [],
          lateral_4 : [],
          lateral_5 : [],
          lateral_6 : [],
          lateral_7 : [],
          lateral_8 : [],
          lateral_9 : []
        };
        ng.listado = {torneos: [], podcast: []};
        ng.streaming = {tipos: [], sitios: {}};
        ng.last_modified = { current_epoctime: null, need_refresh: false, last_epoctime: null, name: "", foto: ""};

        //get torneos
        $http.get(URL + URLTORNEOS).success(function(data) {
          var data = data;
          if(data.status){
            var response = data.response;
            if(response.length > 0){
              ng.listado.torneos = response;
              ng.listado.torneos.unshift({ nombre_alternativo: 'Ninguna', slug: '' });
            }
          }else{
            $msj.show(data.error.message, positionMSj);
          }
        }).error(function(data) {
          $timeout(function(){
            $preload.hide();
          },TIMERESULT);
        });
        //get streaming
        var get_players = function () {
          var players_url = URL + URLPLAYER;
          ng.players = {};
          $http.get(players_url).success(function (data) {
            if (data.status) {
              if (data.response.length > 0) {
                angular.forEach(data.response, function (v, k) {
                  if(ng.streaming.tipos.indexOf(v.tipo)==-1)
                    ng.streaming.tipos.push(v.tipo);
                  if(!ng.players[v.tipo])
                    ng.players[v.tipo] = {};
                  if(!ng.streaming.sitios[v.sitio])
                    ng.streaming.sitios[v.tipo] = [];
                  ng.streaming.sitios[v.tipo].push(v.sitio);
                  ng.players[v.tipo][v.sitio] = {embed: '<iframe width="342" height="204" src="' + v.sitio_url + 'embed/' + v.tipo + '" frameborder="0" allowfullscreen></iframe>'};
                });
              }
            } else {
              if(data.error){
                $msj.show(data.error.message, positionMSj);
              }
              $preload.hide();
            }
          });
        };
        get_players();

        //get podcast
        $http.get(URL + URLPODCASTLIST).success(function(data) {
          var data = data;
          if(data.status){
            var response = data.response;
            if(response.length > 0){
              angular.forEach(response, function(v, k){
                ng.listado.podcast.push({'pcid': v.pcid, 'pcnombre': v.nombre});
              });
            }
          }else{
            $msj.show(data.error.message, positionMSj);
          }
        }).error(function(data) {
          $timeout(function(){
            $preload.hide();
          },TIMERESULT);
        });

        ng.abrirPodcast = function(){
          var pcid = ng.podcast.campana_cuerpo.pcid;
          $http.get(URL + URLPODCASTDETAIL + pcid).success(function(data) {
            var data = data;
            if(data.status){
              var response = data.response;
              if(response){
                var lista = response.lista;
                var url_media = null;
                if(lista[0]){
                  url_media = lista[0].url;
                }
                if(url_media){
                  $window.open(url_media);
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ89 , positionMSj);
                }
              }
            }else{
              $msj.show(data.error.message, positionMSj);
            }
          }).error(function(data) {
            $timeout(function(){
              $preload.hide();
            },TIMERESULT);
          });
        };

        ng.cambioTipoStreaming = function(tipo) {
          ng.envivo[tipo].embed.codigo = "";
          ng.envivo[tipo].embed.sitio = "";
        };

        ng.cambioSitioStreaming = function(tipo) {
          ng.envivo[tipo].embed.codigo = ng.players[ng.envivo[tipo].embed.tipo][ng.envivo[tipo].embed.sitio].embed;
        };

        /** MINUTO A MINUTO **/
        ng.loadSetEvents = true;
        ng.noSetEvents = false;
        ng.events = [];
        $http.get(URL + URLLISTEVENTS  + '?nid=' + ng.nid).success(function(data) {
          var data = data;
          if(data.status){
            ng.events = (data.response)?data.response:[];
            ng.loadSetEvents = false;
            if(ng.events.length<=0){
              ng.noSetEvents = true;
            }else{
              ng.noSetEvents = false;
            }
          }else{
            $msj.show(data.error.message, positionMSj);
          }
        });
        //OPEN Minuto a Minuto
        ng.clickEventMaM = function(evt, mam, type){
            ng.envivo[type].evento = mam;
            evt.preventDefault();
        };

        //CAMBIO DE TEMA 1
        ng.abrirLista = function(ev, key){
          if(!permissions.hasPermission('destacadas', 'set_data')){
            $msj.show(CMSDATA.MSJ.MSJ96, positionMSj);
            return false;
          }
          $mdDialog.show({
              targetEvent: ev,
              templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/portadas/changetags.html',
              locals: {
                modal: {
                    tag_tipos: ng.tag_tipos,
                    lista: ng.lista[key]?ng.lista[key]:[],
                    tipo: key,
                    seccion: ng.seccion.slug
                }
              },
              controller: dialogCtrl
          }).then(function(result) {
            ng.lista[key] = result;
          }, function() {
              $mdDialog.cancel();
          });
        };

        function dialogCtrl($scope, $mdDialog, modal) {
          var file = "";
          $scope.tipo = modal.tipo;
          $scope.seccion = modal.seccion;
          $scope.tag_tipos = modal.tag_tipos;
          $scope.lista_original = angular.copy(modal.lista);
          if(modal.lista){
            if(modal.lista.length>0){
              if(modal.lista[0].slug=="")
                modal.lista.splice(0, 1);
            }
          }else{
            modal.lista = [];
          }
          $scope.tag_lista = angular.copy(modal.lista);
          $scope.nuevoTema = {nombre: "", slug: "", tipo: "", script: ""};
          $scope.error_video = {0: false, 1: false};
          $scope.tema_idx = null;
          $scope.temafilter_idx = null;
          $scope.resetCopy = angular.copy($scope.nuevoTema);

          var verificarTema = function(nombre, list){
            for(var i in list){
              if(list[i].nombre.toLowerCase() == nombre.toLowerCase()){
                if($scope.tema_idx===null){
                  return true;
                }else{
                  if(i == $scope.tema_idx){
                    return false;
                  }else{
                    return true;
                  }
                }
              }
            }
            return false;
          };

          $scope.msj_error = '';
          $scope.verify_widget = function(){
            $scope.msj_error = '';
            if($scope.nuevoTema.script){
              var idx = $scope.nuevoTema.script.indexOf("width");
              if(idx > -1){
                //obtener los tres digitos
                var d1 = $scope.nuevoTema.script[idx+7];
                var d2 = $scope.nuevoTema.script[idx+8];
                var d3 = $scope.nuevoTema.script[idx+9];
                var d4 = $scope.nuevoTema.script[idx+10];
                //verificar que sean enteros
                if(isInt(d1) && isInt(d2) && isInt(d3) && (d4 == '"' || d4 == "'")){
                  var union = d1+''+d2+''+d3;
                  if(union>300)
                    $scope.msj_error = 'Se recomienda que el valor de width no supere los 300px';
                }else{
                  if(!(isInt(d1) && isInt(d2) && (d3 == '"' || d3 == "'"))){
                    if(isInt(d1) && isInt(d2) && isInt(d3) && isInt(d4))
                      $scope.msj_error = 'Se recomienda que el valor de width no supere los 300px';
                    else
                      $scope.msj_error = 'El valor de width es incorrecto';
                  }
                }
              }
            }
          };

          function isInt(value) {
            var x;
            return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
          }

          $scope.agregarTema = function() {
            if($scope.nuevoTema.nombre!=""){
              if(!verificarTema($scope.nuevoTema.nombre, $scope.tag_lista)){
                if($scope.tipo=='campana_cabecera'||$scope.tipo=='cabecera'||$scope.tipo=='campana_cuerpo'||$scope.tipo=='medio'||$scope.tipo=='cronologico_1'||$scope.tipo=='cronologico_2'){
                  delete $scope.nuevoTema.tipo;
                }
                if($scope.nuevoTema.tipo!="widget"){
                  delete $scope.nuevoTema.script;
                }
                $scope.nuevoTema.slug = Slug.slugify($scope.nuevoTema.nombre);
                if($scope.tema_idx===null){
                  $scope.tag_lista.push($scope.nuevoTema);
                }else{
                  $scope.tag_lista[$scope.tema_idx] = $scope.nuevoTema;
                  //Actualizar si tiene filtroColeccion
                  if($scope.temafilter_idx > -1){
                    $scope.filteredTags[$scope.temafilter_idx] = $scope.nuevoTema;
                  }
                }
                $scope.nuevoTema = angular.copy($scope.resetCopy);
                $scope.formNuevoTema.$setPristine();
                $scope.formNuevoTema.$setUntouched();
                if(angular.element('input[name="autocompleteField"]')[0]){
                  angular.element('input[name="autocompleteField"]')[0].value = "";
                }
                $scope.tema_idx = null;
                $scope.temafilter_idx = null;
              }else{
                $msj.show(CMSDATA.MSJ.MSJ76, positionMSj);
              }
            }
          };

          $scope.cancelarTema = function(){
            file = null;
            $scope.nuevoTema = angular.copy($scope.resetCopy);
            $scope.formNuevoTema.$setPristine();
            $scope.formNuevoTema.$setUntouched();
            if(angular.element('input[name="autocompleteField"]')[0]){
              angular.element('input[name="autocompleteField"]')[0].value = "";
            }
            $scope.tema_idx = null;
          };

          $scope.tags_selected = [];
          $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
          };
          $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
          };
          $scope.eliminarTemas = function(){
            angular.forEach($scope.tags_selected, function(v, k){
              var index = $scope.tag_lista.indexOf(v);
              $scope.tag_lista.splice(index, 1);
            });
            $scope.tags_selected = [];
          };
          $scope.cerrar = function() {
            $mdDialog.hide($scope.lista_original);
          };
          $scope.guardarTemas = function() {
            angular.forEach($scope.tag_lista, function(v, k){
              $scope.tag_lista[k]['slug'] = Slug.slugify(v.nombre);
            });
            $scope.tag_lista.unshift({ nombre: 'Ninguna', slug: '' });

            var data_guardado = {
              "seccion":{"slug": $scope.seccion},
              "bloque": $scope.tipo,
              "lista": $scope.tag_lista
            };
            $http.post(URL + URLGUARDARTEMAS, data_guardado).success(function(data){
              var data = data;
              if(data.status){
                $msj.show(CMSDATA.MSJ.MSJ79, positionMSj);
                $mdDialog.hide($scope.tag_lista);
              }else{
                if(data.error){
                  $msj.show(data.error.message, positionMSj);
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ80, positionMSj);
                }
              }
            }).error(function(data) {
              $timeout(function(){
                $preload.hide();
              },TIMERESULT);
            });
          };

          //Autocomplete
          $scope.selectedItem = null;
          $scope.searchText = null;
          $scope.querySearch  = function(query){
            return $http.get(URL + URLTAGSEARCH + query)
            .then(function(result){
              return $.map(result.data.response, function (n, i) { return n.nombre; });
            })
          };
          $scope.searchTextChange = function(text){
            if(text)
              $scope.nuevoTema.nombre = text;
          };

          $scope.getVideoUrl = function() {
            return $sce.trustAsResourceUrl($scope.nuevoTema.url_video);
          };

          $scope.editarTema = function(item, index){
            $scope.nuevoTema = angular.copy(item);
            var filter_status = ($scope.filteredTags.length!=$scope.tag_lista.length)?true:false;
            $scope.tema_idx = (filter_status)?$scope.tag_lista.indexOf(item):index;
            $scope.temafilter_idx = (filter_status)?index:null;
            if(angular.element('input[name="autocompleteField"]')[0]){
              angular.element('input[name="autocompleteField"]')[0].value = item.nombre;
            }
          };
        };

        //Administrar Ranking
        ng.abrirRanking = function(ev, key){
          $mdDialog.show({
              targetEvent: ev,
              templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/portadas/ranking.html',
              locals: {
                modal: {
                    sitio: ng.sitio.slug,
                    seccion: ng.seccion.slug,
                    obj: ng.portada[key],
                    obj_lista: ng.lista[key]?ng.lista[key]:[],
                    tipo: key
                }
              },
              controller: rankingCtrl
          }).then(function(result) {
            //actualizar lista
            ng.lista[key] = result;
            //actualizar portada
            var idx_selected = obtenerPosicion(ng.portada[key], ng.lista[key]);
            if(idx_selected){
              ng.portada[key] = result[idx_selected];
            }
          }, function() {
              $mdDialog.cancel();
          });
        };

        var obtenerPosicion = function (item, list) {
            var idx = -1;
            for (var i in list) {
                idx++;
                if (list[i].slug == item.slug) {
                    return idx;
                }
            }
            return idx;
        };

        function rankingCtrl($scope, $mdDialog, modal, $create) {
          $scope.widget_popup = {open: false, idx: null};
          $scope.tipo = modal.tipo;
          $scope.seccion = modal.seccion;
          $scope.sitio = modal.sitio;
          var idx_selected = obtenerPosicion(modal.obj, modal.obj_lista);
          $scope.cancion_idx = null;
          $scope.cancionfilter_idx = null;
          var ranking = (modal.obj.lista)?modal.obj.lista:[];
          var positionMSj = 'top right';
          $scope.obj_lista = angular.copy(modal.obj_lista);
          $scope.lista_ranking = angular.copy(ranking);
          $scope.nuevaCancion = {artista: "", cancion: "", imagen: "", album: ""};
          if($scope.sitio=='lazona'||$scope.sitio=='oxigeno'||$scope.sitio=='studio92'){
            $scope.nuevaCancion.cancion_url = "";
          }
          $scope.resetCopy = angular.copy($scope.nuevaCancion);
          $scope.refreshAudio = false;

          $scope.widthImage = 250;
          $scope.heightImage = 164;

          $scope.$on('objaudio', function(e, msg) {
            $scope.nuevaCancion.cancion_url = msg.url;
            $scope.refreshAudio = {};
            $scope.refreshAudio.url = msg.url;
          });

          $scope.agregarCancion = function() {
            if($scope.nuevaCancion.artista!=""&&$scope.nuevaCancion.cancion!=""){
              if( ($scope.sitio=='lazona'||$scope.sitio=='oxigeno'||$scope.sitio=='studio92') && !$(".tagzoneaudio .opt-delete").is(':visible')){
                $msj.show(CMSDATA.MSJ.MSJ99, positionMSj);
                return false;
              }

              var btnDonePhoto = angular.element('#add-photo-ranking .tools .md-cms-green');
              if(btnDonePhoto.length == 1){
                var fncLoadEditImg = function() {
                  //TIME WAIT FOR BUTTON DONE
                  var elmThumbVal = angular.element('#add-photo-ranking input[name="thumb_values_edit"]').data('json');
                  //UPLOAD PHOTO AJAX
                  var jsonData = elmThumbVal;
                  //PHOTO EDIT
                  $preload.show();
                  var DATA = (jsonData) ? angular.fromJson(jsonData) : null;
                  $http.post(URL + URLOADIMG, DATA).success(function(data) {
                    var data = data;
                    if (data.status) {
                        var response = data.response;
                        $scope.nuevaCancion.imagen = response.url;

                        if($scope.cancion_idx===null){
                          $scope.lista_ranking.push($scope.nuevaCancion);
                        }else{
                          $scope.lista_ranking[$scope.cancion_idx] = $scope.nuevaCancion;
                          //Actualizar si tiene filtroColeccion
                          if($scope.cancionfilter_idx > -1){
                            $scope.filteredRanking[$scope.cancionfilter_idx] = $scope.nuevaCancion;
                          }
                        }
                        $scope.nuevaCancion = angular.copy($scope.resetCopy);
                        $scope.formNuevaCancion.$setPristine();
                        $scope.formNuevaCancion.$setUntouched();
                        //limpiar audio
                        $scope.reset = "";
                        $scope.image = "";
                        $scope.cancion_idx = null;
                        setTimeout(function () {
                          $scope.refreshAudio = false;
                          $(".tagzoneaudio .opt-delete").click();
                          $(".tools button.md-warn:nth-child(2)").click();
                        }, 2000);
                        $preload.hide();
                      } else {
                        $msj.show(CMSDATA.MSJ.MSJ35, 'top right');
                        $preload.hide();
                      }
                  }).error(function(data) {
                      $msj.show(CMSDATA.MSJ.MSJ35, 'top right');
                      $preload.hide();
                  });
                };
                if (btnDonePhoto.size() === 1) {
                  btnDonePhoto.click();
                  $preload.show();
                  $timeout(function() {
                      fncLoadEditImg();
                  }, TIMEWAITBTNDONE);
                } else {
                  fncLoadEditImg();
                }
              }else{
                if($scope.cancion_idx===null){
                  $scope.lista_ranking.push($scope.nuevaCancion);
                }else{
                  $scope.lista_ranking[$scope.cancion_idx] = $scope.nuevaCancion;
                }
                $scope.nuevaCancion = angular.copy($scope.resetCopy);
                $scope.formNuevaCancion.$setPristine();
                $scope.formNuevaCancion.$setUntouched();
                $scope.reset = "";
                $scope.image = "";
                $scope.cancion_idx = null;
                setTimeout(function () {
                  $scope.refreshAudio = false;
                  $(".tagzoneaudio .opt-delete").click();
                  $(".tools button.md-warn:nth-child(2)").click();
                }, 2000);
              }
            }
          };

          $scope.editarCancion = function(item, index){
            $scope.nuevaCancion = angular.copy(item);
            var filter_status = ($scope.filteredRanking.length!=$scope.lista_ranking.length)?true:false;
            $scope.cancion_idx = (filter_status)?$scope.lista_ranking.indexOf(item):index;
            $scope.cancionfilter_idx = (filter_status)?index:null;
            $timeout(function() {
              //RESET IMG COVER
              $scope.image = item.imagen;
              $scope.reset = $create.guid();
            }, 250);

            if($scope.sitio=='lazona'||$scope.sitio=='oxigeno'||$scope.sitio=='studio92'){
              $scope.refreshAudio = {};
              $scope.refreshAudio.url = $scope.nuevaCancion.cancion_url?$scope.nuevaCancion.cancion_url:false;
            }
          };

          $scope.cancelarCancion = function(){
            $scope.nuevaCancion = angular.copy($scope.resetCopy);
            $scope.formNuevaCancion.$setPristine();
            $scope.formNuevaCancion.$setUntouched();
            $scope.cancion_idx = null;
            //limpiar img
            $scope.reset = "";
            $scope.image = "";
            //limpiar audio
            setTimeout(function () {
              $scope.refreshAudio = false;
              $(".tagzoneaudio .opt-delete").click();
            }, 2000);
          };

          $scope.canciones_selected = [];
          $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
          };
          $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
          };
          $scope.eliminarCancion = function(){
            angular.forEach($scope.canciones_selected, function(v, k){
              var index = $scope.lista_ranking.indexOf(v);
              $scope.lista_ranking.splice(index, 1);
            });
            $scope.canciones_selected = [];
          };
          $scope.cerrar = function() {
            $mdDialog.hide($scope.obj_lista);
          };
          $scope.guardarRanking = function() {
            modal.obj_lista[idx_selected].lista = $scope.lista_ranking;
            var data_guardado = {
              "seccion":{"slug": $scope.seccion},
              "bloque": $scope.tipo,
              "lista": modal.obj_lista
            };
            $http.post(URL + URLGUARDARTEMAS, data_guardado).success(function(data){
              var data = data;
              if(data.status){
                $msj.show(CMSDATA.MSJ.MSJ79, positionMSj);
                $mdDialog.hide(modal.obj_lista);
              }else{
                if(data.error){
                  $msj.show(data.error.message, positionMSj);
                }else{
                  $msj.show(CMSDATA.MSJ.MSJ80, positionMSj);
                }
              }
            }).error(function(data) {
              $timeout(function(){
                $preload.hide();
              },TIMERESULT);
            });
          };

          $scope.uploadCaptureImage = function(index){
            var elm;
            if(index > -1){
              elm = angular.element('#loadThumbDataGif_'+index);
            }else{
              elm = angular.element('#loadThumbDataGif');
            }
            elm.click();
            elm.off('change').on('change', function(evt){
                var file = evt.currentTarget.files[0];
                var formdata = new FormData();
                formdata.append('file', file);
                var DATA = formdata;
                $preload.show();
                $http.post(CMSDATA.URLMULTIPLEPHOTOS, DATA, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(data) {
                    var data = data;
                    if(data.status){
                      var url = data.response[0].foto.url;
                      if(index >= -1){
                        $scope.lista_ranking[index].imagen = url + "?" + new Date().getTime();
                      }else{
                        $scope.nuevaCancion.imagen = url + "?" + new Date().getTime();
                        $scope.showThumbData = true;
                        $scope.isDeleteThumb = true;
                        $scope.isLoadThumb = false;
                      }
                      $msj.show(CMSDATA.MSJ.MSJ56, positionMSj);
                      $preload.hide();
                    }else{
                      $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                      $preload.hide();
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                    $preload.hide();
                });
            });
          };

          $scope.removeCaptureImage = function(index){
            if(index >= -1){
              $scope.lista_ranking[index].imagen = "";
              var _elm = angular.element('#loadThumbDataGif_'+index);
              _elm.val('');
              _elm.off('change');
            }else{
              $scope.nuevaCancion.imagen = "";
              $scope.showThumbData = false;
              $scope.isDeleteThumb = false;
              $scope.isLoadThumb = true;
              var _elm = angular.element('#loadThumbDataGif');
              _elm.val('');
              _elm.off('change');
            }
          };

          $scope.onDropSongComplete = function(index, obj, $event){
            var filter_status = ($scope.filteredRanking.length!=$scope.lista_ranking.length)?true:false;
            if(!filter_status){
              if(typeof(index) != "undefined"){
                var otherIndex = $scope.filteredRanking.indexOf(obj);
                $scope.filteredRanking.splice(otherIndex, 1);
                $scope.filteredRanking.splice(index, 0, obj);
              }else{
                var otherIndex = $scope.filteredRanking.indexOf(obj);
                $scope.filteredRanking.splice(otherIndex, 1);
                $scope.filteredRanking.push(obj);
              }
            }
          };

        };

        ng.cantidad_max = {tag: 1, tag2: 1, tag3: 1};
        ng.cambiarTema = function(){
          definirMaximos();
          //cantidadMaximaPorTipo();
        };

        ng.cambiarModulo = function(tipo){
          if(!(ng.portada.cabecera instanceof Array) && !(ng.portada.medio instanceof Array) && !(ng.portada.cronologico_2 instanceof Array)){
            //if(){
              var slug = (tipo=='cabecera')?(ng.portada.cabecera?ng.portada.cabecera.slug:''):(tipo=='medio'?(ng.portada.medio?ng.portada.medio.slug:''):(ng.portada.cronologico_2?ng.portada.cronologico_2.slug:''));
              ng.destacadas[tipo] = [];
              if(tipo=='cabecera'){
                ng.encuesta = {'cabecera': false, 'medio': false, 'cronologico_2': false};
                ng.publicidad = {'cabecera': false, 'medio': false, 'cronologico_2': false};
                ng.envivo = {
                  'cabecera': {'estado': false, 'embed': {'codigo': '', 'tipo': '', 'sitio': ''}, 'evento': {}, 'streaming':''},
                  'medio': {'estado': false, 'embed': {'codigo': '', 'tipo': '', 'sitio': ''}, 'evento': {}, 'streaming':''}
                };
              }
              if(slug!=""){
                var data_post = {"seccion":{"slug":ng.seccion.slug}, "bloque":tipo, "slug":slug};
                $http.post(URL + URLLISTATEMAS, data_post).success(function(data) {
                  var data = data;
                  if(data.status){
                    var response = data.response;
                    ng.destacadas[tipo] = angular.isDefined(response.destacadas)?response.destacadas:[];
                    ng.encuesta[tipo] = angular.isDefined(response.encuesta)?response.encuesta:false;
                    ng.publicidad[tipo] = angular.isDefined(response.publicidad)?response.publicidad:false;
                    ng.envivo[tipo] = angular.isDefined(response.envivo)?response.envivo:false;
                  }else{
                    $msj.show(data.error.message, positionMSj);
                  }
                }).error(function(data) {
                  $timeout(function(){
                    $preload.hide();
                  },TIMERESULT);
                });
              }
            //}
          }
        };

        ng.querySearch   = function(query){
          return $http.get(URL + URLTAGSEARCH + query)
          .then(function(result){
            return $.map(result.data.response, function (n, i) { return n.nombre; });
          })
        };

        ng.tagsOnAppend = function(chip){
          //return {nombre: chip, slug: chip.split(" ").join("-").toLowerCase()};
          return chip;
        };

        //INIT FNC
        ng.initList = function(data) {
            ng.permissions = permissions.listPermission('destacadas');
            //Verificar acceso a secciones o especiales
            ng.formOptionSearch = false;
            ng.layerSearch = false;
            ng.custom = true;
            //RESPONSIVE METHOD
            ng.responsiveModal = function(scopeSelect){
                var $ifrm = angular.element('#ifrm');
                var scopeSelect = scopeSelect;
                switch (scopeSelect) {
                    case 'desktop':
                        $ifrm.width('100%');
                        break;
                    case 'tablet':
                        $ifrm.width('767px');
                        break;
                    case 'smartphone':
                        $ifrm.width('479px');
                        break;
                    default:
                        break;
                }
            };
            /* LISTA SITIO */
            ng.sitios = [];
            ng.sitio = {}; //Bar Tool
            ng.listaSitios = function() {
              //Sitios
              $cacheService.get(URL + URLLISTSITELIST).then(function(data) {
                var data = data;
                if (data.status) {
                    //SITE
                    ng.sitios = data.response;
                    //SET 1er ITEM
                    angular.forEach(ng.sitios, function(k,v){
                      if(k.slug == sitioxUrl)
                        ng.sitio = k;
                    });
                    angular.forEach(ng.tiposPortadas, function(k,v){
                      if(k.slug == tipoxUrl)
                        ng.tipo = k;
                    });
                    if(ng.sitio.hasOwnProperty('slug')&&ng.tipo.hasOwnProperty('slug')){
                      ng.listaSecciones(ng.sitio.slug, ng.tipo.slug); //OBTENIENDO LISTADO
                    }else{
                      $location.path(URLPORTADADEFAULT);
                    }
                } else {
                    $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
              }, function(msgError) {
                  $msj.show(CMSDATA.MSJ.MSJ17, positionMSj);
                }
              );
            };
            ng.listaSitios();
            /* END LISTA SITIO */

            /* LISTA SECCIONES */
            ng.cargaPortada = true;
            ng.cargaPortadaSelect = false;
            ng.secciones = [];
            ng.seccion = {}; //Bar Tool
            ng.listaSecciones = function(sitio, tipo) {
                var sitio = sitio;
                var tipo = tipo;
                //Secciones
                var url = URL;
                if(tipo == "secciones"){
                  url += URLDESTACADASSECCIONES + sitio;
                }else{
                  url += URLDESTACADASESPECIALES + sitio;
                }
                $http.get(url).success(function(data) {
                  var data = data;
                  if (data.status) {
                    //SITE
                    ng.secciones = data.response;
                    ng.cargaPortada = false;
                    ng.cargaPortadaSelect = true;
                    //SET 1er ITEM
                    if(!angular.isDefined($routeParams.seccion)){
                      ng.seccion = {};
                    }else{
                      angular.forEach(ng.secciones, function(k,v){
                        if(k.slug == seccionxUrl){
                          ng.seccion = k;
                        }
                      });
                      if(!ng.seccion.hasOwnProperty('slug')){
                        $location.path('/portadas/'+ng.tipo.slug+'/'+ng.sitio.slug);
                      }else{
                        //OBTENER TEMAS
                        ng.obtenerTemas();
                        //LEER NOTCIAS PATA LA PORTADA
                        ng.obtenerNoticias(ng.sitio);
                        //OBTENER Actividades
                        ng.obtenerActividad(ng.seccion);
                        //SEGUIR PORTADA -- comentado por ahora
                        ng.seguirPortada(ng.seccion);
                      }
                    }
                  } else {
                      $msj.show(data.error.message, positionMSj);
                      ng.cargaPortada = false;
                      ng.secciones = [];
                      $timeout(function(){
                        $preload.hide();
                      },TIMERESULT);
                  }
                }, function(msgError) {
                  $msj.show(CMSDATA.MSJ.MSJ85, positionMSj);
                  ng.cargaPortada = false;
                  ng.secciones = [];
                  $timeout(function(){
                    $preload.hide();
                  },TIMERESULT);
                }
              );
            };
            /* END LISTA SECCIONES */

            /* LISTA TEMAS */
            ng.obtenerTemas = function(){
              if(!ng.seccion){
                return false;
              }
              $http.post(URL + URLLISTATEMAS, {"seccion":{"slug":ng.seccion.slug}}).success(function(data) {
                var data = data;
                if(data.status){
                  var response = data.response;
                  if(response){
                    ng.lista = response;
                    if(ng.sitio.slug == "rpp"){
                      var podcast = {"nombre": "Podcast", "slug": "podcast", "tipo": "estandar"};
                      //if(ng.lista.hasOwnProperty('campana_cabecera') && ng.lista.campana_cabecera.indexOf(podcast)==-1){
                      //  ng.lista.campana_cabecera.push(podcast);
                      //}
                      //if(ng.lista.hasOwnProperty('cabecera') && ng.lista.cabecera.indexOf(podcast)==-1){
                      //  ng.lista.cabecera.push(podcast);
                      //}
                      if(ng.lista.campana_cuerpo){
                        if(ng.lista.hasOwnProperty('campana_cuerpo') && ng.lista.campana_cuerpo.indexOf(podcast)==-1){
                          ng.lista.campana_cuerpo.push(podcast);
                        }
                      }else{
                        ng.lista.campana_cuerpo = [];
                        ng.lista.campana_cuerpo.push({"nombre": "Ninguna", "slug": ""});
                        ng.lista.campana_cuerpo.push(podcast);
                      }
                      //if(ng.lista.hasOwnProperty('medio') && ng.lista.medio.indexOf(podcast)==-1){
                      //  ng.lista.medio.push(podcast);
                      //}
                      //if(ng.lista.hasOwnProperty('cronologico_2') && ng.lista.cronologico_2.indexOf(podcast)==-1){
                      //  ng.lista.cronologico_2.push(podcast);
                      //}
                    }
                  }else{
                    ng.lista = {
                      campana_cabecera: [],
                      cabecera: [],
                      campana_cuerpo: [{"nombre": "Ninguna", "slug": ""}, {"nombre": "Podcast", "slug": "podcast", "tipo": "estandar"}],
                      medio: [],
                      cronologico_1: [],
                      cronologico_2: [],
                      tag: [],
                      tag2: [],
                      tag3: [],
                      lateral_1 : [],
                      lateral_2 : [],
                      lateral_3 : [],
                      lateral_4 : [],
                      lateral_5 : [],
                      lateral_6 : [],
                      lateral_7 : [],
                      lateral_8 : [],
                      lateral_9 : []
                    };
                  }
                }else{
                  $msj.show(data.error.message, positionMSj);
                }
              }).error(function(data) {
                $timeout(function(){
                  $preload.hide();
                },TIMERESULT);
              });
            };

            /* OBTENER DATA X TIPO */
            ng.tiposPortadas = $cacheService.getTiposPortadas();
            ng.tipo = {};

            /* OBTENER DATA X SITIO */
            ng.obtenerDataXSitio = function() {
                ng.cargaPortada = true;
                ng.cargaPortadaSelect = false;
                ng.cancelarSeguimiento();
                $location.path('/portadas/'+ng.tipo.slug+'/'+ng.sitio.slug);
            };
            /* FIN OBTENER DATA X SITIO */

            /* OBTENER DATA X SECCION */
            ng.obtenerDataXSeccion = function() {
              ng.cargaPortada = true;
              ng.cargaPortadaSelect = false;
              ng.cancelarSeguimiento();
              $location.path('/portadas/'+ng.tipo.slug+'/'+ng.seccion.slug);
            };
            /* FIN OBTENER DATA X SECCION */

            /* OBTENER NOTICIAS */
            ng.obtenerNoticias = function(sitio){
                var sitio = sitio;
                //PHOTO EDIT
                $preload.show();
                var DATA = {
                  sitio: (ng.sitio)?ng.sitio:null,
                  seccion: (ng.seccion)?ng.seccion:null
                };
                $http.post(URL + URLLEERPORTADAS, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        var response = data.response;
                        /* Select Plantilla x sitio */
                        ng.plantillas = $cacheService.getPlantillas()[ng.sitio.slug];
                        var ruta = '';
                        if(response.tipo){
                            //SI HAY TIPO DE PLANTILLA
                            ng.plantilla = response.tipo;
                            ruta = CMSDATA.GLOBAL.URLTEMPLATE + 'portadas/' + ng.sitio.slug + '/' + response.tipo.slug + '.html';
                        }else{
                            //NO HAY TIPO DE PLANTILLA
                            ng.plantilla = ng.plantillas[0];
                            ruta = CMSDATA.GLOBAL.URLTEMPLATE + 'portadas/' + ng.sitio.slug + '/' + ng.plantillas[0].slug + '.html';
                        }
                        ng.cargarPlantilla(ruta);
                        ng.portada.tag = separarPropiedades('tag', response.tag);
                        ng.portada.tag2 = separarPropiedades('tag2', response.tag2);
                        ng.portada.tag3 = separarPropiedades('tag3', response.tag3);
                        ng.portada.cronologico_2 = separarPropiedades('cronologico_2', response.cronologico_2);
                        ng.portada.cronologico_1 = separarPropiedades('cronologico_1', response.cronologico_1);
                        ng.portada.lateral_1 = separarPropiedades('lateral_1', response.lateral_1);
                        ng.portada.lateral_2 = separarPropiedades('lateral_2', response.lateral_2);
                        ng.portada.lateral_3 = separarPropiedades('lateral_3', response.lateral_3);
                        ng.portada.lateral_4 = separarPropiedades('lateral_4', response.lateral_4);
                        ng.portada.lateral_5 = separarPropiedades('lateral_5', response.lateral_5);
                        ng.portada.lateral_6 = separarPropiedades('lateral_6', response.lateral_6);
                        ng.portada.lateral_7 = separarPropiedades('lateral_7', response.lateral_7);
                        ng.portada.lateral_8 = separarPropiedades('lateral_8', response.lateral_8);
                        ng.portada.lateral_9 = separarPropiedades('lateral_9', response.lateral_9);
                        ng.portada.cabecera = separarPropiedades('cabecera', response.cabecera);
                        ng.portada.medio = separarPropiedades('medio', response.medio);
                        ng.portada.campana_cabecera = separarPropiedades('campana_cabecera', response.campana_cabecera);
                        ng.portada.campana_cuerpo = separarPropiedades('campana_cuerpo', response.campana_cuerpo);
                        //traer torneo
                        ng.portada.torneo = separarPropiedades('torneo', response.torneo);

                        /*Cantidades máximas*/
                        definirMaximos();

                        /* Fin Select Plantilla x sitio */
                        ng.destacadas.portada = (response.destacadas)?validarDestacadas(response.destacadas):[];
                        ng.portada.titulo = (response.hasOwnProperty('titulo'))?response.titulo:"";
                        ng.portada.descripcion = (response.hasOwnProperty('descripcion'))?response.descripcion:"";
                        ng.portada.tags = (response.hasOwnProperty('tags'))?response.tags:[];

                        ng.portada.sitio = response.sitio;
                        ng.portada.seccion = response.seccion;
                        ng.portada.tipo = response.tipo;

                        ng.last_modified.current_epoctime = response.last_modified;

                        if(ng.sitio.slug=='rpp'){
                          ng.portadas_tipo_seccion[ng.tipo.slug] = angular.copy(ng.secciones);
                          var tipo_opposite = (ng.tipo.slug == 'secciones')?'especiales':'secciones';
                          var url_destacadas = (tipo_opposite == 'secciones')?URLDESTACADASSECCIONES:URLDESTACADASESPECIALES;
                          //Llenar los campos
                          $http.get(URL + url_destacadas + ng.sitio.slug).success(function(data) {
                            if (data.status){
                              ng.portadas_tipo_seccion[tipo_opposite] = data.response;
                            }
                          });
                          //Lista de portadas
                          ng.portada.portadas = (response.hasOwnProperty('portadas')?validarPortadas(response.portadas):[]);
                        }

                        /* Carga noticias en buscador */
                        ng.$broadcast('triggerBuscarPortadas', true);

                        $msj.show(CMSDATA.MSJ.MSJ45, 'top right');
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ46, 'top right');
                        $preload.hide();
                    }
                }).error(function(data) {
                    ng.destacadas.portada = [];
                    $msj.show(CMSDATA.MSJ.MSJ46, 'top right');
                    $preload.hide();
                });
            };
            /* FIN OBTENER NOTICIAS */
            var validarDestacadas = function(arrDestacadas){
              var arr = [];
              angular.forEach(arrDestacadas, function(k, v){
                if(k && k.nid)
                  arr.push(k);
                else{
                  ng.destacadas.portada[v] = null;
                  arr.push(null);
                }
              });
              return arr;
            };

            var validarPortadas = function(arrPortadas){
              angular.forEach(arrPortadas, function(v, k){
                if(v)
                  ng.portadas_tipo[k].tipo = v.tipo;
              });
              return arrPortadas;
            };

            /* OBTENER ACTIVIDAD */
            ng.obtenerActividad = function(seccion){
              ng.revisions = [];
              ng.revisionProgress = true;
              //get activity
              $http.post(URL + URLPORTADAACTIVITY, {"seccion":{"slug": seccion.slug}}).success(function(data) {
                var data = data;
                if(data.status){
                  var response = data.response[0];
                  if(response){
                    if(response['lista'].length > 0){
                      angular.forEach(response.lista, function (item, key) {
                        ng.revisions.push(item);
                      });
                    }
                  }
                }
                ng.revisionProgress = false;
              }).error(function(data) {
                $timeout(function(){
                  ng.revisionProgress = false;
                  $preload.hide();
                },TIMERESULT);
              });
            };

            /* FIN OBTENER ACTIVIDAD */

            /* SEGUIMIENTO DE PORTADA */
            ng.seguirPortada = function(seccion){
              stop = $interval(function() {
                if(ng.seccion){
                  if(ng.seccion.slug){
                    $http.post(URL + URLMODIFICACIONPORTADA, {"seccion":{"slug": seccion.slug}}).success(function(data){
                      var data = data;
                      if(data.status){
                        if(data.response){
                          if(ng.last_modified.current_epoctime && data.response.last_modified){
                            ng.last_modified.last_epoctime = data.response.last_modified;
                            if(ng.user.username!=data.response.auth.username){
                              ng.last_modified.need_refresh = (ng.last_modified.current_epoctime==data.response.last_modified)?false:true;
                              ng.last_modified.name = (data.response.auth.name)?data.response.auth.name:'';
                              ng.last_modified.foto = (data.response.auth.foto)?data.response.auth.foto:'';
                            }else{
                              ng.last_modified.need_refresh = false;
                            }
                          }
                        }
                      }
                    }).error(function(data) {
                      $timeout(function(){
                        ng.cancelarSeguimiento();
                      },TIMERESULT);
                    });
                  }
                }
              }, refreshTime*1000);
            };
            /* FIN SEGUIMIENTO DE PORTADA */

            ng.cancelarSeguimiento = function(){
              if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
              }
            };

            ng.$on('$destroy',function(){
              if(stop)
                  $interval.cancel(stop);
            });

            ng.recargarVista = function(){
              location.reload();
            };

            /* CARGAR TEMPLATE */
            ng.cargarPlantilla = function(ruta) {
                var ruta = ruta;
                if(!ruta){
                    ng.areaPlantilla = CMSDATA.GLOBAL.URLTEMPLATE + 'portadas/' + ng.sitio.slug + '/' + ng.plantilla.slug + '.html';
                }else{
                    ng.areaPlantilla = ruta;
                }
                /*Cantidades máximas*/
                definirMaximos();
            };
            /* FIN CARGAR TEMPLATE */

            //CLONE ELEMENT FOR DRAG
            var fileClone = CMSDATA.OBJNEW;
            ng.fileClone = fileClone;
            //DRAG START
            $rootScope.$on('draggable:start', function(evt, obj) {
                var obj = obj,
                    evt = evt;
                var hideClone = function() {
                    ng.fileClone = fileClone;
                    angular.element('#zone-clone').hide();
                };
                var data = obj.data;
                if (data && data.hasOwnProperty('drag')) {
                    ng.fileClone = data;
                } else {
                    hideClone();
                }
            });
            //DRAG END
            $rootScope.$on('draggable:end', function(event, obj, c) {
                var obj = obj;
                ng.fileClone = fileClone;
                angular.element('#zone-clone').show();
                ng.$digest();
            });

            //Reordenamiento Drag and Drop
            ng.onDropComplete = function(index, obj, evt, objArrayName) {
                var obj = obj,
                    index = index,
                    evt = evt,
                    objArray = ng.destacadas[objArrayName];
                //verificar que sea una noticia y tenga nid
                if (obj===null || !obj.nid) { return; }
                if (obj.drag) {
                    objArray[index] = obj;
                    delete objArray[index].drag;
                } else { //intercambio de posiciones de elementos
                    var otherObj = objArray[index];
                    var otherIndex = objArray.indexOf(obj);
                    objArray[index] = obj;
                    objArray[otherIndex] = otherObj;
                }
            };

            ng.inputEdit = function($event, ind) {
                var $event = $event;
                var elm = angular.element($event.currentTarget);
                var _in = elm.children('.input-edit-inner');
                var _out = elm.children('.input-edit-outer');
                _in.addClass('ng-hide');
                _out.removeClass('ng-hide');
                _out.find('textarea').off('blur').focus().on('blur', function() {
                    _in.removeClass('ng-hide');
                    _out.addClass('ng-hide');
                });
            };

            /*
            @change Photo
            */
            //OPEN PHOTO
            ng.ADDPHOTOTRANSFER = undefined;
            ng.openAddPhoto = function($event, type, $index, block, objArrayName, $indexNew) {
                var type = type,
                    index = $index,
                    block = block,
                    $indexNew = $indexNew,
                    objArrayName = objArrayName;
                var extension;
                var returnExtension = function(url) {
                    if (url) {
                        var arrUrl = url.split('.');
                        var ext = arrUrl.pop();
                        return ext.toLowerCase();
                    } else {
                        return '';
                    }
                };
                objArray = ng.destacadas[objArrayName];
                extension = returnExtension((block.hasOwnProperty('imagen_portada')) ? block.imagen_portada.url : undefined);
                //var extension = ();
                $mdDialog.show({
                        targetEvent: $event,
                        templateUrl: (extension === 'gif') ?
                            CMSDATA.GLOBAL.URLTEMPLATE + 'modal/portadas/changephotogif.html' : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/portadas/changephoto.html',
                        controller: modalOpenAddPhotoCtrl,
                        locals: {
                            modal: {
                                type: type,
                                index: index,
                                block: block,
                                extension: extension,
                                indexNew: $indexNew,
                                objArray: objArray
                            }
                        }
                    })
                    .then(function() {
                        if (ng.ADDPHOTOTRANSFER) {
                            console.log(ng.ADDPHOTOTRANSFER, 'ng.ADDPHOTOTRANSFER');
                            //DATA COPY PHOTO
                            objArray[ng.ADDPHOTOTRANSFER.index].imagen_portada.url = angular.copy(ng.ADDPHOTOTRANSFER.foto);
                            objArray[ng.ADDPHOTOTRANSFER.index].imagen_portada.hash = angular.copy(ng.ADDPHOTOTRANSFER.hash);
                        }
                    }, function() {
                        $mdDialog.cancel();
                    });
            };

            function modalOpenAddPhotoCtrl(scope, $mdDialog, $create, modal, $timeout) {

                console.log(modal, 'modal');
                //TYPE
                scope.modalType = modal.type;
                //INIt CONFIG
                var wImage = CMSDATA.DIMENSION16x9.widthXLarge,
                    hHeight = CMSDATA.DIMENSION16x9.heightXLarge,
                    hHeightVertical = Math.round((wImage * 16) / 9);
                //1018.6 <> 1019
                var orientation = function(wImage, hHeight) {
                    var wImage = wImage,
                        hHeight = hHeight;
                    return (wImage > hHeight) ? 'horizontal' : 'vertical';
                };
                var resetOrientation = function(_orientacion) {
                    var _orientacion = _orientacion;
                    if (_orientacion === 'horizontal') {
                        scope.widthImage = wImage;
                        scope.heightImage = hHeight;
                    } else {
                        scope.widthImage = hHeight;
                        scope.heightImage = wImage;
                    }
                };
                var resetImgUpload = function(wImage, hHeight) {
                    var wImage = wImage,
                        hHeight = hHeight;
                    resetOrientation(orientation(wImage, hHeight));
                    scope.image = '';
                    scope.reset = $create.guid();
                };
                //EDIT
                scope.foto = modal.block.imagen_portada.url;

                //EDIT ONLY GIF
                var extension = modal.extension;
                if (extension === 'gif') {
                    scope.showThumbData = true;
                    scope.isDeleteThumb = true;
                    scope.isLoadThumb = false;
                    scope.srcThumbData = modal.block.imagen_portada.url;
                } else {
                    //IMG UPLOAD NORMAL NOT GIF
                    $timeout(function() {
                        angular.element('#add-photo-modal input[name="thumb_values_edit"]').data('json', '-1');
                        var dataB64 = modal.block.imagen_portada.url;
                        if (dataB64 != null && dataB64.length != 0) {
                            var img = new Image();
                            resetImgUpload(wImage, hHeight);
                            img.onload = function() {
                                var height = img.height;
                                var width = img.width;
                                var wImage = parseInt((width) ? width : 1, 10),
                                    hHeight = parseInt((height) ? height : 0, 10);
                                resetOrientation(orientation(wImage, hHeight));
                                //scope.image = modal.block.foto.data.data;
                                scope.image = modal.block.imagen_portada.url;

                                scope.reset = $create.guid();
                                // code here to use the dimensions
                            }
                            img.src = modal.block.imagen_portada.url;
                        } else {
                            resetImgUpload(wImage, hHeight);
                        }
                    }, 250);
                }
                scope.removeCaptureImage = function() {
                    scope.srcThumbData = '';
                    scope.showThumbData = false;
                    scope.isDeleteThumb = false;
                    scope.isLoadThumb = true;
                    var _elm = angular.element('#loadThumbDataGif');
                    _elm.val('');
                    _elm.off('change');
                };
                scope.uploadCaptureImage = function() {
                    var elm = angular.element('#loadThumbDataGif');
                    elm.click();
                    angular.element('#loadThumbDataGif').on('change', function(evt) {
                        var files = evt.currentTarget.files;
                        var formdata = new FormData();
                        angular.forEach(files, function(v, i) {
                            formdata.append('file_' + i, files[i]);
                        });
                        var DATA = formdata;
                        $preload.show();
                        $http.post(CMSDATA.URLMULTIPLEPHOTOS, DATA, {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            } /* multipart/form-data */
                        }).
                        success(function(data) {
                            var data = data;
                            if (data.status) {
                                var foto = (data.response[0]) ? data.response[0].foto : '';
                                var url = (foto.url) ? foto.url : '';
                                scope.showThumbData = true;
                                scope.isDeleteThumb = true;
                                scope.isLoadThumb = false;
                                scope.srcThumbData = url;
                                console.log(scope.srcThumbData, 'scope.srcThumbData');
                                $preload.hide();
                            } else {
                                $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                                $preload.hide();
                            }
                        }).error(function(data) {
                            $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                            $preload.hide();
                        });
                    });
                };

                //CLOSE
                scope.closeOpenAddPhoto = function() {
                    $mdDialog.cancel();
                };
                scope.addOpenAddPhoto = function() {
                    if (extension === 'gif') {
                        //IF PHOTO GIF
                        scope.foto = scope.srcThumbData;
                        //PHOTO NO EDIT
                        ng.ADDPHOTOTRANSFER = {
                            foto: scope.foto,
                            tipo: 'photo',
                            index: modal.index,
                            type: modal.type,
                            indexNew: modal.indexNew
                        };
                        $mdDialog.hide();
                    } else {
                        //PHOTO NORMAL
                        //REVIEWS DATA IMG DONE
                        var btnDonePhoto = angular.element('#add-photo-modal .tools .md-cms-green');
                        //GET
                        var fncLoadEditImg = function() {
                            //TIME WAIT FOR BUTTON DONE
                            var elmThumbVal = angular.element('#add-photo-modal input[name="thumb_values_edit"]').data('json');
                            //UPLOAD PHOTO AJAX
                            var jsonData = elmThumbVal;

                            //PHOTO EDIT
                            $preload.show();
                            var DATA = (jsonData) ? angular.fromJson(jsonData) : null;
                            $http.post(URL + URLOADIMG, DATA).
                            success(function(data) {
                                var data = data;
                                if (data.status) {
                                    var response = data.response;
                                    ng.ADDPHOTOTRANSFER = {
                                        foto: response.url,
                                        hash: response.hash,
                                        tipo: 'photo',
                                        index: modal.index,
                                        type: modal.type,
                                        indexNew: modal.indexNew
                                    };
                                    //ng.objPortada[ng.ADDPHOTOTRANSFER.index].imagen_portada.url = ng.ADDPHOTOTRANSFER.foto;
                                    modal.objArray[ng.ADDPHOTOTRANSFER.index].imagen_portada.url = ng.ADDPHOTOTRANSFER.foto;
                                    $mdDialog.hide();
                                    $preload.hide();
                                    //FLOW NORMAL
                                    //END FLOW NORMAL
                                } else {
                                    $msj.show(CMSDATA.MSJ.MSJ35, 'top right');
                                    $preload.hide();
                                }
                            }).error(function(data) {
                                $msj.show(CMSDATA.MSJ.MSJ35, 'top right');
                                $preload.hide();
                            });

                        };
                        if (btnDonePhoto.size() === 1) {
                            btnDonePhoto.click();
                            $preload.show();
                            $timeout(function() {
                                fncLoadEditImg();
                            }, TIMEWAITBTNDONE);
                        } else {
                            fncLoadEditImg();
                        }
                        //END UPLOAD PHOTO AJAX
                    }
                };
            };

            ng.removeNotice = function($event, type, $index, block, objArrayName){
              if(ng.destacadas[objArrayName] && $index > -1){
                ng.destacadas[objArrayName][$index] = null;
                angular.forEach(ng.destacadas[objArrayName], function(valor, indice){
                  if(valor){
                    //recorrer destacadas buscando nueva posicion
                    for (var i = 0; i < ng.destacadas[objArrayName].length; i++) {
                      if(!ng.destacadas[objArrayName][i]){
                        ng.destacadas[objArrayName][i] = valor;
                        ng.destacadas[objArrayName][indice] = null;
                        break;
                      }
                    }
                  }
                });
              }
            };

            /* OPTIONS GENERAL */
            //OBJETO NOTICIAS PORTADA
            var prepararData = function(){
              var data  = angular.copy(ng.portada);
              //Validar que exista el destacado posicion 0
              if(!ng.destacadas.portada[0]){
                return false;
              }
              data.seccion = (!data.seccion)?ng.seccion:data.seccion;
              data.sitio = (!data.sitio)?ng.sitio:data.sitio;
              data.destacadas = ng.destacadas.portada;
              data.tipo = ng.plantilla;
              data.tag = unirPropiedades('tag', data.tag);
              data.tag2 = unirPropiedades('tag2', data.tag2);
              data.tag3 = unirPropiedades('tag3', data.tag3);
              data.cronologico_2 = unirPropiedades('cronologico_2', data.cronologico_2);
              data.cronologico_1 = unirPropiedades('cronologico_1', data.cronologico_1);
              data.lateral_1 = unirPropiedades('lateral_1', data.lateral_1);
              data.lateral_2 = unirPropiedades('lateral_2', data.lateral_2);
              data.lateral_3 = unirPropiedades('lateral_3', data.lateral_3);
              data.lateral_4 = unirPropiedades('lateral_4', data.lateral_4);
              data.lateral_5 = unirPropiedades('lateral_5', data.lateral_5);
              data.lateral_6 = unirPropiedades('lateral_6', data.lateral_6);
              data.lateral_7 = unirPropiedades('lateral_7', data.lateral_7);
              data.lateral_8 = unirPropiedades('lateral_8', data.lateral_8);
              data.lateral_9 = unirPropiedades('lateral_9', data.lateral_9);
              data.cabecera = unirPropiedades('cabecera', data.cabecera);
              data.medio = unirPropiedades('medio', data.medio);
              data.campana_cabecera = unirPropiedades('campana_cabecera', data.campana_cabecera);
              data.campana_cuerpo = unirPropiedades('campana_cuerpo', data.campana_cuerpo);
              data.portadas = unirPropiedadesPortada();
              return data;
            };

            var unirPropiedadesPortada = function(){
              angular.forEach(ng.portada.portadas, function(v, k){
                if(v)
                  v.tipo = ng.portadas_tipo[k].tipo;
              });
              return ng.portada.portadas;
            };

            var isEmpty = function(myObject){
              for(var key in myObject){
                if(myObject.hasOwnProperty(key)){
                  return false;
                }
              }
              return true;
            };

            //Click Preview
            ng.clickPreview = function($event) {
                var $event = $event;
                if(isEmpty(ng.seccion)){
                  if(ng.tipo.slug == 'especiales'){
                    $msj.show(CMSDATA.MSJ.MSJ87, positionMSj);
                  }else{
                    $msj.show(CMSDATA.MSJ.MSJ88, positionMSj);
                  }
                }else{
                  var data = prepararData();
                  if(!data){
                    $msj.show(CMSDATA.MSJ.MSJ90, 'top right');
                    return;
                  }
                  $preload.show();
                  $http.post(URL + URLPREVIEWDETACADA, data).
                  success(function(data) {
                      var data = data;
                      //$timeout(function(){
                      if (data.status) {
                          $mdDialog.show({
                              targetEvent: $event,
                              templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/portadas/previewnew.html',
                              locals: {
                                    response: data.response
                              },
                              controller: addPreviewNews
                          });
                          $msj.show(CMSDATA.MSJ.MSJ27, 'top right');
                      } else {
                          $preload.hide();
                          $msj.show(CMSDATA.MSJ.MSJ4, 'top right');
                      }
                      //},TIMERESULT);
                  }).error(function(data) {
                      $preload.hide();
                      $msj.show(CMSDATA.MSJ.MSJ4, 'top right');
                  });
                }
            };

            function addPreviewNews(scope, $mdDialog, $document, $sce, $preload, response) {
                var response = response;
                scope.readyDataByPublih = ng.parentReadyDataByPublish;
                scope.modalIsPublish = ng.isPublish;
                //Close Modal
                scope.addClosePreviewNews = function() {
                    $mdDialog.hide();
                };
                scope.publishInPreviewNews = function($event) {
                    var $event = $event;
                    ng.clickPublish($event, 'preview');
                };
                scope.ifrmAddHTML = $sce.trustAsHtml('<iframe src="' + response + '" frameborder="0" scrolling="auto" style="width:100%; height:500px" id="ifrm"></iframe>');
                $timeout(function() {
                    var ifrm = angular.element('#ifrm');
                    ifrm.css('visibility', 'hidden');
                    $timeout(function() {
                        ifrm.css('visibility', 'visible');
                        $preload.hide();
                    }, TIMERESULT * 8);
                }, 0);
                scope.previewRWD = 'desktop';
                scope.changePreviewRWD = function($event) {
                    var scopeSelect = scope.previewRWD;
                    ng.responsiveModal(scopeSelect);
                };
                scope.urlPreviewNewWindow = response;

            };

            //Click Guardar
            ng.clickSave = function($event) {
                var $event = $event;
                if(ng.last_modified.need_refresh){
                  $msj.show(CMSDATA.MSJ.MSJ86, positionMSj);
                  return false;
                }
                var data = prepararData();
                if(!data){
                  $msj.show(CMSDATA.MSJ.MSJ90, 'top right');
                  return;
                }
                $preload.show();
                $http.post(URL + URLDESTACADASGUARDAR, data).
                success(function(data) {
                    var data = data;
                    //$timeout(function(){
                    if (data.status) {
                        $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
                        $preload.hide();
                        ng.obtenerActividad(ng.seccion);
                    } else {
                      if(data.error){
                        $msj.show(data.error.message, positionMSj);
                      }else{
                        $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
                      }
                        $preload.hide();
                    }
                    //},TIMERESULT);
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ6, positionMSj);
                });
            };

            //PUBLISH
            ng.clickPublish = function($event, type) {
                var $event = $event;
                if(ng.last_modified.need_refresh){
                  $msj.show(CMSDATA.MSJ.MSJ86, positionMSj);
                  return false;
                }
                var data = prepararData();
                if(!data){
                  $msj.show(CMSDATA.MSJ.MSJ90, 'top right');
                  return;
                }
                $preload.show();
                $http.post(URL + URLPUBLICARDESTACADAS, data).
                success(function(data) {
                    var data = data;
                    //$timeout(function(){
                    if (data.status) {
                        $msj.show(CMSDATA.MSJ.MSJ9,positionMSj);
                        $preload.hide();
                        ng.obtenerActividad(ng.seccion);
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ50,positionMSj);
                        $preload.hide();
                    }
                    //},TIMERESULT);
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ50, positionMSj);
                });
            };

            //ACCIONES permitidas
            ng.mostrarPermisos = false;
            ng.tooglePermisos = function(){
              ng.mostrarPermisos = !ng.mostrarPermisos;
            };

            var unirPropiedades = function(type, obj){
              if(obj){
                obj.cantidad = ng.cantidad[type];
                //Validar si es cabecera
                if(type=='cabecera'||type=='medio'||type=='cronologico_2'){
                  obj.destacadas = ng.destacadas[type];
                  obj.publicidad = ng.publicidad[type];
                  obj.encuesta = ng.encuesta[type];
                  if(type=='cabecera'||type=='medio'){
                    var estado = !angular.isDefined(ng.envivo[type])?false:ng.envivo[type].estado;
                    obj.envivo = {
                      'estado': estado,
                      'embed': (estado)?ng.envivo[type].embed:{'codigo': '', 'tipo': '', 'sitio': ''},
                      'evento': (estado)?ng.envivo[type].evento:{},
                      'streaming': (estado)?ng.envivo[type].streaming:''
                    }
                  }
                }
                //Podcast de los restantes
                if(type=='campana_cabecera'||type=='campana_cuerpo'||type=='cabecera'||type=='medio'||type=='cronologico_2'){
                  if(angular.isDefined(ng.podcast[type].pcid)){
                    if(obj.slug!='podcast'){
                      if(angular.isDefined(obj.pcnombre)){
                        delete obj["pcnombre"];
                      }
                      if(angular.isDefined(obj.pcid)){
                        delete obj["pcid"];
                      }
                    }else{
                      obj.pcid = ng.podcast[type].pcid;
                      obj.pcnombre = ng.podcast[type].pcnombre;
                    }
                  }
                }
              }else{
                obj = {"nombre": "Ninguna", "slug": ""};
              }
              return obj;
            };

            var separarPropiedades = function(type, obj){
              if(obj){
                if(obj.hasOwnProperty('cantidad')){
                  ng.cantidad[type] = obj['cantidad'];
                  delete obj['cantidad'];
                }
                //Validar si es cabecera
                if(type=='cabecera'||type=='medio'||type=='cronologico_2'){
                  ng.destacadas[type] = angular.isDefined(obj.destacadas)?obj.destacadas:[];
                  ng.publicidad[type] = !angular.isDefined(obj.publicidad)?false:obj.publicidad;
                  ng.encuesta[type] = !angular.isDefined(obj.encuesta)?false:obj.encuesta;
                  if(type=='cabecera'||type=='medio'){
                    if(angular.isDefined(obj.envivo)){
                      ng.envivo[type].estado = obj.envivo.estado;
                      ng.envivo[type].embed = obj.envivo.embed;
                      ng.envivo[type].evento = obj.envivo.evento;
                      ng.envivo[type].streaming = obj.envivo.streaming;
                    }
                  }
                }
                //Podcast
                if(angular.isDefined(obj.pcid)){
                  ng.podcast[type] = {'pcid': obj.pcid, 'pcnombre': obj.pcnombre};
                }
              }else{
                obj = {"nombre": "Ninguna", "slug": ""};
              }
              return obj;
            };

            //laterales
            ng.onDropLateral = function($event, oldIndex, newIndex){
              //mover las listas
              var oldList = (ng.lista['lateral_'+oldIndex])? angular.copy(ng.lista['lateral_'+oldIndex]):[];
              var newList = (ng.lista['lateral_'+newIndex])? angular.copy(ng.lista['lateral_'+newIndex]):[];
              var oldObj = angular.copy(ng.portada['lateral_'+oldIndex]);
              var newObj = angular.copy(ng.portada['lateral_'+newIndex]);
              ng.guardarLateral('lateral_'+oldIndex, newList, newObj);
              ng.guardarLateral('lateral_'+newIndex, oldList, oldObj);
            };

            ng.guardarLateral = function(bloque, lista, objeto) {
              var data_guardado = {
                "seccion": {"slug": ng.seccion.slug},
                "bloque": bloque,
                "lista": lista
              };
              $http.post(URL + URLGUARDARTEMAS, data_guardado).success(function(data){
                var data = data;
                if(data.status){
                  ng.lista[bloque] = lista;
                  ng.portada[bloque] = objeto;
                }else{
                  if(data.error){
                    $msj.show(data.error.message, positionMSj);
                  }else{
                    $msj.show(CMSDATA.MSJ.MSJ80, positionMSj);
                  }
                }
              }).error(function(data) {
                $timeout(function(){
                  $preload.hide();
                },TIMERESULT);
              });
            };

            ng.obtenerClase = function(tag, cantidad){
              var clase = "";
              if(cantidad > 0 && tag.slug!="")
                clase = tag.tipo+'_'+cantidad;
              return clase;
            };

            definirMaximos = function(){
              if(
                ng.plantilla.slug=='ninguna'||ng.plantilla.slug=='portada1x2'||
                ng.plantilla.slug=='portada1x3'||ng.plantilla.slug=='portada1x3-4'||
                ng.plantilla.slug=='portada1x4'||ng.plantilla.slug=='portada1x6'
              ){
                ng.cantidad_max.tag = 3;
                ng.cantidad_max.tag2 = 3;
                //tema
                if(ng.portada.tag){
                  if(ng.portada.tag.slug!=""){
                    if(ng.tag_tipos[ng.portada.tag.tipo]){
                      if(ng.tag_tipos[ng.portada.tag.tipo].tamano == 1){
                        ng.cantidad_max.tag = 6;
                      }else if (ng.tag_tipos[ng.portada.tag.tipo].tamano == 3) {
                        ng.portada.tag = {"nombre": "Ninguna", "slug": ""};
                      }
                    }
                  }
                }
                //tema2
                if(ng.portada.tag2){
                  if(ng.portada.tag2.slug!=""){
                    if(ng.tag_tipos[ng.portada.tag2.tipo]){
                      if(ng.tag_tipos[ng.portada.tag2.tipo].tamano == 1){
                        ng.cantidad_max.tag2 = 6;
                      }else if (ng.tag_tipos[ng.portada.tag2.tipo].tamano == 3) {
                        ng.portada.tag2 = {"nombre": "Ninguna", "slug": ""};
                      }
                    }
                  }
                }
              }else if (ng.plantilla.slug=='portada1x9') {
                ng.cantidad_max.tag = 3;
                ng.cantidad_max.tag2 = 3;
                ng.cantidad_max.tag3 = 3;
                //tema
                if(ng.portada.tag){
                  if(ng.portada.tag.slug!=""){
                    if(ng.tag_tipos[ng.portada.tag.tipo]){
                      if(ng.tag_tipos[ng.portada.tag.tipo].tamano == 1){
                        ng.cantidad_max.tag = 6;
                      }else if (ng.tag_tipos[ng.portada.tag.tipo].tamano == 3) {
                        ng.portada.tag = {"nombre": "Ninguna", "slug": ""};
                      }
                    }
                  }
                }
                //tema2
                if(ng.portada.tag2){
                  if(ng.portada.tag2.slug!=""){
                    if(ng.tag_tipos[ng.portada.tag2.tipo]){
                      if(ng.tag_tipos[ng.portada.tag2.tipo].tamano == 1){
                        ng.cantidad_max.tag2 = 6;
                      }else if (ng.tag_tipos[ng.portada.tag2.tipo].tamano == 3) {
                        ng.portada.tag2 = {"nombre": "Ninguna", "slug": ""};
                      }
                    }
                  }
                }
                //tema3
                if(ng.portada.tag3){
                  if(ng.portada.tag3.slug!=""){
                    if(ng.tag_tipos[ng.portada.tag3.tipo]){
                      if(ng.tag_tipos[ng.portada.tag3.tipo].tamano == 1){
                        ng.cantidad_max.tag3 = 6;
                      }else if (ng.tag_tipos[ng.portada.tag3.tipo].tamano == 3) {
                        ng.portada.tag3 = {"nombre": "Ninguna", "slug": ""};
                      }
                    }
                  }
                }
              }
            };
        };
    }
]);

});
