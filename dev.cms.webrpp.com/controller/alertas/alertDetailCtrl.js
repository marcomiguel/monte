// Controller : List News
// 'use strict';

define(['app'], function (app) {

app.register.controller('alertDetailCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$http',
    '$timeout',
    '$q',
    '$preload',
    '$msj',
    '$login',
    '$localStorage',
    '$logout',
    '$menuleft',
    '$mdDialog',
    '$routeParams',
    '$cacheService',
    '$mdToast',
    'permissions',
    function(
        $scope,
        $rootScope,
        $location,
        $http,
        $timeout,
        $q,
        $preload,
        $msj,
        $login,
        $localStorage,
        $logout,
        $menuleft,
        $mdDialog,
        $routeParams,
        $cacheService,
        $mdToast,
        permissions
    ){
    var ng = $scope;

    //GLOBALS
    var URL = CMSDATA.GLOBAL.URLBASE,
        URLVIEW = CMSDATA.GLOBAL.URLVIEW,
        URLLIST = 'listado.html',
        URLLOGIN = 'login.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLLISTSITE = 'sitio',
        URLLISTSITELIST = 'sitio/list',
        URLALERTLIST = 'alertas',
        URLALERT = 'alert',
        URLDETAILALERT = 'alert/id/',
        URLPUBLISH = 'alert/publish',
        URLUNPUBLISH = 'alert/unpublish',
        URLACTIVITY = 'alert/activity/',
        URLPREVIEW = 'alert/vistaprevia/',
        URLTORNEOS = 'destacadas/deportes_torneos',
        DATA = {},
        TIMERESULT = 1000/2;
    //VARS TOOLS
    var positionMSj = 'top right';
    //FLAG DISABLED SESSION
    ng.disabledCloseSession = false;

    //PARENT SCOPE
    var nghome = ng.$parent;
    nghome.preloader = false;
    console.log(nghome, 'nghome');

    //PROFILE PICTURE
    ng.user = { pictureUrl: false };

    ng.showAddOptions = false;

    ng.alert = {
      'aid': null,
      'sitio': 'rpp',
      'titulo': '',
      'imagen': '',
      'cuerpo': '',
      'url': '',
      'tipo': 'informativo',
      'date_create': null,
      'status': 1,
      'publish': 0,
      'auth_name': '',
      'data_factory_id': '',
      'campeonato': ''
    };

    ng.types = $cacheService.getTiposAlertas();
    ng.campeonato = null;
    ng.campeonatos = [];
    $http.get(URL + URLTORNEOS).success(function(data) {
      var data = data;
      if(data.status){
        var response = data.response;
        if(response.length > 0){
          ng.campeonatos = response;
        }
      }else{
        $msj.show(data.error.message, positionMSj);
      }
    }).error(function(data) {
      $timeout(function(){
        $preload.hide();
      },TIMERESULT);
    });

    //Review Session
    $preload.show();
    $login.get(URL + URLSESSION).then(
      function(data) {
          var data = data;
          if(data.status){
              ng.user.pictureUrl = (data.response.foto=="")?false:data.response.foto+"?"+new Date().getTime();
              ng.initList(data);
              $preload.hide();
          }else{
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
    ng.closeSession = function(){
        $logout.get(URL + URLCLOSESESSION);
    };

    //INIT FNC
    ng.initList = function(data){
        //FORM
        ng.custom = true;
        //OPEN PANEL APPS
        ng.showPanel = false;
        ng.openPanel = function($event){
            ng.togglePanel = ng.togglePanel === false ? true: false;
            if(ng.togglePanel){
                ng.showPanel = false;
            }else{
                ng.showPanel = true;
            }
        };
        //OPEN PANEL MODULES
        ng.showPanel2 = false;
        ng.openPanel2 = function($event){
            ng.togglePanel2 = ng.togglePanel2 === false ? true: false;
            if(ng.togglePanel2){
                ng.showPanel2 = false;
            }else{
                ng.showPanel2 = true;
            }
        };

        var nidxUrl = $routeParams.nid;
        if(typeof nidxUrl != 'undefined'){
          var _nid = nidxUrl;
          $preload.show();
          $http.get(URL + URLDETAILALERT + _nid).
            success(function(data) {
              var data = data;
              if(data.status){
                var response = data.response;
                if(response.length > 0){
                  //MODEL
                  ng.alert = {
                    'aid': response[0].aid,
                    'sitio': response[0].sitio,
                    'titulo': response[0].titulo,
                    'imagen': response[0].imagen,
                    'cuerpo': response[0].cuerpo,
                    'url': response[0].url,
                    'tipo': response[0].tipo,
                    'date_create': response[0].date_create,
                    'status': response[0].status,
                    'publish': response[0].publish,
                    'auth_name': response[0].auth_name,
                    'data_factory_id': response[0].data_factory_id,
                    'campeonato': response[0].campeonato?response[0].campeonato:''
                  };

                  //preview image
                  if(ng.alert.imagen){
                    ng.showThumbData = true;
                    ng.isDeleteThumb = true;
                    ng.isLoadThumb = false;
                  }

                }else{
                  $location.path('/alertas/');
                }
              }else{
                console.log('status not true')
              }
              $timeout(function(){
                  $preload.hide();
              },TIMERESULT);
          }).error(function(data) {
              $timeout(function(){
                  $preload.hide();
              },TIMERESULT);
          });

          ng.revisions = [];
          //get activity
          $http.get(URL + URLACTIVITY + _nid).success(function(data) {
            var data = data;
            if(data.status){
              var response = data.response;
              if(response.length > 0){
                angular.forEach(response[0], function (item, key) {
                  if(key!='_id'&&key!='aid'){
                    ng.revisions.push(item);
                  }
                });
              }
            }
          }).error(function(data) {
            $timeout(function(){
              $preload.hide();
            },TIMERESULT);
          });
        }
    };

    //OPEN PERFIL
    ng.openPerfil = function($event, name){
        $location.path('/perfil');
    };

    ng.openApps = function($event, name){
        var _name = name;
        $location.path(_name);
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
           position: positionMSj
       });
    };

    var noValidForm = function(){
        $msj.show(CMSDATA.MSJ.MSJ49, positionMSj);
        ng.saveProgress = false;
    };

    ng.backToList = function(){
      $location.path('/alertas/');
    };

    ng.sites = []; //Bar Tool
    ng.loadSiteHeader = function(existSite, type) {
        var type = type;
        //Sites
        $cacheService.get(URL + ((type!='search')?URLLISTSITE:URLLISTSITELIST))
        .then(
            function (data) {
              var data = data;
              if(data.status){
                ng.sites = data.response;
              }else{
                $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
              }
            },
            function(msgError) {
              $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
            }
        );
    };
    ng.loadSiteHeader(undefined, 'search');

    ng.uploadCaptureImage = function(){
      var elm = angular.element('#loadThumbDataGif');
      elm.click();
      angular.element('#loadThumbDataGif').off('change').on('change',
      function(evt){
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
                  ng.alert.imagen = url + "?" + new Date().getTime();
                  ng.showThumbData = true;
                  ng.isDeleteThumb = true;
                  ng.isLoadThumb = false;
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

    ng.removeCaptureImage = function(){
      ng.alert.imagen = "";
      ng.showThumbData = false;
      ng.isDeleteThumb = false;
      ng.isLoadThumb = true;
      var _elm = angular.element('#loadThumbDataGif');
      _elm.val('');
      _elm.off('change');
    };

    ng.saveAlert = function(){
      $preload.show();
      var request = null;
      if(typeof $routeParams.nid != 'undefined'){
        request = $http.put(URL + URLALERT, ng.alert);
      }else{
        request = $http.post(URL + URLALERT, ng.alert);
        delete ng.alert.aid;
        delete ng.alert.date_create;
        delete ng.alert.auth_name;
      }
      request.success(function(data, status, headers, config) {
        var data = data;
        if(data.status){
          $timeout(function(){
            $preload.hide();
            $msj.show(data.response.op, positionMSj);
            $location.path('/alertas/');
          }, 3000);
        }else{
          $preload.hide();
          toastErrorList(data.error.fields, data.error.message);
        }
      }).error(function(data, status, headers, config) {
        $preload.hide();
        noValidForm();
      });
    };

    ng.previewAlert = function($event){
      //Preview
      var $event = $event, DATA = ng.alert;
      $preload.show();
      $http.post(URL + URLPREVIEW, DATA).
      success(function(data) {
          var data = data;
          //$timeout(function(){
              if(data.status){
                  $mdDialog.show({
                      targetEvent: $event,
                      templateUrl:CMSDATA.GLOBAL.URLTEMPLATE + 'modal/alertas/previewnew.html',
                      locals: {
                          response : data.response
                      },
                      controller: addPreviewNews
                  });
                  $msj.show(CMSDATA.MSJ.MSJ27, 'top right');
              }else{
                  $preload.hide();
                  $msj.show(CMSDATA.MSJ.MSJ4, 'top right');
              }
          //},TIMERESULT);
      }).error(function(data) {
          $preload.hide();
          $msj.show(CMSDATA.MSJ.MSJ4, 'top right');
      });
    };

    function addPreviewNews(scope, $mdDialog, $document, $sce, $preload, response) {
        var response = response;
        //Close Modal
        scope.addClosePreviewNews = function() {
            $mdDialog.hide();
        };
        scope.ifrmAddHTML = $sce.trustAsHtml('<iframe src="'+response+'" frameborder="0" scrolling="auto" style="width:100%; height:500px" id="ifrm"></iframe>');
        $timeout(function(){
            var ifrm = angular.element('#ifrm');
            ifrm.css('visibility', 'hidden');
            $timeout(function(){
                ifrm.css('visibility', 'visible');
                $preload.hide();
            }, TIMERESULT*8);
        }, 0);
        scope.previewRWD = 'desktop';
        scope.changePreviewRWD = function($event){
            var scopeSelect = scope.previewRWD;
            ng.responsiveModal(scopeSelect);
        };
        scope.urlPreviewNewWindow = response;
    };

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

    ng.publishAlert = function(){
      ng.saveProgress = true;
      $http.post(URL + URLPUBLISH, {'aid': $routeParams.nid}).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
              ng.saveProgress = false;
              $msj.show(CMSDATA.MSJ.MSJ9, positionMSj);
              $location.path('/alertas/');
          }else{
              $msj.show(CMSDATA.MSJ.MSJ59, positionMSj);
              ng.saveProgress = false;
          }
        }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ59, positionMSj);
            ng.saveProgress = false;
        });
    };

    ng.unpublishAlert = function(){
      //Editando
      var confirmDeleteNew = $mdDialog.confirm({
        title: 'Alerta',
        content: '¿Está seguro que desea despublicar?',
        ok: 'Aceptar'
      });
      $mdDialog.show( confirmDeleteNew ).then(function() {
          //OK
          $preload.show();
          unpublish($routeParams.nid);
      })
      .finally(function() {
      //Close alert
      confirmDeleteNew = undefined;
      });
    };

    function unpublish(id){
      ng.saveProgress = true;
      $http.post(URL + URLUNPUBLISH, {'aid': id}).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
              ng.saveProgress = false;
              $msj.show(CMSDATA.MSJ.MSJ67, positionMSj);
              $preload.hide();
              $location.path('/alertas/');
          }else{
              $msj.show(CMSDATA.MSJ.MSJ68, positionMSj);
              $preload.hide();
              ng.saveProgress = false;
          }
        }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ68, positionMSj);
            ng.saveProgress = false;
            $preload.hide();
        });
    }

    //Eliminar
    ng.deleteAlert = function($event){
        var confirmDelete = $mdDialog.confirm({
            title: 'Confirmación',
            content: '¿Está seguro que desea eliminar?',
            ok: 'Aceptar',
            cancel: 'Cancelar'
        });
        $mdDialog.show( confirmDelete ).then(function() {
            //OK
            ng.closeDeleteAlert($routeParams.nid);
        }).finally(function() {
            //Close alert
            confirmDelete = undefined;
        });
    };
    //Cerrar
    ng.closeDeleteAlert = function(id) {
      ng.saveProgress = true;
      $http.delete(URL + URLALERT, {params: {aid: id}}).
        success(function(data) {
            var data = data;
            if(data.status){
              ng.saveProgress = false;
              $mdDialog.cancel();
              $msj.show(data.response.op, positionMSj);
              $location.path('/alertas/');
            }else{
              console.log('status not true')
            }
        }).error(function(data) {
          $timeout(function(){
            $preload.hide();
          },TIMERESULT);
        });
    };

    ng.clickViewActivity = function(revision){
      $preload.show();
      $msj.show(CMSDATA.MSJ.MSJ12,positionMSj);
      ng.alert = {
        'aid': revision.aid,
        'sitio': revision.sitio,
        'titulo': revision.titulo,
        'imagen': revision.imagen,
        'cuerpo': revision.cuerpo,
        'url': revision.url,
        'tipo': revision.tipo,
        'date_create': revision.date_create,
        'status': revision.status,
        'publish': revision.publish,
        'auth_name': revision.auth_name,
        'data_factory_id': revision.data_factory_id
      };
      $preload.hide();
    };

}]);

});
