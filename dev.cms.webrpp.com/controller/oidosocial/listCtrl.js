// Controller : List News

// 'use strict';

define(['app'], function (app) {

app.register.controller('listCtrl', [
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
      $mdDialog
    ){
    var ng = $scope;

    //GLOBALS
    var URL = CMSDATA.GLOBAL.URLBASE,
        URLVIEW = CMSDATA.GLOBAL.URLVIEW,
        URLLIST = 'listado.html',
        URLLOGIN = 'login.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLITEMSOCIALTV = 'socialtv/lista/',
        URLSOCIALTV = 'socialtv',
        URLSOCIALTVXML = 'socialtv/xml/',
        URLPUBLISH = 'socialtv/publish',
        URLSOCIALTVSEARCH = 'socialtv/search',
        URLTAGSEARCH = 'tag/search/',
        DATA = {},
        TIMERESULT = 1000/2;
    //VARS TOOLS
    var positionMSj = 'top right';
    //SEARCH
    ng.filterText = CMSDATA.FILTER.texto;
    ng.ownHistories = false;
    ng.filterFrom = CMSDATA.FILTER.desde; //-30 DAYs
    ng.filterTo = CMSDATA.FILTER.hasta;
    //FLAG DISABLED SESSION
    ng.disabledCloseSession = false;

    //PARENT SCOPE
    var nghome = ng.$parent;
    nghome.preloader = false;
    console.log(nghome, 'nghome');

    //PROFILE PICTURE
    ng.user = { pictureUrl: false, id: false, name: false };

    //MENU LEFT
    //ng.menuleft = $menuleft.get();
    ng.menuleft = [];

    //Review Session
    $preload.show();
    $login.get(URL + URLSESSION).then(
      function(data) {
          var data = data;
          if(data.status){
              ng.user.pictureUrl = (data.response.foto=="")?false:data.response.foto+"?"+new Date().getTime();
              ng.user.id = data.response.username;
              ng.user.name = data.response.name;
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

    //MODEL
    ng.histories = [];
    ng.historiesAfter = '';
    ng.isCheckedAll = false;

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
      get_histories();
    };

    var get_histories = function(){
      ng.histories = [];
      $http.get(URL + URLSOCIALTV).success(function(data){
          if(data.status){
            angular.forEach(data.response, function(v, k){
              if(v.status){
                v.sitio_url = (angular.isDefined(v.sitio_url))?v.sitio_url:URL;
                v.url = v.sitio_url + URLSOCIALTVXML + v.programaslug +".xml";
                v.preview = v.sitio_url + URLSOCIALTV + '/widget/' + v.programaslug;
                v.isChecked = false;
                ng.histories.push(v);
              }
            });
            ng.historiesAfter = (ng.histories[ng.histories.length-1]).date_create;
          }
      });
    };

    //OPEN PERFIL
    ng.openPerfil = function($event, name){
        $location.path('/perfil');
    };

    ng.openApps = function($event, name){
        var _name = name;
        $location.path(_name);
    };

    //REDIRECT TO CREATE
    ng.openCreateHistory = function($event, $type, nid){
      var _nid = nid, _type = $type;
      $preload.show();
      $rootScope.objMerge = undefined;
      if(_nid){
        $location.path('/oido-social/detalle/'+_nid);
      }else{
        $location.path('/oido-social/detalle/');
      }
    };

    ng.publishHistory = function($event, $index, lid){
      ng.saveProgress = true;
      $http.post(URL + URLPUBLISH, {'lid': lid}).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
              ng.saveProgress = false;
              $msj.show(CMSDATA.MSJ.MSJ9, positionMSj);
              ng.histories[$index].publish = 1;
          }else{
              $msj.show(CMSDATA.MSJ.MSJ52, positionMSj);
              ng.saveProgress = false;
          }
        }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ52, positionMSj);
            ng.saveProgress = false;
        });
    };

    //MAKE XML
    ng.merge = function($event){
      var histories = $.map(ng.histories, function (n, i) {if (n.isChecked)return n;});
      if(histories.length > 0){
        $preload.show();
        doMerge(histories);
      }else{
        $msj.show(CMSDATA.MSJ.MSJ53, positionMSj);
      }
    };

    var doMerge = function(histories){
      var obj = {
        lid: null,
        programa: '',
        titulo: '',
        url: '',
        sitio: '',
        date_create: '',
        status: true,
        contenido: [],
        tag: []
      };

      var arrTitulo = new Array();
      var arrColor = {'histories': [], 'tags': {}};
      //pushed contenido and tags
      angular.forEach(histories, function(v, k){
        var color = getRandomColor();
        arrColor.histories.push({'titulo': v.titulo, 'color': color});
        $http.get(URL + URLITEMSOCIALTV + v.lid)
          .then(function(result){
              var response = result.data.response;
              response[0].contenido.forEach(function(n){ n.color = color });
              obj.contenido = obj.contenido.concat(response[0].contenido);
          });
        obj.tag = obj.tag.concat(v.tag);
        arrTitulo.push(v.titulo);
        //asociate tag - color
        v.tag.forEach(function(n){ arrColor['tags'][n.slug] = color; });
      });
      obj.titulo = arrTitulo.join(" - ");
      $rootScope.objMerge = { obj: obj, arrColor: arrColor };
      $preload.hide();
      $location.path('/oido-social/detalle/');
    };

    var getRandomColor = function() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    //CHECKED ALL
    ng.historiesCheckAll = function (){
      if (ng.isCheckedAll) {
        ng.isCheckedAll = true;
      } else {
        ng.isCheckedAll = false;
      }
      angular.forEach(ng.histories, function (item) {
        item.isChecked = ng.isCheckedAll;
      });
    };

    //Eliminar
    ng.deleteHistory = function($event, $index, id){
        var $event = $event, $index = $index, comment = comment;
        var confirmDelete = $mdDialog.confirm({
            title: 'Confirmación',
            content: '¿Está seguro que desea eliminar?',
            ok: 'Aceptar',
            cancel: 'Cancelar'
        });
        $mdDialog.show( confirmDelete ).then(function() {
            //OK
            ng.closeDeleteHistory($index, id);
        }).finally(function() {
            //Close alert
            confirmDelete = undefined;
        });
    };
    //Cerrar
    ng.closeDeleteHistory = function($index, id) {
        ng.saveProgress = true;
        var index = $index;
        $http.delete(URL + URLSOCIALTV, {params: {lid: id}}).
          success(function(data) {
              var data = data;
              if(data.status){
                ng.saveProgress = false;
                ng.histories.splice(index, 1);
                $mdDialog.cancel();
                $msj.show(data.response.op, positionMSj);
              }else{
                console.log('status not true')
              }
          }).error(function(data) {
            ng.saveProgress = false;
            $timeout(function(){
              $preload.hide();
            },TIMERESULT);
          });
    };

    //NEXT PAGE
    ng.historiesBusy = false;
    ng.msjBusy = false;

    ng.historiesNextPage = function(){
      //if(ng.histories.length > 0){
        if (ng.historiesBusy) return;
        ng.historiesBusy = true;
        ng.msjBusy = false;

        var request = null;
        if(ng.parameterSearch.autor==""&&ng.parameterSearch.desde==""&&ng.parameterSearch.hasta==""&&ng.parameterSearch.texto==""){
          request = $http.get(URL + URLSOCIALTV + '?cursor=' + ng.historiesAfter);
        }else{
          request = $http.post(URL + URLSOCIALTVSEARCH + '?cursor=' +ng.historiesAfter, ng.parameterSearch);
        }
        request.success(function(data){
            var data = data;
            $timeout(function(){
              if(data.status){
                var items = data.response;
                if(items.length > 0){
                  for (var i = 0; i < items.length; i++) {
                    if(items[i].status){
                      items[i].sitio_url = (angular.isDefined(items[i].sitio_url))?items[i].sitio_url:URL;
                      items[i].url = items[i].sitio_url + URLSOCIALTVXML + items[i].programaslug +".xml";
                      items[i].preview = items[i].sitio_url + URLSOCIALTV + '/' + items[i].programaslug;
                      items[i].isChecked = false;
                      ng.histories.push(items[i]);
                    }
                  }
                  ng.historiesAfter = (ng.histories[ng.histories.length-1]).date_create;
                  ng.historiesBusy = false;
                  msjBusy = false;
                }else{
                  ng.historiesBusy = false;
                  ng.msjBusy = true;
                }
              }else{
                noValidForm();
                ng.msjBusy = false;
              }
            },TIMERESULT);
        }).error(function(data) {
            $timeout(function(){
                noValidForm();
                ng.msjBusy = false;
            },TIMERESULT);
        });
    //  }
    };

    //Autocomplete
    ng.selectedFilterText  = null;
    ng.filterText    = "";
    ng.getItemsSearch   = function($event, query){
      return $http.get(URL + URLTAGSEARCH + query)
      .then(function(result){
        return $.map(result.data.response, function (n, i) { return n.nombre; });
      })
    };

    ng.searchingHistories = false;
    var getHistoriesSearch = function($event){
      ng.saveProgress = true;
      ng.historiesAfter = "";
      ng.histories = [];

      if (ng.searchingHistories) return;
      ng.searchingHistories = true;

      $http.post(URL + URLSOCIALTVSEARCH, ng.parameterSearch).
        success(function(data, status, headers, config) {
          var data = data;
          if(data.status){
            var items = data.response;
            if(items.length > 0){
              for (var i = 0; i < items.length; i++) {
                if(items[i].status){
                  items[i].sitio_url = (angular.isDefined(items[i].sitio_url))?items[i].sitio_url:URL;
                  items[i].url = items[i].sitio_url + URLSOCIALTVXML + items[i].programaslug +".xml";
                  items[i].preview = items[i].sitio_url + URLSOCIALTV + '/' + items[i].programaslug;
                  items[i].isChecked = false;
                  ng.histories.push(items[i]);
                }
              }
              ng.historiesAfter = (items[items.length-1]).date_create;
            }else{
              $msj.show(CMSDATA.MSJ.MSJ18, positionMSj);
            }
            ng.searchingHistories = false;
            ng.saveProgress = false;
          }else{
              $msj.show(CMSDATA.MSJ.MSJ54, positionMSj);
              ng.searchingHistories = false;
              ng.saveProgress = false;
          }
        }).error(function(data, status, headers, config) {
            $msj.show(CMSDATA.MSJ.MSJ54, positionMSj);
            ng.searchingHistories = false;
            ng.saveProgress = false;
        });
    };

    ng.selectedItemChange = function(item){
      ng.parameterSearch.texto = typeof(item)!='undefined'?item:"";
      if(ng.parameterSearch.autor==""&&ng.parameterSearch.desde==""&&ng.parameterSearch.hasta==""&&ng.parameterSearch.texto==""){
        get_histories();
      }else{
        getHistoriesSearch();
      }
    };

    ng.searchFilterHistory = function(){
      var x = ng.filterFrom;
      if(x) x.setHours(0,0,0,0);
      var y = ng.filterTo;
      if(y) y.setHours(23,59,59,0);

      ng.parameterSearch.autor = ng.ownHistories?ng.user.id:"";
      ng.parameterSearch.desde = ng.filterFrom?x:"";
      ng.parameterSearch.hasta = ng.filterTo?y:"";
      ng.parameterSearch.texto = ng.filterText;
      getHistoriesSearch();
      $frm = angular.element('#contentSearch');
      ng.formOptionSearch = false;
      $frm.removeClass('focus');
      ng.layerSearch = false;
      ng.custom = true;
    };

    //FORM
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
        }else{
            ng.formOptionSearch = true;
            $frm.addClass('focus');
            ng.layerSearch = true;
        }
    };

    //FILTRO DE BUSQUEDA
    ng.parameterSearch = {
      autor: "",
      desde: "",
      hasta: "",
      texto: ""
    };

    ng.clickChipLegend = function(parameter){
      if(parameter=='rango'){
        ng.parameterSearch.desde = "";
        ng.parameterSearch.hasta = "";
      }else{
        ng.parameterSearch[parameter] = "";
      }
      if(ng.parameterSearch.autor==""&&ng.parameterSearch.desde==""&&ng.parameterSearch.hasta==""&&ng.parameterSearch.texto==""){
        get_histories();
      }else{
        getHistoriesSearch();
      }
    };

    $timeout(function(){
        var $elemIptSearch = angular.element('.filterText input[type="search"]');
        $elemIptSearch.unbind('keyup').bind('keyup',function(e){
            if(e.which === 13) {
              ng.$apply(function(){
                ng.parameterSearch.texto = ng.filterText;
                getHistoriesSearch();
                e.stopPropagation();
                e.preventDefault();
                //Cerrar buscador
                $frm = angular.element('#contentSearch');
                ng.formOptionSearch = false;
                $frm.removeClass('focus');
                ng.layerSearch = false;
                ng.custom = true;
              });
            }else{
              e.stopPropagation();
              e.preventDefault();
            }
        });
    }, TIMERESULT + TIMERESULT/4);


}]);

});
