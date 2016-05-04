// Controller : List Alerts
// 'use strict';

define(['app'], function (app) {
app.register.controller('alertCtrl', [
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
  '$cacheService',
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
      $cacheService
    ){
    var ng = $scope;

    //GLOBALS
    var URL = CMSDATA.GLOBAL.URLBASE,
        URLVIEW = CMSDATA.GLOBAL.URLVIEW,
        URLLIST = 'listado.html',
        URLLOGIN = 'login.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLALERT = 'alert',
        URLDETAILALERT = 'alert/id/',
        URLPUBLISH = 'alert/publish',
        URLUNPUBLISH = 'alert/unpublish',
        URLLISTSITELIST = 'sitio/list',
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
      get_alerts();
    };

    //OPEN PERFIL
    ng.openPerfil = function($event, name){
        $location.path('/perfil');
    };

    //MODEL
    ng.alerts = [];
    ng.alertsAfter = '';

    var get_alerts = function(site){
      var alerts_url = (site) ? URL + URLALERT + '?sitio=' + site : URL + URLALERT;
      ng.alerts = [];
      $http.get(alerts_url).success(function(data){
          if(data.status){
            if(data.response.length > 0){
              angular.forEach(data.response, function(v, k){
                if(v.status){
                  ng.alerts.push(v);
                }
              });
              ng.alertsAfter = (ng.alerts[ng.alerts.length-1]).date_create;
            }
          }
      });
    };

    //NEXT PAGE
    ng.alertsBusy = false;
    ng.msjBusy = false;
    ng.alertsNextPage = function(){
      if (ng.alertsBusy) return;
      if (ng.alertsAfter == "") return;
      ng.alertsBusy = true;
      ng.msjBusy = false;

      var alerts_url = URL + URLALERT + '?cursor=' + ng.alertsAfter;
      if(ng.sitio){
        alerts_url = alerts_url + '&sitio=' + ng.sitio.slug;
      }

      var request = $http.get(alerts_url);
      request.success(function(data){
          var data = data;
          $timeout(function(){
            if(data.status){
              var items = data.response;
              if(items.length > 0){
                for (var i = 0; i < items.length; i++) {
                  if(items[i].status){
                    ng.alerts.push(items[i]);
                  }
                }
                ng.alertsAfter = (ng.alerts[ng.alerts.length-1]).date_create;
                ng.alertsBusy = false;
                msjBusy = false;
              }else{
                ng.alertsBusy = false;
                ng.msjBusy = true;
              }
            }else{
              ng.msjBusy = false;
            }
          },TIMERESULT);
      }).error(function(data) {
          $timeout(function(){
              ng.msjBusy = false;
          },TIMERESULT);
      });


    };

    ng.openApps = function($event, name){
        var _name = name;
        $location.path(_name);
    };

    ng.obtenerDataXSitio = function(){
      ng.alertsAfter = '';
      var objSitio = ng.sitio;
      if(objSitio){
        get_alerts(objSitio.slug);
      }else{
        get_alerts();
      }
    };

    /* LISTA SITIO */
    ng.sitios = [];
    ng.sitio = null; //Bar Tool
    ng.listaSitios = function() {
        //Sitios
        $cacheService.get(URL + URLLISTSITELIST)
            .then(
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
    ng.listaSitios();
    /* END LISTA SITIO */

    ng.publishAlert = function($event, $index, id){
      ng.saveProgress = true;
      $http.post(URL + URLPUBLISH, {'aid': id}).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
              ng.saveProgress = false;
              $msj.show(CMSDATA.MSJ.MSJ9, positionMSj);
              ng.alerts[$index].publish = 1;
          }else{
              $msj.show(CMSDATA.MSJ.MSJ59, positionMSj);
              ng.saveProgress = false;
          }
        }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ59, positionMSj);
            ng.saveProgress = false;
        });
    };

    ng.unpublishAlert = function($event, $index, id){
      //Editando
      var confirmDeleteNew = $mdDialog.confirm({
        title: 'Alerta',
        content: '¿Está seguro que desea despublicar?',
        ok: 'Aceptar'
      });
      $mdDialog.show( confirmDeleteNew ).then(function() {
          //OK
          $preload.show();
          unpublish($index, id);
      })
      .finally(function() {
      //Close alert
      confirmDeleteNew = undefined;
      });
    };

    function unpublish(index, id){
      ng.saveProgress = true;
      $http.post(URL + URLUNPUBLISH, {'aid': id}).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
              ng.saveProgress = false;
              $msj.show(CMSDATA.MSJ.MSJ67, positionMSj);
              $preload.hide();
              ng.alerts[index].publish = 0;
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

    ng.openCreateAlert = function($event, $type, aid){
      var _aid = aid, _type = $type;
      $preload.show();
      if(_aid){
        $location.path('/alerta/detalle/'+_aid);
      }else{
        $location.path('/alerta/detalle/');
      }
    };

    ng.deleteAlert = function($event, $index, id){
      var confirmDelete = $mdDialog.confirm({
          title: 'Confirmación',
          content: '¿Está seguro que desea eliminar?',
          ok: 'Aceptar',
          cancel: 'Cancelar'
      });
      $mdDialog.show( confirmDelete ).then(function() {
          //OK
          ng.closeDeleteAlert($index, id);
      }).finally(function() {
          //Close alert
          confirmDelete = undefined;
      });
    };

    //Cerrar
    ng.closeDeleteAlert = function(index, id) {
      ng.saveProgress = true;
      $http.delete(URL + URLALERT, {params: {aid: id}}).
        success(function(data) {
            var data = data;
            if(data.status){
              ng.saveProgress = false;
              $mdDialog.cancel();
              $msj.show(data.response.op, positionMSj);
              ng.alerts.splice(index, 1);
            }else{
              console.log('status not true')
            }
        }).error(function(data) {
          $timeout(function(){
            $preload.hide();
          },TIMERESULT);
        });
    };

}]);

});
