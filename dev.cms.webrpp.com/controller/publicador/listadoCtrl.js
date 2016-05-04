 // Controller : List News

// 'use strict';

define(['app'], function (app) {

app.register.controller('listadoCtrl', [
    '$scope',
    '$location',
    '$rootScope',
    '$http',
    '$timeout',
    '$q',
    '$mdDialog',
    '$mdBottomSheet',
    '$mdSidenav',
    '$mdToast',
    '$animate',
    '$preload',
    '$msj',
    '$filter',
    '$window',
    '$login',
    '$localStorage',
    '$logout',
    '$cacheService',
    function(
        $scope,
        $location,
        $rootScope,
        $http,
        $timeout,
        $q,
        $mdDialog,
        $mdBottomSheet,
        $mdSidenav,
        $mdToast,
        $animate,
        $preload,
        $msj,
        $filter,
        $window,
        $login,
        $localStorage,
        $logout,
        $cacheService
    ){
    var ng = $scope;

    //GLOBALS
    var URL = CMSDATA.GLOBAL.URLBASE,
        URLVIEW = CMSDATA.GLOBAL.URLVIEW,
        URLLIST = 'listado.html',
        URLLOGIN = 'login.html',
        URLCREATENEW = 'createnew.html',
        URLSESSION = 'session',
        URLCLOSESESSION = 'session/logout',
        URLLISTNEWS = 'noticias',
        URLEDITNEWS = 'noticias/leer/',
        URLHIGHLIGHT = 'destacadas/',
        URLCOVERS = 'destacadas/list/',
        URLLISTSITE = 'sitio/list',
        URLACTIVIDADBORRADORES = 'noticias?estado=borradores',
        URLDELETE = 'noticias/eliminar/',
        URLLISTSITE = 'sitio/list',
        URLLISTAUTHOR = 'user',
        URLLISTCATEGORY = 'categoria/index/',
        URLSEARCHITEMS = 'noticias/?suggest=',
        DATA = {},
        TIMERESULT = 1000/2;
    //VARS TOOLS
    var positionMSj = 'top right';
    //SEARCH
    //ng.filterText = CMSDATA.FILTER.texto;
    ng.filterText = '';
    var fechaDesdeGlobal = (new Date()).adjustDate(-2190); //6Años
    ng.filterFrom = fechaDesdeGlobal; //-365 DAYs
    ng.filterTo = CMSDATA.FILTER.hasta;
    ng.urlAutocomplete = URL + URLSEARCHITEMS;
    //FLAG DISABLED SESSION
    ng.disabledCloseSession = false;

    //PARENT SCOPE
    var nghome = ng.$parent;
    nghome.preloader = false;
    console.log(nghome, 'nghome');

    //PROFILE PICTURE
    ng.user = { pictureUrl: false };
    //Highlight
    ng.urlAjaxHighlight = URL + URLCOVERS;
    ng.msjEmptyHighlight = 'No hay portadas asignadas.';

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
        //SEARCH
        //AUTHOR
        ng.filterAuthor = undefined;
        ng.filterAuthors = [];
        ng.loadAuthor = function() {
            //AUTHOR
            $http.get(URL + URLLISTAUTHOR)
            .success(
                function (data) {
                    var data = data;
                    if(data.status){
                        //AUTHOR
                        ng.filterAuthors = data.response;
                        ng.filterAuthors.unshift({
                            foto: '',
                            nombre: 'Todos',
                            slug: ''
                        });
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ16,positionMSj);
                    }
                }).error(
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ16,positionMSj);
                }
            );
        };
        ng.loadAuthor();

        //LIST SITES
        ng.filterSite = undefined;
        ng.filterSites = [];
        ng.loadSite = function() {
            //Sites
            $cacheService.get(URL + URLLISTSITE)
            .then(
                function (data) {
                    var data = data;
                    if(data.status){
                        //SITE
                        ng.filterSites = data.response;
                        ng.filterSites.unshift({
                            nombre: 'Grupo RPP',
                            slug : 'grupo-rpp'
                        });
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
                    }
                },
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ17,positionMSj);
                }
            );
        };
        ng.loadSite();

        //STATE
        ng.filterState = undefined;
        ng.filterStates = $cacheService.getState();

        //TYPE CONTENT
        ng.filterTypeContent = undefined;
        ng.filterTypeContents = $cacheService.getTypeContent();
        ng.typeContents = angular.copy(ng.filterTypeContents);
        ng.filterTypeContents.unshift({icon:"", nombre:"Todos", slug:""});

        //SECTION
        //LIST SITES
        ng.filterSection = undefined;
        ng.filterSections = [];
        ng.loadSection = function(sitio) {
            var _sitio = (sitio)?sitio:'rpp';
            //Section
            $cacheService.get(URL + URLLISTCATEGORY + _sitio + '?type=search_box')
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
        ng.loadSection(undefined);
        ng.changeLoadSectionHeader = function(){
            var _sitio = (ng.filterSite)?ng.filterSite.slug:undefined;
            ng.loadSection(_sitio);
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
            //REFRESH rootScope DATASEARCH
            ng.refresRootDataSearch('self');

            //RESET LAYER SEARCH
            ng.resetLayerSearch();

            $event.preventDefault();
            //$body.css('overflow', 'visible');
        };
        ng.resetLayerSearch = function(){
            $frm = angular.element('#contentSearch');
            ng.formOptionSearch = false;
            $frm.removeClass('focus');
            ng.layerSearch = false;
            ng.custom = true;
        };

        //AUTOCOMPLETE SEARCH
        ng.getItemsSearch = function($event, searchText){
            return $http.get(URL + URLSEARCHITEMS + searchText).then(function(response){
                return response.data.response; // USUALLY response.data
            })
        };

        $timeout(function(){
            var $elemIptSearch = angular.element('.filterText input[type="search"]');
            $elemIptSearch.unbind('keyup').bind('keyup',function(e){
                if(e.which === 13) {
                    ng.$apply(function(){
                        ng.refresRootDataSearch('self');
                    });
                }
                e.stopPropagation();
                e.preventDefault();
            });
        }, TIMERESULT + TIMERESULT/4);

        //OBSERVER MODEL AUTOCOMPLETE SEARCH
        //ng.$watch('selectedFilterText', function(newValue, oldValue){
        //    console.log('SII', 'selectedFilterText');
        //    if(newValue != oldValue){
        //        ng.refresRootDataSearch('self');
        //    }
        //});

        //SEARCH QUERY
        ng.refresRootDataSearch = function(type){
            var type = type;
            if(type != 'self'){
                //DATA DE BUSQUEDA DE OTRA PAGINA (CREAR NOTICIA)
                var blankObjSearch = $rootScope.datasearchOutPage;
                ng.filterText = blankObjSearch.texto;
                ng.filterSite = blankObjSearch.sitio;
                ng.filterSection = blankObjSearch.categoria;
                ng.filterTypeContent = blankObjSearch.tipo;
                ng.filterFrom = blankObjSearch.desde;
                ng.filterTo = blankObjSearch.hasta;
                ng.filterState = blankObjSearch.estado;
                ng.filterAuthor = blankObjSearch.autor;
            }

            var texto = (ng.filterText)?ng.filterText:'',
            sitio = (ng.filterSite)?ng.filterSite:'',
            categoria = (ng.filterSection)?ng.filterSection:'',
            tipo = (ng.filterTypeContent)?ng.filterTypeContent:'',
            desde = (ng.filterFrom)?ng.filterFrom:'',
            hasta = (ng.filterTo)?ng.filterTo:'',
            estado = (ng.filterState)?ng.filterState:'',
            autor = (ng.filterAuthor)?ng.filterAuthor:'';
            $rootScope.datasearch = {
                texto: texto,
                sitio : sitio,
                categoria : categoria,
                tipo : tipo,
                desde : desde,
                hasta : hasta,
                estado : estado,
                autor : autor
            };

            //RESET LAYER SEARCH
            ng.resetLayerSearch();
        };
        //GLOBAL VARS SEARCH $rootScope
        //ng.search = function($event){
        //    var $event = $event;
        //    if($event.which === 13) {
        //        ng.refresRootDataSearch('self');
        //        $event.preventDefault();
        //    }
        //};
        ng.refresRootDataSearch('self'); //INIT SEARCH
        //SEARCH

        //CONFIG
        ng.showLoadListNew = true;
        ng.news = {};

        //NO VALID FORM
        var noValidForm = function(){
            $msj.show(CMSDATA.MSJ.MSJ2,positionMSj);
            ng.showLoadListNew = false;
        };

        //WATCH $rootScope DATA SEARCH
        ng.DATA = {
            texto: CMSDATA.FILTER.texto,
            sitio:'',
            categoria:'',
            tipo:'',
            desde:CMSDATA.FILTER.desde,
            hasta:CMSDATA.FILTER.hasta,
            estado:'',
            autor:''
        };
        var chipInitial = {
            texto :{
                nombre: CMSDATA.FILTER.texto, //SET TEXTO INITIAL
                slug: 'texto'
            },
            sitio: {
                nombre: CMSDATA.FILTER.sitio, //SET SITIO INITIAL
                slug: 'sitio'
            }
        };
        ng.chipLegend = [chipInitial.texto, chipInitial.sitio];
        var getChipLegend = function(DATA){
            var DATA = DATA;
            ng.chipLegend = [];
            if(DATA.texto.length > 0){
                ng.chipLegend.push({
                    nombre: DATA.texto,
                    slug: 'texto'
                });
            }
            if((typeof DATA.sitio) === 'object'){
                ng.chipLegend.push({
                    nombre: DATA.sitio.nombre,
                    slug: 'sitio'
                });
            }else{
               ng.chipLegend.push({
                    nombre: CMSDATA.FILTER.sitio,
                    slug: 'sitio'
                });
            }
            if((typeof DATA.categoria) === 'object'){
                ng.chipLegend.push({
                    nombre: DATA.categoria.nombre,
                    slug: 'categoria'
                });
            }
            if((typeof DATA.tipo) === 'object'){
                ng.chipLegend.push({
                    nombre: DATA.tipo.nombre,
                    slug: 'tipo'
                });
            }
            if((typeof DATA.desde === 'object' && (typeof DATA.hasta) === 'object')){
                ng.chipLegend.push({
                    nombre: $filter('date')(DATA.desde, 'dd/MM/yyyy') + ' - ' + $filter('date')(DATA.hasta, 'dd/MM/yyyy'),
                    slug: 'fecha'
                });
            }
            if((typeof DATA.estado) === 'object'){
                ng.chipLegend.push({
                    nombre: DATA.estado.nombre,
                    slug: 'estado'
                });
            }
            if((typeof DATA.autor) === 'object'){
                ng.chipLegend.push({
                    nombre: DATA.autor.nombre,
                    slug: 'autor'
                });
            }
        };
        var tiggerSearch = function(DATA){
            ng.DATA = DATA;
            ng.newsItems = [];
            ng.newsBusy = false;
            ng.newsAfter = '';
            var limitNews = 0;
            ng.newsNextPage('search');
        };
        //OBSERVER MODEL DATA SEARCH
        $rootScope.$watch('datasearch', function(newValue, oldValue){
            if(newValue != oldValue){
                if(!$rootScope.datasearchOutPage){
                    var DATA = $rootScope.datasearch;
                    //SEARCH LIST NEWS
                    tiggerSearch(DATA);
                    //GET CHIP LEGEND
                    getChipLegend(DATA);
                }
            }
        });

        ng.clickChipLegend = function(chip, $index){
            var chip = chip, $index = $index;
            ng.chipLegend.splice($index,1);
            switch(chip.slug){
                //chip.slug = 0 TEXTO
                case 'texto':
                    ($rootScope.datasearch)?$rootScope.datasearch.texto = CMSDATA.FILTER.texto:'';
                    ng.filterText = undefined;
                    nghome.filterText = CMSDATA.FILTER.texto;
                    break;
                //chip.slug = 1 SITIO
                case 'sitio':
                    ($rootScope.datasearch)?$rootScope.datasearch.sitio='':ng.DATA.sitio='';
                    ng.filterSite = undefined;
                    nghome.filterSite = undefined;
                    break;
                //chip.slug = 2 CATEGORIA
                case 'categoria':
                    $rootScope.datasearch.categoria = '';
                    ng.filterSection = undefined;
                    nghome.filterSection = undefined;
                    break;
                //chip.slug = 3 TIPO
                case 'tipo':
                    $rootScope.datasearch.tipo = '';
                    ng.filterTypeContent = undefined;
                    nghome.filterTypeContent = undefined;
                    break;
                //chip.slug = 4 DESDE && HASTA
                case 'fecha':
                    ($rootScope.datasearch)?$rootScope.datasearch.desde = fechaDesdeGlobal:'';
                    ($rootScope.datasearch)?$rootScope.datasearch.hasta = CMSDATA.FILTER.hasta:'';
                    //nghome.filterFrom = CMSDATA.FILTER.desde;
                    ng.filterFrom = fechaDesdeGlobal;
                    ng.filterTo = CMSDATA.FILTER.hasta;
                    nghome.filterFrom = fechaDesdeGlobal;
                    nghome.filterTo = CMSDATA.FILTER.hasta;
                    break;
                //chip.slug = 5 ESTADO
                case 'estado':
                    $rootScope.datasearch.estado = '';
                    ng.filterState = undefined;
                    nghome.filterState = undefined;
                    break;
                //chip.slug = 6 AUTOR
                case 'autor':
                    $rootScope.datasearch.autor = '';
                    ng.filterAuthor = undefined;
                    nghome.filterAuthor = undefined;
                    break;
            }
            var DATA = ($rootScope.datasearch)?$rootScope.datasearch:ng.DATA;
            //SEARCH DATA
            tiggerSearch(DATA);
            //VALID DATA BY DEFAULT
            if( ng.chipLegend.length <=0 ){
                ng.chipLegend.splice(0, 0, chipInitial.texto); //TEXTO
                ng.chipLegend.splice(1, 0, chipInitial.sitio); //SITIO
            }
        };
        //INFINITE SCROLL LIST NEWS
        ng.newsItems = [];
        ng.newsBusy = false;
        ng.newsAfter = '';
        ng.msjBusy = false;
        var limitNews = 0;
        ng.disabledSearch = false;
        ng.total_rows = undefined;
        ng.newsNextPage = function(type){
            if (ng.newsBusy) return;
            ng.newsBusy = true;
            ng.msjBusy = false;
            ng.disabledSearch = true;
            $http.post(URL + URLLISTNEWS + '?cursor=' + ng.newsAfter, ng.DATA).
            success(function(data) {
                var data = data;
                //$timeout(function(){
                    if(data.status){
                        var items = data.response;
                        if(type==="search"){ng.total_rows = data.total_rows;}
                        if(items.length > 0){
                            for (var i = 0; i < items.length; i++) {
                                ng.newsItems.push(items[i]);
                            }
                            //ng.newsAfter = (ng.newsItems[ng.newsItems.length-1]).nid;
                            ng.newsAfter = data.last_cursor;
                            ng.newsBusy = false;
                            ng.showLoadListNew = false;
                            msjBusy = false;
                            ng.disabledSearch = false;
                        }else{
                            $msj.show(CMSDATA.MSJ.MSJ18,positionMSj);
                            //ng.newsAfter = (ng.newsItems[ng.newsItems.length-1]).nid;
                            ng.newsBusy = false;
                            ng.msjBusy = true;
                            ng.disabledSearch = false;
                        }
                    }else{
                        noValidForm();
                        ng.msjBusy = false;
                        ng.disabledSearch = false;
                    }
                //},TIMERESULT);
            }).error(function(data) {
                //$timeout(function(){
                    noValidForm();
                    ng.msjBusy = false;
                    ng.disabledSearch = false;
                //},TIMERESULT);
            });
        };

        //INIT LIST FOR OTHER VIEW
        ng.loadRootSearch = function(){
            if($rootScope.datasearchOutPage){
                var DATA = $rootScope.datasearchOutPage;
                //SEARCH LIST NEWS
                tiggerSearch(DATA);
                //GET CHIP LEGEND
                getChipLegend(DATA);
                //Refresh DATA
                ng.refresRootDataSearch('blank');
                //ng.filterText = undefined;
                $rootScope.datasearchOutPage = undefined;
            }else{
                var DATA = $rootScope.datasearch;
                //SEARCH LIST NEWS
                tiggerSearch(DATA);
                //GET CHIP LEGEND
                getChipLegend(DATA);
            }
            //REMOVE ELEMENT FOR LOCK
            $timeout(function(){
                angular.element('#feedly-mini').remove();
                angular.element('body > .md-scroll-mask').remove();
            },TIMERESULT*4);

        };
        //INIT
        ng.loadRootSearch();

        //Agregar
        ng.openCreateNew = function($event, $type, nid) {
            var _nid = (nid)?nid:'', _type = $type;
            $preload.show();
            $rootScope.objInitNews = { response: undefined, type : _type };
            $location.path('/publicador/noticia/' + _nid);
            /*if(_nid){
                //Edit noticia
                $http.get(URL + URLEDITNEWS + _nid).
                success(function(data) {
                    var data = data;
                    if(data.status){
                        $rootScope.objInitNews = { response: angular.copy(data.response), type : 'editar' }; //Edit
                        $preload.hide();
                        $location.path('/publicador/noticia');
                        //nghome.viewInclude = URLVIEW + URLCREATENEW;
                    }else{
                        $msj.show(data.message,positionMSj);
                        $rootScope.objInitNews = { response: undefined, type : _type }; //Edit
                        $preload.hide();
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ7,positionMSj);
                    $rootScope.objInitNews = { response: undefined, type : _type }; //Edit
                    $timeout(function(){
                        $preload.hide();
                    },TIMERESULT);
                });
            }else{
                //Create nueva noticia
                //nghome.viewInclude = URLVIEW + URLCREATENEW;
                $preload.hide();
                $location.path('/publicador/noticia');
                $rootScope.objInitNews = { response: undefined, type : _type };
            }*/
        };

        //Eliminar
        ng.openDeleteNew = function($event, $title, nid, index) {
            var $event = $event, nid = nid, index = index;
            var confirmDelete = $mdDialog.confirm({
                title: 'Confirmación',
                content: '¿Está seguro que desea eliminar?',
                ok: 'Aceptar',
                cancel: 'Cancelar'
            });
            $mdDialog
            .show( confirmDelete ).then(function() {
                //OK
                $preload.show();
                deleteNewInList(nid, index);
            })
            .finally(function() {
                //Close alert
                confirmDelete = undefined;
            });
        };

        var deleteNewInList = function(nid, index){
            var _nid = nid, _index = index;
            if(_nid){
                //Edit noticia
                $http.delete(URL + URLDELETE + _nid).
                success(function(data) {
                    var data = data;
                    ng.newsItems.splice(_index, 1);
                    if(data.status){
                        //Delete item
                        $preload.hide();
                    }else{
                        $preload.hide();
                        $msj.show(data.message,positionMSj);
                    }
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ8,positionMSj);
                });
            }else{
                //Create nueva noticia
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ8,positionMSj);
            }
        };

        //FILTER CATEGORY SHOW
        ng.returnCategorys = function(categorys){
            var categorys = categorys;
            var _html = "<div class='triangle'></div>"+
                "<div class='ns-popover-tooltip'>"+
                "<div list-popover>"+
                    "<h4>Tambien en:</h4>"+
                        "<ul>";
            angular.forEach(categorys, function(v,i){
                if(!categorys[i].primary){
                    _html += "<li>"+ $filter('uppercase')(categorys[i].nombre) +"</li>";
                }
            });
            _html +="</ul>"+
                    "</div>"+
                "</div>";
            return _html;
        };



    };

}]);

});
