'use strict';

define(['app'], function (app) {

  app.register.controller('parlamentoAndinoCtrl', 
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
            sesion: 'session',
            logout: 'session/logout',
            leer: '/sondeos/leer_parlamento_andino',
            guardar: 'sondeos/guardar_parlamento_andino'
          };

          var inicializarObjetos=function(){
            ng.landing = {
              imgdesktop:'',
              imgmobile:''
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
                      obtenerDetalle();
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

          var obtenerDetalle=function(nid){
            $preload.show();
            $login.get(URL.base + URL.leer).then(
              function(response) {
                // console.log(response, 'rrr');
                var data=response.response;
                if(response.status){
                  if(data){ // detalle existe
                    inicializarObjetos();
                    angular.copy(data, ng.landing);
                    ng.existeFotoDesktop=ng.landing.imgdesktop!==''?true:false;
                    ng.existeFotoMobile=ng.landing.imgmobile!==''?true:false;
                    $preload.hide();
                  }else{
                    // $location.path('/elecciones');
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

          // ---- FIN LISTADO ---- //

          var formdata = new FormData();

          ng.agregarImagen = function(){
              var elm = angular.element('#add-img--cover');
              var thumbData = elm.parent().prev('.loadThumbData');
              elm.parent().prev('.loadThumbData').val('');
              var fileUpload = document.getElementById("file-upload");
              var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif)$");
              
              $timeout(function() {
                thumbData.trigger('click');
                elm.parent().prev('.loadThumbData').off('change').on('change', function(evt){
                  var file = evt.currentTarget.files[0];
                  formdata.append('imgdesktop', file);

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
                          // var height = this.height;
                          // var width = this.width;
                          // if (height != 170 || width != 160) {
                          //     $msj.show('Agregue una imagen de 160 píxeles de ancho por 170 píxeles de alto', CMSDATA.POSITIONMSJ);
                          //     return false;
                          // }
                          
                          angular.element('.img-escudo').remove();
                          preview[0].appendChild(aImg);
                          ng.$apply(function(){
                            ng.existeFotoDesktop=true;  
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

          ng.agregarImagenTv = function(){
              var elm = angular.element('#add-img--cover-tv');
              var thumbData = elm.parent().prev('.loadThumbDataTv');
              elm.parent().prev('.loadThumbDataTv').val('');
              var fileUpload = document.getElementById("file-upload-tv");
              var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif)$");
              
              $timeout(function() {
                thumbData.trigger('click');
                elm.parent().prev('.loadThumbDataTv').off('change').on('change', function(evt){
                  var file = evt.currentTarget.files[0];
                  formdata.append('imgmobile', file);

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
                          ng.$apply(function(){
                            ng.existeFotoMobile=true;  
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

          ng.removePreview = function($event){
              $event.stopPropagation();
              // console.log('eeeeeee');
              angular.element('.img-escudo').remove();
              ng.existeFotoDesktop=false;
          };

          ng.removePreviewTv = function($event){
              $event.stopPropagation();
              angular.element('.img-escudo-tv').remove();
              ng.existeFotoMobile=false;
          };

          ng.guardar = function(type){
            
            $preload.show();
            $http.post(URL.base + URL.guardar, formdata, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined} /* multipart/form-data */
              }).
              success(function(data) {
                $preload.hide();
                var data = data;
                if(data.status){
                  $msj.show('Se guardó correctamente.', CMSDATA.POSITIONMSJ);
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

        ng.clicVolver = function(){ $location.path('/elecciones'); };

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