// Controller : Create News

// 'use strict';

define(['app'], function (app) {

app.register.controller('detalleCtrl', [
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
    '$route',
    '$filter',
    '$log',
    function(
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
        $route,
        $filter,
        $log
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLVIEW = CMSDATA.GLOBAL.URLVIEW,
            URLLIST = 'listado.html',
            URLLOGIN = 'login.html',
            URLSESSION = 'session',
            URLCLOSESESSION = 'session/logout',
            URLLISTAUTHOR = 'user',
            URLGUARDARTAG = 'tag/guardar',
            URLPUBLICARTAG = 'tag/publicar',
            URLOADIMGPHOTO = 'elementos/upload/photo',
            URLPREVIEWDETACADA = 'noticias/vistapreviadestacada',
            URLMODIFICARTEMA = 'tag/leer',
            DATA = {},
            TIMERESULT = 1000 / 4,
            TIMEWAITBTNDONE = 2000;

        //VAR TOOLS
        var positionMSj = 'top right';
        //FLAG DISABLED SESSION
        ng.disabledCloseSession = false;

        //PARENT SCOPE
        var nghome = ng.$parent;
        nghome.preloader = false;

        //DIMENSION IMAGEN | VIDEO | AUDIO UPLOAD
        ng.widthMedia = CMSDATA.DIMENSION16x9.widthLarge;
        ng.heightMedia = CMSDATA.DIMENSION16x9.heightLarge;

        //Close Session
        ng.closeSession = function() {
            $logout.get(URL + URLCLOSESESSION);
        };

        /*
        @init Vars
        */
        ng.layerSearch = false;
        ng.custom = true;
        ng.temas = {
            nombre: '',
            keyword: '',
            titulo_seo: '',
            cuerpo : '',
            tags_in : [],
            tags_seo : [],
            imagen_tema : { url : '' },
            imagen_branding: false,
            imagen_logo : { url : '' },
            imagen_branding : {},
            personalidad: {}
        };
        /*
        @init Functions
        */
        //Init Edit Options
        $scrollGo.go('#contentbodycenter');
        var objInit =  nghome.objTema;
        var nidxUrl = $routeParams.nid;
        //Init Page
        var init = function(obj){
            var _obj = obj;
            if(_obj){
                //Review Session
                $preload.show();
                $login.get(URL + URLSESSION).then(
                    function(data) {
                        var data = data;
                        if (data.status) {
                            ng.initList(data, _obj);
                            $preload.hide();
                        } else {
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
            }else{
                $preload.show();
                $location.path('/temas');
            }
        };
        //EDITAR TEMA
        var openTag = function(item, $index){
            var DATA = item, $index = $index;
            $preload.show();
            $http.post(URL + URLMODIFICARTEMA, DATA).
            success(function(data) {
                var data = data;
                if (data.status) {
                    var response = data.response;
                    var _objInit = {
                        data: { item : item, index : $index },
                        response : response,
                        type : 'editar'
                    }
                    init(_objInit);
                } else {
                    $msj.show(CMSDATA.MSJ.MSJ65,CMSDATA.POSITIONMSJ);
                    $preload.hide();
                }
            }).error(function(data) {
                $msj.show(CMSDATA.MSJ.MSJ65, CMSDATA.POSITIONMSJ);
                $preload.hide();
            });
        };
        if(nidxUrl){
            openTag({
                _id : nidxUrl
            }, 0);
        }else{
            init(objInit);
        }
        //INIT FNC
        ng.initList = function(data, _obj) {
            var $obj = _obj.response;
            ng.temas = {
                _id: ($obj._id)?$obj._id:'',
                nombre: ($obj.nombre)?$obj.nombre:'',
                keyword: ($obj.keyword)?$obj.keyword:'',
                titulo_seo: ($obj.titulo_seo)?$obj.titulo_seo:'',
                cuerpo : ($obj.cuerpo)?$obj.cuerpo:'',
                tags_in : ($obj.tags_in)?$obj.tags_in:[],
                tags_seo : ($obj.tags_seo)?$obj.tags_seo:[],
                imagen_tema : { url : ($obj.imagen_tema)?$obj.imagen_tema.url:'' },
                imagen_logo : { url : ($obj.imagen_logo)?$obj.imagen_logo.url:'' },
                imagen_branding: (angular.isDefined($obj.imagen_branding))?$obj.imagen_branding:false,
                personalidad : {
                    titulo : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.titulo:'',
                    sitios : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.sitios:[{
                        nombre: 'RPP', slug: 'rpp', model: false, tag_especial:{
                            url_1020x65 : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.sitios[0].tag_especial.url_1020x65:''
                        }
                    },{
                        nombre: 'La10', slug: 'la10', model: false, tag_especial:{}
                    }],
                    color: {
                        colorFondo : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.color.colorFondo:'',
                        claseCss : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.color.claseCss:'',
                        colorBorde : ($obj.hasOwnProperty('personalidad'))?
                        ($obj.personalidad.color.hasOwnProperty('colorBorde'))?$obj.personalidad.color.colorBorde:'':
                        '',
                        contraste: ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.color.contraste:false
                    },
                    imagenes: {
                        url_1020x51 : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.imagenes.url_1020x51:'',
                        url_694x242 : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.imagenes.url_694x242:'',
                        url_logo_tag : ($obj.hasOwnProperty('personalidad'))?$obj.personalidad.imagenes.url_logo_tag:''
                    },
                    twitter : {
                        hashtag : ($obj.hasOwnProperty('personalidad'))?
                        ($obj.personalidad.hasOwnProperty('twitter'))?$obj.personalidad.twitter.hashtag:'':
                        ''
                    }
                }
            };
            //COLOR
            ng.listColors = [
                {
                    color: '#000000', nombre: 'Negro'
                },{
                    color: '#053a55', nombre: 'Azul'
                },{
                    color: '#ffffff', nombre: 'Blanco'
                }
            ];
            ng.changeColor = function($event, color){
                ng.temas.personalidad.color.claseCss = color.color;
            };
            //END COLOR

            ng.backToList = function(){
                $location.path('/temas');
            };

            ng.chipsTags = function(chip) {
                return chip;
            };
            ng.chipsAsociados = function(chip) {
                return chip;
            };

            ng.changeMultimediaFiltro = function($event){
                var $event = $event;
                if($event.which === 13) {
                    var query = ng.query;
                    $rootScope.buscarQueryTema = { query: query };
                    ng.backToList();
                }
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

            /*
            @change Photo
            */

            /* OPTIONS GENERAL */
            //OBJETO NOTICIAS PORTADA
            var refreshObj = function(){
                ng.newsObj = ng.temas;
            };
            //Click Preview
            ng.clickPreview = function($event) {
                var $event = $event;
                refreshObj();
                var DATA = ng.newsObj;
                $preload.show();
                $http.post(URL + URLPREVIEWDETACADA, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        $mdDialog.show({
                            targetEvent: $event,
                            templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/portadas/previewnew.html',
                            locals: {
                                  response: data.response
                            },
                            controller: addPreviewNews
                        });
                        $msj.show(CMSDATA.MSJ.MSJ27, 'top right');
                    } else {
                        $preload.hide();
                        $msj.show(CMSDATA.MSJ.MSJ4, 'top right');
                    }
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
                scope.ifrmAddHTML = $sce.trustAsHtml('<iframe src="' + response + '" frameborder="0" scrolling="auto" style="width:100%; height:500px" id="ifrm"></iframe>');
                $timeout(function() {
                    var ifrm = angular.element('#ifrm');
                    ifrm.css('visibility', 'hidden');
                    $timeout(function() {
                        ifrm.css('visibility', 'visible');
                        $preload.hide();
                    }, TIMERESULT * 8);
                }, 0);
                scope.previewRWD = 'desktop';
                scope.changePreviewRWD = function($event) {
                    var scopeSelect = scope.previewRWD;
                    ng.responsiveModal(scopeSelect);
                };
                scope.urlPreviewNewWindow = response;
            };

            //Reviews Valids
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
            ng.erroFields = {};
            reviewValid = function(){
                ng.erroFields = {};
                if(ng.selectedTabIndex === 1){
                    //if(ng.temas.personalidad.imagenes.url_logo_80x42.length <= 0){
                    //    ng.erroFields.url_logo_80x42 = 'Debe subir el Logo';
                    //}
                    //if(ng.temas.personalidad.sitios[0].model && ng.temas.personalidad.imagenes.url_1020x51.length <= 0){
                    //    ng.erroFields.url_1020x51 = 'Debe subir la Imagen de fondo';
                    //}
                    //if(ng.temas.personalidad.sitios[1].model && ng.temas.personalidad.imagenes.url_694x242.length <= 0){
                    //    ng.erroFields.url_694x242 = 'Debe subir la Imagen de fondo para La10';
                    //}
                    //if(ng.temas.personalidad.sitios[0].tag_especial.activo && ng.temas.personalidad.sitios[0].tag_especial.url_1020x65 <= 0){
                    //    ng.erroFields.url_1020x65 = 'Debe subir la Imagen de fondo para el tag especial';
                    //}
                    if(Object.keys(ng.erroFields).length > 0){
                        toastErrorList(ng.erroFields, 'Campos que debe corregir');
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return true;
                }
            };

            //Click Guardar
            ng.clickSave = function($event) {
                if(!reviewValid()){ return false; };
                var $event = $event;
                refreshObj();
                var DATA = ng.newsObj;
                $preload.show();
                $http.post(URL + URLGUARDARTAG, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ63,positionMSj);
                        $preload.hide();
                    }
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ63, positionMSj);
                });
            };

            //PUBLISH
            ng.clickPublish = function($event, type) {
                if(!reviewValid()){ return false; };
                var $event = $event;
                refreshObj();
                var DATA = ng.newsObj;
                $preload.show();
                $http.post(URL + URLPUBLICARTAG, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        $msj.show(CMSDATA.MSJ.MSJ9,positionMSj);
                        $preload.hide();
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ64,positionMSj);
                        $preload.hide();
                    }
                }).error(function(data) {
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ64, positionMSj);
                });
            };


            //SUBIR IMAGEN
            var elm = angular.element('#input-file--upload');
            elm.val('');
            ng._imgMode = undefined;
            ng.subirImagen = function($event, model){
                ng._imgModel = model;
                var elm = angular.element('#input-file--upload');
                elm.val('');
                elm.trigger('click', model);
            };
            elm.off('change').on('change', function(evt){
                var file = evt.currentTarget.files[0];
                var formdata = new FormData();
                formdata.append('file', file);
                var DATA = formdata;
                ng.procesoSubidaImagen(DATA);
            });
            ng.procesoSubidaImagen = function(data){
                var DATA = data;
                $preload.show();
                $http.post(URL + URLOADIMGPHOTO, DATA, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined} /* multipart/form-data */
                }).
                success(function(data) {
                    var data = data;
                    var response = data.response;
                    var _model = ng._imgModel;
                    if(_model === 'url_1020x51'){
                        ng.temas.personalidad.imagenes.url_1020x51 = (response)?response[0].url:'';
                    }else if(_model === 'url_694x242'){
                        ng.temas.personalidad.imagenes.url_694x242 = (response)?response[0].url:'';
                    }else if(_model === 'url_logo_tag'){
                        ng.temas.personalidad.imagenes.url_logo_tag = (response)?response[0].url:'';
                    }else if(_model === 'url_1020x65'){
                         ng.temas.personalidad.sitios[0].tag_especial.url_1020x65 = (response)?response[0].url:'';
                    }else{
                        ng.temas[_model].url = (response)?response[0].url:'';
                    }
                    $preload.hide();
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                    $preload.hide();
                });
            };

            //END FUNCTIONS
        };

        //REMOVER IMAGEN
        ng.removerImagen = function($event, model){
            var _model = model;
            if(_model === 'url_1020x51'){
                ng.temas.personalidad.imagenes.url_1020x51 = '';
            }else if(_model === 'url_694x242'){
                ng.temas.personalidad.imagenes.url_694x242 = '';
            }else if(_model === 'url_logo_tag'){
                ng.temas.personalidad.imagenes.url_logo_tag = '';
            }else if(_model === 'url_1020x65'){
                ng.temas.personalidad.sitios[0].tag_especial.url_1020x65 = '';
            }else{
                ng.temas[_model].url = '';
            }
        };

        //MARK TAG SPECIAL
        //ng.changeTagEspecial = function(type){
        //    var type = type;
        //    if(ng.temas.personalidad.sitios[type].tag_especial.activo){
        //        ng.temas.personalidad.sitios[type].model = true;
        //    }
        //};
    }
]);

});
