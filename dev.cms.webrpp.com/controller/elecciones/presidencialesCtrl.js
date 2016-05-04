'use strict';

define(['app'], function (app) {

  app.register.controller('presidencialesCtrl',
    [
      '$scope',
      '$rootScope',
      '$location',
      '$preload',
      '$http',
      '$mdDialog',
      '$msj',
      '$timeout',
      '$logout',
      '$login',
      '$localStorage',
      '$routeParams',
      '$mdToast',
      function(
        $scope,
        $rootScope,
        $location,
        $preload,
        $http,
        $mdDialog,
        $msj,
        $timeout,
        $logout,
        $login,
        $localStorage,
        $routeParams,
        $mdToast) {

          var
            ng = $scope,
            nid = $routeParams.nid,
            URL = {
              base: CMSDATA.GLOBAL.URLBASE,
              sesion:'session',
              logout:'session/logout',
              conteo: {
                guardar: 'sondeos/guardar_conteo/',
                lista: 'sondeos/lista_conteos',
                publicar: 'sondeos/publicar_conteos',
                leer: 'sondeos/leer_conteo/'
              },
              candidatos:{
                listar:'sondeos/candidatos',
                guardar:'sondeos/guardar_candidatos',
                eliminar:''
              },
              fuentes: {
                listar: 'sondeos/encuestadoras'
              }
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

          // Close Session
          ng.disabledCloseSession = false;
          ng.closeSession = function() {
            $logout.get(URL.base + URL.logout);
          };

          // ---- FIN SESION ---- //

          // ---- INICIO HEADER ---- //
          ng.formOptionSearch = false;
          ng.layerSearch = false;
          var $body = angular.element('body');
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

          // ---- INICIO DETALLE ---- //

          var inicializarObjetos=function(){
            // objetos
            ng.conteo = {
              current: {'nombre': 'General', 'slug': 'general', 'escrutadas': 0}
            };

            ng.votos = {
              'id': null,
              'fuente': {"_id":"","nombre":"","slug":""},
              'pct': '',
              'ganadores':{},
              'dpt':{
                general: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                tac: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                moq: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                anc: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                cus: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                are: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
              	pun: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                mdd: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                huc: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                tum: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                lim: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                lpr: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                jun: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                apu: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                caj: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                hua: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                piu: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
              	ama: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                lor: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                aya: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                cal: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                lal: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
              	pas: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                sam: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                uca: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                lam: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}},
                ica: {'candidatos':{}, 'escrutadas':{"votos":0,"porcentaje":"0"}, 'blanco':{"votos":0,"porcentaje":"0"}, 'nulos':{"votos":0,"porcentaje":"0"}, 'impugnados':{"votos":0,"porcentaje":"0"}}
              },
              'url_xml': ''
            };

            ng.departamentos = [
              {'nombre': 'General', 'slug': 'general'},
              {'nombre': 'Amazonas', 'slug': 'ama'}, {'nombre': 'Ancash', 'slug': 'anc'}, {'nombre': 'Apurimac', 'slug': 'apu'}, {'nombre': 'Arequipa', 'slug': 'are'}, {'nombre': 'Ayacucho', 'slug': 'aya'},
              {'nombre': 'Cajamarca', 'slug': 'caj'}, {'nombre': 'Callao', 'slug': 'cal'}, {'nombre': 'Cusco', 'slug': 'cus'}, {'nombre': 'Huancavelica', 'slug': 'huc'}, {'nombre': 'Huanuco', 'slug': 'hua'},
              {'nombre': 'Ica', 'slug': 'ica'}, {'nombre': 'Junin', 'slug': 'jun'}, {'nombre': 'La Libertad', 'slug': 'lal'}, {'nombre': 'Lambayeque', 'slug': 'lam'}, {'nombre': 'Lima', 'slug': 'lim'},
              {'nombre': 'Lima - provincial', 'slug': 'lpr'},
              {'nombre': 'Loreto', 'slug': 'lor'}, {'nombre': 'Madre De Dios', 'slug': 'mdd'}, {'nombre': 'Moquegua', 'slug': 'moq'}, {'nombre': 'Pasco', 'slug': 'pas'}, {'nombre': 'Piura', 'slug': 'piu'},
              {'nombre': 'Puno', 'slug': 'pun'}, {'nombre': 'San Martin', 'slug': 'sam'}, {'nombre': 'Tacna', 'slug': 'tac'}, {'nombre': 'Tumbes', 'slug': 'tum'}, {'nombre': 'Ucayali', 'slug': 'uca'}
            ];

            var obtenerFuentes = function(){
              ng.fuentes = [];
              $http.get(URL.base + URL.fuentes.listar).success(function(response){
                  var data=response.response;
                  if(response.status){
                    angular.copy(data, ng.fuentes);
                  }
              }).error(
              function(msgError) {
                $msj.show('Error: No se pudo cargar las fuentes.', CMSDATA.POSITIONMSJ);
              });
            };
            obtenerFuentes();

            var obtenerListaCandidatos = function(){
              ng.listaCandidatos = [];
              $http.get(URL.base + URL.candidatos.listar).success(function(response){
                  var data=response.response;
                  if(response.status){
                    angular.copy(data, ng.listaCandidatos);
                    //loop candidatos
                    angular.forEach(data, function(v, k){
                      var id = v['id']; //id candidato
                      ng.votos['ganadores'][id] = false;
                      angular.forEach(ng.votos['dpt'], function(i, j){
                        i['candidatos'][id] = {'votos': 0, 'porcentaje': 0};
                      });
                    });
                    ng.votos_original = angular.copy(ng.votos);
                    obtenerHistoriaConteo();
                  }
              }).error(
              function(msgError) {
                $msj.show('Error: No se pudo cargar los candidatos.', CMSDATA.POSITIONMSJ);
              });
            };
            obtenerListaCandidatos();
          };

        //ALERT ERROR LIST
        var toastErrorList = function(errorList, errorMsj){
            var _err = '', errorList = errorList, errorMsj = errorMsj;
            angular.forEach(errorList, function(v, i){
                _err += '<li>' + v + '</li>';
            });
            var type = 'toast-error--list';
            $mdToast.show({
               template: '<md-toast class="md-toast ' + type +'">' +
               '<p class="p-info">' + errorMsj + ':</p>'+
               '<ul>'+
                _err +
               '</ul>'+
               '</md-toast>',
               hideDelay: 7000,
               position: CMSDATA.POSITIONMSJ
           });
        };

        var obtenerHistoriaConteo = function(fuente){
          var fuente_param = (fuente)?fuente.slug:'onpe';
          ng.historialConteo = [];
          $http.get(URL.base + URL.conteo.lista + '?fuente='+fuente_param).success(function(response){
              var data=response.response;
              if(response.status){
                angular.copy(data, ng.historialConteo);
                //focus first element
                if(data.length > 0){
                  ng.clickViewActivity(data[0]._id);
                }
              }else{
                ng.votos = angular.copy(ng.votos_original);
                ng.votos.fuente = (fuente)?fuente:ng.fuentes[ng.fuentes.length-1];
              }
          }).error(
          function(msgError) {
            $msj.show('Error: No se pudo cargar los candidatos.', CMSDATA.POSITIONMSJ);
          });
        };

          ng.guardar = function(tipo){
            if(tipo=='crear'){
              ng.votos.id = null;
            }
            //fixear guardado si tiene vacio porcentaje y voyo
            if(!('votos' in ng.votos['dpt'][ng.conteo.current.slug]['blanco']) || !('porcentaje' in ng.votos['dpt'][ng.conteo.current.slug]['blanco']))
              ng.votos['dpt'][ng.conteo.current.slug]['blanco'] = {'votos': 0, 'porcentaje': 0};
            if(!('votos' in ng.votos['dpt'][ng.conteo.current.slug]['escrutadas']) || !('porcentaje' in ng.votos['dpt'][ng.conteo.current.slug]['escrutadas']))
              ng.votos['dpt'][ng.conteo.current.slug]['escrutadas'] = {'votos': 0, 'porcentaje': 0};
            if(!('votos' in ng.votos['dpt'][ng.conteo.current.slug]['impugnados']) || !('porcentaje' in ng.votos['dpt'][ng.conteo.current.slug]['impugnados']))
              ng.votos['dpt'][ng.conteo.current.slug]['impugnados'] = {'votos': 0, 'porcentaje': 0};
            if(!('votos' in ng.votos['dpt'][ng.conteo.current.slug]['nulos']) || !('porcentaje' in ng.votos['dpt'][ng.conteo.current.slug]['nulos']))
              ng.votos['dpt'][ng.conteo.current.slug]['nulos'] = {'votos': 0, 'porcentaje': 0};

            angular.forEach(ng.votos['dpt'][ng.conteo.current.slug]['candidatos'], function(v, k){
              if(!('votos' in v) || !('porcentaje' in v)){
                ng.votos['dpt'][ng.conteo.current.slug]['candidatos'][k] = {'votos': 0, 'porcentaje': 0};
              }
            });

            $preload.show();
            $http.post(URL.base + URL.conteo.guardar +'?dept='+ng.conteo.current.slug, ng.votos).success(function(response) {
              $preload.hide();
              if(response.status){
                if(tipo=='crear'){
                  $msj.show('Se registró correctamente.', CMSDATA.POSITIONMSJ);
                }else{
                  $msj.show('Se modificó correctamente.', CMSDATA.POSITIONMSJ);
                  ng.votos.id = null;
                }
                obtenerHistoriaConteo(ng.votos.fuente);
              }else{
                $preload.hide();
                toastErrorList(response.error.fields, response.error.message);
                //Revision de campos con errores
              }
            }).error(function(response) {
                $preload.hide();
                $msj.show('No se pudo guardar los votos', CMSDATA.POSITIONMSJ);
            });
          };

          ng.cambiarFuente = function(){
            obtenerHistoriaConteo(ng.votos.fuente);
          };

          // ---- FIN DETALLE ---- //

          // ---- INICIO MODAL ---- //

          // ---- FIN MODAL ---- //

          ng.clicVolver = function(){ $location.path('/elecciones'); };

          ng.clickViewActivity = function(id){
            $preload.show();
            var url = (id) ? URL.conteo.leer + '/' + id : URL.conteo.leer;
            $http.get(URL.base + url).success(function(response){
                $preload.hide();
                var data=response.response;
                if(response.status){
                  //actualizar data
                  ng.votos = {
                    'id': data.id,
                    'fuente': data.fuente,
                    'ganadores': data.ganadores,
                    'pct': data.pct,
                    'dpt': data.dpt,
                    'url_xml': data.url_xml
                  };

                  ng.conteo.current.escrutadas = angular.copy(ng.votos['dpt']['general']['escrutadas']['porcentaje']);

                }
            }).error(
            function(msgError) {
              $msj.show('Error: No se pudo cargar el detalle.', CMSDATA.POSITIONMSJ);
            });
          };

          ng.publicar = function(){
            ng.votos.id = null;
            $preload.show();
            $http.post(URL.base + URL.conteo.publicar, ng.votos).success(function(response) {
              $preload.hide();
              if(response.status){
                $msj.show('Se publicó correctamente.', CMSDATA.POSITIONMSJ);
              }else{
                $preload.hide();
                toastErrorList(response.error.fields, response.error.message);
                //Revision de campos con errores
              }
            }).error(function(response) {
                $preload.hide();
                $msj.show('No se pudo guardar los votos', CMSDATA.POSITIONMSJ);
            });
          };

          var init=function(){
            verificarSesion();
          }();

          ng.cambiarDepartamento = function(){
            $('#mapa-peru').vectorMap('deselect', '');
            $('#mapa-peru').vectorMap('select', ng.conteo.current.slug);
            ng.conteo.current.escrutadas = angular.copy(ng.votos['dpt'][ng.conteo.current.slug]['escrutadas']['porcentaje']);
          };

  }]);

});
