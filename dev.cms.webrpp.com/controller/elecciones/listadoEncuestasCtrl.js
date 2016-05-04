'use strict';

define(['app'], function (app) {

  app.register.controller('listadoEncuestasCtrl', 
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
        $mdToast) {
  	
          var ng = $scope;

          var URL = {
            base: CMSDATA.GLOBAL.URLBASE,
            sesion:'session',
            logout:'session/logout',
            encuestas:{
              listar:'sondeos/index',
              eliminar:'sondeos/eliminar_encuesta/',
              publicar:'sondeos/publicar'
            },
            encuestadoras:{
              listar:'sondeos/encuestadoras',
              guardar:'sondeos/guardar_encuestadoras',
              eliminar:'sondeos/eliminar_encuestadoras'
            },
            candidatos:{
              listar:'sondeos/candidatos',
              guardar:'sondeos/guardar_candidatos',
              eliminar:'sondeos/eliminar_candidato/'
            }
          };

          var inicializarObjetos=function(){
            //listas
            ng.listaEncuestas=[];
            ng.listaEncuestadoras=[];
            ng.listaCandidatos=[];
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
                      obtenerListaEncuestas();
                      obtenerListaEncuestadoras();
                      obtenerListaCandidatos();
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

          // ---- INICIO LISTADO ---- // 

          var obtenerListaEncuestas = function(){
            ng.listaEncuestas = [];
            // $preload.show();
            // ng.searchLoad=true;
            $http.get(URL.base + URL.encuestas.listar).success(function(response){
                var data=response.response;
                if(response.status){
                  angular.copy(data, ng.listaEncuestas);
                  // $preload.hide();
                  // ng.searchLoad=false;
                }
            }).error(
            function(msgError) {
              $msj.show('Error: No se pudo cargar las encuestas.', CMSDATA.POSITIONMSJ);
            });
          };

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

          var obtenerListaCandidatos = function(){
            ng.listaCandidatos = [];
            // $preload.show();
            // ng.searchLoad=true;
            $http.get(URL.base + URL.candidatos.listar).success(function(response){
                var data=response.response;
                if(response.status){
                  angular.copy(data, ng.listaCandidatos);
                  // $preload.hide();
                  // ng.searchLoad=false;
                }
            }).error(
            function(msgError) {
              $msj.show('Error: No se pudo cargar los candidatos.', CMSDATA.POSITIONMSJ);
            });
          };

          // ---- FIN LISTADO ---- //

          // ---- INICIO MODAL ---- //

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
              if($scope.tema_idx===null){
                $scope.tag_lista.push($scope.nuevoTema);
              }else{
                $scope.tag_lista[$scope.tema_idx] = $scope.nuevoTema;
                
              }
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
              var checados=[];
              angular.forEach($scope.tags_selected, function(v, k){
                // var index = $scope.tag_lista.indexOf(v);
                // $scope.tag_lista.splice(index, 1);
                checados.push(v._id);
              });
              // console.log(checados, 'cccccc');
              $http.post(URL.base + URL.encuestadoras.eliminar, {encuestadoras: checados}).success(function(data){
                var data = data;
                if(data.status){
                  $msj.show('Se eliminaron correctamente las encuestadoras', CMSDATA.POSITIONMSJ);
                  $scope.tag_lista = data.response;
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
                  $scope.tag_lista = data.response;
                  ng.listaEncuestadoras = data.response;
                  obtenerListaEncuestas();
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

          ng.mostrarModalCandidatos = function($event, type, $index, detail){
            $event.preventDefault();
            var type = type, index = $index;
            $mdDialog.show({
              targetEvent : $event,
              scope: $scope,
              preserveScope: true,
              templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/elecciones/candidato.html',
              controller : modalCandidatosCtrl,
              locals: {
                modal : {
                  type: type,
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

          function modalCandidatosCtrl(scope, modal, $timeout) {
            //TYPE
            if(modal.detail){
              modal.type = 'edit';
              scope.modalType = 'edit';
            }else{
              modal.type = 'add';
              scope.modalType = 'add';
            }
            if(modal.type === 'edit'){

              scope.candidato = {
                nombre : modal.detail.nombre,
                nombrecorto : modal.detail.nombrecorto,
                orden : modal.detail.orden,
                partido : modal.detail.partido,
                partidocorto : modal.detail.partidocorto,
                url : modal.detail.url,
                tag : modal.detail.tag,
                color : modal.detail.color,
                foto: modal.detail.foto,
                fototv: modal.detail.fototv,
                logotv: modal.detail.logotv,
                _id : modal.detail._id 
              };

            }else{
              //CLEAR ADD
              scope.candidato = {
                nombre : '',
                nombrecorto : '',
                orden : '',
                partido : '',
                partidocorto : '',
                url : '',
                tag : '',
                color : '',
                foto: '',
                fototv: '',
                logotv: '',
                _id : '' 
              };
            }

            var formdata = new FormData();

            scope.existeFoto=scope.candidato.foto!==''?true:false;
            scope.existeFotoTv=scope.candidato.fototv!==''?true:false;
            scope.existeLogoTv=scope.candidato.logotv!==''?true:false;

            scope.agregarImagen = function(){
                var elm = angular.element('#add-img--cover');
                var thumbData = elm.parent().prev('.loadThumbData');
                elm.parent().prev('.loadThumbData').val('');
                var fileUpload = document.getElementById("file-upload");
                var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif)$");
                
                $timeout(function() {
                  thumbData.trigger('click');
                  elm.parent().prev('.loadThumbData').off('change').on('change', function(evt){
                    var file = evt.currentTarget.files[0];
                    formdata.append('foto', file);

                    var img = document.createElement("img");
                    img.classList.add("img-escudo");
                    img.file = file;
                    var preview=angular.element('#add-img--cover');

                    if (regex.test(fileUpload.value.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = (function(aImg) {
                        return function(e) {
                          aImg.src = e.target.result;
                          aImg.onload = function () {
                            var height = this.height;
                            var width = this.width;
                            if (height != 170 || width != 160) {
                                $msj.show('Agregue una imagen de 160 píxeles de ancho por 170 píxeles de alto', CMSDATA.POSITIONMSJ);
                                return false;
                            }
                            
                            angular.element('.img-escudo').remove();
                            preview[0].appendChild(aImg);
                            scope.$apply(function(){
                              scope.existeFoto=true;  
                            });
                            
                            // console.log(scope.existeFoto, 'eeeeeeeee');
                            return true;
                          };
                        }; 
                      })(img);
                      reader.readAsDataURL(file);
                    }else{
                      $msj.show('Agregue una imagen en formato PNG, JPG o GIF', CMSDATA.POSITIONMSJ);
                    }

                     
                  });
                }, 0);
            };

            scope.agregarImagenTv = function(){
                var elm = angular.element('#add-img--cover-tv');
                var thumbData = elm.parent().prev('.loadThumbDataTv');
                elm.parent().prev('.loadThumbDataTv').val('');
                var fileUpload = document.getElementById("file-upload-tv");
                var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif)$");
                
                $timeout(function() {
                  thumbData.trigger('click');
                  elm.parent().prev('.loadThumbDataTv').off('change').on('change', function(evt){
                    var file = evt.currentTarget.files[0];
                    formdata.append('fototv', file);

                    var img = document.createElement("img");
                    img.classList.add("img-escudo-tv");
                    img.file = file;
                    var preview=angular.element('#add-img--cover-tv');

                    if (regex.test(fileUpload.value.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = (function(aImg) {
                        return function(e) {
                          aImg.src = e.target.result;
                          aImg.onload = function () {
                            var height = this.height;
                            var width = this.width;
                            // if (height != 170 || width != 160) {
                            //     $msj.show('Agregue una imagen de 160 píxeles de ancho por 170 píxeles de alto', CMSDATA.POSITIONMSJ);
                            //     return false;
                            // }
                            
                            angular.element('.img-escudo-tv').remove();
                            preview[0].appendChild(aImg);
                            scope.$apply(function(){
                              scope.existeFotoTv=true;  
                            });
                            
                            // console.log(scope.existeFoto, 'eeeeeeeee');
                            return true;
                          };
                        }; 
                      })(img);
                      reader.readAsDataURL(file);
                    }else{
                      $msj.show('Agregue una imagen en formato PNG, JPG o GIF', CMSDATA.POSITIONMSJ);
                    }

                     
                  });
                }, 0);
            };

            scope.agregarLogoTv = function(){
                var elm = angular.element('#add-img--cover-logo');
                var thumbData = elm.parent().prev('.loadThumbDataLogo');
                elm.parent().prev('.loadThumbDataLogo').val('');
                var fileUpload = document.getElementById("file-upload-logo");
                var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif)$");
                
                $timeout(function() {
                  thumbData.trigger('click');
                  elm.parent().prev('.loadThumbDataLogo').off('change').on('change', function(evt){
                    var file = evt.currentTarget.files[0];
                    formdata.append('logotv', file);

                    var img = document.createElement("img");
                    img.classList.add("img-escudo-logo");
                    img.file = file;
                    var preview=angular.element('#add-img--cover-logo');

                    if (regex.test(fileUpload.value.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = (function(aImg) {
                        return function(e) {
                          aImg.src = e.target.result;
                          aImg.onload = function () {
                            var height = this.height;
                            var width = this.width;
                            // if (height != 170 || width != 160) {
                            //     $msj.show('Agregue una imagen de 160 píxeles de ancho por 170 píxeles de alto', CMSDATA.POSITIONMSJ);
                            //     return false;
                            // }
                            
                            angular.element('.img-escudo-logo').remove();
                            preview[0].appendChild(aImg);
                            scope.$apply(function(){
                              scope.existeLogoTv = true;  
                            });
                            
                            // console.log(scope.existeFoto, 'eeeeeeeee');
                            return true;
                          };
                        }; 
                      })(img);
                      reader.readAsDataURL(file);
                    }else{
                      $msj.show('Agregue una imagen en formato PNG, JPG o GIF', CMSDATA.POSITIONMSJ);
                    }

                     
                  });
                }, 0);
            };

            scope.removePreview = function($event){
                $event.stopPropagation();
                // console.log('eeeeeee');
                angular.element('.img-escudo').remove();
                scope.existeFoto=false;
            };

            scope.removePreviewTv = function($event){
                $event.stopPropagation();
                angular.element('.img-escudo-tv').remove();
                scope.existeFotoTv=false;
            };

            scope.removePreviewLogo = function($event){
                $event.stopPropagation();
                angular.element('.img-escudo-logo').remove();
                scope.existeLogoTv=false;
            };

            var guardarCandidato = function(type){
              formdata.append('_id', scope.candidato._id);
              formdata.append('nombre', scope.candidato.nombre);
              formdata.append('nombrecorto', scope.candidato.nombrecorto);
              formdata.append('orden', scope.candidato.orden);
              formdata.append('url', scope.candidato.url);
              formdata.append('partido', scope.candidato.partido);
              formdata.append('partidocorto', scope.candidato.partidocorto);
              formdata.append('tag', scope.candidato.tag);
              formdata.append('color', scope.candidato.color);
              $preload.show();
              $http.post(URL.base + URL.candidatos.guardar, formdata, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined} /* multipart/form-data */
                }).
                success(function(data) {
                  $preload.hide();
                  var data = data;
                  if(data.status){
                    $msj.show('Se guardó correctamente el candidato', CMSDATA.POSITIONMSJ);
                    // $mdDialog.hide($scope.tag_lista);
                    if(modal.type==='edit') // editar
                      ng.listaCandidatos[modal.index] = data.response;
                    else if(modal.type==='add') // agregar
                      ng.listaCandidatos.push(data.response);
                    $mdDialog.hide();
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

            //CLOSE
            scope.cancelar = function(){
                $mdDialog.cancel();
            };
            scope.aceptar = function(){
              guardarCandidato();
            };
          };
          // ---- FIN MODAL ---- //

          //Eliminar Candidato
          ng.openDeleteNew = function($event, item, index) {
              var $event = $event, index = index;
              var confirmDelete = $mdDialog.confirm({
                  title: 'Confirmación',
                  content: '¿Está seguro que desea eliminar a "'+item.nombre+'"?',
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
              if(item._id){
                  //Edit noticia
                  $http.delete(URL.base + URL.candidatos.eliminar + item._id).
                  success(function(data) {
                      var data = data;
                      if(data.status){
                          $preload.hide();
                          $msj.show('Se eliminó correctamente el candidato', CMSDATA.POSITIONMSJ);
                          ng.listaCandidatos.splice(index,1)
                      }else{
                          $preload.hide();
                          // $msj.show(data.message, CMSDATA.POSITIONMSJ);
                          toastErrorList(data.error.fields, data.error.message);
                          //Revision de campos con errores
                          revisionErrorFiled(data.error.fields);
                      }
                  }).error(function(data) {
                      $preload.hide();
                      $msj.show('No se pudo eliminar correctamente al candidato', CMSDATA.POSITIONMSJ);
                  });
              }else{
                  $preload.hide();
                  $msj.show('No se pudo eliminar correctamente al candidato', CMSDATA.POSITIONMSJ);
              }
          };

          //Eliminar Encuesta
          ng.openDeleteEncuesta = function($event, item, index) {
              var $event = $event, index = index;
              var confirmDelete = $mdDialog.confirm({
                  title: 'Confirmación',
                  content: '¿Está seguro que desea eliminar la encuesta de "'+item.encuestadora.nombre+'"?',
                  ok: 'Aceptar',
                  cancel: 'Cancelar'
              });
              $mdDialog
              .show( confirmDelete ).then(function() {
                  //OK
                  $preload.show();
                  deleteEncuestaInList(item, index);
              })
              .finally(function() {
                  //Close alert
                  confirmDelete = undefined;
              });
          };

          var deleteEncuestaInList = function(item, index){
              var index = index;
              if(item._id){
                  //Edit noticia
                  $http.delete(URL.base + URL.encuestas.eliminar + item._id).
                  success(function(data) {
                      var data = data;
                      if(data.status){
                          $preload.hide();
                          $msj.show('Se eliminó correctamente la encuesta', CMSDATA.POSITIONMSJ);
                          ng.listaEncuestas.splice(index,1)
                      }else{
                          $preload.hide();
                          $msj.show(data.message, CMSDATA.POSITIONMSJ);
                      }
                  }).error(function(data) {
                      $preload.hide();
                      $msj.show('No se pudo eliminar correctamente la encuesta', CMSDATA.POSITIONMSJ);
                  });
              }else{
                  $preload.hide();
                  $msj.show('No se pudo eliminar correctamente la encuesta', CMSDATA.POSITIONMSJ);
              }
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

          ng.publicar = function(){
            $preload.show();
            $http.post(URL.base + URL.encuestas.publicar, {}).
              success(function(response) {
                $preload.hide();
                if(response.status){
                  
                  $msj.show('Se ha publicado correctamente', CMSDATA.POSITIONMSJ);
                }else{
                  toastErrorList(response.error.fields, response.error.message);
                  //Revision de campos con errores
                  revisionErrorFiled(response.error.fields); 
                }
              }).error(function(response) {
                  $preload.hide();
                  $msj.show('No se pudo publicar la encuesta', CMSDATA.POSITIONMSJ);
            });
          };


          ng.mostrarVistaDetalle = function($event, nid){
            $preload.show();
            // editar o agregar
            nid?$location.path('/elecciones/encuesta/'+nid):$location.path('/elecciones/encuesta/');
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