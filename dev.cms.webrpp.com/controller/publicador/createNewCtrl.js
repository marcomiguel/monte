// Controller : Create News

'use strict';

define(['app'], function (app) {

app.register.controller('createNewCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$anchorScroll',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$create',
    'Slug',
    '$msj',
    '$sce',
    '$scrollGo',
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$filter',
    '$isExtension',
    '$insertJavascript',
    '$window',
    '$loadimg',
    '$popup',
    '$bytesToSize',
  function (
    $scope,
     $rootScope,
     $http,
     $document,
     $location,
     $anchorScroll,
     $preload,
     $mdDialog,
     $mdToast,
     $timeout,
     $create,
     Slug,
     $msj,
     $sce,
     $scrollGo,
     $localStorage,
     $login,
     $logout,
     $routeParams,
     $cacheService,
     $route,
     $filter,
     $isExtension,
     $insertJavascript,
     $window,
     $loadimg,
     $popup,
     $bytesToSize
    ) {
    var ng = $scope;

    //GLOBALS
    var URL = CMSDATA.GLOBAL.URLBASE,
        URLVIEW = CMSDATA.GLOBAL.URLVIEW,
        URLLIST = 'listado.html',
        URLLOGIN = 'login.html',
        URLCREATENEW = 'createnew.html',
        URLSESSION = 'session',
        URLLISTNEWS = 'noticias',
        URLPREVIEW = 'noticias/vistaprevia',
        URLSAVE = 'noticias/guardar',
        URLPUBLISH = 'noticias/publicar',
        URLREVISIONS = 'noticias/revisiones/',
        URLHIGHLIGHT = 'destacadas/',
        URLCOVERS = 'destacadas/list/',
        URLLISTCATEGORY = 'categoria/index/',
        URLLISTCATEGORYMULTIPLE = 'categoria/noticia/',
        URLPREVIEWCOVERS = 'noticias/vistapreviadestacada',
        URLCOVEREDIT = 'destacadas/noticias?slug=',
        URLSEARCHITEMS = 'noticias/?suggest=',
        URLCLOSESESSION = 'session/logout',
        URLEDITNEWS = 'noticias/leer/',
        URLLISTAUTHOR = 'user',
        URLLISTSITE = 'sitio',
        URLLISTSITELIST = 'sitio/list',
        URLLISTTHUMBS = 'noticias/imagenportada/',
        URLOADIMG = 'noticias/cargarimagen',
        URLVALIDPUBLISH = 'noticias/validar',
        URLFUENTES = 'noticias/fuentes',
        URLDELETE = 'noticias/eliminar/',
        URLLISTEVENTS = 'eventos/seleccionar',
        URLOADIMGPHOTO = 'elementos/upload/photo',
        DATA = {},
        TIMERESULT = 1000/4,
        TIMEWAITBTNDONE = 2000;

    //FB
    $insertJavascript.fb('2.5');

    //VAR TOOLS
    var positionMSj = CMSDATA.POSITIONMSJ;
    //SEARCH
    //ng.filterText = CMSDATA.FILTER.texto;
    ng.filterText = '';
    var fechaDesdeGlobal = (new Date()).adjustDate(-2190); //6Años
    ng.filterFrom = fechaDesdeGlobal; //-365 DAYs
    ng.filterTo = CMSDATA.FILTER.hasta;
    //FLAG DISABLED SESSION
    ng.disabledCloseSession = false;

    //PARENT SCOPE
    var nghome = ng.$parent;
    nghome.preloader = false;

    //PROFILE PICTURE
    ng.user = { pictureUrl: false };

    //TinyMCE
    ng.tinymceOptions = CMSDATA.CONFIGEDITOR;

    //DIMENSION IMAGEN | VIDEO | AUDIO UPLOAD
    ng.widthMedia = CMSDATA.DIMENSION16x9.widthLarge;
    ng.heightMedia = CMSDATA.DIMENSION16x9.heightLarge;

    //Review Session
    $preload.show();
    $login.get(URL + URLSESSION).then(
      function(data) {
          var data = data;
          if(data.status){
              $localStorage.login =  data.response;
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

    //LIST SITES
    ng.filterSite = undefined;
    ng.filterSites = [];
    ng.sites = []; //Bar Tool
    ng.loadSiteHeader = function(existSite, type, callback) {
        var type = type;
        //Sites
        $cacheService.get(URL + ((type!='search')?URLLISTSITE:URLLISTSITELIST))
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
                        ng.objSitio = (existSite)?existSite:ng.sites[0];
                        if(nidxUrl==undefined) ng.objInstantArticle = true;

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
    ng.loadSiteHeader(undefined, 'search');

    //AUTHOR
    ng.objAuthor = undefined;
    ng.filterAuthor = undefined;
    ng.filterAuthors = [];
    ng.autores = [];
    ng.loadAuthorHeader = function(existAuthor, type) {
        //AUTHOR
        $http.get(URL + URLLISTAUTHOR)
        .success(
            function (data) {
                var data = data;
                if(data.status){
                    if(type === 'search'){
                        //AUTHOR SEARCH
                        ng.filterAuthors = data.response;
                        ng.filterAuthors.unshift({
                            foto: '',
                            nombre: 'Todos',
                            slug: ''
                        });
                    }else{
                        //AUTHOR PAGE
                        ng.autores = data.response;
                        if(existAuthor){
                            ng.objAuthor = existAuthor;
                        }else{
                            $timeout(function () {
                                ng.objAuthor = {
                                    nombre : $localStorage.login.name,
                                    slug : $localStorage.login.username,
                                    foto : $localStorage.login.avatar
                                };
                            }, 3000);
                        }
                    }
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ16,positionMSj);
                }
            }).error(
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ16,positionMSj);
            }
        );
    };
    ng.loadAuthorHeader(undefined, 'search');

    //Init Vars
    //ng.blk1 = CMSDATA.OBJNEW;
    ng.blk1 = angular.copy(CMSDATA.OBJNEW);
    ng.showEditAddBlock = false;
    ng.idEdit = '-1';

    //REVIEWs ADDBLOCK
    var reviewAddBlocks = function(){
        if(ng.blockAdd.length <= 0){
            ng.isMediaLoad = true;
        }else{
            for (var i = 0; i < ng.blockAdd.length; i++) {
                var _t = ng.blockAdd[i].tipo;
                if(_t === 'photo' || _t === 'video' || _t === 'audio' || _t === 'youtube'){
                    var iAfter = i;
                    if(iAfter>0){
                        // ++
                        var _tAfter = ng.blockAdd[iAfter-1].tipo;
                        if(_tAfter === 'text' || _tAfter === 'embed'){
                            ng.isMediaLoad = true;
                        }
                    }else{
                        //ONLY ONE
                        ng.isMediaLoad = false;
                    }
                    break;
                }else{
                    ng.isMediaLoad = true;
                }
            }
        }
    };

    //Load Events MAM
    ng.mamDisabled = false;
    ng.loadSetEvents = false;
    ng.noSetEvents = false;
    var loadEventsAjax = function(type){
        if(type === 'delete'){
            ng.mamDisabled = false;
            ng.objDataFactory = '';
        }else{
            var isMaM = false, __ind;
            for (var i = 0; i < ng.blockAdd.length; i++) {
                if(ng.blockAdd[i].tipo === 'mam'){
                    isMaM = true;
                    __ind = i;
                    ng.mamDisabled = true;
                    break;
                }
            }
            if(isMaM){
                if(type === 'drag'){
                    $timeout(function () {
                        angular.element('#idIconMaM' + ng.blockAdd[__ind].mam.id).parent().addClass('activomam');
                    }, 10);
                }else{
                    ng.loadSetEvents = true;
                    ng.noSetEvents = false;
                    $http.get(URL + URLLISTEVENTS  + '?nid=' + ng.nid).
                    success(function(data) {
                        var data = data;
                        if(data.status){
                            ng.blockAdd[__ind].mam.mamIncidents = (data.response)?data.response:[];
                            ng.loadSetEvents = false;
                            if(ng.blockAdd[__ind].mam.mamIncidents.length<=0){
                                ng.noSetEvents = true;
                            }else{
                                ng.noSetEvents = false;
                            }
                            if(type === 'edit'){
                                $timeout(function () {
                                    var __elm = angular.element('#idIconMaM' + ng.blockAdd[__ind].mam.id);
                                    if(__elm.size()>0){
                                        __elm.parent().addClass('activomam');
                                    }else{
                                        var _IndM = angular.copy(ng.blockAdd[__ind].mam);
                                        ng.blockAdd[__ind].mam.mamIncidents.unshift(_IndM);
                                        $timeout(function () {
                                            var __elm = angular.element('#idIconMaM' + ng.blockAdd[__ind].mam.id);
                                            __elm.parent().addClass('activomam');
                                            ng.objDataFactory = ng.blockAdd[__ind].mam.datafactory;
                                        }, 10);
                                    }
                                }, 10);
                            }
                        }else{

                        }
                    }).error(function(data) {

                    });
                }
            }
        }
    };
    //OPEN Minuto a Minuto
    ng.clickEventMaM = function(evt, mam, index, colimIndex){
        var elm = angular.element(evt.target);
        elm.parent().find('li').removeClass('activomam');
        elm.addClass('activomam');
        ng.blockAdd[colimIndex].mam.datafactory = (mam.datafactory)?mam.datafactory:'';
        ng.blockAdd[colimIndex].mam.id = (mam.id)?mam.id:'';
        ng.blockAdd[colimIndex].mam.titulo = (mam.titulo)?mam.titulo:'';
        ng.blockAdd[colimIndex].mam.fechaInicio = (mam.fechaInicio)?mam.fechaInicio:'';
        ng.objDataFactory = mam.datafactory;
        evt.preventDefault();
    };
    //INIT FNC
    //FLAGS
    ng.flags = {
        addPhoto : true,
        addVideo : true,
        addAudio : true,
        addYoutube : true,
        categoryMultiple : true,
        addText : true,
        addCite : true,
        addRelated : true,
        addEmbed : true,
        thumbs : true
    };
    var switchFlags = function(boolean){
        ng.flags.addPhoto = boolean;
        ng.flags.addVideo = boolean;
        ng.flags.addAudio = boolean;
        ng.flags.addYoutube = boolean;
        ng.flags.categoryMultiple = boolean;
        ng.flags.addText = boolean;
        ng.flags.addCite = boolean;
        ng.flags.addRelated = boolean;
        ng.flags.addEmbed = boolean;
        ng.flags.thumbs = boolean;
    };
    //ng.objDisabledArticle = false;
    var reviewTitles = function(){
        if(ng.objSitio != 'rpp'){ ng.objTitulares = true; }
        else{
            if(ng.objCategoryMultiple){
                console.log(ng.objCategoryMultiple.seccion, 'ng.objCategoryMultiple.seccion');
                switch (ng.objCategoryMultiple.seccion) {
                    case 'Virales':
                        ng.objTitulares = false;
                        break;
                    case 'Perú':
                        ng.objTitulares = false;
                        break;
                    default:
                        ng.objTitulares = true;
                }
            }
        }
    };
    var disabledIA = function(){
        if(ng.objTipo === 'galeria' ||
        ng.objTipo === 'mam' ||
        ng.objTipo === 'url' ||
        ng.objTipo === 'infografia' ||
        ng.objTipo === 'brandcontent'){
            ng.objInstantArticle = false;
        }else{
            // if(ng.objSitio === 'la10'){ng.objInstantArticle = true;}
            // else if(ng.objSitio === 'rpp'){ checkCategoryIA(); }
            if(ng.objSitio === 'la10' || ng.objSitio === 'rpp' ){ng.objInstantArticle = true;}
            else{ ng.objInstantArticle = false; }
        }
        reviewTitles();
    };
    var checkCategoryIA = function(){
        if(ng.objSitio === 'rpp' && ng.objCategoryMultiple){
            switch (ng.objCategoryMultiple.seccion) {
                case 'Tecnología':
                    ng.objInstantArticle = true;
                    ng.objTitulares = true;
                    break;
                case 'Virales':
                    ng.objInstantArticle = true;
                    ng.objTitulares = false;
                    break;
                case 'Vida y Estilo':
                    ng.objInstantArticle = true;
                    ng.objTitulares = true;
                    break;
                case 'Perú':
                    ng.objInstantArticle = false;
                    ng.objTitulares = false;
                    break;
                default:
                    ng.objInstantArticle = false;
                    ng.objTitulares = true;
            }
        }
    };
    ng.initList = function(data){
        //SEARCH
        //STATE
        ng.filterState = undefined;
        ng.filterStates = $cacheService.getState();

        //TYPE CONTENT
        ng.filterTypeContent = undefined;
        ng.filterTypeContents = $cacheService.getTypeContent();
        ng.typeContents = angular.copy(ng.filterTypeContents);
        ng.filterTypeContents.unshift({icon:"", nombre:"Todos", slug:""});

        //FILTER
        ng.objF = {
            filtroColeccion : ''
        };

        //SECTION
        //LIST SITES
        ng.filterSection = undefined;
        ng.filterSections = [];
        ng.loadSectionHeader = function(sitio) {
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
        ng.loadSectionHeader(undefined);
        ng.changeLoadSectionHeader = function(){
            var _sitio = (ng.filterSite)?ng.filterSite.slug:undefined;
            ng.loadSectionHeader(_sitio);
        };

        ng.noEsUrl = true;
        ng.cambioTipoPublicador = function($event){
            if(ng.objTipo === 'url'){
                ng.noEsUrl = false;
            }else{
                ng.noEsUrl = true;
            }
            disabledIA();
        };

        //FORM
        ng.formOptionSearch = false;
        ng.layerSearch = false;
        //var $body = angular.element('body');
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
            ng.refresRootDataSearch();

            //RESET LAYER SEARCH
            ng.resetLayerSearch();
            $rootScope.datasearchOutPage = $rootScope.datasearch;
            $location.path('/publicador');
            $event.preventDefault();
            //$body.css('overflow', 'visible');
        };
        ng.resetLayerSearch = function(){
            var $frm = angular.element('#contentSearch');
            ng.formOptionSearch = false;
            $frm.removeClass('focus');
            ng.layerSearch = false;
            ng.custom = true;
        };

        //AUTOCOMPLETE SEARCH
        ng.getItemsSearch = function($event, searchText){
            return $http.get(URL + URLSEARCHITEMS + searchText).then(function(response){
                return response.data.response; // USUALLY response.data
            });
        };

        $timeout(function(){
            var $elemIptSearch = angular.element('.filterText input[type="search"]');
            $elemIptSearch.unbind('keyup').bind('keyup',function(e){
                if(e.which === 13) {
                    ng.$apply(function(){
                        ng.refresRootDataSearch();

                        $rootScope.datasearchOutPage = $rootScope.datasearch;

                        $location.path('/publicador');
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }else{
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        }, TIMERESULT + TIMERESULT/4);

        //SEARCH QUERY
        ng.refresRootDataSearch = function(){
            var texto = (ng.filterText)?ng.filterText:'',
            sitio = (ng.filterSite)?ng.filterSite:'',
            categoria = (ng.filterSection)?ng.filterSection:'',
            tipo = (ng.filterTypeContent)?ng.filterTypeContent:'',
            desde = (ng.filterFrom)?ng.filterFrom:fechaDesdeGlobal,
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
        ng.search = function($event){
            var $event = $event;
            if($event.which === 13) {
                ng.refresRootDataSearch();
                $event.preventDefault();
            }
        };
        //ng.refresRootDataSearch(); //INIT SEARCH
        //END SEARCH

        ng.trustResource = function(resourceUrl) {
            return $sce.trustAsResourceUrl(resourceUrl);
        };

        //ADD MULTIMEDIA ADDBLOCK
        ng.isMediaLoad = true;
        //REVIEWs ADDBLOCK
        reviewAddBlocks();
        ng.addMedia = function(index, obj, indexNew){
            var obj = obj, index = index, indexNew = indexNew;
            var addImgMini = function(obj){
                switch (obj.tipo) {
                    case 'photo':
                        var imgData = obj.foto;
                        ng.addNewPhotoThumb(imgData, true);
                        break;
                    case 'youtube':
                        var imgData = angular.copy(obj.youtube);
                        imgData.url = imgData.url_cover;
                        ng.addNewPhotoThumb(imgData, true);
                        break;
                    case 'video':
                        var imgData = CMSDATA.OBJNEW.foto;
                        imgData.url = obj.video.url_cover;
                        if((imgData.url).length>0){
                            ng.addNewPhotoThumb(imgData, true);
                        }
                        break;
                    case 'audio':
                        var imgData = angular.copy(obj.audio);
                        imgData.url = imgData.url_cover;
                        ng.addNewPhotoThumb(imgData, true);
                        break;
                    case 'embed':
                        var __isEmbed = obj.embed;
                        if(__isEmbed){
                            if(__isEmbed.indexOf('fb-root')){
                                if (typeof (FB) != 'undefined') {
                                    $timeout(function () {
                                        FB.XFBML.parse(document.getElementById('block-ui-add'));
                                    }, 0);
                                }
                            }else if(__isEmbed.indexOf('twitter')){
                                if (typeof (twttr) != 'undefined') {
                                    twttr.widgets.load();
                                }
                            }
                        }
                };
                //REVIEWS BLOCK NO NEDIA
                reviewAddBlocks();
            };

            if(angular.isNumber(indexNew)){
                //ADD INBLOCK
                var $index =  (indexNew<0)?0:undefined; // + 1 FORWARD
                ng.blockAdd.splice($index,0,obj);
                addImgMini(obj);
            }else{
                //ADD NORMAL
                ng.blockAdd.splice(index,0,obj);
                addImgMini(obj);
            }
        };
        //Eliminar
        ng.deleteBlock = function($event, $index, block){
            var $event = $event, $index = $index, block = block;
            var confirmDelete = $mdDialog.confirm({
                title: 'Confirmación',
                content: '¿Está seguro que desea eliminar?',
                ok: 'Aceptar',
                cancel: 'Cancelar'
            });
            $mdDialog
            .show( confirmDelete ).then(function() {
                //OK
                ng.closeDeleteBlock($index);
                reviewAddBlocks();
                loadEventsAjax('delete');
            })
            .finally(function() {
                //Close alert
                confirmDelete = undefined;
            });
        };
        //Cerrar
        ng.closeDeleteBlock = function($index) {
            var index = $index;
            ng.blockAdd.splice(index, 1);
            //REVIEWS BLOCK NO NEDIA
            reviewAddBlocks();
            $mdDialog.cancel();
        };
        //INSERT TEXT
        //ng.showOpenText = false;
        ng.showOpenTextNew = {};
        ng.clickAddText = function($event, $index){
            var $index = $index;
            if(angular.isNumber($index)){
                //ADD FOR BLOCK
                if(!ng.showOpenTextNew[$index]){
                    ng.showOpenTextNew[$index] = true;
                }else{
                    ng.showOpenTextNew[$index] = false;
                }
            }else{
                //ADD NORMAL
                if(!ng.showOpenText){
                    ng.showOpenText = true;
                }else{
                    ng.showOpenText = false;
                }
            }
        };
        ng.ADDTEXTTRANSFER = undefined;
        ng.textoNew = {};
        ng.flags.addText = false;
        ng.openAddText = function($event, type ,$index, block, $indexNew){
            switchFlags(true);
            var type = type, index = $index, block = block, $indexNew = $indexNew;
            if(type==='add'){
                if(angular.isNumber($indexNew)){
                    //ADD NORMAL
                    //ADD
                    var objTextAdd = angular.copy(CMSDATA.OBJNEW);
                    objTextAdd.texto = ng.textoNew[$indexNew];
                    objTextAdd.tipo = 'text';
                    var index = $indexNew + 1; // + 1 FORWARD
                    ng.addMedia(index, objTextAdd);
                    ng.textoNew[$indexNew] = '';
                    ng.showOpenTextNew[$indexNew] = false;
                }else{
                    //ADD NORMAL
                    //ADD
                    var objTextAdd = angular.copy(CMSDATA.OBJNEW);
                    objTextAdd.texto = ng.texto;
                    objTextAdd.tipo = 'text';
                    var index = ng.blockAdd.length;
                    ng.addMedia(index, objTextAdd);
                    ng.texto = '';
                }
                switchFlags(false);
            }else{
                //EDIT
                $mdDialog.show({
                    targetEvent : $event,
                    templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddtext.html',
                    controller : modalOpenAddTextCtrl,
                    locals: {
                        modal : {
                            type: type,
                            index: index,
                            block: block
                        }
                    }
                })
                .then(function() {
                    if(ng.ADDTEXTTRANSFER){
                        //DATA
                        ng.blockAdd[ng.ADDTEXTTRANSFER.index].texto = ng.ADDTEXTTRANSFER.texto;
                    }
                    switchFlags(false);
                }, function() {
                    $mdDialog.cancel();
                    switchFlags(false);
                });
            }
        };
        function modalOpenAddTextCtrl(scope, $mdDialog, $create, modal, $timeout) {
            //TinyMCE
            scope.tinymceOptions = CMSDATA.CONFIGEDITOR;
            //TYPE
            scope.modalType = modal.type;
            //BUSCAR NOTICIAs
            modal.block.relacionado.alineacion = (modal.block.relacionado.alineacion === null)?'':modal.block.relacionado.alineacion;

            //Review
            if(modal.type === 'edit'){
                scope.texto_edit = modal.block.texto;
            }else{
                //CLEAR ADD
                scope.texto_edit = '';
            }

            //sitio
            scope.copyLinkSitio = ng.objSitio;

            //CLOSE
            scope.closeOpenAddText = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddText = function(){
                //GET
                ng.ADDTEXTTRANSFER = {
                    texto : scope.texto_edit,
                    tipo : 'text',
                    index : modal.index,
                    type : modal.type
                };
                $mdDialog.hide();
            };
        };
        //OPEN CITE
        ng.ADDCITETRANSFER = undefined;
        ng.flags.addCite = false;
        ng.openAddCite = function($event, type ,$index, block){
            switchFlags(true);
            var type = type, index = $index, block = block;
            //ADD
            $mdDialog.show({
                targetEvent : $event,
                templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddcite.html',
                controller : modalOpenAddCiteCtrl,
                locals: {
                    modal : {
                        type: type,
                        index: index,
                        block: block
                    }
                }
            })
            .then(function() {
                if(ng.ADDCITETRANSFER){
                    //DATA
                    var objCiteAdd = angular.copy(CMSDATA.OBJNEW.cita);
                    objCiteAdd.alineacion = ng.ADDCITETRANSFER.cita.alineacion;
                    objCiteAdd.titulo = ng.ADDCITETRANSFER.cita.titulo;
                    objCiteAdd.desarrollo = ng.ADDCITETRANSFER.cita.desarrollo;
                    //ADD CITE
                    //if(ng.ADDCITETRANSFER.cita.type === 'add'){
                        ng.blockAdd[ng.ADDCITETRANSFER.cita.index].cita = angular.copy(objCiteAdd);
                        //var index = ng.blockAdd.length;
                        //ng.addMedia(index, objCiteAdd);
                    //}else{
                        //ng.blockAdd[ng.ADDCITETRANSFER.index] = angular.copy(objCiteAdd);
                    //}
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddCiteCtrl(scope, $mdDialog, $create, modal, $timeout) {
            modal.block.cita.alineacion = (modal.block.cita.alineacion === null)?'':modal.block.cita.alineacion;
            modal.block.cita.titulo = (modal.block.cita.titulo === null)?'':modal.block.cita.titulo;
            modal.block.cita.desarrollo = (modal.block.cita.desarrollo === null)?'':modal.block.cita.desarrollo;

            //TinyMCE
            scope.tinymceOptions = CMSDATA.CONFIGEDITOR;
            //TYPE
            scope.modalType = modal.type;
                //CLEAR ADD
                scope.cita = {
                    alineacion : ((modal.block.cita.alineacion).length === 0)?CMSDATA.OBJNEW.cita.alineacion:modal.block.cita.alineacion,
                    titulo : modal.block.cita.titulo,
                    desarrollo : modal.block.cita.desarrollo
                };
            //}

            //TEXT UPDATE OR EDIT
            (scope.cita.alineacion != CMSDATA.OBJNEW.cita.alineacion ||
            scope.cita.titulo.length>0 ||
            ($filter('htmlToPlaintext')(scope.cita.desarrollo)).length>0)
            ?scope.modalType = 'edit':scope.modalType = 'add';
            //CLOSE
            scope.closeOpenAddCite = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddCite = function(){
                //GET
                ng.ADDCITETRANSFER = {
                    cita : {
                        alineacion : scope.cita.alineacion,
                        titulo : scope.cita.titulo,
                        desarrollo : scope.cita.desarrollo,
                        index : modal.index,
                        type : modal.type
                    }
                };
                $mdDialog.hide();
            };
            scope.removeOpenAddCite = function(){
                //REMOVE
                ng.ADDCITETRANSFER = {
                    cita : {
                        alineacion : CMSDATA.OBJNEW.cita.alineacion,
                        titulo : CMSDATA.OBJNEW.cita.titulo,
                        desarrollo : CMSDATA.OBJNEW.cita.desarrollo,
                        index : modal.index,
                        type : modal.type
                    }
                };
                $mdDialog.hide();
            };
        };
        //OPEN RELATED
        ng.ADDRELATEDTRANSFER = undefined;
        ng.flags.addRelated = false;
        ng.openAddRelated = function($event, type ,$index, block){
            switchFlags(true);
            var type = type, index = $index, block = block;
            //ADD
            $mdDialog.show({
                targetEvent : $event,
                templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddrelated.html',
                controller : modalOpenAddRelatedCtrl,
                locals: {
                    modal : {
                        type: type,
                        index: index,
                        block: block
                    }
                }
            })
            .then(function() {
                if(ng.ADDRELATEDTRANSFER){
                    //DATA
                    var objRelatedAdd = angular.copy(CMSDATA.OBJNEW.relacionado);
                    objRelatedAdd.alineacion = ng.ADDRELATEDTRANSFER.relacionado.alineacion;
                    objRelatedAdd.items = ng.ADDRELATEDTRANSFER.relacionado.items;
                    //ADD CITE
                    ng.blockAdd[ng.ADDRELATEDTRANSFER.relacionado.index].relacionado = angular.copy(objRelatedAdd);
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddRelatedCtrl(scope, $mdDialog, $create, modal, $timeout, $msj) {
            modal.block.relacionado.alineacion = (modal.block.relacionado.alineacion === null)?'':modal.block.relacionado.alineacion;
            //RELATED
            scope.searchRel = undefined;
            scope.readonlySearchCT = false;
            scope.listArrSocialNoResultCT = false;
            scope.searchLoadCT = false;
            scope.listArrRelated = [];
            scope.listArrSocialCT = [];
            var resetRelated = function(){
                scope.listArrRelated = [];
                scope.readonlySearchCT = false;
                scope.searchRel = undefined;
                scope.listArrSocialCT = [];
            };
            var loadRelatedEdit = function(obj){
                var obj = obj;
                scope.listArrRelated = obj;
            };
            scope.keySearchRelated = function($event){
                //ENTER
                if($event.which === 13) {
                    scope.searchRelated();
                }
            };
            scope.searchRelated = function(){
                var type = 'web';
                scope.listArrSocialCT = [];
                scope.readonlySearchCT = true;
                scope.searchLoadCT = true;
                $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + scope.searchRel + '/' + type + '?sitio=' + ng.objSitio).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            scope.listArrSocialCT = (response)?response:[];
                            scope.searchLoadCT = false;
                            scope.readonlySearchCT = false;
                            $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                            if(response.length<=0){
                                scope.listArrSocialNoResultCT = true;
                            }else{
                                scope.listArrSocialNoResultCT = false;
                            }
                        }else{
                            scope.readonlySearchCT = false;
                            scope.searchLoadCT = false;
                            scope.listArrSocialNoResultCT = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        scope.searchLoadCT = false;
                        scope.readonlySearchCT = false;
                        scope.listArrSocialNoResultCT = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    }
                }).error(function(data) {
                    scope.searchLoadCT = false;
                    scope.readonlySearchCT = false;
                    scope.listArrSocialNoResultCT = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                });
            };
            scope.clickCheckCT = function(index, obj){
                var index = index, obj = obj;
                scope.listArrRelated.push(obj);
                scope.listArrSocialCT.splice(index, 1);
            };
            scope.clickRemoveCT = function(index){
                var index = index;
                scope.listArrRelated.splice(index, 1);
            };
            modal.block.relacionado.alineacion = ((modal.block.relacionado.alineacion).length===0)?
            CMSDATA.OBJNEW.relacionado.alineacion:
            modal.block.relacionado.alineacion;
            //END RELATED
            //TYPE
            if(
                modal.block.relacionado.items.length>0 ||
                modal.block.relacionado.alineacion != CMSDATA.OBJNEW.relacionado.alineacion
            ){
                modal.type = 'edit';
                scope.modalType = 'edit';
            }else{
                modal.type = 'add';
                scope.modalType = 'add';
            }
            if(modal.type === 'edit'){
                scope.relacionado = {
                    alineacion :  modal.block.relacionado.alineacion,
                    items :  modal.block.relacionado.items
                };
                scope.listArrRelated = modal.block.relacionado.items;
            }else{
                //CLEAR ADD
                scope.relacionado = {
                    alineacion : CMSDATA.OBJNEW.relacionado.alineacion,
                    items : CMSDATA.OBJNEW.relacionado.items
                };
                scope.listArrRelated = [];
            }
            //CLOSE
            scope.closeOpenAddText = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddText = function(){
                //GET
                //scope.relacionado.items = scope.listArrRelated;
                ng.ADDRELATEDTRANSFER = {
                    relacionado : {
                        alineacion : scope.relacionado.alineacion,
                        //items : scope.relacionado.items,
                        items : scope.listArrRelated,
                        index : modal.index,
                        type : modal.type
                    }
                };
                $mdDialog.hide();
            };
            scope.removeOpenAddRelated = function(){
                //DELETE
                scope.relacionado.alineacion = CMSDATA.OBJNEW.relacionado.alineacion;
                scope.relacionado.items = CMSDATA.OBJNEW.relacionado.items;
                scope.listArrRelated = [];
                resetRelated();
                scope.addOpenAddText();
                $timeout(function(){
                    $mdDialog.hide();
                }, 0);
            };
        };
        //Doble Click
        ng.dClickFalse = function($event){ return false; };
        //OPEN PHOTO
        ng.ADDPHOTOTRANSFER = undefined;
        ng.flags.addPhoto = false;
        ng.openAddPhoto = function($event, type ,$index, block, $indexNew){
            switchFlags(true);
            var type = type, index = $index, block = block, $indexNew = $indexNew;
            var extension = $isExtension.get((block.hasOwnProperty('foto'))?block.foto.url:undefined);
            $mdDialog.show({
                targetEvent : $event,
                templateUrl :
                    (type!='cropear')?
                        (extension === 'gif')?
                        CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddphotogif.html':
                        CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddphoto.html'
                    :CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddphotoarchive.html',
                controller : modalOpenAddPhotoCtrl,
                locals: {
                    modal : {
                        type: type,
                        index: index,
                        block: block,
                        extension : extension,
                        indexNew : $indexNew
                    }
                }
            })
            .then(function() {
                if(ng.ADDPHOTOTRANSFER){
                    //DATA
                    var objPhotoAdd = angular.copy(CMSDATA.OBJNEW);
                    objPhotoAdd.credito = ng.ADDPHOTOTRANSFER.credito;
                    objPhotoAdd.subtitulo = ng.ADDPHOTOTRANSFER.subtitulo;
                    objPhotoAdd.via = ng.ADDPHOTOTRANSFER.via;
                    objPhotoAdd.tipo = ng.ADDPHOTOTRANSFER.tipo;
                    objPhotoAdd.foto = angular.copy(ng.ADDPHOTOTRANSFER.foto);
                    //ADD PHOTO
                    if(ng.ADDPHOTOTRANSFER.type === 'add' || ng.ADDPHOTOTRANSFER.type === 'cropear'){
                        var index = ng.blockAdd.length;
                        ng.addMedia(index, objPhotoAdd, ng.ADDPHOTOTRANSFER.indexNew);
                    }else{
                        ng.blockAdd[ng.ADDPHOTOTRANSFER.index] = angular.copy(objPhotoAdd);
                        var imgData = angular.copy(ng.blockAdd[ng.ADDPHOTOTRANSFER.index].foto);
                        ng.addNewPhotoThumb(imgData, true);
                    }
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddPhotoCtrl(scope, $mdDialog, $create, modal, $timeout) {
            //TYPE
            scope.modalType = modal.type;
            //INIt CONFIG
            var wImage =  CMSDATA.DIMENSION16x9.widthXLarge,
            hHeight = CMSDATA.DIMENSION16x9.heightXLarge,
            hHeightVertical = Math.round((wImage*16)/9);
            //1018.6 <> 1019
            var orientation = function(wImage, hHeight){
                var wImage = wImage, hHeight = hHeight;
                return (wImage > hHeight)?'horizontal':'vertical';
            };
            var resetOrientation = function(_orientacion){
                var _orientacion = _orientacion;
                if(_orientacion === 'horizontal'){
                    scope.widthImage = wImage;
                    scope.heightImage = hHeight;
                }else{
                    scope.widthImage = hHeight;
                    scope.heightImage = wImage;
                }
            };
            var resetImgUpload = function(wImage, hHeight){
                var wImage = wImage, hHeight = hHeight;
                resetOrientation(orientation(wImage, hHeight));
                scope.image = '';
                scope.reset = $create.guid();
            };

            //Keywords Photos
            scope.tagsOnAppendPhoto = function(chip) {
                return {
                    nombre: chip,
                    slug: 'SLUG'
                };
            };
            if(modal.type === 'edit'){
                //EDIT
                scope.credito = modal.block.credito;
                scope.foto = modal.block.foto;
                scope.foto.tags = (modal.block.foto.tags)?modal.block.foto.tags:CMSDATA.OBJNEW.foto.tags;
                scope.parrafo1 = modal.block.subtitulo;
                scope.via = modal.block.via;

                //EDIT ONLY GIF
                var extension = modal.extension;
                if(extension === 'gif'){
                    scope.showThumbData = true;
                    scope.isDeleteThumb = true;
                    scope.isLoadThumb = false;
                    scope.srcThumbData = modal.block.foto.url;
                }else{
                    //IMG UPLOAD NORMAL NOT GIF
                    $timeout(function(){
                        angular.element('#add-photo-modal input[name="thumb_values_edit"]').data('json', '-1');
                        var dataB64 = modal.block.foto.data.data;
                        if(dataB64 != null && dataB64.length != 0){
                            var img = new Image();
                            resetImgUpload(wImage, hHeight);
                            img.onload = function(){
                              var height = img.height;
                              var width = img.width;
                              var wImage = parseInt((width)?width:1, 10),
                              hHeight = parseInt((height)?height:0, 10);
                              resetOrientation(orientation(wImage, hHeight));
                              //scope.image = modal.block.foto.data.data;
                              scope.image = modal.block.foto.url;

                              scope.reset = $create.guid();
                              // code here to use the dimensions
                            }
                            img.src = modal.block.foto.url;
                        }else{
                            resetImgUpload(wImage, hHeight);
                        }
                    },250);
                }
                scope.removeCaptureImage = function(){
                    scope.srcThumbData = '';
                    scope.showThumbData = false;
                    scope.isDeleteThumb = false;
                    scope.isLoadThumb = true;
                    var _elm = angular.element('#loadThumbDataGif');
                    _elm.val('');
                    _elm.off('change');
                };
                scope.uploadCaptureImage = function(){
                    var elm = angular.element('#loadThumbDataGif');
                    elm.click();
                    angular.element('#loadThumbDataGif').on('change', function(evt){
                        var files = evt.currentTarget.files;
                        var formdata = new FormData();
                        angular.forEach(files, function(v,i){
                            formdata.append('file_' + i, files[i]);
                        });
                        var DATA = formdata;
                        $preload.show();
                        $http.post(CMSDATA.URLMULTIPLEPHOTOS, DATA, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined} /* multipart/form-data */
                        }).
                        success(function(data) {
                            var data = data;
                            if(data.status){
                                var foto = (data.response[0])?data.response[0].foto:'';
                                var url = foto.url;
                                scope.showThumbData = true;
                                scope.isDeleteThumb = true;
                                scope.isLoadThumb = false;
                                scope.srcThumbData = url;
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
            }else if(modal.type === 'cropear'){
                //RETURN BASE64
                resetImgUpload(wImage, hHeight);
                scope.foto = angular.copy(CMSDATA.OBJNEW.foto);
                scope.foto.alt = (modal.block.foto.descripcion)?modal.block.foto.descripcion:"";
                scope.credito = CMSDATA.OBJNEW.credito;
                scope.parrafo1 = (modal.block.foto.descripcion)?modal.block.foto.descripcion:CMSDATA.OBJNEW.parrafo1;
                scope.via = CMSDATA.OBJNEW.via;
                $preload.show();
                $http.get(modal.block.foto.urlb64).
                success(function(data){
                    //scope.image = modal.block.foto.url;
                    resetImgUpload(wImage, hHeight);
                    scope.image = data;
                    $preload.hide();
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                    $preload.hide();
                });
            }else{
                //CLEAR ADD
                resetImgUpload(wImage, hHeight);
                scope.credito = CMSDATA.OBJNEW.credito;
                scope.foto = angular.copy(CMSDATA.OBJNEW.foto);
                scope.parrafo1 = CMSDATA.OBJNEW.parrafo1;
                scope.via = CMSDATA.OBJNEW.via;
            }
            //CLOSE
            scope.closeOpenAddPhoto = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddPhoto = function(){
                if(scope.foto.alt.length>0 && scope.parrafo1.length>0){ //LEYENDA
                    //SI HAY LA LAYENDA
                    if(extension === 'gif'){
                        //IF PHOTO GIF
                        scope.foto.url = scope.srcThumbData;
                        //PHOTO NO EDIT
                        ng.ADDPHOTOTRANSFER = {
                            credito : scope.credito,
                            foto : {
                                alt: scope.foto.alt,
                                attr: {
                                    align: scope.foto.attr.align
                                },
                                data: {data:scope.foto.url,name:'', url: scope.foto.url},
                                descripcion: scope.foto.descripcion,
                                id: $create.guid(),
                                tags: scope.foto.tags,
                                url: scope.foto.url, //URL
                                hash : scope.foto.hash
                            },
                            subtitulo: scope.parrafo1,
                            via: scope.via,
                            tipo : 'photo',
                            index : modal.index,
                            type : modal.type,
                            indexNew : modal.indexNew
                        };
                        $mdDialog.hide();
                    }else{
                        //PHOTO NORMAL
                        //REVIEWS DATA IMG DONE
                        var btnDonePhoto = angular.element('#add-photo-modal .tools .md-cms-green');
                        //GET
                        var fncLoadEditImg = function(){
                            //TIME WAIT FOR BUTTON DONE
                            var elmThumbVal = angular.element('#add-photo-modal input[name="thumb_values_edit"]').data('json');
                            //UPLOAD PHOTO AJAX
                            var jsonData = elmThumbVal;
                            if(jsonData === '-1' || jsonData === ''){
                                //PHOTO NO EDIT
                                ng.ADDPHOTOTRANSFER = {
                                    credito : scope.credito,
                                    foto : {
                                        alt: scope.foto.alt,
                                        attr: {
                                            align: scope.foto.attr.align
                                        },
                                        data: {data:scope.foto.url,name:'', url: scope.foto.url},
                                        descripcion: scope.foto.descripcion,
                                        id: $create.guid(),
                                        tags: scope.foto.tags,
                                        url: scope.foto.url, //URL
                                        hash : scope.foto.hash
                                    },
                                    subtitulo: scope.parrafo1,
                                    via: scope.via,
                                    tipo : 'photo',
                                    index : modal.index,
                                    type : modal.type,
                                    indexNew : modal.indexNew
                                };
                                $mdDialog.hide();
                            }else{
                                //PHOTO EDIT
                                $preload.show();
                                var DATA = (jsonData)?angular.fromJson(jsonData):null;
                                $http.post(URL + URLOADIMG, DATA).
                                success(function(data) {
                                    var data = data;
                                    if(data.status){
                                        var response = data.response;
                                        ng.ADDPHOTOTRANSFER = {
                                            credito : scope.credito,
                                            foto : {
                                                alt: scope.foto.alt,
                                                attr: {
                                                    align: scope.foto.attr.align
                                                },
                                                data: {data:response.url,name:'', url: response.url},
                                                descripcion: scope.foto.descripcion,
                                                id: $create.guid(),
                                                tags: scope.foto.tags,
                                                url: response.url, //URL LLEGA AL GUARDAR
                                                hash : response.hash
                                            },
                                            subtitulo: scope.parrafo1,
                                            via: scope.via,
                                            tipo : 'photo',
                                            index : modal.index,
                                            type : modal.type,
                                            indexNew : modal.indexNew
                                        };
                                        $mdDialog.hide();
                                        $preload.hide();
                                        //FLOW NORMAL
                                        //END FLOW NORMAL
                                    }else{
                                        $msj.show(CMSDATA.MSJ.MSJ35,'top right');
                                        $preload.hide();
                                    }
                                }).error(function(data) {
                                    $msj.show(CMSDATA.MSJ.MSJ35,'top right');
                                    $preload.hide();
                                });
                            }
                        };
                        if(btnDonePhoto.size() === 1){
                            btnDonePhoto.click();
                            $preload.show();
                            $timeout(function () {
                                fncLoadEditImg();
                            }, TIMEWAITBTNDONE);
                        }else{
                            fncLoadEditImg();
                        }
                        //END UPLOAD PHOTO AJAX
                    }
                }else{
                    //REVISANDO TITULO Y LEYENDA
                    if(scope.foto.alt.length <= 0 && scope.parrafo1.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ55, CMSDATA.POSITIONMSJ);
                    }else if(scope.parrafo1.length <= 0 && scope.foto.alt.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ73, CMSDATA.POSITIONMSJ);
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ74, CMSDATA.POSITIONMSJ);
                    }
                }
            };
        };
        //OPEN VIDEO
        ng.ADDVIDEOTRANSFER = undefined;
        ng.flags.addVideo = false;
        ng.openAddVideo = function($event, type, $index, block, $indexNew){
            switchFlags(true);
            $mdDialog.cancel();
            var type = type, index = $index, block = block, $indexNew = $indexNew;
            $mdDialog.show({
                targetEvent : $event,
                templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddvideo.html',
                controller : modalOpenAddVideoCtrl,
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
                if(ng.ADDVIDEOTRANSFER){
                    //DATA
                    var objVideoAdd = angular.copy(CMSDATA.OBJNEW);
                    objVideoAdd.credito = angular.copy(ng.ADDVIDEOTRANSFER.credito);
                    objVideoAdd.subtitulo = angular.copy(ng.ADDVIDEOTRANSFER.subtitulo);
                    objVideoAdd.via = angular.copy(ng.ADDVIDEOTRANSFER.via);
                    objVideoAdd.tipo = angular.copy(ng.ADDVIDEOTRANSFER.tipo);
                    objVideoAdd.video = angular.copy(ng.ADDVIDEOTRANSFER.video);
                    //ADD VIDEO
                    if(ng.ADDVIDEOTRANSFER.type === 'add'){
                        var index = ng.blockAdd.length;
                        ng.addMedia(index, objVideoAdd, ng.ADDVIDEOTRANSFER.indexNew);
                    }else{
                        var ind = ng.ADDVIDEOTRANSFER.index;
                        ng.blockAdd[ind] = angular.copy(objVideoAdd);
                        var imgData = CMSDATA.OBJNEW.foto;
                        imgData.url = ng.blockAdd[ind].video.url_cover;
                        if((imgData.url).length>0){
                            ng.addNewPhotoThumb(imgData, true);
                        }
                        $timeout(function(){
                            //VIDEO LOAD REFRESH
                            document.getElementById('video_'+ind).load();
                        },0);
                    }
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddVideoCtrl(scope, $preload, $msj, $create, modal, $timeout) {
            //TYPE
            scope.modalType = modal.type;
            //VIDEO
            scope.widthVideo = ng.widthMedia;
            scope.heightVideo = ng.heightMedia;
            scope.resetVideo = false;
            scope.refreshVideo = false;
            scope.video = { descripcion: '', tags: [], url: '', url_cover: '', duracion: '', hash: '', flag: false};
            var objMsgModal = { descripcion: '', tags: [], url: '', url_cover: '', duracion: '', hash: '', flag: false};
            scope.$on('objvideo', function(e, msg) {
                objMsgModal = msg;
                //scope.video.url = msg.url_video;
                //scope.video.url_cover = msg.url_video_cover;
                //scope.video.duracion = msg.duracion;
                //scope.video.hash = msg.hash;
            });
            //Keywords Video
            scope.tagsOnAppendVideo = function(chip) {
                return {
                    nombre: chip,
                    slug: 'SLUG'
                };
            };
            if(modal.type === 'edit'){
                scope.credito = modal.block.credito;
                scope.video = modal.block.video;
                scope.video.tags = (modal.block.video.tags)?modal.block.video.tags:CMSDATA.OBJNEW.video.tags;
                scope.parrafo1 = modal.block.subtitulo;
                scope.via = modal.block.via;
                //VIDEO UPLOAD
                $timeout(function(){
                    //EDIT VIDEO
                    scope.refreshVideo = {
                        url: scope.video.url,
                        url_cover: scope.video.url_cover,
                        duracion: scope.video.duracion,
                        hash: scope.video.hash
                    };
                },250);
            }else{
                //CLEAR ADD
                scope.credito = CMSDATA.OBJNEW.credito;
                scope.video = angular.copy(CMSDATA.OBJNEW.video);
                scope.parrafo1 = CMSDATA.OBJNEW.parrafo1;
                scope.via = CMSDATA.OBJNEW.via;
            }
            //CLOSE
            scope.closeOpenAddVideo = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddVideo = function(){

                if(scope.video.descripcion.length>0 && scope.parrafo1.length>0){
                    var fncLoadModalVideo = function(){
                        if(objMsgModal.url_video){ scope.video.url = objMsgModal.url_video; }
                        if(objMsgModal.url_video_cover){ scope.video.url_cover = objMsgModal.url_video_cover; }
                        if(!scope.video.flag){
                            if(objMsgModal.duracion){ scope.video.duracion = objMsgModal.duracion; }
                            if(objMsgModal.hash){ scope.video.hash = objMsgModal.hash; }
                        }
                        ng.ADDVIDEOTRANSFER = {
                            credito : scope.credito,
                            video : {
                                descripcion: scope.video.descripcion,
                                tags: scope.video.tags,
                                url : scope.video.url,
                                url_cover : scope.video.url_cover,
                                duracion : scope.video.duracion,
                                hash : scope.video.hash
                            },
                            subtitulo: scope.parrafo1,
                            via: scope.via,
                            tipo : 'video',
                            index : modal.index,
                            type : modal.type,
                            indexNew : modal.indexNew
                        };
                    };
                    var checkImgCover = angular.element('#add-video-modal #output li');
                    var btnDoneVideo = angular.element('#add-video-modal #videoOptions .video_done');
                    var btnUploadCaptureEdit = angular.element('#btnUploadCaptureEdit');
                    var fncVideoPrev = function(){
                        $timeout(function() {
                            btnDoneVideo.triggerHandler('click');
                            scope.$on('objvideo', function(e, msg) {
                                if(objMsgModal.url_video){ scope.video.url = objMsgModal.url_video; }
                                if(objMsgModal.url_video_cover){ scope.video.url_cover = objMsgModal.url_video_cover; }
                                if(objMsgModal.duracion){ scope.video.duracion = objMsgModal.duracion; }
                                if(objMsgModal.hash){ scope.video.hash = objMsgModal.hash; }
                                $timeout(function() {
                                    angular.element('#add-video-modal #videoPlayer').get(0).addEventListener('loadeddata', function() {
                                        fncLoadModalVideo();
                                        $mdDialog.hide();
                                    }, false);
                                }, 250);
                            });
                        }, 0);
                    };
                    if(
                        (scope.video.url).length!=0 &&
                        (scope.video.url_cover).length!=0/* &&
                        (String(scope.video.duracion)).length!=0*/){
                        //EXIST VIDEO
                        //GET
                        if(!(btnDoneVideo.is(':disabled')) && checkImgCover.is(':visible')){
                            fncVideoPrev();
                        }else if(btnUploadCaptureEdit.is(':visible')){
                            //EDIT
                            fncLoadModalVideo();
                            $mdDialog.hide();
                        }else if(!(btnDoneVideo.is(':visible')) && !checkImgCover.is(':visible')){
                            fncLoadModalVideo();
                            $mdDialog.hide();
                        }else{
                            $msj.show(CMSDATA.MSJ.MSJ37,CMSDATA.POSITIONMSJ);
                        }
                    }else{
                        if(!(btnDoneVideo.is(':visible')) && !checkImgCover.is(':visible')){
                            fncLoadModalVideo();
                            $mdDialog.hide();
                        }else{
                            fncVideoPrev();
                        }
                    }
                }else{
                    //REVISANDO TITULO Y LEYENDA
                    if(scope.video.descripcion.length <= 0 && scope.parrafo1.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ55, CMSDATA.POSITIONMSJ);
                    }else if(scope.parrafo1.length <= 0 && scope.video.descripcion.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ73, CMSDATA.POSITIONMSJ);
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ74, CMSDATA.POSITIONMSJ);
                    }
                }
            };
        };
        //OPEN AUDIO
        ng.ADDAUDIOTRANSFER = undefined;
        ng.flags.addAudio = false;
        ng.openAddAudio = function($event, type, $index, block, $indexNew){
            switchFlags(true);
            $mdDialog.cancel();
            var type = type, index = $index, block = block, $indexNew = $indexNew;
            $mdDialog.show({
                targetEvent : $event,
                scope: $scope,
                preserveScope: true,
                templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddaudio.html',
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
                    var objAudioAdd = angular.copy(CMSDATA.OBJNEW);
                    objAudioAdd.credito = ng.ADDAUDIOTRANSFER.credito;
                    objAudioAdd.subtitulo = ng.ADDAUDIOTRANSFER.subtitulo;
                    objAudioAdd.via = ng.ADDAUDIOTRANSFER.via;
                    objAudioAdd.tipo = ng.ADDAUDIOTRANSFER.tipo;
                    objAudioAdd.audio = angular.copy(ng.ADDAUDIOTRANSFER.audio);
                    //ADD AUDIO
                    if(ng.ADDAUDIOTRANSFER.type === 'add'){
                        var index = ng.blockAdd.length;
                        ng.addMedia(index, objAudioAdd, ng.ADDAUDIOTRANSFER.indexNew);
                    }else{
                        var ind = ng.ADDAUDIOTRANSFER.index;
                        ng.blockAdd[ind] = angular.copy(objAudioAdd);
                        var imgData = angular.copy(ng.blockAdd[ind].audio);
                        imgData.url = imgData.url_cover;
                        ng.addNewPhotoThumb(imgData, true);
                    }
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddAudioCtrl(scope, $create, modal, $timeout) {
            //TYPE
            scope.modalType = modal.type;
            //REVIW DATA TRANSFER IMAGEN COVER
            scope.$on('objimagen', function(e, msg) {
                var msg = msg;
                var elm = angular.element('.tagzoneaudio .opt-send');
                if(msg){
                    elm.removeAttr('disabled');
                }else{
                    elm.attr('disabled','disabled');
                }
            });
            //AUDIO
            scope.widthAudio = ng.widthMedia;
            scope.heightAudio = ng.heightMedia;
            scope.refreshAudio = false;
            scope.audio = { descripcion: '', tags: [], url: '', url_cover: '', duracion: '', hash: '' };
            scope.$on('objaudio', function(e, msg) {
                scope.audio.url = msg.url;
                scope.audio.url_cover = msg.url_cover;
                scope.audio.duracion = msg.duracion;
                scope.audio.hash = msg.hash;
            });
            //OBJ AUDIO COVER
            scope.image = '';
            scope.widthImage = scope.widthAudio;
            scope.heightImage = scope.heightAudio;
            //Keywords Audio
            scope.tagsOnAppendAudio = function(chip) {
                return {
                    nombre: chip,
                    slug: 'SLUG'
                };
            };
            if(modal.type === 'edit'){
                scope.credito = modal.block.credito;
                scope.audio = modal.block.audio;
                scope.audio.tags = (modal.block.audio.tags)?modal.block.audio.tags:CMSDATA.OBJNEW.audio.tags;
                scope.parrafo1 = modal.block.subtitulo;
                scope.via = modal.block.via;
                //AUDIO UPLOAD
                $timeout(function(){
                    var elm = angular.element('.tagzoneaudio .opt-send');
                    elm.css('display', 'inline-block');
                    elm.removeAttr('disabled');
                    //EDIT AUDIO
                    scope.refreshAudio = {
                        url: scope.audio.url,
                        url_cover: scope.audio.url_cover,
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
                    elm.attr('disabled', 'disabled');
                },250);
                //CLEAR ADD
                scope.credito = CMSDATA.OBJNEW.credito;
                scope.audio = angular.copy(CMSDATA.OBJNEW.audio);
                scope.parrafo1 = CMSDATA.OBJNEW.parrafo1;
                scope.via = CMSDATA.OBJNEW.via;
            }
            //CLOSE
            scope.closeOpenAddAudio = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddAudio = function(){
                if(scope.audio.descripcion.length>0 && scope.parrafo1.length>0){
                    //GET
                    ng.ADDAUDIOTRANSFER = {
                        credito : scope.credito,
                        audio : {
                            descripcion: scope.audio.descripcion,
                            tags: scope.audio.tags,
                            url : scope.audio.url,
                            url_cover : scope.audio.url_cover,
                            duracion : scope.audio.duracion,
                            hash : scope.audio.hash
                        },
                        subtitulo: scope.parrafo1,
                        via: scope.via,
                        tipo : 'audio',
                        index : modal.index,
                        type : modal.type,
                        indexNew : modal.indexNew
                    };
                    $mdDialog.hide();
                }else{
                    //REVISANDO TITULO Y LEYENDA
                    if(scope.audio.descripcion.length <= 0 && scope.parrafo1.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ55, CMSDATA.POSITIONMSJ);
                    }else if(scope.parrafo1.length <= 0 && scope.audio.descripcion.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ73, CMSDATA.POSITIONMSJ);
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ74, CMSDATA.POSITIONMSJ);
                    }
                }
            };
        };
        //OPEN EMBED
        ng.ADDEMBEDTRANSFER = undefined;
        ng.flags.addEmbed = false;
        ng.openAddEmbed = function($event, type, $index, block, $indexNew){
            switchFlags(true);
            var type = type, index = $index, block = block, $indexNew = $indexNew;
            $mdDialog.show({
                targetEvent : $event,
                scope: $scope,
                preserveScope: true,
                templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddembed.html',
                controller : modalOpenAddEmbedCtrl,
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
                if(ng.ADDEMBEDTRANSFER){
                    //DATA
                    var objEmbedAdd = angular.copy(CMSDATA.OBJNEW);
                    objEmbedAdd.credito = ng.ADDEMBEDTRANSFER.credito;
                    objEmbedAdd.subtitulo = ng.ADDEMBEDTRANSFER.subtitulo;
                    objEmbedAdd.via = ng.ADDEMBEDTRANSFER.via;
                    objEmbedAdd.tipo = ng.ADDEMBEDTRANSFER.tipo;
                    objEmbedAdd.embed = ng.ADDEMBEDTRANSFER.embed;
                    objEmbedAdd.embed_data = angular.copy(ng.ADDEMBEDTRANSFER.embed_data);
                    //ADD EMBED
                    if(ng.ADDEMBEDTRANSFER.type === 'add'){
                        var index = ng.blockAdd.length;
                        ng.addMedia(index, objEmbedAdd, ng.ADDEMBEDTRANSFER.indexNew);
                    }else{
                        var ind = ng.ADDEMBEDTRANSFER.index;
                        ng.blockAdd[ind] = angular.copy(objEmbedAdd);
                    }
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddEmbedCtrl(scope, $create, modal, $timeout) {
            //TYPE
            scope.modalType = modal.type;
            //Keywords Audio
            scope.tagsOnAppendEmbed = function(chip) {
                return {
                    nombre: chip,
                    slug: 'SLUG'
                };
            };
            if(modal.type === 'edit'){
                scope.credito = modal.block.credito;
                scope.embed = modal.block.embed;
                scope.embed_data = (modal.block.embed_data)?modal.block.embed_data:CMSDATA.OBJNEW.embed_data;
                scope.parrafo1 = modal.block.subtitulo;
                scope.via = modal.block.via;
            }else{
                //CLEAR ADD
                scope.credito = CMSDATA.OBJNEW.credito;
                scope.embed = CMSDATA.OBJNEW.embed;
                scope.embed_data = angular.copy(CMSDATA.OBJNEW.embed_data);
                scope.parrafo1 = CMSDATA.OBJNEW.parrafo1;
                scope.via = CMSDATA.OBJNEW.via;
            }
            //CLOSE
            scope.closeOpenAddEmbed = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddEmbed = function(){
                if(scope.embed_data.descripcion.length>0 && scope.parrafo1.length>0){
                    //GET
                    ng.ADDEMBEDTRANSFER = {
                        credito : scope.credito,
                        embed : scope.embed,
                        embed_data : {
                            descripcion: scope.embed_data.descripcion,
                            tags: scope.embed_data.tags,
                        },
                        subtitulo: scope.parrafo1,
                        via: scope.via,
                        tipo : 'embed',
                        index : modal.index,
                        type : modal.type,
                        indexNew : modal.indexNew
                    };
                    $mdDialog.hide();
                }else{
                    //REVISANDO TITULO Y LEYENDA
                    if(scope.embed_data.descripcion.length <= 0 && scope.parrafo1.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ55, CMSDATA.POSITIONMSJ);
                    }else if(scope.parrafo1.length <= 0 && scope.embed_data.descripcion.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ73, CMSDATA.POSITIONMSJ);
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ74, CMSDATA.POSITIONMSJ);
                    }
                }
            };
        };
        //OPEN YOUTUBE
        ng.ADDYOUTUBETRANSFER = null;
        ng.flags.addYoutube = false;
        ng.openAddYoutube = function($event, type, $index, block, $indexNew){
            switchFlags(true);
            $mdDialog.cancel();
            var type = type, index = $index, block = block, $event = $event, $indexNew = $indexNew;
            $mdDialog.show({
                targetEvent : $event,
                scope: $scope,
                preserveScope: true,
                bindToController : true,
                templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/openaddyoutube.html',
                controller : modalOpenAddYoutubeCtrl,
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
                if(ng.ADDYOUTUBETRANSFER){
                        var ngTransfer = angular.copy(ng.ADDYOUTUBETRANSFER);
                        //DATA
                        var objYoutubeAdd = angular.copy(CMSDATA.OBJNEW);
                        objYoutubeAdd.credito = ngTransfer.credito;
                        objYoutubeAdd.subtitulo = ngTransfer.subtitulo;
                        objYoutubeAdd.via = ngTransfer.via;
                        objYoutubeAdd.tipo = ngTransfer.tipo;
                        objYoutubeAdd.youtube = angular.copy(ngTransfer.youtube);
                        //ADD EMBED
                        if(ngTransfer.type === 'add'){
                            var obj = angular.copy(ngTransfer);
                            var index = ng.blockAdd.length;
                            ng.addMedia(index, obj, ng.ADDYOUTUBETRANSFER.indexNew);
                        }else{
                            var ind = ngTransfer.index;
                            ng.blockAdd[ind] = angular.copy(objYoutubeAdd);
                        }
                }
                switchFlags(false);
            }, function() {
                $mdDialog.cancel();
                switchFlags(false);
            });
        };
        function modalOpenAddYoutubeCtrl(scope, $create, modal, $timeout) {
            var elm = angular.element('#add-img--cover');
            ng.showThumbData = false;
            ng.isDeleteThumb = false;
            scope.uploadCaptureImage = function(){
                var elm = angular.element('#add-img--cover');
                var thumbData = elm.find('.loadThumbData');
                thumbData.click();
                elm.find('.loadThumbData').on('change', function(evt){
                    var file = evt.currentTarget.files[0];
                    var formdata = new FormData();
                    formdata.append('file', file);
                    var DATA = formdata;
                    $preload.show();
                    $http.post(CMSDATA.URLMULTIPLEPHOTOS, DATA, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined} /* multipart/form-data */
                    }).
                    success(function(data) {
                        var data = data;
                        if(data.status){
                            var foto = (data.response[0])?data.response[0].foto:'';
                            var url = foto.url;
                            ng.showThumbData = true;
                            ng.isDeleteThumb = true;
                            ng.srcThumbData = url;
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
            scope.removeCaptureImage = function(){
                scope.srcThumbData = '';
                angular.element('#zone-img--youtube img').attr('src', '');
                scope.showThumbData = false;
                ng.isDeleteThumb = false;
            }
            //TYPE
            scope.modalType = modal.type;
            //YOUTUBE
            var youTubeGetParams = function(url){
                var ID = '',
                _url = url.replace(/(>|<)/gi,'');
                var url = _url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/),
                _timestamp = _url.split(/(t=|&start=|&amp;start=)/),
                _autoplay = _url.split(/(autoplay=|&autoplay=|&amp;autoplay=)/);
                var ID, TIMESTAMP, AUTOPLAY;
                //ID
                if(url[2] !== undefined) {
                    ID = url[2].split(/[^0-9a-z_\-]/i);
                    ID = ID[0];
                }else {
                    ID = url;
                }
                //Timestamp
                if(_timestamp[2] !== undefined) {
                    TIMESTAMP = _timestamp[2].split(/[^0-9a-z_\-]/i);
                    //"?rel=0&start=30"
                    TIMESTAMP = TIMESTAMP[0];
                }else {
                    TIMESTAMP = '';
                }
                //AUTOPLAY
                if(_autoplay[2] !== undefined) {
                    AUTOPLAY = _autoplay[2].split(/[^0-9a-z_\-]/i);
                    //"?rel=0&start=30"
                    AUTOPLAY = AUTOPLAY[0];
                }else {
                    AUTOPLAY = '';
                }
                return { ID: ID, TIMESTAMP:TIMESTAMP, AUTOPLAY:AUTOPLAY };
            };
            scope.pasteVideoYoutube = function(_model){
                //$timeout(function(){
                    var params = youTubeGetParams(scope.youtube.url);
                    scope.youtube.autoplay = (params.AUTOPLAY==='true' || params.AUTOPLAY==='1')?true:false;
                    scope.youtube.id = params.ID;
                    scope.youtube.timestamp = params.TIMESTAMP;
                //},0);
            };
            scope.changeTimeYoutube = function(_model){
                //$timeout(function(){
                    var params = youTubeGetParams(scope.youtube.url);
                    scope.youtube.url = scope.youtube.url.replace('#t='+params.TIMESTAMP || 't='+params.TIMESTAMP, '#t='+scope.youtube.timestamp);
                //},TIMERESULT);
            };
            //Keywords Audio
            scope.tagsOnAppendYoutube = function(chip) {
                return {
                    nombre: chip,
                    slug: 'SLUG'
                };
            };

            if(modal.type === 'edit'){
                scope.credito = modal.block.credito;
                scope.youtube = angular.copy(modal.block.youtube);
                scope.youtube.url = (modal.block.youtube.url)?modal.block.youtube.url:'https://youtu.be/'+modal.block.youtube.id;
                scope.youtube.tags = (modal.block.youtube.tags)?modal.block.youtube.tags:CMSDATA.OBJNEW.youtube.tags;
                scope.srcThumbData = (modal.block.youtube.hasOwnProperty('url_cover'))?modal.block.youtube.url_cover:'';
                scope.parrafo1 = modal.block.subtitulo;
                scope.via = modal.block.via;
                if((scope.srcThumbData).length > 0){
                    ng.showThumbData = true;
                    ng.isDeleteThumb = true;
                }else{
                    ng.showThumbData = false;
                    ng.isDeleteThumb = false;
                }
            }else{
                //CLEAR ADD
                scope.credito = '';
                scope.youtube = CMSDATA.OBJNEW.youtube;
                scope.youtube.url = '';
                scope.srcThumbData = '';
                scope.parrafo1 = CMSDATA.OBJNEW.parrafo1;
                scope.via = CMSDATA.OBJNEW.via;
            }
            //CLOSE
            scope.closeOpenAddYoutube = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddYoutube = function(){
                if(scope.youtube.descripcion && scope.youtube.descripcion.length>0 && scope.parrafo1.length>0){
                    if((scope.srcThumbData).length>0){
                        //EXIST THUMB
                        //GET
                        ng.ADDYOUTUBETRANSFER = {
                            credito : scope.credito,
                            youtube : {
                                autoplay : scope.youtube.autoplay,
                                descripcion : scope.youtube.descripcion,
                                id : scope.youtube.id,
                                tags : scope.youtube.tags,
                                timestamp : scope.youtube.timestamp,
                                url : scope.youtube.url,
                                url_cover : scope.srcThumbData
                            },
                            subtitulo: scope.parrafo1,
                            via: scope.via,
                            tipo : 'youtube',
                            index : modal.index,
                            type : modal.type,
                            indexNew : modal.indexNew
                        };
                        //$timeout(function () {
                        $mdDialog.hide();
                        //}, 0);
                    }else{
                        //NOT EXIST THUMB
                        $msj.show(CMSDATA.MSJ.MSJ40, positionMSj);
                    }

                }else{
                    //REVISANDO TITULO Y LEYENDA
                    if(scope.youtube.descripcion && scope.youtube.descripcion.length <= 0 && scope.parrafo1.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ55, CMSDATA.POSITIONMSJ);
                    }else if(scope.parrafo1.length <= 0 && scope.youtube.descripcion && scope.youtube.descripcion.length > 0){
                        $msj.show(CMSDATA.MSJ.MSJ73, CMSDATA.POSITIONMSJ);
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ74, CMSDATA.POSITIONMSJ);
                    }
                }

            };
        };
        ng.openAddMaM = function($event, type, $index, block, $indexNew){
            var type = type, index = $index, block = block, $event = $event, $indexNew = $indexNew;
            var objMaMAdd = CMSDATA.OBJNEW;
            objMaMAdd.tipo = 'mam';
            objMaMAdd.mam.mamIncidents = [];
            if(type === 'add'){
                var index = ng.blockAdd.length;
                ng.addMedia(index, objMaMAdd, $indexNew);
                loadEventsAjax('add');
            }else{

            }
        };
        //OPEN GALLERY PHOTO
        var elmFile = angular.element('#inputFileTrigger');
        var elmFileGif = angular.element('#inputFileTriggerGif');
        elmFile.val('').removeAttr('data-index').removeAttr('data-typephoto');
        elmFileGif.val('').removeAttr('data-index').removeAttr('data-typephoto');
        ng.openAddPhotoGallery = function($event, type, typephoto, $indexNew){
            var elmFile = angular.element('#inputFileTrigger');
            var elmFileGif = angular.element('#inputFileTriggerGif');
            elmFile.val('').removeAttr('data-index').removeAttr('data-typephoto');
            elmFileGif.val('').removeAttr('data-index').removeAttr('data-typephoto');
            var typephoto = typephoto, $indexNew = $indexNew;
            elmFile.attr({'data-index': $indexNew, 'data-typephoto': typephoto});
            elmFileGif.attr({'data-index': $indexNew, 'data-typephoto': typephoto});
            elmFile.val('');
            elmFileGif.val('');
            if(typephoto === 'gif'){
                elmFileGif.click();
            }else{
                elmFile.click();
            }
        };
        //CHANGE INPUT FILE
        var loadPhoto = function(files, typeIndex){
            var files = files;
            var typeIndex = {
                typephoto : typeIndex.typephoto,
                indexNew : typeIndex.indexNew
            };
            //inputFileTriggerGif
            var formdata = new FormData();
            angular.forEach(files, function(v,i){
                formdata.append('file_' + i, files[i]);
            });
            var DATA = formdata;
            $preload.show();
            $http.post(CMSDATA.URLMULTIPLEPHOTOS, DATA, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined} /* multipart/form-data */
            }).
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response?data.response:[];
                    var index = ng.blockAdd.length;
                    var count = 0;
                    angular.forEach(response, function(v,i){
                        var obj = v;
                        var _ind = index + count;
                        ng.addMedia(_ind, obj, typeIndex.indexNew);
                        count++;
                    });
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ24, positionMSj);
                }else{
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ23, positionMSj);
                }
            }).error(function(data) {
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ23, positionMSj);
            });
        };
        elmFile.bind('change', function(){
            ng.$apply(function(){
                var files = elmFile[0].files; //FILES UPLOAD
                //var clickUploadMultipleImages = function(files){
                    loadPhoto(files, {
                        typephoto : '',
                        indexNew : angular.element('#inputFileTrigger').data('index')
                    });
                //};
                //clickUploadMultipleImages(files);
            });
        });
        elmFileGif.bind('change', function(){
            ng.$apply(function(){
                var files = elmFileGif[0].files; //FILES UPLOAD
                //var clickUploadMultipleImages = function(files){
                    loadPhoto(files, {
                        typephoto : 'gif',
                        indexNew : angular.element('#inputFileTriggerGif').data('index')
                    });
                //};
                //clickUploadMultipleImages(files);
            });
        });
        //END ACTIONS
        //TRIGGER MODULE
        ng.triggerModule = function($event, module){
            var mod = module;
            switch (mod) {
                case 'gallery':
                    ng.$broadcast('triggerGallery', true);
                    break;
                case 'covers':
                    //NULL
                    break;
                default:
            }
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
                switch (data.tipo) {
                    case 'archive':
                        ng.fileClone = data;
                        break;
                    case 'photo':
                        ng.fileClone = data;
                        break;
                    case 'youtube':
                        ng.fileClone = data;
                        break;
                    case 'embed':
                        ng.fileClone = data;
                        break;
                    case 'text':
                        ng.fileClone = data;
                        break;
                    default:
                        hideClone();
                }
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
        //ADD NEWS
        ng.openCreateNew = function($event, $type, nid) {
            var _nid = nid, _type = $type;
            $preload.show();
            if(!_nid){
                $preload.hide();
                $rootScope.objInitNews = { response: undefined, type : _type };
                $location.path('/publicador/noticia');
            }
        };
        //END FUNCTIONS
        //PUBLISH FACEBOOK
        var dateRSA = new Date();
        ng.dateTimeRS = {
            date : dateRSA,
            time: dateRSA,
            today : $filter('date')(dateRSA.getTime(), "yyyy-MM-dd")
        };
        ng.redessociales = {
            nid : ng.nid,
            msj : '',
            titulo: '',
            descripcion: '',
            notas_relacionadas: false,
            datePublish : null,
            timePublish : null,
            imageAdds : [],
            imagePost : [],
            carouselThumbs : [],
            imageActive : null,
            accounts : {
                facebook: { groups: [], pages: [] },
                twitter: { groups: [], pages: [] },
                google: { groups: [], pages: [] }
            },
            preload: true,
            postReady : false,
            postError : {
                status : false,
                message : ''
            }
        };
        //LEER
        $http.get(URL + 'redessociales').
        success(function(data) {
            var data = data;
            if(data.status){
                var response = data.response;
                //ng.redessociales.accounts = (response)?response:[];
                ng.redessociales.accounts.facebook = (response.facebook)?response.facebook:{ groups: [], pages: [] };
                ng.redessociales.accounts.twitter = (response.twitter)?response.twitter:{ groups: [], pages: [] };
                ng.redessociales.accounts.google = (response.google)?response.google:{ groups: [], pages: [] };
                ng.redessociales.preload = false;
                ng.redessociales.titulo = ng.objTitulo_seo;
                ng.redessociales.descripcion = ng.objBajada;
            }
            $preload.hide();
        }).error(function(err) {
            $msj.show('Ocurrio un error. No se obtuvo la configuración guardada.',CMSDATA.POSITIONMSJ);
             ng.redessociales.preload = false;
        });
        var reviewChooseImg = function(){
            var arrPortadaThumb = [];
            arrPortadaThumb.push({ url : ng.imgFirst.url, activo : true });
            for (var i = 0; i < ng.thumbs.length; i++) {
                ng.thumbs[i].url = ng.thumbs[i].url==null?'':ng.thumbs[i].url;
                if((ng.thumbs[i].url).indexOf('16-9-mask.png') === -1){
                    arrPortadaThumb.push({ url : ng.thumbs[i].url, activo : false });
                }
            }
            return arrPortadaThumb;
        };
        $timeout(function () {
            ng.carouselThumbs = reviewChooseImg();
        }, 10);
        ng.selectCarousel = function($event, $index, thumb){
            var _i = $index;
            //for (var i = 0; i < ng.carouselThumbs.length; i++) {
            //    ng.carouselThumbs[i].activo = false;
            //}
            //ng.carouselThumbs[_i].activo = true;
            if(ng.carouselThumbs[_i].activo) ng.carouselThumbs[_i].activo = false;
            else{ ng.carouselThumbs[_i].activo = true; }
        };
        ng.isCaorusel = false;
        ng.chooseImg = function($event, isShow){
            if(!isShow){
                ng.isCaorusel = ng.isCaorusel === false ? true: false;
            }
            ng.carouselThumbs = reviewChooseImg();
            for (var i = 0; i < ng.redessociales.imageAdds.length; i++) {
                ng.carouselThumbs.push(ng.redessociales.imageAdds[i]);
            }
        };
        var elmFileFB = angular.element('#inputFileTriggerFB');
        elmFileFB.val('');
        ng.openLoadImgFB = function($event){
            var elmFileFB = angular.element('#inputFileTriggerFB');
            elmFileFB.val('');
            elmFileFB.trigger('click');
            elmFileFB.unbind('change');
            elmFileFB.bind('change', function(){
                ng.$apply(function(){
                    var files = elmFileFB[0].files; //FILES UPLOAD
                    loadPhotoFB(files);
                });
            });
        };

        //CHANGE INPUT FILE
        var convertFormatFB = function(urlImg, flag){
            var urlImg = urlImg;
            return {
                activo : (flag)?flag:false,
                url : urlImg
            };
        };
        var loadPhotoFB = function(files){
            var files = files;
            var formdata = new FormData();
            angular.forEach(files, function(v,i){
                var size = v.size; // bytes
                var maxSize = 1; // Mb
                var imgSize = ($bytesToSize.convert(size)).split(' ');
                var isImgGood = parseFloat(imgSize[0]);
                var typeImgLoad = imgSize[1];
                formdata.append('file_' + i, files[i]);
                var DATA = formdata;
                if(typeImgLoad === 'Bytes' || typeImgLoad === 'KB'){
                    guardarImgRS(DATA);
                    return false;
                }else if(typeImgLoad === 'MB'){
                    if(isImgGood > parseFloat(maxSize)){
                        $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
                    }else{
                        guardarImgRS(DATA);
                    }
                    return false;
                }else if(typeImgLoad === 'GB' || typeImgLoad === 'TB'){
                  $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
                }

            });
        };

        var guardarImgRS = function(data){
            $preload.show();
            $http.post(URL + URLOADIMGPHOTO, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined} /* multipart/form-data */
            }).
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response?data.response:[];
                    if(angular.isArray(response)){
                        angular.forEach(response, function(v,i){
                            if(response[i]){
                                ng.carouselThumbs.push(convertFormatFB(response[i].url, true));
                                ng.redessociales.imageAdds.push(convertFormatFB(response[i].url, true));
                            }
                        });
                    }else{
                        ng.carouselThumbs.push(convertFormatFB(response.url, true));
                        ng.redessociales.imageAdds.push(convertFormatFB(response.url, true));
                    }
                    $timeout(function(){
                        $preload.hide();
                        $msj.show(CMSDATA.MSJ.MSJ24, positionMSj);
                    },2000);
                }else{
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ23, positionMSj);
                }
            }).error(function(data) {
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ23, positionMSj);
            });
        };

        //ng.ADDFBTRANSFER = undefined;
        ng.isProgramFB = false;
        ng.mostrarCheckNR = false;
        ng.programPost = function($event){
            ng.isProgramFB = ng.isProgramFB === false ? true: false;
        };
        ng.insertRSActive = function($event, page, $index, type, parentIndex, redsocial){
            var page = page, $index = $index, type = type, parentIndex = parentIndex, redsocial = redsocial;
            ng.redessociales.accounts[redsocial][type][$index].active = (ng.redessociales.accounts[redsocial][type][$index].active === false)?true:false;
            ng.redessociales.postReady = false;
            //Review Checks Pages and Groups
            for (var i = 0; i < ng.redessociales.accounts.facebook.pages.length; i++) {
                if(ng.redessociales.accounts.facebook.pages[i].active === true){
                    ng.mostrarCheckNR = true;
                    return false;
                }else{
                    ng.mostrarCheckNR = false;
                }
            }
            for (var i = 0; i < ng.redessociales.accounts.facebook.groups.length; i++) {
                if(ng.redessociales.accounts.facebook.groups[i].active === true){
                    ng.mostrarCheckNR = true;
                    return false;
                }else{
                    ng.mostrarCheckNR = false;
                }
            }
        };
        ng.isAccountsFB = true;
        ng.sendPostFB = function($event){
            $preload.show();
            //IMG CAROUSEL
            var img1 = []/*, kepp = true*/;
            for (var i = 0; i < ng.carouselThumbs.length; i++) {
                //if(kepp === true){
                    if(ng.carouselThumbs[i].activo === true){
                        img1.push(ng.carouselThumbs[i]);
                //        kepp = false;
                    }
                //}
            }
            ng.redessociales.imageActive = (ng.isCaorusel)?img1:null;
            ng.redessociales.carouselThumbs = ng.carouselThumbs;
            //Review Checks Pages and Groups
            var keppPage = true;
            for (var i = 0; i < ng.redessociales.accounts.facebook.pages.length; i++) {
                if(keppPage === true){
                    if(ng.redessociales.accounts.facebook.pages[i].active === true){
                        keppPage = false;
                    }
                }
            }
            var keppGroups = true;
            for (var i = 0; i < ng.redessociales.accounts.facebook.groups.length; i++) {
                if(keppGroups === true){
                    if(ng.redessociales.accounts.facebook.groups[i].active === true){
                        keppGroups = false;
                    }
                }
            }
            var keppTW = true;
            for (var i = 0; i < ng.redessociales.accounts.twitter.pages.length; i++) {
                if(keppTW === true){
                    if(ng.redessociales.accounts.twitter.pages[i].active === true){
                        keppTW = false;
                    }
                }
            }
            //nid
            ng.redessociales.nid = ng.nid;
            //DATA
            ng.redessociales.postReady = false;
            ng.redessociales.postError.status = false;
            ng.redessociales.postError.message = '';
            ng.redessociales.datePublish = (ng.isProgramFB)?angular.copy(ng.dateTimeRS.date).getTime():null;
            ng.redessociales.timePublish = (ng.isProgramFB)?angular.copy(ng.dateTimeRS.time).getTime():null;
            var DATA = angular.copy(ng.redessociales);
            if(!keppPage || !keppGroups || !keppTW){
                $http.post(URL + 'redessociales/publicar', DATA).
                success(function(data) {
                    var data = data;
                    if(data.status){
                        $preload.hide();
                        $msj.show('Publicación en Redes Sociales correcta.',positionMSj);
                        ng.redessociales.msj = '';
                        ng.redessociales.titulo = ng.objTitulo_corto;
                        ng.redessociales.descripcion = ng.objBajada;
                        ng.redessociales.titulo = ng.objTitulo_corto;
                        ng.redessociales.notas_relacionadas = false;
                        ng.redessociales.postReady = false;
                        ng.redessociales.postError.status = false;
                        ng.redessociales.postError.message = '';
                        reviewHistory();
                    }else{
                        var msjErr = (data.error.message)?data.error.message:'Ocurrio un error.';
                        ng.redessociales.postError.message = msjErr;
                        ng.redessociales.postError.status = true;
                        $msj.show(msjErr,CMSDATA.POSITIONMSJ);
                    }
                    $preload.hide();
                }).error(function(err) {
                    $preload.hide();
                    ng.redessociales.postError.status = false;
                    $msj.show('Ocurrio un error.',CMSDATA.POSITIONMSJ);
                });
            }else{
                $preload.hide();
                ng.redessociales.postReady = true;
            }
        };
        ng.historyRS = [];
        var reviewHistory = function(){
            var nid = ng.nid;
            $http.get(URL + 'redessociales/leer_posts/' + nid).
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response;
                    ng.historyRS = (response)?response:[];
                }
                $preload.hide();
            }).error(function(err) {
                //$msj.show('Ocurrio un error.',CMSDATA.POSITIONMSJ);
            });
        };
        ng.openRSShare = function($event, post, type){
            var post = post, type = type, DATA = { id : post._id, message : post.message, page_id : post.page_id };
            switch (type) {
                case 'share':
                    var closeCallback = function(){ return false; };
                    var permalink = post.permalink, permalink = post.permalink, page_id = 'rpp' + page_id;
                    $popup.open(permalink, page_id, '1000', '500', closeCallback);
                    break;
                case 'edit':
                    $preload.show();
                    var DATA = DATA;
                    $http.post(URL + 'redessociales/facebook_actualizar_post', DATA).
                    success(function(data) {
                        var data = data;
                        if(data.status){
                            reviewHistory();
                            $timeout(function(){
                                $preload.hide();
                                $msj.show('Se actualizo el texto del post correctamente.',positionMSj);
                            },1500);
                        }
                        $preload.hide();
                    }).error(function(err) {
                        $preload.hide();
                        $msj.show('Ocurrio un error al actualizar.',CMSDATA.POSITIONMSJ);
                    });
                    break;
                case 'delete':
                    var DATA = DATA;
                    var $event = $event;
                    var confirmDeleteRS = $mdDialog.confirm({
                        title: 'Confirmación',
                        content: '¿Está seguro que desea eliminar?',
                        ok: 'Aceptar',
                        cancel: 'Cancelar'
                    });
                    $mdDialog
                    .show( confirmDeleteRS ).then(function() {
                        //OK
                        $preload.show();
                        $http.post(URL + 'redessociales/eliminar_post', DATA).
                        success(function(data) {
                            var data = data;
                            if(data.status){
                                reviewHistory();
                                $timeout(function(){
                                    $preload.hide();
                                    $msj.show('Se eliminó correctamente el post.',positionMSj);
                                },1500);
                            }
                            $preload.hide();
                        }).error(function(err) {
                            $preload.hide();
                            $msj.show('Ocurrio un error al eliminar.',CMSDATA.POSITIONMSJ);
                        });
                    })
                    .finally(function() {
                        //Close alert
                        confirmDeleteRS = undefined;
                    });
                    break;
                default:
            }

        };
        $timeout(function(){
            reviewHistory();
        },2000);
        //END PUBLISH FACEBOOK

        ng.validTW=false;
        var validarLista = function(lista){
            try{
                for (var i = 0; i <= lista.length; i++) {
                    if(lista[i].active){
                        ng.validTW = true;
                        return true;
                    }else{
                        ng.validTW = false;
                        return false;
                    }
                }
            }catch(e){
                // console.log(e, 'eee');
            }
        };

        ng.validarEnviarRS = function (lista) {
            var tw = validarLista(lista);
            if(tw){
                if(ng.redessociales.msj.length<=0||ng.redessociales.msj.length<=0||ng.redessociales.msj.length>90){
                    return true;
                }else{
                    return false;
                }
            }else{
                if(ng.redessociales.msj.length<=0){
                    return true;
                }else{
                    return false;
                }
            }
        }

    };

    //SITE CREATE NEW
    //BLOCK PARAGRAF AND CITE
    ng.parrafoycita = CMSDATA.GLOBAL.URLVIEW + 'parrafoycita.html';
    ng.agregadorparrafoycita = CMSDATA.GLOBAL.URLVIEW + 'agregadorparrafoycita.html';
    ng.showAddOptions = false;

    //Scroll To Block ADD
    var scrollToAddBlocks = function(_id){
        $timeout(function(){
            $scrollGo.go(_id);
        }, TIMERESULT);
    };

    //URL TITLE
    ng.setUrlSection = function(){
        var section = (ng.objCategoryMultiple)?ng.objCategoryMultiple.slug:'';
        var tSeo = (ng.objTitulo_seo)?Slug.slugify(ng.objTitulo_seo):'';
        if(section){
            var arrSection = section.split('/');
            arrSection.splice(0,1); //REMOVE SITE
            section = arrSection.join('/');
        }
        var p = (ng.objCategoryMultiple)?'/':'';
        ng.objUrl = section + p + tSeo ;
    };

    //blurTitle
    ng.blurTitle = function(){
        //TITLE SEO
        if(ng.objTitulo_seo === undefined){
            ng.objTitulo_seo = ng.objTitulo;
        }else if(ng.objTitulo_seo != undefined && ng.objTitulo_seo.length <= 0){
            ng.objTitulo_seo = ng.objTitulo;
        }
        //TITLE SHORT
        if(ng.objTitulo_corto === undefined){
            ng.objTitulo_corto = ng.objTitulo;
        }else if(ng.objTitulo_corto != undefined && ng.objTitulo_corto.length <= 0){
            ng.objTitulo_corto = ng.objTitulo;
        }
        //SLUG
        ng.setUrlSection();
    };

    //changeTitleSeo
    ng.changeTitleSeo = function(){
        ng.setUrlSection();
    };

    //Load Categories
    ng.objCategoryMultiple = undefined;
    ng.objCategorys = undefined;
    ng.DATATRANSFERMODAL = undefined;
    ng.DATARETURNMODAL = undefined;
    ng.loadCategoryMultiple = function(existCategorys) {
        var _sitio = ng.objSitio;
        $http.get(URL + URLLISTCATEGORYMULTIPLE + _sitio + '/' + ng.nid).
        //$http.get(URL + URLLISTCATEGORYMULTIPLE + 'la10/' + ng.nid).
        success(function(data){
            var data = data;
            if(data.status){
                ng.DATATRANSFERMODAL = data.response;
                //Exist Categorys
                if(existCategorys){
                    var DATATRANSFER = ng.DATATRANSFERMODAL;
                    var mapDataCategory = function(DATATRANSFER){
                        var arrInput = [], arrOutput = [], arrModelSelect = [];
                        //CATEGORY MULTIPLE
                        //SEPARATE INPUT , OUTPUT AND MODEL SELECT
                        var DATA = DATATRANSFER;
                        angular.forEach(DATA, function(v,i){
                            if(!DATA[i].ticked){
                                //INPUT LEFT
                                arrInput.push(DATA[i]);
                            }else{
                                //OUTPUT RIGHT
                                arrOutput.push(DATA[i]);
                            }
                            //INIT MODEL SELECT
                            if(DATA[i].primary){
                                arrModelSelect.push(DATA[i]);
                            }
                        });
                        return {
                            input : arrInput,
                            output : arrOutput,
                            modelSelect : arrModelSelect
                        }
                    };
                    var RETURNDATATRANSFER = mapDataCategory(DATATRANSFER);
                    ng.objCategoryMultiple = RETURNDATATRANSFER.modelSelect[0]; //SET TEXT SELECT
                    ng.objCategorys = angular.copy(RETURNDATATRANSFER.output); //OUTPUT

                    //SET SECTION URL
                    ng.setUrlSection();
                    // reviewTitles();
                }else{
                    //Category
                    // checkCategoryIA();
                }
            }else{
                $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
            }
        }).error(function(data) {
            $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
        });
    };
    //ng.loadCategoryMultiple();
    ng.changeCategorys = function(){
        var _sitio = ng.objSitio;
        //if(_sitio === 'la10'){ng.objInstantArticle = true}else{ng.objInstantArticle = false};
        disabledIA();
        ng.loadCategoryMultiple(_sitio);
    };

    //OPEN EDIT CATEGORY
    ng.flags.categoryMultiple = false;
    ng.clickEditCategoryModal = function($event){
        ng.flags.categoryMultiple = true;
        $mdDialog.show({
            targetEvent : $event,
            scope: $scope,
            preserveScope: true,
            templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/editcategory.html',
            controller : modalCategoryAddCtrl
        })
        .then(function() {
            var output = ng.DATARETURNMODAL.output;
            var input = ng.DATARETURNMODAL.input;
            var modelSelect = ng.DATARETURNMODAL.modelSelect;
            if(modelSelect){
                //DATA SET MODEL CATEGORY
                ng.objCategoryMultiple = modelSelect; //SET TEXT CATEGORY SELECT
                ng.objCategorys = angular.copy(output);
            }else{
                ng.objCategoryMultiple = undefined;
                ng.objCategorys = [];
            }
            //SET SECTION URL
            ng.setUrlSection();
            ng.flags.categoryMultiple = false;
            //checkCategoryIA();
            disabledIA();
        }, function() {
            $mdDialog.cancel();
            ng.flags.categoryMultiple = false;
        });
    };
    function modalCategoryAddCtrl(scope, $mdDialog) {
        var DATATRANSFER = ng.DATATRANSFERMODAL;
        scope.categoryInput = [];
        scope.categoryOutput = [];
        var mapDataCategory = function(DATATRANSFER){
            var arrInput = [], arrOutput = [];
            //CATEGORY MULTIPLE
            //SEPARATE INPUT AND OUTPUT
            var DATA = DATATRANSFER;
            angular.forEach(DATA, function(v,i){
                if(!DATA[i].ticked){
                    //INPUT LEFT
                    arrInput.push(DATA[i]);
                }else{
                    //OUTPUT RIGHT
                    arrOutput.push(DATA[i]);
                }
            });
            scope.categoryInput = angular.copy(arrInput);
            scope.categoryOutput = angular.copy(arrOutput);
        };
        scope.categoryInputModel = undefined;
        scope.categoryOutputModel = undefined;
        if(!ng.DATARETURNMODAL){ //IF NOT RETURN DATA
            mapDataCategory(DATATRANSFER);
        }else{
            scope.categoryInput = angular.copy(ng.DATARETURNMODAL.input);
            scope.categoryOutput = angular.copy(ng.DATARETURNMODAL.output);
            scope.categoryOutputModel = [angular.copy(ng.DATARETURNMODAL.modelSelect)];
       }
        //CATEGORY INPUT
        scope.addCategoryElection = function(categoryInputModel){
            var categoryInputModel = categoryInputModel;
            angular.forEach(categoryInputModel, function(v,i){
                var _index = scope.categoryInput.indexOf(categoryInputModel[i]);
                if(_index >= 0){
                    scope.categoryOutput.push(categoryInputModel[i]);
                    categoryInputModel[i].ticked = true;
                    categoryInputModel[i].primary = false;
                    scope.categoryInput.splice(_index, 1);
                }
            });
            scope.categoryInputModel = undefined;

            //IF ONE ITEM
            var existPrimary = false;
            angular.forEach(scope.categoryOutput, function(v,i){
                if(scope.categoryOutput[i].primary === true){
                    existPrimary = true;
                }
            });
            if(!existPrimary){
                scope.categoryOutput[0].primary = true;
            }
            //IF ONE ITEM
        };
        //CATEGORY OUTPUT
        scope.removeCategoryElection = function(categoryOutputModel){
            var categoryOutputModel = categoryOutputModel;
            angular.forEach(categoryOutputModel, function(v,i){
                var _index = scope.categoryOutput.indexOf(categoryOutputModel[i]);
                if(_index >= 0){
                    scope.categoryInput.push(categoryOutputModel[i]);
                    categoryOutputModel[i].ticked = false;
                    scope.categoryOutput.splice(_index, 1);
                    //SELECT INITIAL
                    if(scope.categoryOutput.length>0){
                        if(categoryOutputModel[i].primary === true){
                            scope.categoryOutput[0].primary = true;
                        }else{
                            scope.categoryOutput[i].primary = false;
                        }
                    }
                    //END SELECT INITIAL
                }
            });
            scope.categoryOutputModel = undefined;
        };
        scope.changeCategoryOutputModel = function(categoryOutputModel){
            var categoryOutputModel = categoryOutputModel;
            if(scope.categoryOutputModel.length>1){
                scope.categoryOutputModel = undefined;
            }else{
                angular.forEach(scope.categoryOutput,function(v,i){
                    scope.categoryOutput[i].primary = false;
                });
                var _index = scope.categoryOutput.indexOf(categoryOutputModel[0]);
                scope.categoryOutput[_index].primary = true;
            }
        };
        scope.cancel = function() {
            $mdDialog.cancel();
        };
        scope.answerCategoryAll = function(jsonData) {
            //SEND DATA MODEL INTERFACE
            //DATA SET MODEL CATEGORY
            var modelSelect = undefined;
            angular.forEach(scope.categoryOutput, function(v,i){
                if(scope.categoryOutput[i].primary === true){
                    modelSelect = scope.categoryOutput[i]; //SET TEXT CATEGORY SELECT
                }
            });
            ng.DATARETURNMODAL = {
                input: scope.categoryInput,
                output : scope.categoryOutput,
                modelSelect : modelSelect
            };
            $mdDialog.hide();
        };
    }
    //END OPEN EDIT CATEGORY

    //Remove class active block
    var removeClassActiveblock = function(){
        var elm = angular.element('#block-ui-add');
        elm.children('.draglist').find('.md-content-addblock').removeClass('activeEdit');
    };

    //REFRESH BLOCKS
    //Create OBJ Blocks
    var createObjBlocks = function(parrafo1, parrafo2, cita, relacionado, embed, credito, via, tipo, youtube, foto, video, audio, mam, embed_data){
        var parrafo1 = parrafo1, parrafo2 = parrafo2,
        cita = cita, relacionado = relacionado, embed = embed, credito = credito,
        via = via, tipo = tipo, youtube = youtube,
        foto = foto, video = video, audio = audio, mam = mam,
        embed_data = embed_data;
        return {
            subtitulo: parrafo1,
            texto: parrafo2,
            cita: cita,
            relacionado : relacionado,
            embed: embed,
            credito: credito,
            via: via,
            tipo: tipo, //'text',
            youtube: youtube,
            foto: foto,
            video: video,
            audio: audio,
            mam: mam,
            embed_data : embed_data
        };
    };

    ng.blockAdd = []; //Agregador Bloques
    ng.temas = [];
    ng.tags = [];
    ng.objCategory = undefined;
    ng.autorObj = undefined;
    ng.objSitio = undefined;
    ng.contenido = createObjBlocks(
        '',
        '',
        {
            alineacion: 'arriba',
            titulo: '',
            desarrollo: ''
        },
        {
            alineacion: 'arriba',
            items : []
        },
        '',
        '',
        '',
        'text',
        {
            url : '', /*YOUTUBE*/
            id : '',
            autoplay : '',
            timestamp : '',
            url_cover: '',
            descripcion: '',
            tags: []
        },
        { /* FOTO */
            attr: {
                align: 'center'
            },
            id: '',
            data: '',
            alt: '',
            descripcion: '',
            url: '',
            tags: []
        },{
            url: '', /*VIDEO*/
            url_cover: '',
            duracion : '',
            hash: '',
            tags: []
        },{
            url: '', /*AUDIO*/
            url_cover: '',
            duracion : '',
            hash: '',
            tags: []
        },{
            id: '', /*MAM*/
            datafactory: '',
            titulo: '',
            fechaInicio: ''
        },{/*embed_data*/
            descripcion: '',
            tags: []
        }
    );
    ng.objDate_publish = null;
    ng.objTime_publish = null;
    ng.volada = '';
    ng.ticker = '';
    ng.bajada = '';
    ng.entradilla = '';
    ng.titulo = '';
    ng.url = '';
    ng.titulo_seo = '';
    ng.titulo_corto = '';
    ng.fuente = '';
    ng.newsObj = {};
    ng.nid = ''; //NID
    ng.objDataFactory = ''

    var refreshObj = function(){
        //TEMAS
        var objTemas = [];
        if(ng.tagsNames.length>0){
            angular.forEach(ng.tagsNames, function(value, key) {
                objTemas.push({
                    slug: ng.tagsNames[key].nombre,
                    nombre: ng.tagsNames[key].nombre
                });
            });
        }
        ng.temas = angular.copy(objTemas);

        //TAGS
        var objKeywords = [];
        if(ng.keywordsNames.length>0){
            angular.forEach(ng.keywordsNames, function(value, key) {
                objKeywords.push({
                    slug: ng.keywordsNames[key].nombre,
                    nombre: ng.keywordsNames[key].nombre
                });
            });
        }
        ng.tags = angular.copy(objKeywords);

        //Sections
        var selectCategoryPrimary = function(obj){
            var obj = obj;
            var objNew = { nombre: '', slug: '' };
            if(obj){
                angular.forEach(obj, function(v, i){
                    if(v.primary){
                        objNew.nombre = v.nombre,
                        objNew.slug = v.slug
                    }
                });
            }
            return objNew;

        };

        ng.categoria = selectCategoryPrimary(ng.objCategorys?ng.objCategorys:null)
        ng.categorias = ng.objCategorys?ng.objCategorys:null;
        //Autor
        ng.autorA = {
            nombre: ng.objAuthor?ng.objAuthor.nombre:null,
            slug : ng.objAuthor?ng.objAuthor.slug:null,
            foto : ng.objAuthor?ng.objAuthor.foto:null
        };

        //Site
        ng.sitio = ng.objSitio?ng.objSitio:null;

        //Contenido
        var objContenido = [];
        if(ng.blockAdd.length>0){
            angular.forEach(ng.blockAdd, function(value, key) {
                if(ng.blockAdd[key].hasOwnProperty('cita')){
                    if(ng.blockAdd[key].cita.titulo === null){
                        ng.blockAdd[key].cita.titulo = '';
                    }
                    if(ng.blockAdd[key].cita.desarrollo === null){
                        ng.blockAdd[key].cita.desarrollo = '';
                    }
                    if(ng.blockAdd[key].cita.alineacion === null){
                        ng.blockAdd[key].cita.alineacion = '';
                    }
                    if(ng.blockAdd[key].relacionado.alineacion === null){
                        ng.blockAdd[key].relacionado.alineacion = '';
                    }
                }else{
                    ng.blockAdd[key].cita = {
                        alineacion : '',
                        titulo: '',
                        desarrollo : ''
                    }
                }
                if(ng.blockAdd[key].hasOwnProperty('relacionado')){
                    if(ng.blockAdd[key].relacionado.alineacion === null){
                        ng.blockAdd[key].relacionado.alineacion = '';
                    }
                }else{
                    ng.blockAdd[key].relacionado = {
                        alineacion : '',
                        items : []
                    }
                }
                objContenido.push(
                    createObjBlocks(
                        ng.blockAdd[key].subtitulo,
                        ng.blockAdd[key].texto,
                        {
                            alineacion: (ng.blockAdd[key].cita)?
                            //ng.blockAdd[key].cita.alineacion:
                            ((ng.blockAdd[key].cita.titulo.length>0 || ($filter('htmlToPlaintext')(ng.blockAdd[key].cita.desarrollo)).length>0)?
                            ng.blockAdd[key].cita.alineacion:
                            ''):'',
                            titulo: (ng.blockAdd[key].cita)?ng.blockAdd[key].cita.titulo:'',
                            desarrollo: (ng.blockAdd[key].cita)?ng.blockAdd[key].cita.desarrollo:''
                        },
                        {
                            alineacion: (ng.blockAdd[key].relacionado)?
                            //ng.blockAdd[key].relacionado.alineacion:
                            (((ng.blockAdd[key].relacionado.items).length>0)?ng.blockAdd[key].relacionado.alineacion:''):
                            '',
                            items : (ng.blockAdd[key].relacionado)?ng.blockAdd[key].relacionado.items:[]
                        },
                        ng.blockAdd[key].embed,
                        ng.blockAdd[key].credito,
                        ng.blockAdd[key].via,
                        ng.blockAdd[key].tipo,
                        (ng.blockAdd[key].hasOwnProperty('youtube'))?{
                            url : ng.blockAdd[key].youtube.url,
                            id : ng.blockAdd[key].youtube.id,
                            autoplay : ng.blockAdd[key].youtube.autoplay,
                            timestamp : ng.blockAdd[key].youtube.timestamp,
                            url_cover : (ng.blockAdd[key].youtube.hasOwnProperty('url_cover'))?ng.blockAdd[key].youtube.url_cover:'',
                            descripcion : (ng.blockAdd[key].youtube.hasOwnProperty('descripcion'))?ng.blockAdd[key].youtube.descripcion:'',
                            tags : (ng.blockAdd[key].youtube.hasOwnProperty('tags'))?ng.blockAdd[key].youtube.tags:[]
                        }:'',
                        (ng.blockAdd[key].hasOwnProperty('foto'))?{
                            attr: {
                                align:
                                    (ng.blockAdd[key].foto.hasOwnProperty('attr'))?
                                        ng.blockAdd[key].foto.attr.hasOwnProperty('align')?ng.blockAdd[key].foto.attr.align:'':
                                        ''
                            },
                            //id: $create.guid(),
                            id: ng.blockAdd[key].foto.id,
                            data: ng.blockAdd[key].foto.data,
                            alt: ng.blockAdd[key].foto.alt,
                            descripcion: ng.blockAdd[key].foto.descripcion,
                            url: ng.blockAdd[key].foto.url,
                            tags: ng.blockAdd[key].foto.tags
                        }:'',
                        {
                            url: (ng.blockAdd[key].video)?ng.blockAdd[key].video.url:null,
                            url_cover: (ng.blockAdd[key].video)?ng.blockAdd[key].video.url_cover:null,
                            duracion: (ng.blockAdd[key].video)?ng.blockAdd[key].video.duracion:null,
                            hash: (ng.blockAdd[key].video)?ng.blockAdd[key].video.hash:null,
                            descripcion: (ng.blockAdd[key].video)?ng.blockAdd[key].video.descripcion:null,
                            alt: (ng.blockAdd[key].video)?ng.blockAdd[key].video.alt:null,
                            tags: (ng.blockAdd[key].video)?ng.blockAdd[key].video.tags:[]
                        },
                        {
                            url: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.url:null,
                            url_cover: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.url_cover:null,
                            duracion: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.duracion:null,
                            hash: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.hash:null,
                            descripcion: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.descripcion:null,
                            alt: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.alt:null,
                            tags: (ng.blockAdd[key].audio)?ng.blockAdd[key].audio.tags:[]
                        },
                        {
                            id: (ng.blockAdd[key].mam)?ng.blockAdd[key].mam.id:null,
                            datafactory: (ng.blockAdd[key].mam)?ng.blockAdd[key].mam.datafactory:null,
                            titulo: (ng.blockAdd[key].mam)?ng.blockAdd[key].mam.titulo:null,
                            fechaInicio: (ng.blockAdd[key].mam)?ng.blockAdd[key].mam.fechaInicio:null
                        },
                        { /*embed_data*/
                            descripcion: (ng.blockAdd[key].embed_data)?ng.blockAdd[key].embed_data.descripcion:'',
                            tags: (ng.blockAdd[key].embed_data)?ng.blockAdd[key].embed_data.tags:[]
                        }
                    )
                );
            });

            ng.contenido = angular.copy(objContenido);
        }
        //Date publish
        var validDateTime = function(date, time){
            var date = date, time = time, replaceStr = function(str, arrPos, arrValue){
                var arr = str.split('');
                for (var i = 0; i < arrPos.length; i++) {
                    arr[arrPos[i]] = arrValue[i];
                }
                return arr.join('');
            };
            if(date != null){
                if(time != null){
                    //Time Get Values HH, MM
                    var arrTime = time.toString().split(' '),
                    _arrTime = arrTime[4].split(':'),
                    HH = _arrTime[0], MM = _arrTime[1];
                    //Date Replace Format Wed May 13 2015 07:45:00 GMT-0500 (PET)
                    var strDate = date.toString();
                    date = replaceStr(strDate, [16,17,19,20], (HH + MM).split('')); //HH & MM
                    return date;
                }else{
                    return date;
                }

            }else{
                return null;
            }
        };
        //ng.date_publish = angular.copy(ng.objDate_publish);
        ng.date_publish = validDateTime(ng.objDate_publish, ng.objTime_publish);

        //Volada
        ng.volada = angular.copy(ng.objVolada);
        //Volada
        ng.ticker = angular.copy(ng.objTicker);
        //Bajada
        ng.bajada = angular.copy(ng.objBajada);

        //Entradilla
        ng.entradilla = angular.copy(ng.objEntradilla);

        //Titulo
        ng.titulo = angular.copy(ng.objTitulo);
        //Url
        ng.url = angular.copy(ng.objUrl);
        //Titulo SEO
        ng.titulo_seo = angular.copy(ng.objTitulo_seo);
        //Titulo Corto
        ng.titulo_corto = angular.copy(ng.objTitulo_corto);
        //Fuente
        ng.fuente = angular.copy(ng.objFuente);
        //Tipo
        ng.tipo = angular.copy(ng.objTipo);

        //Maps Google
        ng.maps = ng.getDataMap();

        //Thumbs PORTADA
        ng.portada_thumb = function(){
            var arrPortadaThumb = [];
            arrPortadaThumb.push({ url : ng.imgFirst.url, activo : true });
            for (var i = 0; i < ng.thumbs.length; i++) {
                arrPortadaThumb.push({ url : ng.thumbs[i].url, activo : false });
            }
            return arrPortadaThumb;
        };

        //PROGRAMADO
        ng.programado = ng.objProgramado;

        //Firmar noticia
        ng.firmarnoticia = ng.objFirmaNoticia;
        //Comentarios FB
        ng.comentariosfb = ng.objComentariosFB;
        //Instant Article
        ng.instant_article = ng.objInstantArticle;
        //Comentarios FB
        ng.titulares = ng.objTitulares;

        //JSON OBJ INIT
        ng.newsObj = {
            nid : ng.nid, //LISTO
            sitio : ng.sitio, //LISTO
            tipo : ng.tipo, //LISTO
            fecha_publicacion : '',
            date_publish : ng.date_publish, //LISTO
            categoria : ng.categoria, //LISTO
            categorias : ng.categorias, //LISTO CATEGORY MULTIPLE
            volada : ng.volada, //LISTO
            ticker : ng.ticker, //LISTO
            entradilla : angular.copy(ng.entradilla), //LISTO
            bajada : ng.bajada, //LISTO
            titulo : ng.titulo, //LISTO
            slug : ng.url, //LISTO
            titulo_seo : ng.titulo_seo, //LISTO
            titulo_corto : ng.titulo_corto, //LISTO
            contenido : ng.contenido, //LISTO
            permalink : '',
            autor : ng.autorA, //LISTO
            fuente : ng.fuente, //LISTO
            stats : '',
            publicidad : '',
            config : '',
            categoria_slug : '',
            tags : ng.temas, //LISTO
            keywords : ng.tags, //LISTO
            imagen_portada:{
                url : ng.imgFirst.url,
                activo : true
            },
            portada_thumb : ng.portada_thumb(),
            seo : '',
            revisions : '',
            version : '',
            last_modified : '',
            created_publish : '',
            created_time : '',
            _id : {
                $id : ''
            },
            estado : '',
            mapa: ng.maps,
            datafactory : ng.objDataFactory,
            programado : ng.programado,
            firmarnoticia : ng.firmarnoticia,
            comentariosfb : ng.comentariosfb,
            url_externo : ng.objUrlExterno,
            instant_article : ng.instant_article,
            imagen_lateral : (ng.thumbVertical.imgVertical)?ng.thumbVertical.imgVertical:null,
            titulares : ng.titulares
        };

    };

    //BACK TO LIST
    ng.backToList = function(){
        //Open new view
        //nghome.viewInclude = URLVIEW + URLLIST;
        $location.path('/publicador');
    };

    //Reordenamiento Drag and Drop
    ng.onDropComplete = function (index, obj, evt) {
        var obj = obj, index = index, evt = evt;
        if(obj && obj.hasOwnProperty('drag')){
            if(obj['drag'] === 'archive'){
                //ARCHIVE
                delete obj['drag'];
                index = (index)?index:0;
                var extension = $isExtension.get((obj.hasOwnProperty('foto'))?obj.foto.url:undefined);
                if(extension === 'gif'){
                    ng.openAddPhoto(undefined, 'edit', index, obj, index);
                }else{
                    ng.openAddPhoto(undefined, 'cropear', index, obj, index);
                }
            }else{
                delete obj['drag'];
                ng.addMedia(index, obj);
            }
            reviewAddBlocks();
        }else{
            //No editando
            var otherIndex = ng.blockAdd.indexOf(obj);
            ng.blockAdd.splice(otherIndex, 1);
            ng.blockAdd.splice(index, 0, obj);
            reviewAddBlocks();
            loadEventsAjax('drag');
        }
    };

    /* OPTIONS GENERAL */
    //Click Preview
    ng.clickPreview = function($event){

        //Refresh objs DATA = ng.newsObj
        refreshObj();

        //Preview
        var $event = $event, DATA = ng.newsObj;
        $preload.show();
        $http.post(URL + URLPREVIEW, DATA).
        success(function(data) {
            var data = data;
            //$timeout(function(){
                if(data.status){
                    $mdDialog.show({
                        targetEvent: $event,
                        templateUrl:CMSDATA.GLOBAL.URLTEMPLATE + 'modal/previewnew.html',
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
        scope.readyDataByPublih = ng.parentReadyDataByPublish;
        scope.modalIsPublish = ng.isPublish;
        //Close Modal
        scope.addClosePreviewNews = function() {
            $mdDialog.hide();
        };
        scope.publishInPreviewNews = function($event) {
            var $event = $event;
            ng.clickPublish($event, 'preview');
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

    //Click Guardar
    ng.clickSave = function($event){

        //Refresh objs DATA = ng.newsObj
        refreshObj();

        //Preview
        var $event = $event, DATA = ng.newsObj;
        $preload.show();
        $http.post(URL + URLSAVE, DATA).
        success(function(data) {
            var data = data;
            //$timeout(function(){
                if(data.status){
                    ng.nid = data.response.id; //NID
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
                    //REVISIONES
                    getRevisions(ng.nid);

                    //Limpieza de Revision de campos con errores
                    clearRevisionErrorFiled('save');

                }else{
                    $preload.hide();
                    toastErrorList(data.error.fields, data.error.message);
                    //$msj.show(data.error.message,positionMSj);
                    //Revision de campos con errores
                    revisionErrorFiled(data.error.fields);
                }
            //},TIMERESULT);
        }).error(function(data) {
            $preload.hide();
            $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
        });
    };

    //Click Publicar
    ng.fields = {
        titulo: '',
        url: '',
        titulo_seo: '',
        titulo_corto: '',
        categoria: '',
        contenido: '',
        tags: '',
        autor: ''
    };
    var revisionErrorFiled = function(fields){
        var fields = fields;
        if(fields){
            ng.fields.titulo = fields.hasOwnProperty('titulo')?fields.titulo:'';
            ng.fields.url = fields.hasOwnProperty('slug')?fields.slug:'';
            ng.fields.titulo_seo = fields.hasOwnProperty('titulo_seo')?fields.titulo_seo:'';
            ng.fields.titulo_corto = fields.hasOwnProperty('titulo_corto')?fields.titulo_corto:'';
            ng.fields.categoria = fields.hasOwnProperty('categoria')?fields.categoria:'';
            ng.fields.contenido = fields.hasOwnProperty('contenido')?fields.contenido:'';
            ng.fields.tags = fields.hasOwnProperty('tags')?fields.tags:'';
            ng.fields.autor = fields.hasOwnProperty('autor')?fields.autor:'';
        }
    };
    var clearRevisionErrorFiled = function(type){
        var type = type;
        if(type = 'publish'){
            ng.fields.titulo = '';
            ng.fields.url = '';
            ng.fields.titulo_seo = '';
            ng.fields.titulo_corto = '';
            ng.fields.categoria = '';
            ng.fields.contenido = '';
            ng.fields.tags = '';
            ng.fields.autor = '';
        }else{
            ng.fields.titulo = '';
            ng.fields.url = '';
            ng.fields.categoria = '';
            ng.fields.contenido = '';
            ng.fields.tags = '';
            ng.fields.autor = '';
        }
    };

    //Get Publish
    ng.isPublish = false;
    ng.getPublish = function(data, type){
        var data = data, type = type;
        if(type === 'page'){
            var op = data.estado || undefined;
            //Page
            if((op && op === 'publicado') || (op && op === 'editado')){
                ng.isPublish = true;
            }else{
                ng.isPublish = false;
            }
        }else{
            var op = data.op || undefined;
            //Click
            if((op && op === 'PUBLISH') || (op && op === 'EDIT')){
                ng.isPublish = true;
            }else{
                ng.isPublish = false;
            }
        }
    };

    //PUBLISH
    ng.parentReadyDataByPublish = false;
    ng.clickPublish = function($event, type){
        var $event = $event, type = type;
        //Refresh objs DATA = ng.newsObj
        refreshObj();
        var DATA = ng.newsObj;
        var isPreview = function(){
            if(type='preview'){
                //CLOSE DIALOG
                $mdDialog.hide();
            }
        };
        var actionPublish = function(){
            //IF PUBLISH
            //Preview
            $http.post(URL + URLPUBLISH, DATA).
            success(function(data) {
                var data = data;
                //$timeout(function(){
                    if(data.status){
                        ng.nid = data.response.id; //NID
                        $preload.hide();
                        $msj.show(CMSDATA.MSJ.MSJ9,positionMSj);
                        //REVISIONES
                        getRevisions(ng.nid);

                        //Limpieza de Revision de campos con errores
                        clearRevisionErrorFiled('publish');

                        //IF NEW PUBLISH
                        ng.getPublish(data.response, 'click');

                        //PREVIEW
                        isPreview();

                    }else{
                        $preload.hide();
                        toastErrorList(data.error.fields, data.error.message);
                        //$msj.show(data.error.message,positionMSj);
                        //Revision de campos con errores
                        revisionErrorFiled(data.error.fields);
                        //PREVIEW
                        isPreview();
                    }
                //},TIMERESULT);
            }).error(function(data) {
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ10,positionMSj);
            });
        };

        //VALID PUBLISH
        //IF PUBLISH
        //Preview
        $preload.show();
        if(type!='preview'){
            $http.post(URL + URLVALIDPUBLISH, DATA).
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response;
                    if(response.publicado){
                        //PUBLISH NORMAL
                        ng.parentReadyDataByPublish = true;
                        actionPublish();
                    }else{
                        //PREVIEW
                        ng.parentReadyDataByPublish = true;
                        //Limpieza de Revision de campos con errores
                        clearRevisionErrorFiled('publish');
                        ng.clickPreview($event, 'publish');

                    }
                }else{
                    ng.parentReadyDataByPublish = false;
                    $preload.hide();
                    toastErrorList(data.error.fields, data.error.message);
                    //Revision de campos con errores
                    revisionErrorFiled(data.error.fields);
                }
            }).error(function(data) {
                ng.parentReadyDataByPublish = false;
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ10,positionMSj);
            });
        }else{
            //PUBLISH NORMAL
            ng.parentReadyDataByPublish = true;
            actionPublish();
        }
    };

    //Delete New
    var deleteNewInList = function(nid){
        var _nid = nid;
        if(_nid){
            //Edit noticia
            $http.delete(URL + URLDELETE + _nid).
            success(function(data) {
                var data = data;
                if(data.status){
                    //Delete item
                    ng.backToList();
                    $preload.hide();
                }else{
                    $preload.hide();
                    $msj.show(data.message,positionMSj);
                }
            }).error(function(data) {
                $preload.hide();
                if(ng.isPublish){
                    $msj.show(CMSDATA.MSJ.MSJ38,positionMSj);
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ8,positionMSj);
                }
            });
        }else{
            //Create nueva noticia
            $preload.hide();
            $msj.show(CMSDATA.MSJ.MSJ8,positionMSj);
        }
    };
    ng.clickDelete = function($event){
        //Editando
        var confirmDeleteNew = $mdDialog.confirm({
        title: 'Alerta',
        content: (ng.isPublish)?'¿Está seguro que desea despublicar?':'¿Está seguro que desea eliminar?',
        ok: 'Aceptar'
        });
        $mdDialog
        .show( confirmDeleteNew ).then(function() {
            //OK
            //confirmDeleteNew = undefined;
            $preload.show();
            var nid = ng.nid;
            deleteNewInList(nid);
        })
        .finally(function() {
        //Close alert
        confirmDeleteNew = undefined;
        });
    };

    //View Activity
    ng.clickViewActivity = function(revision){
        var revision_id = revision.revision_id,
        nid = revision.nid;

        //PRELOAD
        $preload.show();

        $http.get(URL + URLREVISIONS + nid + '/' + revision_id).
        success(function(data) {
            var data = data;
            //$timeout(function(){
                if(data.status){
                    //REVISION REFRESH OBJECT
                    var objInit = angular.copy(data);
                    init(objInit);
                    $preload.hide();
                    scrollToAddBlocks('#bodyAddsNews');
                    $msj.show(CMSDATA.MSJ.MSJ12,positionMSj);

                }else{
                    $preload.hide();
                    $msj.show(data.error.message,positionMSj);
                }
            //},TIMERESULT);
        }).error(function(data) {
            $preload.hide();
            $msj.show(CMSDATA.MSJ.MSJ11,positionMSj);
        });
    };

    //Load Categories
    ng.categories = [];
    ng.loadCategory = function(existCategory) {
        var _sitio = ng.objSitio;
        $http.get(URL + URLLISTCATEGORY + _sitio).
        //$http.get(URL + URLLISTCATEGORY + 'la10').
        success(function(data){
            var data = data;
            //if(data.status){
                //CATEGORY
            //    ng.categories = data.response;
            if(data){
                //CATEGORY
                ng.categories = data;
                if(existCategory){
                    ng.objCategory = existCategory;
                }
            }else{
                $msj.show(CMSDATA.MSJ.MSJ32,positionMSj);
            }
        }).error(function(data) {
            $msj.show(CMSDATA.MSJ.MSJ13,positionMSj);
        });
    };

    //Load FUENTE
    ng.fuentes = [];
    ng.loadFuente = function(existFuente) {
        $cacheService.get(URL + URLFUENTES)
        .then(
            function (data) {
                var data = data;
                if(data.status){
                    //CATEGORY
                    ng.fuentes = data.response;
                    if(existFuente){
                        ng.objFuente = existFuente;
                    }
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ34,positionMSj);
                }
            },
            function(msgError) {
                $msj.show(CMSDATA.MSJ.MSJ34,positionMSj);
            }
        );
    };

    //MAP GOOGLE
    var _lat = -12.046374, _lng = -77.0427934, _lugar = 'Lima, Perú';
    ng.showLoadMap = function(_map){
        var _map = _map;
        ng.ObjDataMap = _map || {
            center : {
                lat: _lat, //VALUE DEFAULT LIMA
                lng: _lng //VALUE DEFAULT LIMA
            },
            lugar: _lugar //VALUE DEFAULT LIMA
        };
        ng.objMapZoom = 12;
        ng.objMap = (ng.ObjDataMap.lugar)?ng.ObjDataMap.lugar:_lugar; //INPUT UBICATION
        ng.objMapLat = (ng.ObjDataMap.center)?ng.ObjDataMap.center.lat:_lat;
        ng.objMapLng = (ng.ObjDataMap.center)?ng.ObjDataMap.center.lng:_lugar;
        ng.objLatLng = [ng.objMapLat, ng.objMapLng];
        //Marker
        ng.markerGeo = {
            id: 0,
            name: ng.objMap,
            lat: ng.objMapLat,
            lng: ng.objMapLng,
            position: ng.objLatLng,
            draggable: true,
            animation: google.maps.Animation.BOUNCE,
            markerClick : function(event){
                ng.setCenter(event);
            },
            onDragEnd : function(event){
                ng.setCenter(event);
            }
        };
        ng.showMapGoogle = function(_id, _type){
            var _id = angular.element(_id),
            _cls = 'height-none',
            _type = _type;
            if(_type === 'open'){
                _id.removeClass(_cls);
            }else{
                if(_id.hasClass(_cls)){
                    _id.removeClass(_cls);
                }else{
                    _id.addClass(_cls);
                }
            }
        };
        var map;
        var geocoder = new google.maps.Geocoder();
        var noUbication = 'No se encontro ubicción';
        ng.$on('mapInitialized', function(evt, evtMap) {
          map = evtMap;
          //Update Position, Marker
          ng.updateCenter = function(lat, lng, lugar) {
              var lat = lat, lng = lng, lugar = lugar;
              ng.objMapLat = lat;
              ng.objMapLng = lng;
              ng.objLatLng = [lat, lng];
              ng.objMap = lugar;
              angular.extend(ng.markerGeo, { position: [lat, lng] });
              ng.objMapZoom = 15;
          };
          ng.codeLatLng = function(lat, lng, type) {
              var lat = lat, lng = lng;
              var latlng = new google.maps.LatLng(lat, lng);
              geocoder.geocode({'latLng': latlng}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                      var _result = results[1] || results[0];
                      if (_result) {
                          var lugar = _result.formatted_address;
                          ng.dataMapInitHTML5.lugar = lugar;
                          if(type = 'drag'){
                            var _lugar = lugar.toString();
                            ng.objMapLat = lat;
                            ng.objMapLng = lng;
                            ng.objLatLng = _lugar;
                            ng.objMap = _lugar;
                          }
                          return lugar;
                    } else {
                      return noUbication;
                    }
                  } else {
                    return noUbication;
                  }
                  ng.$apply();
              });
          };
          //Revision HTML5
          ng.dataMapInitHTML5 = {
            lat : '',
            lng : '',
            lugar : ''
          };
          var reviewHTML5Geo = function(){
              var onSuccessGeo = function(position) {
                  var lat = position.coords.latitude,
                  lng = position.coords.longitude;
                  ng.dataMapInitHTML5.lat = lat;
                  ng.dataMapInitHTML5.lng = lng;
                  ng.codeLatLng(lat, lng, 'review');
                  ng.$apply();
              };
              var onErrorGeo = function(error) {
              };
              navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);
          };
          reviewHTML5Geo();

          ng.reviewDataHTML5 = function(){
              var lat = ng.dataMapInitHTML5.lat;
              var lng = ng.dataMapInitHTML5.lng;
              var lugar = ng.dataMapInitHTML5.lugar;
              ng.updateCenter(lat, lng, lugar);
              //ng.$apply();
              ng.showMapGoogle('#map-google', 'open');
          }
          //Review Map On Search Input
          ng.methodSearch = function(query, type, latLng){
              var query = query;
              var type = type;
              var latLng = latLng;
              if(type === 'place' && (latLng.lat || latLng.lng)){
                  //PLACE MAP
                  var lugar = query;
                  var lat = latLng.lat,
                  lng = latLng.lng;
                  ng.updateCenter(lat, lng, lugar);
                  ng.showMapGoogle('#map-google', 'open');
                  ng.$apply();
              }else{
                  //NORMAL MAPS
                  geocoder.geocode( { "address": query }, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                          _result = results[1] || results[0];
                          var location = _result.geometry.location;
                          var lugar = _result.formatted_address;
                          var lat = location.lat(),
                          lng = location.lng();
                          ng.updateCenter(lat, lng, lugar);
                          ng.showMapGoogle('#map-google', 'open');
                          ng.$apply();
                      }
                  });
              }
          };
           var autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputMapGoogle'));
          ng.reviewMap = function($event){
              var $event = $event;
              //PLACES
              autocomplete.bindTo('bounds', map);
              //END PLACES
          };

          //SEARCH AUTOCOMPLETE
          google.maps.event.addListener(autocomplete, 'place_changed', function() {
              var place = autocomplete.getPlace();
              var lat = (place.geometry)?place.geometry.location.A:undefined;
              var lng = (place.geometry)?place.geometry.location.F:undefined;
              var query = place.formatted_address;
              ng.methodSearch(query, 'place', { lat: lat, lng : lng });
          });

          ng.searchMap = function($event){
              var query = ng.objMap;
              ng.methodSearch(query, 'click', { lat: undefined, lng : undefined });
              ng.objMapZoom = 15;
              $event.preventDefault();
          };
          ng.setCenter = function($event){
            var latLng = $event.latLng;
            var lat = latLng.G;
            var lng = latLng.K;
            var lugar = '';
            ng.updateCenter(lat, lng, lugar);
            geocoder.geocode({ 'latLng': latLng },
            function (results, status) {
                var _result = results[1] || results[0];
                var lugar = _result.formatted_address;
                ng.objMap = lugar;
                ng.objMapZoom = 15;
                ng.$apply();
            });
          };
        });
        //GET VALUES DATA GOOGLE MAPs
        ng.getDataMap = function(){
            return {
                center : {
                    lat: ng.objMapLat,
                    lng: ng.objMapLng
                },
                lugar: ng.objMap
            };
        };
    };
    // END MAP GOOGLE

    //THUMBS PORTADA
    ng.imgFirst = {
        url: '',
        alt: 'Imagen de portada'
    };
    ng.thumbs = [];
    var imgDefault = CMSDATA.IMGDEFAULTLA10;
    var imgThumbsLoad = function(nid){
        var nid = nid;
        var elm = angular.element('#imgFirstThumb');
        if(nid){
            var portadaThumb = ng.portadaThumb;
            if(portadaThumb.length>0){
                for (var i = 0; i < portadaThumb.length; i++) {
                    if(portadaThumb[i].activo){
                        ng.imgFirst.url = portadaThumb[i].url;
                    }else{
                        ng.thumbs.push(portadaThumb[i]);
                    }
                }
            }
        }else{
            ng.imgFirst.url = imgDefault;
        }
        elm.attr('data-thumbs', (ng.portadaThumb)?ng.portadaThumb.length:'-1');
    };
    ng.selectThumb = function($event, thumb, $index){
        var $event = $event, thumb = thumb, $index = $index;
        if(thumb){
            var imgPush = angular.copy(ng.imgFirst);
            ng.imgFirst = {
                url : thumb.url
            };
            ng.thumbs.push(imgPush);
            ng.thumbs.splice($index, 1);
            //FB IMG Refresh
            ng.chooseImg(undefined, true);
        }
    };
    //ADD THUMB
    ng.addNewPhotoThumb = function(imgData, isBlock){
        var imgData = imgData;
        var elm = angular.element('#imgFirstThumb');
        if(isBlock){ //BLOCK ADD
            if(ng.thumbs.length === 0){
                if(elm.attr('data-thumbs') === '-1'){
                    //PRIMERA FOTO SUBIDA
                    var imgPush = angular.copy(ng.imgFirst);
                    ng.thumbs.push(imgPush);
                    ng.imgFirst = {
                        url : imgData.url
                    };
                }else{
                    var imgPush = angular.copy(imgData);
                    ng.thumbs.push(imgPush);
                }
            }else{
                var imgPush = angular.copy(imgData);
                ng.thumbs.push(imgPush);
            }
        }else{
            var imgPush = angular.copy(ng.imgFirst);
            ng.thumbs.push(imgPush);
            ng.imgFirst = {
                url : imgData.url
            };
        }
        elm.attr('data-thumbs', ng.thumbs.length);
        //FB IMG Refresh
        ng.chooseImg(undefined, true);
    };
    ng.flags.thumbs = false;
    ng.addThumb = function($event){
        switchFlags(true);
        $mdDialog.show({
            controller: modalThumbAddCtrl,
            templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/addthumb.html',
            targetEvent: $event,
        })
        .then(function(response) {
            if(response){
                //DATA
                var imgData = angular.copy(response);
                if(imgData){
                    ng.addNewPhotoThumb(imgData, false);
                    $timeout(function(){
                        $preload.hide();
                    },2000); //WAIT FOR LOAD PHOTO
                }
            }
            switchFlags(false);
        }, function() {
            $mdDialog.cancel();
            switchFlags(false);
        });
    };
    function modalThumbAddCtrl(scope, $mdDialog, $preload) {
        scope.widthImage = CMSDATA.DIMENSION16x9.widthLarge;
        scope.heightImage = CMSDATA.DIMENSION16x9.heightLarge;
        scope.cancel = function() {
            $mdDialog.cancel();
        };
        scope.answerThumb = function() {
            //FNC LOAD DATA
            var fncLoadEditImg = function(){
                var elm = angular.element('#imgUploadThumb [name="thumb_values"]');
                var jsonData = elm.data('json');
                $preload.show();
                var DATA = angular.fromJson(jsonData);

                $http.post(URL + URLLISTTHUMBS, DATA).
                success(function(data) {
                    var data = data;
                    if(data.status){
                        var response = data.response;
                        $mdDialog.hide(response);
                        //$preload.hide();
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ33,'top right');
                        $preload.hide();
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ33,'top right');
                    $preload.hide();
                });
            };
            //REVIEWs
            var elm = angular.element('#imgUploadThumb [name="thumb_values"]');
            var jsonData = elm.data('json');
            if(!jsonData){
                //No Hay data
                //REVIEWS DATA IMG DONE
                var btnDonePhoto = angular.element('#imgUploadThumb .tools .md-cms-green');
                if(btnDonePhoto.size() === 1){
                    btnDonePhoto.click();
                    $preload.show();
                    $timeout(function () {
                        fncLoadEditImg();
                    }, TIMEWAITBTNDONE);
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ36,'top right');
                }
            }else{
                fncLoadEditImg();
            }
        };
    };

    //THUMB PORTADA VERTICAL
    ng.thumbVertical = {
        state : false,
        imgVertical : {},
        preload : false
    };
    ng.addThumbVertical = function($event){
        var evtSuccess = function(data){
            if(data.status){
                ng.thumbProgressVertical = true;
                var response = data.response;
                ng.thumbVertical.imgVertical = angular.copy(response[0]);
                ng.thumbVertical.preload = true;
                ng.thumbVertical.state = false;
                $timeout(function(){
                    ng.thumbVertical.preload = false;
                    ng.thumbVertical.state = true;
                },3000);
            }else{
                $msj.show(CMSDATA.MSJ.MSJ23, CMSDATA.POSITIONMSJ);
            }
        };
        var evtError = function(err){
            console.log(err, 'error');
        };
        $loadimg.load(evtSuccess, evtError);
    };
    //FIN THUMB PORTADA

    //Init Edit Options
    var objInit =  nghome.objInitNews;

    //Init Page
    var init = function(obj){
        var response = obj.response,
        type = obj.type;
        ng.objDate_publish = new Date(response.date_publish); //Date publish
        ng.objTime_publish = new Date(response.date_publish); //Time publish
        ng.nid = response.nid; //NID
        ng.objFuente = response.fuente; //FUENTE
        ng.autorObj = (response.autor!=null)?response.autor:undefined; //AUTHOR
        ng.objCategory = (response.categoria!=null)?response.categoria:undefined; //CATEGORY
        ng.objCategorys = (response.categorias!=null)?response.categorias:undefined; //CATEGORYS
        ng.objTitulo = response.titulo; //TITULO
        ng.objUrl = (response.slug!=null)?response.slug:undefined; //URL
        ng.objTitulo_seo = response.titulo_seo; //TITULO SEO
        ng.objTitulo_corto = response.titulo_corto; //TITULO CORTO
        ng.objBajada = response.bajada; //BAJADA
        ng.objVolada = response.volada; //VOLADA
        ng.objTicker = response.ticker; //VOLADA
        ng.objEntradilla = response.entradilla; //ENTRADILLA
        ng.tagsNames = response.tags; //TEMAS
        ng.keywordsNames = response.keywords; //KEYWORDS
        ng.blockAdd = response.contenido; //AGREGADOR
        ng.objTipo = response.tipo; //TIPO NOTICIA
        ng.objSitio = (response.sitio!=null)?response.sitio:undefined; //SITIO
        ng.ObjDataMapEdit = (response.mapa!=null)?response.mapa:undefined; //MAPA
        ng.objDataFactory = (response.datafactory!=null)?response.datafactory:undefined; //DATAFACTORY
        ng.portadaThumb = (response.portada_thumb!=null)?response.portada_thumb:undefined; //PORTADA THUMB
        ng.objProgramado = (response.programado!=null)?response.programado:false; //PROGRAMADO
        ng.objFirmaNoticia = (response.firmarnoticia!=null)?response.firmarnoticia:false; //FIRMAR NOTICIA
        ng.objComentariosFB = (response.comentariosfb!=null)?response.comentariosfb:true; //COMENTARIOS
        ng.objTitulares = (response.titulares!=null)?response.titulares:true; //TITULARES
        ng.objUrlExterno = (response.url_externo!=null)?response.url_externo:undefined; //URL EXTERNO
        // ng.objInstantArticle = (response.instant_article!=null)?response.instant_article:((ng.objSitio==='la10')?true:false);
        ng.objInstantArticle = (response.instant_article!=null)?response.instant_article:((ng.objSitio==='la10'||ng.objSitio==='rpp')?true:false);
        ng.thumbVertical.imgVertical = (response.imagen_lateral!=null)?response.imagen_lateral:null; //IMAGEN VERTICAL
        if(response.imagen_lateral){ ng.thumbVertical.state = true; }
        loadEventsAjax('edit');
    };
    var nidxUrl = $routeParams.nid;

    var noNidLoad = function(){
        //CREACION DE NUEVA NOTICIA
        //Tipo noticia
        ng.objTipo = (objInit)?objInit.type:'noticia';

        //FUENTE
        ng.loadFuente(undefined);

        //AUTHOR
        ng.loadAuthorHeader(undefined, 'page');

        //AUTHOR
        ng.loadSiteHeader(undefined, 'page', function(){
            ng.loadCategory(undefined);
            ng.loadCategoryMultiple(undefined);
        });

        //Load Map
        ng.showLoadMap(undefined);

        //FECHA DE INICIO | SET DATE INITIAL
        ng.objDate_publish = new Date(); //Date publish
        ng.objTime_publish = new Date(); //Time publish

        //LOAD THUMBS PORTADA
        imgThumbsLoad(undefined);

    };

    if(nidxUrl){
        //EDICION SOLO URL
        //Agregar
        var _nid = nidxUrl;
        $preload.show();
        //Edit noticia
        $http.get(URL + URLEDITNEWS + _nid).
        success(function(data) {
            var data = data;
            if(data.status){
                var objInit = { type: 'editar', response: data.response };

                //EDICION CLICK MODIFICAR
                init(objInit);

                //Get Publish
                ng.getPublish(objInit.response, 'page');

                //FUENTE
                ng.loadFuente(ng.objFuente);

                //AUTHOR
                ng.loadAuthorHeader(ng.autorObj, 'page');

                //SITE
                ng.loadSiteHeader(ng.objSitio, 'page', function(){
                    ng.loadCategory(ng.objCategory);
                    ng.loadCategoryMultiple(ng.objCategorys);
                });

                //Load Map
                ng.showLoadMap(ng.ObjDataMapEdit);

                //SCROLL TOP
                scrollToAddBlocks('#bodyAddsNews');

                //CLICK REVISIONS
                getRevisions(ng.nid);

                //LOAD THUMBS PORTADA
                imgThumbsLoad(ng.nid);
                //OPEN FAB SPEED FIAL
                ng.isOpenSpeedDial = false;
                ng.showOpenText = false;

                //REVIEWs
                reviewAddBlocks();

                $timeout(function(){
                    $preload.hide();
                },TIMERESULT);
            }else{
                noNidLoad();
                $timeout(function(){
                    $preload.hide();
                },TIMERESULT);
            }
        }).error(function(data) {
            noNidLoad();
            $timeout(function(){
                $preload.hide();
            },TIMERESULT);
        });

    }else {
        if(objInit && objInit.response){
            //EDICION CLICK MODIFICAR
            init(objInit);

            //Get Publish
            ng.getPublish(objInit.response, 'page');

            //FUENTE
            ng.loadFuente(ng.objFuente);

            //AUTHOR
            ng.loadAuthorHeader(ng.autorObj, 'page');

            //SITE
            ng.loadSiteHeader(ng.objSitio, 'page', function(){
                ng.loadCategory(ng.objCategory);
                ng.loadCategoryMultiple(ng.objCategorys);
            });

            //Load Map
            ng.showLoadMap(ng.ObjDataMapEdit);

            //SCROLL TOP
            scrollToAddBlocks('#bodyAddsNews');

            //LOAD THUMBS PORTADA
            imgThumbsLoad(ng.nid);
            //OPEN FAB SPEED FIAL
            ng.isOpenSpeedDial = false;
            ng.showOpenText = false;
        }else{
            noNidLoad();
            //OPEN FAB SPEED FIAL
            ng.isOpenSpeedDial = true;
            ng.showOpenText = true;
            ng.objComentariosFB = true;
            ng.objTitulares = true;
            //ng.objInstantArticle = true;
            //disabledIA();
        }
    }

    //Temas
    ng.tagsReadonly = false;
    ng.tagsNames = [];
    ng.tagsOnAppend = function(chip) {
        //KEYWORDS
        var idemKeywords = false;
        if(ng.keywordsNames.length > 0){
            angular.forEach(ng.keywordsNames, function(v,i){
                if(chip === v.nombre){
                    idemKeywords = true;
                }
            });
        }
        //NO IDEM CHIP KEYWORDS
        if(!idemKeywords){
            ng.keywordsNames.push({
                nombre: chip,
                slug: 'SLUG'
            });
        }

        //RETURN THEME
        return {
            nombre: chip,
            slug: 'SLUG'
        };
    };

    //Keywords
    ng.keywordsReadonly = false;
    ng.keywordsNames = [];
    ng.keywordsOnAppend = function(chip) {
        return {
            nombre: chip,
            slug: 'SLUG'
        };
    };


    //Revisiones
    ng.revisionProgress = false;
    ng.showRevisions = false;
    ng.clickShowRevisions = function(ifMoreLess){
        if(!ifMoreLess){
            ng.showRevisions = true;
        }else{
            ng.showRevisions = false;
        }
    };
    var getRevisions = function(nid) {
        var _nid = nid;
        if(nid){
            ng.revisionProgress = true;
            $http.get(URL + URLREVISIONS + _nid).
            success(function(data) {
                var data = data;
                $timeout(function(){
                    if(data.status){
                        //ng.revisions = data.response.reverse();
                        ng.revisions = data.response;
                        ng.revisionProgress = false;
                    }else{
                        ng.revisionProgress = false;
                    }
                },TIMERESULT);
            }).error(function(data) {
                $timeout(function(){
                    ng.revisionProgress = false;
                },TIMERESULT);
            });
        }
    };
    getRevisions(ng.nid);

    //FIN DESTACADA
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


}]);

});
