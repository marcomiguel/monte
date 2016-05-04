// Controller : List News

// 'use strict';

define(['app'], function (app) {

app.register.controller('detailCtrl', [
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
        $mdToast
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
        URLSOCIALTV = 'socialtv',
        URLITEMSOCIALTV = 'socialtv/lista/',
        URLSOCIALTVXML = 'socialtv/xml/',
        URLTAGSEARCH = 'tag/search/',
        URLPROGRAMSEARCH = 'socialtv/programas'
        URLPUBLISH = 'socialtv/publish',
        URLITEMACTIVITY = 'socialtv/activity/',
        URLPREVIEW = 'socialtv/vistaprevia/',
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

    //MENU LEFT
    ng.menuleft = [];

    ng.showAddOptions = false;

    //MODEL
    ng.history = {
      lid: null,
      programa: null,
      titulo: '',
      hashtags: '',
      url: '',
      sitio: '',
      sitio_url: '',
      date_create: null,
      status: 1,
      contenido: [],
      tag: [],
      publish: 0,
    };

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
          $http.get(URL + URLITEMSOCIALTV + _nid).
            success(function(data) {
              var data = data;
              if(data.status){
                var response = data.response;
                if(response.length > 0){
                  response[0].sitio_url = (angular.isDefined(response[0].sitio_url))?response[0].sitio_url:URL;
                  response[0].url = response[0].sitio_url + URLSOCIALTVXML + response[0].programaslug +".xml";
                  response[0].preview = response[0].sitio_url + URLSOCIALTV + '/widget/' + response[0].programaslug;

                  ng.history = {
                    lid: response[0].lid,
                    url: response[0].url,
                    preview: response[0].preview,
                    sitio_url: response[0].sitio_url,
                    programa: response[0].programa,
                    titulo: response[0].titulo,
                    hashtags: response[0].hashtags,
                    sitio: response[0].sitio,
                    date_create: response[0].date_create,
                    status: response[0].status,
                    contenido: response[0].contenido,
                    tag: response[0].tag,
                    publish: response[0].publish
                  };
                }else{
                  $location.path('/oido-social/');
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
          $http.get(URL + URLITEMACTIVITY + _nid).success(function(data) {
            var data = data;
            if(data.status){
              var response = data.response;
              if(response.length > 0){
                angular.forEach(response[0], function (item, key) {
                  if(key!='_id'&&key!='lid'){
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

    //Reordenamiento Drag and Drop
    ng.onDropComplete = function (index, obj, evt) {
        var obj = obj, index = index, evt = evt;
        if(obj && obj.hasOwnProperty('drag')){
          var comment = {
            "tipo": (obj.via)?obj.via.toLowerCase():'facebook',
            "hashtags": obj.data.hashtags,
            "nombreusuario": obj.data.name,
            "cuentausuario": obj.data.autor,
            "avatar": obj.data.avatar,
            "mensaje": obj.texto,
            "datetime": obj.data.post_date,
            "embed": obj.embed,
            "imgpost": obj.data.foto
          };
          if(typeof(index) != "undefined"){
            ng.history.contenido.splice(index, 0, comment);
          }else{
            ng.history.contenido.push(comment);
          }
          delete obj['drag'];
        }else{
            //No editando
            if(typeof(index) != "undefined"){
              var otherIndex = ng.history.contenido.indexOf(obj);
              ng.history.contenido.splice(otherIndex, 1);
              ng.history.contenido.splice(index, 0, obj);
            }else{
              var otherIndex = ng.history.contenido.indexOf(obj);
              ng.history.contenido.splice(otherIndex, 1);
              ng.history.contenido.push(obj);
            }
        }
    };

    //Eliminar
    ng.deleteComment = function($event, $index, comment){
        var $event = $event, $index = $index, comment = comment;
        var confirmDelete = $mdDialog.confirm({
            title: 'Confirmación',
            content: '¿Está seguro que desea eliminar?',
            ok: 'Aceptar',
            cancel: 'Cancelar'
        });
        $mdDialog.show( confirmDelete ).then(function() {
            //OK
            ng.closeDeleteComment($index);
        }).finally(function() {
            //Close alert
            confirmDelete = undefined;
        });
    };
    //Cerrar
    ng.closeDeleteComment = function($index) {
        var index = $index;
        ng.history.contenido.splice(index, 1);
        $mdDialog.cancel();
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

    ng.saveHistory = function($event){
      $preload.show();
      var request = null;
      ng.history.programa = ng.history.programa?ng.history.programa:"";
      if(typeof $routeParams.nid != 'undefined'){
        request = $http.put(URL + URLSOCIALTV, ng.history);
      }else{
        request = $http.post(URL + URLSOCIALTV, ng.history);
        delete ng.history.lid;
        delete ng.history.date_create;
      }
      request.success(function(data, status, headers, config) {
        var data = data;
        if(data.status){
          $timeout(function(){
            $preload.hide();
            $msj.show(data.response.op, positionMSj);
            $location.path('/oido-social/');
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

    ng.deleteHistory = function($event){
        var $event = $event;
        var confirmDelete = $mdDialog.confirm({
            title: 'Confirmación',
            content: '¿Está seguro que desea eliminar?',
            ok: 'Aceptar',
            cancel: 'Cancelar'
        });
        $mdDialog.show( confirmDelete ).then(function() {
            //OK
            ng.closeDeleteHistory($routeParams.nid);
        }).finally(function() {
            //Close alert
            confirmDelete = undefined;
        });
    };
    //Cerrar
    ng.closeDeleteHistory = function(id) {
        ng.saveProgress = true;
        $http.delete(URL + URLSOCIALTV, {params: {lid: id}}).
          success(function(data) {
              var data = data;
              if(data.status){
                ng.saveProgress = false;
                $mdDialog.cancel();
                $msj.show(data.response.op, positionMSj);
                $location.path('/oido-social/');
              }else{
                console.log('status not true')
              }
          }).error(function(data) {
            $timeout(function(){
              $preload.hide();
            },TIMERESULT);
          });
    };

    ng.publishHistory = function($event){
      ng.saveProgress = true;
      $http.post(URL + URLPUBLISH, {'lid': $routeParams.nid}).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
              ng.saveProgress = false;
              $msj.show(CMSDATA.MSJ.MSJ9, positionMSj);
              $location.path('/oido-social/');
          }else{
              $msj.show(CMSDATA.MSJ.MSJ52, positionMSj);
              ng.saveProgress = false;
          }
        }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ52, positionMSj);
            ng.saveProgress = false;
        });
    };

    ng.previewAlert = function($event){
      //Preview
      var $event = $event, DATA = ng.history;
      $preload.show();
      $http.post(URL + URLPREVIEW, DATA).
      success(function(data) {
          var data = data;
          //$timeout(function(){
              if(data.status){
                  $mdDialog.show({
                      targetEvent: $event,
                      templateUrl:CMSDATA.GLOBAL.URLTEMPLATE + 'modal/oidosocial/previewnew.html',
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

    //NO Valid Form
    var noValidForm = function(){
        $msj.show(CMSDATA.MSJ.MSJ49, positionMSj);
        ng.saveProgress = false;
    };

    ng.backToList = function(){
      $location.path('/oido-social/');
    };

    ng.newTag = function(chip) {
      //var slug = ;
      return {
        nombre: chip,
        slug: chip.split(" ").join("-").toLowerCase()
      };
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

    //Load History Merged
    var objMerge =  nghome.objMerge;
    if(typeof(objMerge) != "undefined"){
      ng.showDiff = true;
      ng.objMerge = objMerge;
      ng.history = objMerge.obj;
    }else{
      ng.showDiff = false;
    }

    //Autocomplete
    ng.selectedItem  = null;
    ng.searchText1    = null;
    ng.searchText2 = null;
    ng.querySearch   = function(query){
      return $http.get(URL + URLTAGSEARCH + query)
      .then(function(result){
        return $.map(result.data.response, function (n, i) { return n.nombre; });
      })
    };

    ng.programs = [];
    get_programs();

    function get_programs(){
      $http.get(URL + URLPROGRAMSEARCH).then(function(result){
        ng.programs = $.map(result.data.response, function (n, i) { return n.nombre; });
      });
    };

    ng.searchTextChange = function(searchText1){
      ng.history.programa = searchText1;
    };

    ng.searchProgram = function(query){
      var results = query ? ng.programs.filter( createFilterFor(query) ) : ng.programs,
          deferred;
      return results;
    };

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.indexOf(lowercaseQuery) === 0);
      };
    }

    //activity
    ng.clickViewActivity = function(revision){
      $preload.show();
      $msj.show(CMSDATA.MSJ.MSJ12,positionMSj);
      ng.history = {
        lid: revision.lid,
        url: URL + URLSOCIALTVXML + revision.programaslug +'.xml',
        programa: revision.programa,
        titulo: revision.titulo,
        hashtags: revision.hashtags,
        sitio: revision.sitio,
        date_create: revision.date_create,
        status: revision.status,
        contenido: revision.contenido,
        tag: revision.tag,
        publish: revision.publish
      };
      $preload.hide();
    };

    ng.selectedIndex = 0;

    ng.changeSite = function(){
      var searchingSite = true;
      angular.forEach(ng.sites, function(v){
        if(searchingSite) {
          if(v.slug == ng.history.sitio){
            searchingSite = false;
            ng.history.sitio_url = v.url;
          }
        }
      });
    };

    //CLONE ELEMENT FOR DRAG
    var fileClone = CMSDATA.OBJNEW;
    ng.fileClone = fileClone;
    //DRAG START
    $rootScope.$on('draggable:start', function(evt, obj){
      var obj = obj,
      evt = evt;
      var hideClone = function(){
        ng.fileClone = fileClone;
        angular.element('#zone-clone').hide();
      };
      var data = obj.data;
      if(data && data.hasOwnProperty('drag')){
        ng.fileClone = data;
      }else{
        hideClone();
      }
    });
    //DRAG END
    $rootScope.$on('draggable:end', function(event, obj){
      var obj = obj;
      ng.fileClone = fileClone;
      angular.element('#zone-clone').show();
    });

}]);

});
