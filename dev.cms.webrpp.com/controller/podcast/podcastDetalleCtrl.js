// 'use strict';

define(['app'], function (app) {

app.register.controller('podcastDetalleCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$msj', '$timeout', '$logout', '$login', '$localStorage', '$routeParams', '$sce', '$mdToast', '$cacheService',
function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $msj, $timeout, $logout, $login, $localStorage, $routeParams, $sce, $mdToast, $cacheService) {
  
  var ng=$scope;

  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    URLLISTSITE : 'sitio',
    URLLISTSITELIST : 'sitio/list',
    URLLISTCATEGORY : 'categoria/index/',
    sesion:'session',
    logout:'session/logout',
    upload:'elementos/upload/photo',
    podcast:{
      detalle:'podcast/id/',
      guardar:'podcast/'
    },
    itunes:'https://itunes.apple.com/search?term='
  };

  var nid = $routeParams.nid;

  var inicializarObjetos=function(){
    
    // ng.enumCategoria={
    //   BRANDING:{_id:1, descripcion:'Branding'},
    //   MUSICAL:{_id:2, descripcion:'Musical'}
    // };

    ng.detalle={
      pcid:'',
      nombre:'',
      bajada:'',
      branded:{
        url:''
      },
      branded_url:'',
      sitio:'',
      lista:[],
      categoria:null
    };
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
  // ---- FIN SESION ---- //

  // ---- INICIO HEADER ---- //
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

  // ---- FIN HEADER ---- //

  // ---- INICIO SITES ---- // 

  //LIST SITES
  ng.filterSite = undefined;
  ng.filterSites = [];
  ng.sites = []; //Bar Tool
  ng.loadSiteHeader = function(existSite, type, callback) {
      var type = type;
      //Sites
      $cacheService.get(URL.base + ((type!='search')?URL.URLLISTSITE:URL.URLLISTSITELIST))
      .then(
          function (data) {
              var data = data;
              if(data.status){
                  if(type === 'search'){
                      //SITE
                      ng.filterSites = data.response;
                      ng.filterSites.unshift({
                          nombre: 'Grupo RPP',
                          slug : 'grupo-rpp'
                      });
                  }else{
                      //PAGE
                      //Bar Tool
                      ng.sites = data.response;
                      //ng.objSitio = sites[0];
                      ng.detalle.sitio = (existSite)?existSite:ng.sites[0];
                      callback();
                  }
              }else{
                  $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
              }
          },
          function(msgError) {
              $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
          }
      );
  };
  // ng.loadSiteHeader(undefined, 'search');

  // ---- FIN SITES ---- //

  //SECTION
  //LIST SITES
  ng.filterSection = undefined;
  ng.filterSections = [];
  ng.loadSectionHeader = function(sitio) {
      var _sitio = (sitio)?sitio:'rpp';
      //Section
      $cacheService.get(URL.base + URL.URLLISTCATEGORY + _sitio + '?type=search_box')
      .then(
          function (data) {
              var data = data;
              if(data.status){
                  //SITES
                  ng.filterSections = data.response;
              }else{
                  $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
              }
          },
          function(msgError) {
              $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
          }
      );
  };
  ng.loadSectionHeader(undefined);
  ng.changeLoadSectionHeader = function(){
      var _sitio = (ng.filterSite)?ng.filterSite.slug:undefined;
      ng.loadSectionHeader(_sitio);
  };



  // ---- INICIO DETALLE ---- // 

  var verificarDetalle=function(){
    if(nid){ // EDITAR
      obtenerDetalle(nid);
    }else{ // AGREGAR
      inicializarObjetos();
      ng.loadSiteHeader(undefined, 'page', function(){
          // ng.loadCategory(undefined);
          // ng.loadCategoryMultiple(undefined);
      });
    }
  };

  var obtenerDetalle=function(nid){
    $preload.show();
    $login.get(URL.base + URL.podcast.detalle+nid).then(
      function(response) {
        var data=response.response;
        if(response.status){
          if(data){ // detalle existe
            inicializarObjetos();
            angular.copy(data, ng.detalle);
            angular.forEach(ng.detalle.lista, function(value,key){
              ng.detalle.lista[key].urlfront=trustResource(ng.detalle.lista[key].url);
            });
            // ng.detalle.sitio='rpp';
            //SITE
            ng.loadSiteHeader(ng.detalle.sitio, 'page', function(){
                // ng.loadCategory(ng.objCategory);
                // ng.loadCategoryMultiple(ng.objCategorys);
            });
            $preload.hide();
          }else{
            $location.path('/podcast/');
          }
        }else{
                    
        }
      },
      function(msgError) {
        
      }
    );
  };

  var trustResource=function(resourceUrl) {
    return $sce.trustAsResourceUrl(resourceUrl);
  };

  ng.eliminarAudio = function(idx){ ng.detalle.lista.splice(idx,1); };

  // ---- FIN DETALLE ---- //

  // ---- INICIO GUARDAR ---- //

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

  var toastError = function(errorMsj){
      var type = 'toast-error--list';
      $mdToast.show({
          template: '<md-toast class="md-toast ' + type +'">' +
          '<p class="p-info">' + errorMsj + '.</p>'+
          '</md-toast>',
          hideDelay: 7000,
          position: CMSDATA.POSITIONMSJ
     });
  };

  ng.guardarDetalle = function(tipo){
    $preload.show();
    $http.post(URL.base + URL.podcast.guardar, ng.detalle).
      success(function(response) {
        $preload.hide();
        if(response.status){
          angular.copy(response.response, ng.detalle);
          // clearRevisionErrorFiled();
          if(tipo=='agregar'){
            $location.path('/podcast/detalle/'+ng.detalle.pcid);
          }
          $msj.show(CMSDATA.MSJ.MSJ5,CMSDATA.POSITIONMSJ);
        }else{
          $preload.hide();
          toastErrorList(response.error.fields, response.error.message);
          //Revision de campos con errores
          revisionErrorFiled(response.error.fields);
        }
      }).error(function(response) {
          $preload.hide();
          $msj.show(CMSDATA.MSJ.MSJ6,CMSDATA.POSITIONMSJ);
    });
  };

  // ---- FIN GUARDAR ---- //

  //OPEN AUDIO
  ng.ADDAUDIOTRANSFER = undefined;
  //DIMENSION IMAGEN | VIDEO | AUDIO UPLOAD
  ng.widthMedia = CMSDATA.DIMENSION16x9.widthLarge;
  ng.heightMedia = CMSDATA.DIMENSION16x9.heightLarge;
  ng.openAddAudio = function($event, type, $index, block, $indexNew){
      var type = type, index = $index, block = block, $indexNew = $indexNew;
      $mdDialog.show({
          targetEvent : $event,
          scope: $scope,
          preserveScope: true,
          templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/podcast/openaddaudio.html',
          controller : modalOpenAddAudioCtrl,
          locals: {
              modal : {
                  type: type,
                  index: index,
                  block: block,
                  indexNew : $indexNew
              }
          }
      })
      .then(function() {
          if(ng.ADDAUDIOTRANSFER){
            //DATA
            // var objAudioAdd = angular.copy(CMSDATA.OBJNEW);
            // objAudioAdd.tipo = ng.ADDAUDIOTRANSFER.tipo;
            // objAudioAdd.audio = angular.copy(ng.ADDAUDIOTRANSFER.audio);
            // console.log(ng.ADDAUDIOTRANSFER, 'popopopopo');
            //ADD AUDIO
            if(ng.ADDAUDIOTRANSFER.type === 'add'){
              // console.log('aaaa');
              // var index = ng.detalle.lista.length;
              ng.detalle.lista.unshift(ng.ADDAUDIOTRANSFER);
              // console.log(ng.detalle.lista, 'kkkkkkkkk');
              angular.forEach(ng.detalle.lista, function(value,key){
                // ng.detalle.lista[key].urlfront=null;
                ng.detalle.lista[key].urlfront=trustResource(ng.detalle.lista[key].url);
                // console.log(ng.detalle.lista[key].urlfront, ng.detalle.lista[key].url, 'jjjj');
                
              });
              // ng.$apply(function(){
                
              // });
            }else{
              // console.log('bbb');
              var ind = ng.ADDAUDIOTRANSFER.index;
              ng.detalle.lista[ind] = angular.copy(ng.ADDAUDIOTRANSFER);
            }
          }
      }, function() {
          $mdDialog.cancel();
      });
  };

  function modalOpenAddAudioCtrl(scope, $create, modal, $timeout) {
      // console.log(modal,'mmmmmmm');
      //TYPE
      scope.modalType = modal.type;
      //AUDIO
      scope.widthAudio = ng.widthMedia;
      scope.heightAudio = ng.heightMedia;
      scope.refreshAudio = false;
      scope.audio = {
          titulo: '',
          pos: 0,
          url: '',
          hash: '',
          duracion:''
      };
      scope.$on('objaudio', function(e, msg) {
          scope.audio.url = msg.url;
          scope.audio.duracion = msg.duracion;
          scope.audio.hash = msg.hash;
      });
      //OBJ AUDIO COVER
      scope.image = '';
      scope.widthImage = scope.widthAudio;
      scope.heightImage = scope.heightAudio;
      if(modal.type === 'edit'){
          scope.titulo = modal.block.titulo;
          scope.srcThumbData = modal.block.imgpost;
          //AUDIO UPLOAD
          $timeout(function(){
              var elm = angular.element('.tagzoneaudio .opt-send');
              elm.css('display', 'inline-block');
              elm.removeAttr('disabled');
              //EDIT AUDIO
              scope.refreshAudio = {
                  url: scope.audio.url,
                  duracion: scope.audio.duracion,
                  hash: scope.audio.hash
              };
              //RESET IMG COVER
              scope.image = scope.audio.url_cover;
              scope.reset = $create.guid();
          },250);
      }else{
          $timeout(function(){
              var elm = angular.element('.tagzoneaudio .opt-send');
              elm.css('display', 'none');
              // elm.attr('disabled', 'disabled');
          },250);
          //CLEAR ADD
          scope.titulo = '';
          scope.srcThumbData = '';
      }
      //CLOSE
      scope.closeOpenAddAudio = function(){
          $mdDialog.cancel();
      };
      scope.addOpenAddAudio = function(){
          // console.log(scope.srcThumbData,'srccc');
          if(scope.titulo.length>0){
            //GET
            ng.ADDAUDIOTRANSFER = {
              url : scope.audio.url,
              duracion : scope.audio.duracion,
              hash : scope.audio.hash,
              titulo: scope.titulo,
              imgpost:scope.srcThumbData,
              index : modal.index,
              type : modal.type,
              indexNew : modal.indexNew
            };
            $mdDialog.hide();
          }else{
            //REVISANDO TITULO
            if(scope.titulo.length <= 0)
              $msj.show(CMSDATA.MSJ.MSJ73, CMSDATA.POSITIONMSJ);
          }
      };

      scope.removeCaptureImage = function(){
        scope.srcThumbData = '';
      };

      scope.agregarImagen = function(){
        // console.log('aaaaa');
          
          var elm = angular.element('#add-img--cover');
          var thumbData = elm.find('.loadThumbData');
          thumbData.val('');

          $timeout(function() {
            thumbData.trigger('click');
            elm.find('.loadThumbData').off('change').on('change', function(evt){
              var file = evt.currentTarget.files[0];
              // var size = file.size; // bytes
              // var maxSize=1; // Mb
              // var imgSize = ($bytesToSize.convert(size)).split(' ');
              // var isVideoGood = parseFloat(imgSize[0]);
              // var typeVideoLoad = imgSize[1];
              var formdata = new FormData();
              formdata.append('file', file);

              var img = document.createElement("img");
              // img.classList.add("img-escudo");
              img.file = file;
              // var preview=angular.element('#add-img--cover');

              var reader = new FileReader();
              reader.onload = (function(aImg) {
                return function(e) { 
                  aImg.src = e.target.result;
                  aImg.onload = function () {
                    var height = this.height;
                    var width = this.width;
                    if (height >= width ) {
                        $msj.show('Agregue una imagen más ancha.', CMSDATA.POSITIONMSJ);
                        return false;
                    }else{
                      guardarImagen(formdata);
                      return true;
                    }
                    
                    // angular.element('.img-escudo').remove();
                    // preview[0].appendChild(aImg);
                    
                  };
                }; 
              })(img);
              reader.readAsDataURL(file);

              // if(typeVideoLoad === 'Bytes' || typeVideoLoad === 'KB'){
                  // guardarImagen(formdata);
              //     return false;
              // }else if(typeVideoLoad === 'MB'){
              //     if(isVideoGood > parseFloat(maxSize)){
              //         $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
              //     }else{
              //         guardarImagen(formdata,idxIncidencia);
              //     }
              //     return false;
              // }else if(typeVideoLoad === 'GB' || typeVideoLoad === 'TB'){
              //   $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
              // } 
            });
          }, 0);

          var guardarImagen = function(data){
            $preload.show();
            $http.post(URL.base + URL.upload, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined} /* multipart/form-data */
            }).
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response[0];
                    var url = response.url;
                    scope.showThumbData = true;
                    scope.isDeleteThumb = true;
                    scope.srcThumbData = url;
                    $timeout(function () {
                      $msj.show(CMSDATA.MSJ.MSJ56, CMSDATA.POSITIONMSJ);
                      $preload.hide();
                      /*if(idxIncidencia===''){ // agregar imagen
                        console.log('add');
                        // ng.suceso.foto=url;
                      }else{ // editar imagen
                        // ng.evento.incidencias[idxIncidencia].foto=url; 
                        console.log('edit');
                      }*/
                    }, 1000);
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ39, CMSDATA.POSITIONMSJ);
                    $preload.hide();
                }
            }).error(function(data) {
                $msj.show(CMSDATA.MSJ.MSJ39, CMSDATA.POSITIONMSJ);
                $preload.hide();
            });
              
          };

      };

  };


  //OPEN PHOTO
  ng.ADDPHOTOTRANSFER = {
    branded:null,
    branded_url:''
  };
  ng.openAddPhoto = function($event, type ,$index, block, $indexNew){
      var type = type, index = $index, block = block, $indexNew = $indexNew;
      // var extension = $isExtension.get((block.hasOwnProperty('foto'))?block.foto.url:undefined);
      $mdDialog.show({
          targetEvent : $event,
          templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/podcast/openaddphoto.html',
          controller : modalOpenAddPhotoCtrl,
          locals: {
              modal : {
                  type: type,
                  index: index,
                  block: block,
                  data:{
                    brandedurl:ng.detalle.branded===null?'':ng.detalle.branded.url,
                    branded_url:ng.detalle.branded_url===null?'':ng.detalle.branded_url
                  },
                  // extension : extension,
                  indexNew : $indexNew
              }
          }
      })
      .then(function() {
          // console.log(ng.ADDPHOTOTRANSFER,'trrrrr');
          if(ng.ADDPHOTOTRANSFER){
              //DATA
              // var objPhotoAdd = angular.copy(CMSDATA.OBJNEW);
              
              // objPhotoAdd.via = ng.ADDPHOTOTRANSFER.via;
              // objPhotoAdd.tipo = ng.ADDPHOTOTRANSFER.tipo;
              // objPhotoAdd.foto = angular.copy(ng.ADDPHOTOTRANSFER.foto);
              // //ADD PHOTO
              // if(ng.ADDPHOTOTRANSFER.type === 'add' || ng.ADDPHOTOTRANSFER.type === 'cropear'){
              //     var index = ng.blockAdd.length;
              //     ng.addMedia(index, objPhotoAdd, ng.ADDPHOTOTRANSFER.indexNew);
              // }else{
              //     ng.blockAdd[ng.ADDPHOTOTRANSFER.index] = angular.copy(objPhotoAdd);
              // }
          }
      }, function() {
          $mdDialog.cancel();
      });
  };

  function modalOpenAddPhotoCtrl(scope, modal, $mdDialog, $create, $timeout) {
    // console.log(modal,'mmmmmm');
    //Keywords Photos
    scope.branded_url = modal.data.branded_url;
    scope.brandedurl = modal.data.brandedurl;
    scope.mBtnRemovePreview=false;


    //INIt CONFIG
    var elm = angular.element('#add-img--cover');
    ng.showThumbData = false;
    ng.isDeleteThumb = false;

    var DATA;
    scope.uploadCaptureImage = function(){
        var elm = angular.element('#add-img--cover');
        var thumbData = elm.find('.loadThumbData');
        thumbData.val('');
        thumbData.click();
        elm.find('.loadThumbData').off('change').on('change', function(evt){
            var file = evt.currentTarget.files[0];
            var formdata = new FormData();
            formdata.append('file', file);
            // var _data = {
            //     url : scope.url
            // };
            // formdata.append('data', JSON.stringify(_data));
            // var DATA = formdata;
            DATA = formdata;
            // scope.addOpenAddPhoto(DATA);
            // ng.ADDPHOTOTRANSFER.branded=formdata;

            var img = document.createElement("img");
            img.classList.add("img-escudo");
            img.file = file;
            var preview=angular.element('#add-img--cover');

            var reader = new FileReader();
            reader.onload = (function(aImg) {
              return function(e) { 
                aImg.src = e.target.result;
                aImg.onload = function () {
                  var height = this.height;
                  var width = this.width;
                  // if (height != 400 || width != 400) {
                  //     $msj.show('Agregue una imagen de 400 píxeles por 400 píxeles', positionMSj);
                  //     return false;
                  // }
                  
                  angular.element('.img-escudo').remove();
                  preview[0].appendChild(aImg);
                  scope.$apply(function(){
                    scope.mBtnRemovePreview=true;  
                  });
                  
                  // console.log(scope.mBtnRemovePreview, 'ggg');
                  return true;
                };
              }; 
            })(img);
            reader.readAsDataURL(file);


        });

        
    };

    scope.removePreview = function(){
        angular.element('.img-escudo').remove();
        scope.mBtnRemovePreview=false;
    };

    scope.removeCaptureImage = function(){
        scope.brandedurl = '';
    };

    scope.guardarImagen=function(data){
      /* Img */
      $preload.show();
      $http.post(URL.base + URL.upload, data, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined} /* multipart/form-data */
      }).
      success(function(data) {
          var data = data;
          if(data.status){
              var response = data.response;
              var url = response.url;
              ng.showThumbData = true;
              ng.isDeleteThumb = true;
              ng.srcThumbData = url;
              $timeout(function () {
                  var _imgData = response;
                  // console.log(_imgData, '_imgData');
                  if(angular.isArray([_imgData])){
                      // ng.ADDPHOTOTRANSFER.branded=_imgData[0];
                      ng.detalle.branded=_imgData[0];
                  }else{
                      // ng.ADDPHOTOTRANSFER.branded=_imgData;
                      ng.detalle.branded=_imgData;
                  }
                  $msj.show(CMSDATA.MSJ.MSJ56, CMSDATA.POSITIONMSJ);
                  $mdDialog.hide();
                  $preload.hide();
              }, 5000);
          }else{
              $msj.show(CMSDATA.MSJ.MSJ39, CMSDATA.POSITIONMSJ);
              $preload.hide();
          }
      }).error(function(data) {
          $msj.show(CMSDATA.MSJ.MSJ39, CMSDATA.POSITIONMSJ);
          $preload.hide();
      });
    };

    // scope.addOpenAddPhoto = function(data){
    scope.addOpenAddPhoto = function(){
        if(scope.branded_url.length <= 0){
            $msj.show('Debes ingresar la URL del branding.','top right');
        }else{
            // scope.guardarImagen(data);
            // console.log(DATA,'dddd');
            if(typeof(DATA)!=='undefined'){
              scope.guardarImagen(DATA);  
            }else{
              $mdDialog.hide();
            }
            // url
            ng.detalle.branded_url=scope.branded_url;
        }
    };

    //CLOSE
    scope.closeOpenAddPhoto = function(){
        $mdDialog.cancel();
    };
  };

  ng.clicVolver = function(){ $location.path('/podcast/'); };

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