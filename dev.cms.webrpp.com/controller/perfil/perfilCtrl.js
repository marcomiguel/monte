// Controller : Login
// 'use strict';

define(['app'], function (app) {

app.register.controller('perfilCtrl', [
    '$scope',
    '$msj',
    '$http',
    '$preload',
    '$login',
    '$localStorage',
    '$location',
    '$logout',
    '$menuleft',
    '$cacheService',
    '$rootScope',
function(
    $scope,
    $msj,
    $http,
    $preload,
    $login,
    $localStorage,
    $location,
    $logout,
    $menuleft,
    $cacheService,
    $rootScope
    ){
    var ng = $scope;
    //GLOBALS
    var URL = CMSDATA.GLOBAL.URLBASE,
        URLLOGIN = 'login.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLSESSIONLOGIN = 'session/login',
        URLPROFILE = 'user/profile',
        URLPROFILEPICTURE = 'user/profile_picture',
        URLSAVEPASSWORD = 'user/clave',
        URLCATEGORYAUTOR = 'categoria/index/rpp',
        DATA = {},
        TIMERESULT = 1000;
    var positionMSj = 'top right';
    var nghome = ng.$parent;
    nghome.preloader = false;
    //MENU LEFT
    ng.menuleft = $menuleft.get();
    ng.isLogin = false;
    console.log(nghome, 'nghome');

    //CONFIG
    ng.saveProgress = false;
    ng.focusIpnutUser = false;
    ng.user = {
                id: null,
                pictureUrl: false,
                name : '',
                email: '',
                occupation: '',
                password: '',
                new_password: '',
                confirm_password: '',
                autor : {
                    categoria: { label: '', nombre: '', slug: '' },
                    biografia : '',
                    facebook : '',
                    twitter : ''
                }
              };

    //Review Session
    $preload.show();
    $login.get(URL + URLSESSION).then(
      function(data) {
          var data = data;
          if(data.status){
              ng.user.pictureUrl = !(data.response.foto)?
              false:data.response.foto+"?"+new Date().getTime();
              if(ng.user.pictureUrl){
                ng.showThumbData = true;
                ng.isDeleteThumb = true;
                ng.isLoadThumb = false;
              }
              $preload.hide();
              ng.loadProfile();
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

    ng.custom = true;

    //Close Session
    ng.closeSession = function(){
        $logout.get(URL + URLCLOSESESSION);
    };

    //Autor Section
    ng.categorias = [];
    var loadAutorSection = function(_categoria){
        //Section
        $http.get(URL + URLCATEGORYAUTOR)
        .then(
            function (data) {
                var data = data;
                if(data.status){
                    //categorias
                    var response = data.data.response;
                    ng.categorias = response;
                    if(_categoria){
                        ng.user.autor.categoria = _categoria;
                    }
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
            }
        );
    };

    ng.errorProfile = undefined;
    ng.loadProfile = function() {
        $http.get(URL + URLPROFILE).
        success(function(data){
            if(data.status){
              var profile = data.response;
              ng.user.id = profile.id;
              ng.user.name = profile.nombre;
              ng.user.email = profile.email;
              ng.user.occupation = profile.cargo == null ? '' : profile.cargo;
              //Section Autor
              ng.user.autor.categoria = (profile.hasOwnProperty('autor'))?profile.autor.categoria:'';
              ng.user.autor.biografia = (profile.hasOwnProperty('autor'))?profile.autor.biografia:'';
              ng.user.autor.facebook = (profile.hasOwnProperty('autor'))?profile.autor.facebook:'';
              ng.user.autor.twitter = (profile.hasOwnProperty('autor'))?profile.autor.twitter:'';
              var _categoria = (profile.hasOwnProperty('autor'))?profile.autor.categoria:undefined;
              loadAutorSection(_categoria);
          }else{
              ng.errorProfile = data.error.message;
          }
        });
    };

    //NO Valid Form
    var noValidForm = function(){
        $msj.show(CMSDATA.MSJ.MSJ41, positionMSj);
        ng.saveProgress = false;
    };

    //Click
    ng.saveProfile = function($event){
      ng.saveProgress = true;
      DATA = {
          id : ng.user.id,
          nombre: ng.user.name,
          email: ng.user.email,
          cargo: ng.user.occupation,
          autor : {
              categoria : ng.user.autor.categoria,
              biografia : ng.user.autor.biografia,
              facebook : ng.user.autor.facebook,
              twitter : ng.user.autor.twitter
          }
      };

      $http.post(URL + URLPROFILE, DATA).
      success(function(data, status, headers, config) {
          var data = data;
              if(data.status){
                  ng.saveProgress = false;
                  $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
              }else{
                  noValidForm();
              }
      }).error(function(data, status, headers, config) {
              noValidForm();
      });
    };

    ng.savePassword = function($event){
      ng.saveProgress = true;
      DATA = { password : ng.user.password, new_password: ng.user.new_password,
      confirm_password: ng.user.confirm_password };
      $http.post(URL + URLSAVEPASSWORD, DATA).
      success(function(data, status, headers, config) {
          var data = data;
              if(data.status){
                  ng.saveProgress = false;
                  $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
              }else{
                  ng.saveProgress = false;
                  $msj.show(data.error.message, positionMSj);
              }
      }).error(function(data, status, headers, config) {
              noValidForm();
      });
    };

    ng.uploadCaptureImage = function(){
      var elm = angular.element('#loadThumbDataGif');
      elm.click();
      angular.element('#loadThumbDataGif').off('change').on('change',
      function(evt){
          var files = evt.currentTarget.files;
          var formdata = new FormData();
          formdata.append('id', ng.user.id);
          formdata.append('foto', files[0]);
          var DATA = formdata;
          $preload.show();
          $http.post(URL + URLPROFILEPICTURE, DATA, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined} /* multipart/form-data */
          }).
          success(function(data) {
              var data = data;
              if(data.status){
                  var url = data.response.foto;
                  ng.user.pictureUrl = url + "?" + new Date().getTime();
                  ng.showThumbData = true;
                  ng.isDeleteThumb = true;
                  ng.isLoadThumb = false;
                  $msj.show(CMSDATA.MSJ.MSJ5, positionMSj);
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
      ng.user.pictureUrl = false;
      ng.showThumbData = false;
      ng.isDeleteThumb = false;
      ng.isLoadThumb = true;
      var _elm = angular.element('#loadThumbDataGif');
      _elm.val('');
      _elm.off('change');
    };

}]);

});
