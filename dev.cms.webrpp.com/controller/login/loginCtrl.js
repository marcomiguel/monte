// Controller : Login

'use strict';

define(['app'], function (app) {


    app.register.controller('loginCtrl', [
        '$scope',
        '$http',
        '$timeout',
        '$mdToast',
        '$rootScope',
        '$msj',
        '$document',
        '$location',
        '$localStorage',
        '$login',
        '$templateCache',
    function(
        $scope,
        $http,
        $timeout,
        $mdToast,
        $rootScope,
        $msj,
        $document,
        $location,
        $localStorage,
        $login,
        $templateCache
        ){
        var ng = $scope;
        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLVIEW = CMSDATA.GLOBAL.URLVIEW,
            URLLIST = 'listado.html',
            URLLOGIN = 'login.html',
            URLSESSION = 'session',
            URLSESSIONLOGIN = 'session/login',
            URLPERMISSIONS = '/session/index',
            DATA = {},
            TIMERESULT = 1000;
        var positionMSj = 'top right';

        var nghome = ng.$parent;
        nghome.preloader = false;
        ng.isLogin = false;
        console.log(nghome, 'nghome');

        //CONFIG
        ng.loginProgress = false;
        ng.user = { name : '', password: ''};
        ng.focusIpnutUser = false;

        //VALID SESSION
        $login.get(URL + URLSESSION).then(
          function(data) {
              var data = data;
              if(data.status){
                  $location.path('/publicador');
              }else{
                  ng.isLogin = true;
              }
          },
          function(msgError) {
              ng.isLogin = true;
          }
        );

        //NO Valid Form
        var noValidForm = function(){
            $msj.show(CMSDATA.MSJ.MSJ1, positionMSj);
            ng.loginProgress = false;
            ng.userDisabled = false;
            ng.passwordDisabled = false;
            ng.loginDisabled = false;
        };

        //Click Login
        ng.loginCMS = function(type){
            ng.loginProgress = true;
            ng.userDisabled = true;
            ng.passwordDisabled = true;
            ng.loginDisabled = true;
            DATA = { username : ng.user.name, password: ng.user.password};
            $http.post(URL + URLSESSIONLOGIN, DATA).
              success(function(data, status, headers, config) {
                var data = data;
                //$timeout(function(){
                    if(data.status){
                        ng.loginProgress = true;
                        //Limpiar templates de cache
                        $templateCache.removeAll();
                        //Validar sus permisos
                        $http.get(URL + URLPERMISSIONS).then(function(rsp) {
                            var data_permission = rsp.data;
                            if(data_permission.status){
                              var response = data_permission.response;
                              if('rol_acciones' in response){
                                permissionList = response['rol_acciones'];
                                $localStorage.login =  data.response;
                                $timeout(function () {
                                    $location.path('/publicador');
                                },5000);
                              }
                            }else{
                              $location.path('/acceso-denegado/');
                            }
                        });
                    }else{
                        noValidForm();
                    }
                //},TIMERESULT);
            }).error(function(data, status, headers, config) {
                //$timeout(function(){
                    noValidForm();
                //},TIMERESULT);
            });
        };

    }]);
});
