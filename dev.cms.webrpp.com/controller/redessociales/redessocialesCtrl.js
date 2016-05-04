// Controller : List Roles

// 'use strict';

define(['app'], function (app) {

app.register.controller(
    'redessocialesCtrl', [
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
        '$sce',
        '$mdToast',
        '$window',
        '$popup',
        function (
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
            $sce,
            $mdToast,
            $window,
            $popup) {
  //NG SCOPE
  var ng=$scope;
  //INSERT SDK FACEBOOK
  //$insertJavascript.fb('2.5');

  //URL GLOBAL
  var URL = {
    base: CMSDATA.GLOBAL.URLBASE,
    sesion:'session',
    connect : 'api/facebook/connect',
    connect_twitter : 'api/twitter/connect',
    me : 'redessociales/facebook_me',
    me_twitter : 'redessociales/twitter_me',
    managed_pages: 'redessociales/facebook_pages',
    managed_pages_twitter: 'redessociales/twitter_pages',
    save : 'redessociales/save',
    read : 'redessociales/leer'
  };

  // ---- INICIO SESION ---- //
  ng.user = { pictureUrl: false };

  var rechazarSesion=function(){
    $msj.show(CMSDATA.MSJ.MSJ0, CMSDATA.POSITIONMSJ);
    delete $localStorage.login;
    $preload.hide();
    $location.path('/');
  };

  var verificarDetalle = function(){
      /*$window.fbAsyncInit = function() {
        FB.init({
          appId: CMSDATA.IDS.facebook,
          status: true,
          cookie: true,
          xfbml: true,
          version: 'v2.5'
        });
    };*/
      //CONFIG FACEBOOK
      ng.isAccountsFB = false;
      ng.redessociales = {
          facebook : {
              accounts : [],
              preload: false
          },
          twitter : {
              accounts : [],
              preload: false
          },
          google : {
              accounts : [],
              preload: false
          }
      };
      ng.fb = {
          accounts : [],
          preload: false
      };
      //LEER
      $preload.show();
      $http.get(URL.base + URL.read).
      success(function(data) {
          var data = data;
          if(data.status){
              var response = data.response;
              //Facebook
              ng.redessociales.facebook.accounts = (response.facebook)?response.facebook.accounts:[];
              if(ng.redessociales.facebook.accounts){
                  (ng.redessociales.facebook.accounts.length > 0)?ng.isAccountsFB = true:'';
              }else{
                  ng.redessociales.facebook.accounts = [];
              }
              //Twitter
              ng.redessociales.twitter.accounts = (response.twitter)?response.twitter.accounts:[];
              if(ng.redessociales.twitter.accounts){
                  (ng.redessociales.twitter.accounts.length > 0)?ng.isAccountsTW = true:'';
              }else{
                 ng.redessociales.twitter.accounts = [];
              }
              //Google+
              ng.redessociales.google.accounts = (response.google)?response.google.accounts:[];
              if(ng.redessociales.google.accounts){
                  (ng.redessociales.google.accounts.length > 0)?ng.isAccountsG = true:'';
              }else{
                  ng.redessociales.google.accounts = [];
              }
               //$msj.show('Se obtuvo la configuración guardada.',CMSDATA.POSITIONMSJ);
          }
          $preload.hide();
      }).error(function(err) {
          $msj.show('Ocurrio un error. No se obtuvo la configuración guardada.',CMSDATA.POSITIONMSJ);
           $preload.hide();
      });

      ng.insertFBActive = function($event, page, $index, type, parentIndex, redsocial){
          //console.log($index, '$index');
          //console.log(parentIndex, 'parentIndex');
          var page = page, $index = $index, type = type, parentIndex = parentIndex, redsocial = redsocial;
          ng.redessociales[redsocial].accounts[parentIndex].managed_pages[type][$index].active = (ng.redessociales[redsocial].accounts[parentIndex].managed_pages[type][$index].active === false)?true:false;
      };
      ng.activeAccountFB = function($event, account, $index){
          var $index = $index;
          for (var i = 0; i < ng.redessociales.facebook.accounts.length; i++) {
              ng.redessociales.facebook.accounts[i].active = false;
          }
          ng.redessociales.facebook.accounts[$index].active = true;
      };
      ng.loginFB = function($event){
          var popup = null;
          var urlconnectfb = URL.base + URL.connect;
          var reviewDuplicate = function(response){
            var response = response;
            var id = response.id;
            var isRepeat = null, keepGoing = true;
            angular.forEach(ng.redessociales.facebook.accounts, function(v,i){
                if(keepGoing) {
                    if(ng.redessociales.facebook.accounts[i].id === id){
                        isRepeat = i;
                        keepGoing = false;
                    }
                }
            });
            return isRepeat;
          };
          var closeCallback = function(){
              ng.redessociales.facebook.preload = true;
              $http.get(URL.base + URL.managed_pages).
              success(function(data) {
                  var data = data;
                  if(data.status){
                      var response = data.response;
                      if(response){
                          var itemDuplicate = reviewDuplicate(response);
                          if(itemDuplicate != null){
                              var name = (response.name)?response.name:'';
                              var confirmDuplicate = $mdDialog.confirm({
                                  title: 'Confirmación',
                                  content: 'El usuario ' + name + ' ya existe, ¿ Desea reemplazar los valores?',
                                  ok: 'Aceptar',
                                  cancel: 'Cancelar'
                              });
                              $mdDialog
                              .show( confirmDuplicate ).then(function() {
                                  //OK
                                  ng.redessociales.facebook.accounts[itemDuplicate] = response;
                              })
                              .finally(function() {
                                  //Close alert
                                  confirmDuplicate = undefined;
                              });
                          }else{
                              ng.redessociales.facebook.accounts.push(response);
                          }
                          ng.isAccountsFB = true;
                      }
                  }
                  ng.redessociales.facebook.preload = false;
              }).error(function(err) {
                  ng.redessociales.facebook.preload = false;
              });
          };
          var popup = $popup.open(urlconnectfb, 'rpp', '1050', '550', closeCallback);
      };
      //DELETE FB
      ng.deleteFB = function($event, account, $index, redsocial){
          var $index = $index, redsocial = redsocial;
          var confirmDelete = $mdDialog.confirm({
              title: 'Confirmación',
              content: '¿Está seguro que desea eliminar?',
              ok: 'Aceptar',
              cancel: 'Cancelar'
          });
          $mdDialog
          .show( confirmDelete ).then(function() {
              //OK
              console.log($index, '$index');
              ng.redessociales[redsocial].accounts.splice($index, 1);
          })
          .finally(function() {
              //Close alert
              confirmDelete = undefined;
          });
      };
      //TWITTER
      ng.loginTwitter = function($event){
          var popup = null;
          var urlconnectTw = URL.base + URL.connect_twitter;
          var reviewDuplicate = function(response){
            var response = response;
            var id = response.id;
            var isRepeat = null, keepGoing = true;
            angular.forEach(ng.redessociales.twitter.accounts, function(v,i){
                if(keepGoing) {
                    if(ng.redessociales.twitter.accounts[i].id === id){
                        isRepeat = i;
                        keepGoing = false;
                    }
                }
            });
            return isRepeat;
          };
          var closeCallback = function(){
              ng.redessociales.twitter.preload = true;
              $http.get(URL.base + URL.managed_pages_twitter).
              success(function(data) {
                  var data = data;
                  if(data.status){
                      console.log(data, 'data');
                      var response = data.response;
                      if(response){
                          var itemDuplicate = reviewDuplicate(response);
                          if(itemDuplicate != null){
                              var name = (response.name)?response.name:'';
                              var confirmDuplicate = $mdDialog.confirm({
                                  title: 'Confirmación',
                                  content: 'El usuario ' + name + ' ya existe, ¿ Desea reemplazar los valores?',
                                  ok: 'Aceptar',
                                  cancel: 'Cancelar'
                              });
                              $mdDialog
                              .show( confirmDuplicate ).then(function() {
                                  //OK
                                  ng.redessociales.twitter.accounts[itemDuplicate] = response;
                              })
                              .finally(function() {
                                  //Close alert
                                  confirmDuplicate = undefined;
                              });
                          }else{
                              ng.redessociales.twitter.accounts.push(response);
                          }
                          ng.isAccountsTW = true;
                      }
                  }
                  ng.redessociales.twitter.preload = false;
              }).error(function(err) {
                  ng.redessociales.twitter.preload = false;
              });
          };
          var popup = $popup.open(urlconnectTw, 'rpp', '1050', '550', closeCallback);
      };
      //SAVE
      ng.clickSave = function($event){
          //var DATA = ng.fb;
          var DATA = ng.redessociales;
          $preload.show();
          $http.post(URL.base + URL.save, DATA).
          success(function(data) {
              var data = data;
              if(data.status){
                   $msj.show('Se guardo correctamente.',CMSDATA.POSITIONMSJ);
              }
              $preload.hide();
          }).error(function(err) {
              $msj.show('Ocurrio un error. Vuelve a intentarlo.',CMSDATA.POSITIONMSJ);
               $preload.hide();
          });
      };
      //END PUBLISH FACEBOOK
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
          rechazarSesion(); }
    );
  };

  // ---- FIN SESION ---- //

  var init=function(){
    verificarSesion();
  }();

}]);

});
