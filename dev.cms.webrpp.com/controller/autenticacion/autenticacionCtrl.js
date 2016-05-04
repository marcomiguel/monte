// Controller : autenticacion

// 'use strict';

define(['app'], function (app) {

app.register.controller('autenticacionCtrl', [
    '$scope',
    '$preload',
    '$rootScope',
    '$location',
    '$http',
    '$timeout',
    '$login',
    'permissions',
    '$route',
    '$msj',
    function (
            $scope,
            $preload,
            $rootScope,
            $location,
            $http,
            $timeout,
            $login,
            permissions,
            $route,
            $msj
        ) {

        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
                URLSESSION = 'session',
                URLCLOSESESSION = 'session/logout',
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

        ng.initList = function (data) {
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

            ng.access = [];
            var permission = permissions.getPermissions();
            var params = $route.routes;
            angular.forEach(permission, function(val, key){
              if(val.indexOf('index') >= -1){
                //match
                for(v in params){
                  var item = params[v];
                  if(item['permission']){
                    if(item['permission']['slug']){
                      if(item['permission']['slug'] == key && item['permission']['action'] == 'index'){
                        ng.access.push({'name': item.originalPath.slice(1).trim(),'url': v});
                        break;
                      }
                    }
                  }
                }

              }
            });
        };

    }]);

});
