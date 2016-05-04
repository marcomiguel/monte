'use strict';

define(['app'], function (app) {

app.register.controller('agregarVideoCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$document',
    '$location',
    '$preload',
    '$mdDialog',
    '$mdToast',
    '$timeout',
    '$msj',
    '$localStorage',
    '$login',
    '$logout',
    '$routeParams',
    '$cacheService',
    '$route',
    '$bytesToSize',
    function(
        $scope,
        $rootScope,
        $http,
        $document,
        $location,
        $preload,
        $mdDialog,
        $mdToast,
        $timeout,
        $msj,
        $localStorage,
        $login,
        $logout,
        $routeParams,
        $cacheService,
        $route,
        $bytesToSize
    ) {
        var ng = $scope,
            nid = $routeParams.nid,
            positionMSj = CMSDATA.POSITIONMSJ,
            URL = {
                base: CMSDATA.GLOBAL.URLBASE,
                sesion:'session',
                logout:'session/logout',
                upload:'eventos/subir_escudo/',
                equipo:{
                  detalle:'/eventos/leer_equipo/',
                  guardar:'/eventos/guardar_equipo/'
                }
            };

        // ---- INICIO SESION ---- // 
        ng.user = { pictureUrl: false };

        var rechazarSesion = function(){
            $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
            delete $localStorage.login;
            $preload.hide();
            $location.path('/');
        };

        var verificarSesion = function(){
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
                  rechazarSesion();
              }
            );
        };

        // ---- FIN SESION ---- //
            
        // ---- INICIO DETALLE ---- //
        var obtenerDetalle = function(){
            $preload.show();
            $login.get(URL.base + URL.equipo.detalle+nid).then(
              function(response) {
                var data=response.response;
                if(response.status){
                  if(data){ // evento existe
                    inicializarObjetos();
                    
                    $preload.hide();
                  }else{
                    $location.path('/eventos/equipos');
                  }
                }else{
                            
                }
              },
              function(msgError) {
                
              }
            );
        };

        var verificarDetalle = function(){
            if(nid){ // EDITAR
              obtenerDetalle(nid);
            }else{ // AGREGAR
              inicializarObjetos();            }
        };

        var inicializarObjetos = function(){
            
        };

        ng.redessociales = {
            msj : '',
            video_url : '',
            url : '', 
            titulo: '',
            descripcion: '',
            datePublish : null,
            timePublish : null,
            accounts : {
                facebook: { groups: [], pages: [] }
                // twitter: { groups: [], pages: [] },
                // google: { groups: [], pages: [] }
            },
            preload: true,
            postReady : false,
            postError : {
                status : false,
                message : ''
            }
        };

        ng.redessocialesTW = {
            msj : '',
            video_url : '',
            // url : '', 
            // titulo: '',
            descripcion: '',
            datePublish : null,
            timePublish : null,
            accounts : {
                // facebook: { groups: [], pages: [] },
                twitter: { groups: [], pages: [] }
                // google: { groups: [], pages: [] }
            },
            preload: true,
            postReady : false,
            postError : {
                status : false,
                message : ''
            }
        };

        //LEER
        $http.get(URL.base + 'redessociales').
            success(function(data) {
                var data = data;
                if(data.status){
                    var response = data.response;
                    //ng.redessociales.accounts = (response)?response:[];
                    ng.redessociales.accounts.facebook = (response.facebook)?response.facebook:{ groups: [], pages: [] };
                    ng.redessocialesTW.accounts.twitter = (response.twitter)?response.twitter:{ groups: [], pages: [] };
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

        ng.isProgramFB = false;
        ng.programPost = function($event){
            ng.isProgramFB = ng.isProgramFB === false ? true: false;
        };

        ng.insertRSActive = function($event, page, $index, type, parentIndex, redsocial){
            var page = page, $index = $index, type = type, parentIndex = parentIndex, redsocial = redsocial;
            if (redsocial == 'facebook') {
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
            }else if (redsocial == 'twitter'){
                ng.redessocialesTW.accounts[redsocial][type][$index].active = (ng.redessocialesTW.accounts[redsocial][type][$index].active === false)?true:false;
                ng.redessocialesTW.postReady = false;    
            }
        };

        ng.isChooseVideo = false;
        ng.isChooseVideoTW = false;
        ng.chooseVideo = function($event){
            ng.isChooseVideo = ng.isChooseVideo === false ? true: false;
        };
        ng.chooseVideoTW = function($event){
            ng.isChooseVideoTW = ng.isChooseVideoTW === false ? true: false;
        };

        var postear = function(post, rs){
            $http.post(URL.base + 'redessociales/publicar_multimedia', post).
            success(function(data) {
                var data = data;
                if(data.status){
                    $preload.hide();
                    if (rs == 'fb'){
                        $msj.show('Publicación en Facebook correcta.', positionMSj);
                        ng.redessociales.msj = '';
                        ng.redessociales.postReady = false;
                        ng.redessociales.postError.status = false;
                        ng.redessociales.postError.message = '';
                    }else if (rs == 'tw'){
                        $msj.show('Publicación en Twitter correcta.', positionMSj);
                        ng.redessocialesTW.msj = '';
                        ng.redessocialesTW.postReady = false;
                        ng.redessocialesTW.postError.status = false;
                        ng.redessocialesTW.postError.message = '';    
                    }
                }else{
                    var msjErr = (data.error.message)?data.error.message:'Ocurrio un error.';
                    if (rs == 'fb'){
                        ng.redessociales.postError.message = msjErr;
                        ng.redessociales.postError.status = true;
                    }else if (rs == 'tw'){
                        ng.redessocialesTW.postError.message = msjErr;
                        ng.redessocialesTW.postError.status = true;    
                    }
                    $msj.show(msjErr, CMSDATA.POSITIONMSJ);
                }
                $preload.hide();
            }).error(function(err) {
                $preload.hide();
                if (rs == 'fb'){
                    ng.redessociales.postError.status = false;
                }else if (rs == 'tw'){
                    ng.redessocialesTW.postError.status = false;
                }
                $msj.show('Ocurrio un error.',CMSDATA.POSITIONMSJ);
            });
        };

        ng.isAccountsFB = true;
        ng.sendPost = function($event, rs){
            $preload.show();

            if(rs == 'fb'){
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
                
                //DATA
                ng.redessociales.postReady = false;
                ng.redessociales.postError.status = false;
                ng.redessociales.postError.message = '';
                ng.redessociales.datePublish = (ng.isProgramFB)?angular.copy(ng.dateTimeRS.date).getTime():null;
                ng.redessociales.timePublish = (ng.isProgramFB)?angular.copy(ng.dateTimeRS.time).getTime():null;
                var DATA = angular.copy(ng.redessociales);
                if(!keppPage || !keppGroups){
                    postear(DATA, rs);
                }else{
                    $preload.hide();
                    ng.redessociales.postReady = true;
                }
            }else if(rs == 'tw'){
                //Review Checks Pages and Groups
                var keppTW = true;
                for (var i = 0; i < ng.redessocialesTW.accounts.twitter.pages.length; i++) {
                    if(keppTW === true){
                        if(ng.redessocialesTW.accounts.twitter.pages[i].active === true){
                            keppTW = false;
                        }
                    }
                }
                //DATA
                ng.redessocialesTW.postReady = false;
                ng.redessocialesTW.postError.status = false;
                ng.redessocialesTW.postError.message = '';
                ng.redessocialesTW.datePublish = (ng.isProgramFB)?angular.copy(ng.dateTimeRS.date).getTime():null;
                ng.redessocialesTW.timePublish = (ng.isProgramFB)?angular.copy(ng.dateTimeRS.time).getTime():null;
                var data = angular.copy(ng.redessocialesTW);
                if(!keppTW){
                    postear(data, rs);
                }else{
                    $preload.hide();
                    ng.redessocialesTW.postReady = true;
                }
            }

        };

        var objFileVideo = {};

        ng.changeVideo = function(element, event, rs){
            var arrClassBtns = [
                '.video_done',
                '.video_remove'
            ];

            var onlyBtnRemove = function(elm, arr){
                var elm = elm, arr = arr;
                for (var i = 0; i < arr.length; i++) {
                    elm.querySelector(arr[i].classCSS).style.display = (arr[i].displayCSS)?'inline-block':'none';
                }
            };

            var file = element.files[0];
            var size = file.size;
            var videoGMG = ($bytesToSize.convert(size)).split(' ');
            var isVideoGood = parseFloat(videoGMG[0]);
            var typeVideoLoad = videoGMG[1];
            var msjVideoLoad = (rs == 'fb') ? angular.element('#msjVideoLoad') : angular.element('#msjVideoLoadTW') ;
            if(typeVideoLoad === 'Bytes' || typeVideoLoad === 'KB'){
                msjVideoLoad.addClass('ng-hide');
            }else if(typeVideoLoad === 'MB'){
                if(isVideoGood > parseFloat(CMSDATA.VIDEOLOAD)){
                    msjVideoLoad.removeClass('ng-hide');
                }else{
                    msjVideoLoad.addClass('ng-hide');
                }
            }else if(typeVideoLoad === 'GB' || typeVideoLoad === 'TB'){
                msjVideoLoad.removeClass('ng-hide');
            }
            var type = file.type;
            var val = element.value;
            // angular.element(elm).find('.output').show();
            if(val != ''){

                var videoPlayer = (rs == 'fb') ? document.getElementById('videoPlayer') : document.getElementById('videoPlayerTW');
                videoPlayer.style.display = 'block';

                var videoOptions = (rs == 'fb') ? document.getElementById('videoOptions') : document.getElementById('videoOptionsTW');
                onlyBtnRemove(videoOptions, [
                    {
                        classCSS : arrClassBtns[0],
                        displayCSS : true
                    },{
                        classCSS : arrClassBtns[1],
                        displayCSS : true
                    }
                ]);

                var file = element.files[0];

                objFileVideo = file;

                var type = file.type;
                var URL = window.URL || window.webkitURL;
                var fileURL = URL.createObjectURL(file);

                videoPlayer.src = fileURL;
                videoPlayer.play();
                // $('#videoOptions').find('.video_done').attr('disabled', 'disabled');
                // ng.getSetData('', '', videoPlayer.duration);
            }
        };

        ng.uploadVideo = function(rs){
            var formdata = new FormData();
            formdata.append('file', objFileVideo);
            // formdata.append('file_cover', $('#videoPlayer').siblings('.output').find('.outputBig img').attr('src'));
            formdata.append('file_cover', '');
            var DATA = formdata;
            var videoPlayer = (rs == 'fb') ? document.getElementById('videoPlayer') : document.getElementById('videoPlayerTW');
            videoPlayer.pause();

            $preload.show();
            $http.post(CMSDATA.URLELEMENTS, DATA, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined} /* multipart/form-data */
            }).
            success(function(data) {
                var data = data;
                if(data.status){
                    videoPlayer.src = '';
                    videoPlayer.poster = '';

                    ng.removeVideo('ajax', data.response);

                    //Insert Datos Video
                    var urlVideo = data.response.url,
                    urlCover = '',
                    hash = data.response.name;
                    var duration = videoPlayer.duration
                    // ng.getSetData(urlVideo, urlCover, duration, hash, true);
                    //Insert Datos Video
                    if(rs == 'fb'){
                        ng.redessociales.video_url = data.response.url;    
                    }else if (rs == 'tw') {
                        ng.redessocialesTW.video_url = data.response.url;   
                    }
                    
                    // $('#output').html('');
                    // $('#outputBig').html('');
                    $preload.hide();
                }else{
                    ng.getSetData('', '', '', '');
                    $preload.hide();
                    $msj.show(data.error.message, positionMSj);
                }
            }).error(function(data) {
                ng.getSetData('', '', '', '');
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ14, positionMSj);
            });
        };

        ng.removeVideo = function(type, data, rs) {
            // if(type_edit){ng.imgOutEditShow = true;}
            // else{ng.imgOutEditShow = false;}
            var inputVideo = (rs == 'fb')? $('#inputVideo') : $('#inputVideoTW');
            inputVideo.val('');
            var msjVideoLoad = (rs == 'fb')? angular.element('#msjVideoLoad') : angular.element('#msjVideoLoadTW');
            msjVideoLoad.addClass('ng-hide');
            var videoPlayer = (rs == 'fb') ? document.getElementById('videoPlayer') : document.getElementById('videoPlayerTW');
            var videoOptions = (rs == 'fb') ? document.getElementById('videoOptions') : document.getElementById('videoOptionsTW');
            videoPlayer.src = '';
            videoPlayer.poster = '';

            var arrClassBtns = [
                '.video_done',
                '.video_remove'
            ];

            var onlyBtnRemove = function(elm, arr){
                var elm = elm, arr = arr;
                for (var i = 0; i < arr.length; i++) {
                    elm.querySelector(arr[i].classCSS).style.display = (arr[i].displayCSS)?'inline-block':'none';
                }
            };

            if(type === 'ajax'){
                var DATA = data;
                onlyBtnRemove(videoOptions, [{
                    classCSS : arrClassBtns[0],
                    displayCSS: false
                },{
                    classCSS : arrClassBtns[1],
                    //displayCSS: (type_edit)?false:true
                    displayCSS: false
                }
                ]);
                videoPlayer.poster = DATA.url_cover;
                videoPlayer.src = DATA.url;
                videoPlayer.pause();
                // angular.element(elm).find('.output').hide();
            }else{
                onlyBtnRemove(videoOptions, [{
                    classCSS : arrClassBtns[0],
                    displayCSS: false
                },{
                    classCSS : arrClassBtns[1],
                    displayCSS: false
                }
                ]);
                videoPlayer.style.display = 'none';

                // $('#output').html('');
                // $('#outputBig').html('');
                // angular.element(elm).find('.output').show();
            }
        };

        // ---- FIN DETALLE ---- //

        ng.clicVolver = function(){ $location.path('/redessociales/videos'); };

    }
]);

});
