// Controller : Create News

// 'use strict';

define(['app'], function (app) {

app.register.controller('audiosCtrl', [
    '$scope',
    '$http',
    '$location',
    '$preload',
    '$mdDialog', 
    '$mdToast',
    '$timeout',
    '$create',
    '$msj',
    '$scrollGo',
    '$localStorage',
    '$login',
    '$logout',
    '$cacheService',
    '$rootScope',
    '$bytesToSize',
    function(
        $scope,
        $http,
        $location,
        $preload,
        $mdDialog,
        $mdToast,
        $timeout,
        $create,
        $msj,
        $scrollGo,
        $localStorage,
        $login,
        $logout,
        $cacheService,
        $rootScope,
        $bytesToSize
    ) {
        var ng = $scope;

        //GLOBALS
        var URL = CMSDATA.GLOBAL.URLBASE,
            URLVIEW = CMSDATA.GLOBAL.URLVIEW,
            URLLIST = 'listado.html',
            URLLOGIN = 'login.html',
            URLSESSION = 'session',
            URLPREVIEWDETACADA = 'noticias/vistapreviadestacada',
            URLCLOSESESSION = 'session/logout',
            URLLISTSITE = 'sitio',
            URLLISTSITELIST = 'sitio/list',
            URLOADIMG = 'noticias/cargarimagen',
            URLVALIDPUBLISH = 'noticias/validar',
            URLMULTIMEDIA = 'elementos/index/',
            URLOADIMGARCHIVE = 'elementos/upload',
            URLOADIMGPHOTO = 'elementos/upload/photo',
            UPDATEDATAPHOTO = 'elementos/actualizar',
            URLLISTAUTHOR = 'user',
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

        //Review Session
        $preload.show();
        $login.get(URL + URLSESSION).then(
            function(data) {
                var data = data;
                if (data.status) {
                    ng.initList(data);
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

        //Close Session
        ng.closeSession = function() {
            $logout.get(URL + URLCLOSESESSION);
        };

        /* LISTA SITIO */
        ng.sitios = [];
        ng.sitio = undefined; //Bar Tool
        ng.listaSitios = function() {
            //Sitios
            $cacheService.get(URL + URLLISTSITELIST)
                .then(
                    function(data) {
                        var data = data;
                        if (data.status) {
                            //SITE
                            ng.sitios = data.response;
                            //SET 1er ITEM
                            //TODOS/ng.sitio = ng.sitios[0]; //RPP
                            //TRAE NOTICIAS DE LA PLANTILLA
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

        /* LISTA AUTORES */
        ng.autor = undefined;
        ng.autores = [];
        ng.listaAutores = function() {
            //AUTHOR
            $cacheService.get(URL + URLLISTAUTHOR)
            .then(
                function (data) {
                    var data = data;
                    if(data.status){
                        ng.autores = data.response;
                        //TODOS/ng.autor = ng.autores[0];
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ16,positionMSj);
                    }
                },
                function(msgError) {
                    $msj.show(CMSDATA.MSJ.MSJ16,positionMSj);
                }
            );
        };
        ng.listaAutores();
        /* END LISTA AUTORES */

        /* Lista Extensiones */
        ng.extensiones = $cacheService.getPhotos();
        ng.extension = ng.extensiones[0];
        /* Fin Lista Extensiones */

        /*
        @init Vars
        */
        ng.multimedias = [];
        /*
        @init Functions
        */
        //INIT FNC
        ng.initList = function(data) {
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

            ng.returnSize = function(size){
                return $bytesToSize.convert(size);
            };

            //ng.desde = (new Date()).adjustDate(-365); //-365 DAYs
            //ng.hasta = CMSDATA.FILTER.hasta;
            ng.desde = undefined;
            ng.hasta = undefined;
            ng.query = '';

            /* Init Vars */
            var refreshObj = function(){
                ng.newsObj = {
                    tipo: 'audio',
                    extension: ng.extension,
                    sitio: ng.sitio,
                    desde: (ng.desde)?ng.desde.getTime():'',
                    hasta: (ng.hasta)?ng.hasta.getTime():'',
                    query: ng.query,
                    tag: '',
                    cursor: ''
                };
            };

            //FOTOS
            //INFINITE SCROLL LIST
            ng.newsBusy = false;
            ng.newsAfter = '';
            ng.msjBusy = false;
            //Click Guardar
            ng.obtenerMultimedia = function($event, tipo, nuevo) {
                var $event = $event, tipo = tipo, nuevo = nuevo;
                if (ng.newsBusy) return;
                ng.newsBusy = true;
                ng.msjBusy = false;
                refreshObj();
                var DATA = ng.newsObj;
                //if(tipo != 'infinite'){
                //    $preload.show();
                //}
                if(tipo === 'reload'){
                    $rootScope.$broadcast('masonry.reload');
                }
                $http.post(URL + URLMULTIMEDIA + 'audio?cursor=' + ng.newsAfter, DATA).
                success(function(data) {
                    var data = data;
                    if (data.status) {
                        var response = data.response;
                        if(tipo != 'infinite'){
                            ng.multimedias = response.items;
                            $preload.hide();
                        }else{
                            var items = response.items;
                            for (var i = 0; i < items.length; i++) {
                                ng.multimedias.push(items[i]);
                            }
                        }
                        ng.newsAfter = response.cursor;
                        ng.newsBusy = false;
                        msjBusy = false;

                        if(nuevo === 'nuevo'){
                            var elm = angular.element('#img0');
                            elm.parent().addClass('blink')
                            $timeout(function(){
                                elm.parent().removeClass('blink');
                            },10000);
                        }
                    } else {
                        $msj.show(CMSDATA.MSJ.MSJ51,positionMSj);
                        ng.newsBusy = false;
                        ng.msjBusy = true;
                        //if(tipo != 'infinite'){
                        //$preload.hide();
                        //}
                    }
                }).error(function(data) {
                    if(tipo != 'infinite'){
                    $preload.hide();
                    }
                    ng.newsBusy = false;
                    $msj.show(CMSDATA.MSJ.MSJ51, positionMSj);
                    ng.msjBusy = true;
                });
            };
            ng.obtenerMultimedia();

            ng.newsNextPage = function() {
                ng.obtenerMultimedia(undefined, 'infinite');
            };

            ng.buscarMultimediaFiltro = function($event, nuevo){
                ng.newsBusy = false;
                ng.newsAfter = '';
                ng.msjBusy = false;
                ng.multimedias = [];
                var nuevo = (nuevo)?nuevo:undefined;

                ng.formOptionSearch = false;
                ng.layerSearch = false;
                ng.custom = true;

                ng.obtenerMultimedia(undefined, 'reload', nuevo);
            };

            ng.changeMultimediaFiltro = function($event){
                var $event = $event;
                if($event.which === 13) {
                    ng.newsBusy = false;
                    ng.newsAfter = '';
                    ng.msjBusy = false;
                    ng.multimedias = [];

                    ng.formOptionSearch = false;
                    ng.layerSearch = false;
                    ng.custom = true;

                    ng.obtenerMultimedia(undefined, 'reload');
                }

            };

            ng.clickChipLegend = function(param){
                var param = param;
                if(param === 'desde'){
                    ng.desde = undefined;
                }else if(param === 'hasta'){
                    ng.hasta = undefined;
                }else if(param === 'sitio'){
                    ng.sitio = undefined;
                }else if(param === 'autor'){
                    ng.autor = undefined;
                }else if(param === 'extension'){
                    ng.extension = ng.extensiones[0];
                }else if(param === 'query'){
                    ng.query = '';
                };
                ng.buscarMultimediaFiltro(undefined);
            };

            ng.abrirDetalle = function($event, modal, indice){
                var $event = $event, modal = modal, indice = indice;
                $mdDialog.show({
                    targetEvent: $event,
                    templateUrl: CMSDATA.GLOBAL.URLTEMPLATE + 'modal/audios/detail.html',
                    controller: modalOpenDetailCtrl,
                    locals : {
                        modal : modal,
                        indice : indice
                    }
                })
                .then(function() {

                }, function() {
                    $mdDialog.cancel();
                });
            };
            function modalOpenDetailCtrl(scope, modal, indice, $bytesToSize) {
                console.log(modal, 'modal');
                scope.indice = indice;
                scope.modal = angular.copy(modal);
                if(scope.modal.hasOwnProperty('filesize')){
                    scope.filesize = (scope.modal.filesize)?$bytesToSize.convert(scope.modal.filesize):undefined;
                }else{
                    scope.filesize = undefined;
                }
                //CLOSE
                scope.closeOpenDetailPhoto = function() {
                    try {
                        jwplayer(modal._id).pause(true);
                    }catch(err){}
                    $mdDialog.cancel();
                };
                scope.updateOpenDetailPhoto = function() {
                    $preload.show();
                    var DATA = scope.modal;
                    DATA.name = '';
                    $http.post(URL + UPDATEDATAPHOTO, DATA).
                    success(function(data) {
                        var data = data;
                        if (data.status) {
                            var response = data.response;
                            console.log(scope.indice, 'scope.indice');
                            ng.multimedias[scope.indice].titulo = scope.modal.titulo;
                            ng.multimedias[scope.indice].descripcion = scope.modal.descripcion;
                            $mdDialog.hide();
                            $preload.hide();
                            $msj.show(CMSDATA.MSJ.MSJ57,positionMSj);
                        } else {
                            $mdDialog.hide();
                            $preload.hide();
                            $msj.show(CMSDATA.MSJ.MSJ58,positionMSj);

                        }
                    }).error(function(data) {
                        $mdDialog.hide();
                        $preload.hide();
                        $msj.show(CMSDATA.MSJ.MSJ58, positionMSj);
                    });
                    try {
                        jwplayer(modal._id).pause(true);
                    }catch(err){}
                };
                scope.setupVar = {
                    autostart: false,
                    id : modal._id,
                    file : modal.url,
                    width: CMSDATA.DIMENSION16x9.widthLarge,
                    height:CMSDATA.DIMENSION16x9.heightLarge,
                    image : modal.url_zoom,
                    skin : {
                        name: 'bekle'
                    }
                };
            };
        };

        //Agregar Photo
        //OPEN PHOTO
        //OPEN GALLERY PHOTO
        var elmFile = angular.element('#inputFileTrigger');
        elmFile.val('');
        elmFile.bind('change', function(){
            ng.$apply(function(){
                var files = elmFile[0].files; //FILES UPLOAD
                loadPhoto(files);
            });
        });
        //CHANGE INPUT FILE
        var loadPhoto = function(files){
            var files = files;
            var formdata = new FormData();
            angular.forEach(files, function(v,i){
                formdata.append('file_' + i, files[i]);
            });
            var DATA = formdata;
            $preload.show();
            $http.post(URL + URLOADIMGPHOTO, DATA, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined} /* multipart/form-data */
            }).
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response?data.response:[];
                    if(angular.isArray([response])){
                        angular.forEach(response, function(v,i){
                            if(response[i]){
                                ng.multimedias.unshift(response[i]);
                            }
                        });
                    }else{
                        ng.multimedias.unshift(response);
                    }
                    $timeout(function(){
                        $rootScope.$broadcast('masonry.reload');
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
        ng.ADDPHOTOTRANSFER = undefined;
        ng.agregarMultimedia = function($event, type){
            var $event = $event, type = type;
            if(type === 'foto'){
                var extension = type;
                ng.newsBusy = false;
                ng.newsAfter = '';
                ng.msjBusy = false;
                $mdDialog.show({
                    targetEvent : $event,
                    templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/fotos/openaddphoto.html',
                    controller : modalOpenAddPhotoCtrl
                })
                .then(function() {
                    if(ng.ADDPHOTOTRANSFER){
                        ng.newsAfter = '';
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ35,'top right');
                    }
                }, function() {
                    $mdDialog.cancel();
                });
            }else if(type === 'multiple'){
                var elmFile = angular.element('#inputFileTrigger');
                elmFile.val('');
                elmFile.click();
            }
        };
        function modalOpenAddPhotoCtrl(scope, $mdDialog, $create, $timeout) {
            //INIt CONFIG
            var elm = angular.element('#add-img--cover');
            ng.showThumbData = false;
            ng.isDeleteThumb = false;
            scope.uploadCaptureImage = function(){
                var elm = angular.element('#add-img--cover');
                var thumbData = elm.find('.loadThumbData');
                elm.val('');
                thumbData.click();
                elm.find('.loadThumbData').off('change').on('change', function(evt){
                    var file = evt.currentTarget.files[0];
                    var formdata = new FormData();
                    formdata.append('file', file);
                    var _data = {
                        titulo : scope.titulo,
                        descripcion : scope.descripcion,
                        fuente : scope.fuente,
                        fotografo : scope.fotografo,
                        tags : scope.tags
                    };
                    formdata.append('data', JSON.stringify(_data));
                    var DATA = formdata;
                    scope.addOpenAddPhoto(DATA, _data);
                });
            };
            scope.removeCaptureImage = function(){
                scope.srcThumbData = '';
                angular.element('#zone-img--youtube img').attr('src', '');
                scope.showThumbData = false;
                ng.isDeleteThumb = false;
            }

            //CLEAR ADD
            scope.foto = '';

            //Keywords Photos
            scope.titulo = '';
            scope.descripcion = '';
            scope.fuente = '';
            scope.fotografo = '';
            scope.tags = [];
            scope.tagsOnAppendPhoto = function(chip) {
                return {
                    nombre: chip,
                    slug: 'SLUG'
                };
            };
            //CLOSE
            scope.closeOpenAddPhoto = function(){
                $mdDialog.cancel();
            };
            scope.addOpenAddPhoto = function(data, _data){
                if(scope.descripcion.length <= 0){
                    $msj.show(CMSDATA.MSJ.MSJ55,'top right');
                }else{
                    //PHOTO NORMAL
                    var DATA = data;
                    ng.ADDPHOTOTRANSFER = _data;
                    /* Img */
                    $preload.show();
                    $http.post(URL + URLOADIMGPHOTO, DATA, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined} /* multipart/form-data */
                    }).
                    success(function(data) {
                        var data = data;
                        if(data.status){
                            var response = data.response;
                            var url = response.url;
                            ng.showThumbData = true;
                            ng.isDeleteThumb = true;
                            ng.srcThumbData = url;
                            $rootScope.$broadcast('masonry.reload');
                            $timeout(function () {
                                $scrollGo.go('#bodyAddsNews');
                                var _imgData = response;
                                console.log(_imgData, '_imgData');
                                if(angular.isArray([_imgData])){
                                    ng.multimedias.unshift(_imgData[0]);
                                }else{
                                    ng.multimedias.unshift(_imgData);
                                }
                                //ng.buscarMultimediaFiltro(undefined, 'nuevo');
                                $msj.show(CMSDATA.MSJ.MSJ56, positionMSj);
                                $mdDialog.hide();
                                $preload.hide();
                            }, 5000);
                        }else{
                            $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                            $preload.hide();
                        }
                    }).error(function(data) {
                        $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                        $preload.hide();
                    });
                    /* /Img */
                }
            };
        };

    }
]);

});
