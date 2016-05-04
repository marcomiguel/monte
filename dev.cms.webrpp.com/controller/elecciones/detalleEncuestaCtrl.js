'use strict';

define(['app'], function (app) {

  app.register.controller('detalleEncuestaCtrl', 
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
              encuesta: {
                detalle: '/sondeos/encuesta/',
                guardar: '/sondeos/guardar_encuestas'
              },
              encuestadoras:{
                listar:'sondeos/encuestadoras',
                guardar:'sondeos/guardar_encuestadoras'
              },
              candidatos:{
                listar:'sondeos/candidatos',
                guardar:'sondeos/guardar_candidatos',
                eliminar:''
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

          var obtenerListaEncuestadoras = function(){
            ng.listaEncuestadoras = [];
            // $preload.show();
            // ng.searchLoad=true;
            $http.get(URL.base + URL.encuestadoras.listar).success(function(response){
                var data=response.response;
                if(response.status){
                  angular.copy(data, ng.listaEncuestadoras);
                  // $preload.hide();
                  // ng.searchLoad=false;
                }
            }).error(
            function(msgError) {
              $msj.show('Error: No se pudo cargar las encuestadoras.', CMSDATA.POSITIONMSJ);
            });
          };

          var inicializarObjetos=function(){
            // listas
            obtenerListaEncuestadoras();
            // objetos
            ng.encuesta = {
              encuestadora: null,
              flash_electoral: false,
              fecha: new Date(),
              mesas_escrutadas:'',
              votos:'',
              candidatos:[
                {
                  _id:'',
                  nombre:'',
                  partido:'',
                  foto:'',
                  porcentaje:'',
                  segunda:false
                },
                {
                  _id:'',
                  nombre:'',
                  partido:'',
                  foto:'',
                  porcentaje:'',
                  segunda:false
                },
                {
                  _id:'',
                  nombre:'',
                  partido:'',
                  foto:'',
                  porcentaje:'',
                  segunda:false
                },
                {
                  _id:'',
                  nombre:'',
                  partido:'',
                  foto:'',
                  porcentaje:'',
                  segunda:false
                },
                {
                  _id:'',
                  nombre:'',
                  partido:'',
                  foto:'',
                  porcentaje:'',
                  segunda:false
                },
                {
                  _id:'',
                  nombre:'',
                  partido:'',
                  foto:'',
                  porcentaje:'',
                  segunda:false
                }
              ]
            };
          };

          var verificarDetalle=function(){
            if(nid){ // EDITAR
              obtenerDetalle(nid);
            }else{ // AGREGAR
              // inicializarObjetos();
              inicializarObjetos();
            }
            
          };

          var obtenerDetalle=function(nid){
            $preload.show();
            $login.get(URL.base + URL.encuesta.detalle+nid).then(
              function(response) {
                var data=response.response;
                if(response.status){
                  if(data){ // detalle existe
                    inicializarObjetos();
                    angular.copy(data, ng.encuesta);
                    ng.encuesta.fecha = new Date(ng.encuesta.fecha);
                    $preload.hide();
                  }else{
                    $location.path('/elecciones');
                  }
                }else{
                            
                }
              },
              function(msgError) {
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ6, CMSDATA.POSITIONMSJ);
              }
            );
          };


          ng.fields = {
            titulo: '',
            tipo: ''
        };

        var clearRevisionErrorFiled = function(){
          ng.fields.titulo = '';
          ng.fields.tipo = '';  
        };

        var revisionErrorFiled = function(fields){
            var fields = fields;
            if(fields){
                ng.fields.titulo = fields.hasOwnProperty('titulo')?fields.titulo:'';
                ng.fields.tipo = fields.hasOwnProperty('tipo')?fields.tipo:'';
            }
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

        ng.cambiarSegundaVuelta = function(idx){
          var count=0;
          for (var i = 0; i < ng.encuesta.candidatos.length; i++) {
            if(ng.encuesta.candidatos[i].segunda){
              count++;
            }
          };
          if(count>2){
            $msj.show('Sólo 2 candidatos pasan a segunda vuelta.', CMSDATA.POSITIONMSJ);
            ng.encuesta.candidatos[idx].segunda = false;
          }  
        };

        ng.guardar = function(esNuevo){
          if(esNuevo) delete ng.encuesta._id;
          $preload.show();
          $http.post(URL.base + URL.encuesta.guardar, ng.encuesta).
            success(function(response) {
              $preload.hide();
              if(response.status){
                angular.copy(response.response, ng.encuesta);
                ng.encuesta.fecha = new Date(ng.encuesta.fecha);
                $msj.show(CMSDATA.MSJ.MSJ5, CMSDATA.POSITIONMSJ);
                // clearRevisionErrorFiled();
                // if(tipo=='agregar'){
                //   $location.path('/elecciones/encuesta/'+ng.encuesta._id);
                // }
              }else{
                $preload.hide();
                toastErrorList(response.error.fields, response.error.message);
                //Revision de campos con errores
                revisionErrorFiled(response.error.fields);
              }
            }).error(function(response) {
                $preload.hide();
                $msj.show('No se pudo guardar la encuesta', CMSDATA.POSITIONMSJ);
          });
        };

        

        $scope.dragoverCallback = function(event, index, external, type) {
                $scope.logListEvent('dragged over', event, index, external, type);
                // Disallow dropping in the third row. Could also be done with dnd-disable-if.
                return index < 10;
            };

            $scope.dropCallback = function(event, index, item, external, type, allowedType) {
                $scope.logListEvent('dropped at', event, index, external, type);
                if (external) {
                    if (allowedType === 'itemType' && !item.label) return false;
                    if (allowedType === 'containerType' && !angular.isArray(item)) return false;
                }
                return item;
            };

            $scope.logEvent = function(message, event) {
                // console.log(message, '(triggered by the following', event.type, 'event)');
                // console.log(event);
            };

            $scope.logListEvent = function(action, event, index, external, type) {
                var message = external ? 'External ' : '';
                message += type + ' element is ' + action + ' position ' + index;
                $scope.logEvent(message, event);
            };

          // ---- FIN DETALLE ---- //

          // ---- INICIO MODAL ---- //
          
          ng.mostrarModalSeleccionarCandidato = function($event, $index, detail){
            $event.preventDefault();
            var index = $index;
            $mdDialog.show({
              targetEvent : $event,
              scope: $scope,
              preserveScope: true,
              templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/elecciones/seleccionar-candidato.html',
              controller : modalSeleccionarCandidatoCtrl,
              locals: {
                modal : {
                  index: index,
                  detail: detail
                }
              }
            })
            .then(function() {
              
            }, function() {
              $mdDialog.cancel();
            });
          };

          function modalSeleccionarCandidatoCtrl(scope, modal) {
            var obtenerListaCandidatos = function(){
              scope.listaCandidatos = [];
              // $preload.show();
              // ng.searchLoad=true;
              $http.get(URL.base + URL.candidatos.listar).success(function(response){
                  var data=response.response;
                  if(response.status){
                    angular.copy(data, scope.listaCandidatos);
                    // $preload.hide();
                    // ng.searchLoad=false;
                  }
              }).error(
              function(msgError) {
                $msj.show('Error: No se pudo cargar los candidatos.', CMSDATA.POSITIONMSJ);
              });
            };

            obtenerListaCandidatos();

            //TYPE
            if(modal.detail.nombre&&modal.detail.partido){
              modal.type = 'edit';
              scope.modalType = 'edit';
            }else{
              modal.type = 'add';
              scope.modalType = 'add';
            }
            if(modal.type === 'edit'){
                scope.candidato = modal.detail;
            }else{
                //CLEAR ADD
                scope.candidato = null;
            }
            //CLOSE
            scope.cancelar = function(){
                $mdDialog.cancel();
            };
            scope.aceptar = function(){
              var existe=false;
              for (var i = 0; i < ng.encuesta.candidatos.length; i++) {
                if(ng.encuesta.candidatos[i]._id==scope.candidato._id){
                  existe=true;
                  $msj.show('El candidato ya ha sido seleccionado.', CMSDATA.POSITIONMSJ);
                  return false;
                }else{
                  existe=false;
                }
              };
              if(!existe){
                ng.encuesta.candidatos[modal.index]._id = scope.candidato._id;
                ng.encuesta.candidatos[modal.index].nombre = scope.candidato.nombre;
                ng.encuesta.candidatos[modal.index].nombrecorto = scope.candidato.nombrecorto;
                ng.encuesta.candidatos[modal.index].partido = scope.candidato.partido;
                ng.encuesta.candidatos[modal.index].foto = scope.candidato.foto;
                $mdDialog.hide();
              }
            };
          };

          ng.mostrarModalEncuestadoras = function(ev){
            $mdDialog.show({
              targetEvent: ev,
              templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/elecciones/encuestadoras.html',
              locals: {
                modal: {
                    // tag_tipos: ng.tag_tipos,
                    lista: ng.listaEncuestadoras,
                    // tipo: key,
                    // seccion: ng.seccion.slug
                }
              },
              controller: modalEncuestadorasCtrl
            }).then(function(result) {
              // ng.lista[key] = result;
            }, function() {
                $mdDialog.cancel();
            });
          };

          function modalEncuestadorasCtrl($scope, $mdDialog, modal){
            // $scope.lista_original = angular.copy(modal.lista);
            $scope.tag_lista = angular.copy(modal.lista);
            $scope.tema_idx = null;
            $scope.temafilter_idx = null;
            $scope.nuevoTema = {nombre: ""};
            $scope.resetCopy = angular.copy($scope.nuevoTema);
            $scope.agregar = function(){
              // console.log($scope.tema_idx, 'iiii');
              if($scope.tema_idx===null){
                $scope.tag_lista.push($scope.nuevoTema);
              }else{
                $scope.tag_lista[$scope.tema_idx] = $scope.nuevoTema;
                
              }

              // $scope.tag_lista.push($scope.nuevoTema);
              $scope.nuevoTema = angular.copy($scope.resetCopy);
              $scope.formNuevoTema.$setPristine();
              $scope.formNuevoTema.$setUntouched();
              $scope.tema_idx = null;
            }
            $scope.editarTema = function(item, index){
              $scope.nuevoTema = angular.copy(item);
              $scope.tema_idx = $scope.tag_lista.indexOf(item);
              $scope.temafilter_idx = index;
            };

            $scope.cancelarTema = function(){
              $scope.nuevoTema = angular.copy($scope.resetCopy);
              $scope.formNuevoTema.$setPristine();
              $scope.formNuevoTema.$setUntouched();
              $scope.tema_idx = null;
              $scope.temafilter_idx = null;
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

            $scope.guardarTemas = function($event) {
              $http.post(URL.base + URL.encuestadoras.guardar, $scope.tag_lista).success(function(data){
                var data = data;
                if(data.status){
                  $msj.show('Se guardaron correctamente las encuestadoras', CMSDATA.POSITIONMSJ);
                  $mdDialog.hide($scope.tag_lista);
                  ng.listaEncuestadoras = data.response;
                }else{
                  if(data.error){
                    $msj.show(data.error.message, CMSDATA.POSITIONMSJ);
                  }else{
                    $msj.show(CMSDATA.MSJ.MSJ80, CMSDATA.POSITIONMSJ);
                  }
                }
              }).error(function(data) {
                $timeout(function(){
                  $preload.hide();
                }, 250);
              });
            };

          };

          ng.removerCandidato = function($event, index){
            $event.stopPropagation();
            ng.encuesta.candidatos[index]._id = '';
            ng.encuesta.candidatos[index].nombre = '';
            ng.encuesta.candidatos[index].nombrecorto = '';
            ng.encuesta.candidatos[index].partido = '';
            ng.encuesta.candidatos[index].foto = '';
            ng.encuesta.candidatos[index].url = '';
            ng.encuesta.candidatos[index].porcentaje = '';
            angular.element('#img-candidato-'+index).remove();
          };

          // ---- FIN MODAL ---- //

          ng.clicVolver = function(){ $location.path('/elecciones'); };

          var init=function(){
            verificarSesion();
          }();
    
  }]);

});

