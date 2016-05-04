//HTML5 UPLOAD IMAGE
app.directive('html5uploadimage', function($timeout) {
  return {
    restrict: 'EA',
    scope: {
        widthImage:'@',
        heightImage:'@',
        resize:'@',
        url:'@',
        ajax:'@',
        originalsize:'@',
        image:'@',
        editstart:'@',
        reset:'='
    },
    //replace: true,
    //template: '<div class="dropzone" style="width:{{width}};height:{{height}}"><input type="file" name="thumb" /></div>',
    link: function (scope, element, attrs) {
        var objInit = {
            width : attrs.widthImage,
            height : attrs.heightImage,
            //editstart : attrs.editstart,
            //resize : true,
            ajax : attrs.ajax,
            //url : CMSDATA.URLELEMENTS,
            //data : { },
            onAfterProcessImage: function() {
                var thumb_values_edit = angular.element('input[name="thumb_values_edit"]'),
                thumb_values = angular.element('input[name="thumb_values"]');
                thumb_values_edit.data('json', thumb_values.data('json'));
                var json = angular.fromJson(thumb_values.data('json'));
                scope.$emit('objimagen', json);
        	},
        	onAfterCancel: function() {
                var thumb_values_edit = angular.element('input[name="thumb_values_edit"]');
                thumb_values_edit.data('json', '');
                scope.$emit('objimagen', undefined);
        	}
        };
        var htmlDirective = '<div class="dropzone"><input type="file" name="thumb" /></div>';
        //Init
        var elm = angular.element(element);
        elm.html('').html(htmlDirective);
        elm.children('.dropzone').html5imageupload(objInit);
        //Observe
        scope.$watch('reset', function(newValue, oldValue) {
            if(newValue != oldValue){
                objInit.width = attrs.widthImage;
                objInit.height = attrs.heightImage;
                objInit.ajax = attrs.ajax;
                if(attrs.image != '' || attrs.image != ' '){
                    //objInit.originalsize = attrs.originalsize;
                    objInit.image = attrs.image;
                    //objInit.editstart = attrs.editstart;
                }else{
                    delete objInit['originalsize'];
                    delete objInit['image'];
                    //delete objInit['editstart'];
                }
                elm.html('').html(htmlDirective);
                elm.children('.dropzone').html5imageupload(objInit);
            }
        });
    }
  };
});

//HTML5 UPLOAD IMAGE CROPEO
app.directive('html5uploadimagecropeo', function($timeout) {
  return {
    restrict: 'EA',
    scope: {
        widthImage:'@',
        heightImage:'@',
        resize:'@',
        url:'@',
        ajax:'@',
        originalsize:'@',
        image:'@',
        editstart:'@',
        reset:'=',
        dimensionsonly:'@'
    },
    link: function (scope, element, attrs) {
        var objInit = {
            width : attrs.widthImage,
            height : attrs.heightImage,
            editstart : true,
            dimensionsonly: true,
            originalsize : true,
            image : attrs.image,
            //resize : true,
            ajax : attrs.ajax,
            //url : CMSDATA.URLELEMENTS,
            //data : { },
            onAfterProcessImage: function() {
                var thumb_values_edit = angular.element('input[name="thumb_values_edit"]'),
                thumb_values = angular.element('input[name="thumb_values"]');
                thumb_values_edit.data('json', thumb_values.data('json'));
                var json = angular.fromJson(thumb_values.data('json'));
                scope.$emit('objimagen', json);
        	},
        	onAfterCancel: function() {
                var thumb_values_edit = angular.element('input[name="thumb_values_edit"]');
                thumb_values_edit.data('json', '');
                scope.$emit('objimagen', undefined);
        	}
        };
        var htmlDirective = '<div class="dropzone"><input type="file" name="thumb" /></div>';
        //Init
        var elm = angular.element(element);
        elm.html('').html(htmlDirective);

        elm.children('.dropzone').html5imageupload(objInit);
        //Observe
        scope.$watch('reset', function(newValue, oldValue) {
            if(newValue != oldValue){
                objInit.width = attrs.widthImage;
                objInit.height = attrs.heightImage;
                objInit.ajax = attrs.ajax;
                if(attrs.image != '' || attrs.image != ' '){
                    objInit.originalsize = true;
                    objInit.image = attrs.image;
                    objInit.editstart = true;
                }else{
                    delete objInit['originalsize'];
                    delete objInit['image'];
                    //delete objInit['editstart'];
                }
                elm.html('').html(htmlDirective);
                elm.children('.dropzone').html5imageupload(objInit);
            }
        });
    }
  };
});

//Render video youtube
app.directive('youtube', function($sce, $mdDialog) {
  return {
    restrict: 'EA',
    scope: { code:'@', autoplay:'@', timestamp:'@', id:'@' },
    replace: true,
    template: '<iframe width="560" height="315" src="{{url}}" frameborder="0" allowfullscreen></iframe>',
    link: function (scope, element, attrs) {
        //Video Youtube
        attrs.$observe('code',function(val){
            if (val) {
                var _id = (attrs.id)?attrs.id:'',
                _timestamp = (attrs.timestamp)?'&start=' + attrs.timestamp:'',
                _autoplay = (attrs.autoplay)?'&autoplay=' + (attrs.autoplay):'';
                scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' +  _id + '?rel=0' + _timestamp + _autoplay);
            }else{
                scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/undefined');
            }
        });
    }
  };
});
//Upload Video
app.directive('uploadvideo', function($preload,$http,$msj, $timeout, $bytesToSize) {
    return {
        restrict: 'EA',
        scope: { widthVideo:'@', heightVideo:'@', reset:'=', jsonRefresh:'=' },
        replace: true,
        template: '<div>'+
        '<div class="alert-warn ng-hide" id="msjVideoLoad"><ul style="paddgin:0;margin:0">'+
        '<li>'+ CMSDATA.VIDEOLOADMSJ.MSJ1 +'</li>'+
        '<li>'+ CMSDATA.VIDEOLOADMSJ.MSJ2 +'</li>'+
        '</ul></div>'+
        '<div class="dropzonevideo" style="width:573px; height:322px">' +
            '<input class="inputVideo" id="inputVideo" accept="video/mp4" ng-model="video" onchange="angular.element(this).scope().changeVideo(this, event)" type="file" name="thumbvideo" />'+
            '<video style="width:573px; height:322px; display:none;" class="videoPlayer" id="videoPlayer" controls autoplay></video>'+
            '<div class="videoOptions" id="videoOptions" style="text-align:right;">'+
                '<button type="button" style="display:none;position:absolute;left:103%;top:0;z-index:2;" id="btnUploadCaptureEdit" class="video_upload_capture_edit md-fab md-mini md-button md-primary md-default-theme" aria-label="Upload Capture" ng-click="uploadCaptureImage()"><img src="./svg/plus24.svg" width="21" height="21px" /><md-tooltip>Agregar imagen de cover</md-tooltip></button>'+
                '<button type="button" style="display:none;" id="btnUploadCapture" class="video_upload_capture md-fab md-mini md-button md-primary md-default-theme" aria-label="Upload Capture" ng-click="uploadCaptureImage()"><img src="./svg/plus24.svg" width="21" height="21px" /><md-tooltip>Agregar imagen de cover</md-tooltip></button>'+
                '<button type="button" style="display:none;" class="video_capture md-fab md-mini md-button md-primary md-default-theme" aria-label="Capture" ng-click="captureImage()"><img src="./svg/photo_camera.svg" width="24" height="24px" /><md-tooltip>Capturar imagen</md-tooltip></button>'+
                '<button type="button" style="display:none;" class="video_remove md-fab md-mini md-button md-warn md-default-theme" aria-label="Cancelar" ng-click="removeVideo(undefined, {})"><img src="./svg/delete82.svg" width="24" height="24px" /><md-tooltip>Remover video</md-tooltip></button>'+
                '<button type="button" disabled style="display:none;" class="video_done md-fab md-mini md-button md-cms-green md-default-theme" aria-label="Done" ng-click="uploadVideo()"><img src="./svg/done.svg" width="24" height="24px" /><md-tooltip>Agregar video e imagen</md-tooltip></button>'+
            '</div>'+
            '<div style="width:760px; min-height:322px; left:580px" class="output">'+
                '<ul id="output" class="outputThumb" style="height:322px; width:143px;">'+
                '</ul>'+
                '<div id="outputBig" class="outputBig">'+
                '</div>'+
            '</div>'+
            '<div ng-if="imgOutEditShow" style="position:absolute;right:auto;border:1px solid #ddd;overflow:hidden;top:0;background-color:#eee;width:612px;text-align:left;min-height:322px;left:580px">'+
                '<img ng-if="imgOutEdit.length>0" style="border:4px solid #43A047;float:left;" width="603" height="339" ng-src="{{imgOutEdit}}" alt="Imagen" />'+
                '<div ng-if="imgOutEdit.length<=0" class="alert-warn">No hay imagen de cover, debes agregar una imagen</div>'+
            '</div>'+
            '<input class="thumbData" type="hidden" data-json="" />'+
        '</div><input accept="image/x-png, image/png, image/jpeg, image/jpg" class="loadThumbData" type="file" style="position:absolute;left:10px;z-index:-1" /></div>',
        link: function (scope, element, attrs) {
            var ng = scope;

            //UPLOAD video
            ng.video = '';
            var elm = element;
            var wVideo = attrs.widthVideo;
            var hVideo = attrs.heightVideo;
            var objFileVideo = {};
            var positionMSj = 'top right';
            var arrClassBtns = [
                '.video_capture',
                '.video_done',
                '.video_remove',
                '.video_upload_capture',
                '.video_upload_capture_edit'
            ];
            ng.json = {
                url_video: '',
                url_video_cover: '',
                duracion: '',
                hash: '',
                flag: false
            };
            ng.imgOutEditShow = false;
            var onlyBtnRemove = function(elm, arr){
                var elm = elm, arr = arr;
                for (var i = 0; i < arr.length; i++) {
                    elm.querySelector(arr[i].classCSS).style.display = (arr[i].displayCSS)?'inline-block':'none';
                }
            };
            ng.captureImage = function() {
                var video, $output, canvas, scale = 0.25;

                video = $('.videoPlayer', '.dropzonevideo');
                canvas = $('<canvas/>').attr({
                    'width':wVideo,
                    'height':hVideo
                }).get(0);
                canvas.getContext('2d').drawImage(video.get(0), 0, 0, wVideo, hVideo);
                var dataURL = canvas.toDataURL();
                $outputBig = video.siblings('.output').find('.outputBig');
                $outputBig.html('').html('<img width="'+wVideo+'" height="'+hVideo+'" src="'+dataURL+'" />');

                $output = video.siblings('.output').find('.outputThumb');
                $output.prepend('<li><img width="'+wVideo+'" height="'+hVideo+'" src="'+dataURL+'" /><span></span><li/>');
                $output.find('li').removeClass('thumbFirst');
                $output.find('li:first').addClass('thumbFirst');

                var $outLi = $output.find('li');
                $outLi.click(function(e){
                    var t = $(this);
                    $outLi.removeClass('thumbFirst');
                    t.addClass('thumbFirst');
                    $outputBig.html('').html('<img width="'+wVideo+'" height="'+hVideo+'" src="'+t.find('img').attr('src')+'" />');
                });

                video.siblings('.videoOptions').find('.video_done').removeAttr('disabled');

            };
            ng.uploadCaptureImage = function(){
                if((document.querySelector('#add-video-modal video').src).length > 0){
                    //$timeout(function(){
                    var thumbData = elm.find('.loadThumbData');
                    thumbData.val('').trigger('click');
                    //},0);
                }else{
                    $msj.show(CMSDATA.MSJ.MSJ37, positionMSj);
                }
            };
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
                        if(angular.element('#btnUploadCaptureEdit').is(':visible')){
                            //EDIT UPLOAD IMAGE
                            var foto = (data.response[0])?data.response[0].foto:'';
                            var url = foto.url;
                            ng.imgOutEdit = url;
                            videoPlayer.poster = url;
                            var _close = function(){
                                $timeout(function(){
                                    $preload.hide();
                                    $msj.show(CMSDATA.MSJ.MSJ24, positionMSj);
                                },2000);
                            };
                            var urlVideo = videoPlayer.src, urlCover = url,
                            duration = '', hash = '';
                            ng.getSetData(urlVideo, urlCover, duration, hash, true, 'edit');
                            _close();
                        }else{
                            //UPLOAD IMAGE NORMAL
                            angular.element(elm).find('.output').show(); //EPA
                            var foto = (data.response[0])?data.response[0].foto:'';
                            var url = foto.url;
                            var video, $output, canvas, scale = 0.25;
                            video = $('.videoPlayer', '.dropzonevideo');
                            $outputBig = video.siblings('.output').find('.outputBig');
                            $outputBig.html('').html('<img width="'+wVideo+'" height="'+hVideo+'" src="'+url+'" />');
                            $output = video.siblings('.output').find('.outputThumb');
                            $output.prepend('<li><img width="'+wVideo+'" height="'+hVideo+'" src="'+url+'" /><span></span><li/>');
                            $output.find('li').removeClass('thumbFirst');
                            $output.find('li:first').addClass('thumbFirst');
                            var $outLi = $output.find('li');
                            $outLi.click(function(e){
                                var t = $(this);
                                $outLi.removeClass('thumbFirst');
                                t.addClass('thumbFirst');
                                $outputBig.html('').html('<img width="'+wVideo+'" height="'+hVideo+'" src="'+t.find('img').attr('src')+'" />');
                            });
                            video.siblings('.videoOptions').find('.video_done').removeAttr('disabled');
                            $preload.hide();
                        }
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                        $preload.hide();
                    }
                }).error(function(data) {
                    $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
                    $preload.hide();
                });
            });

            ng.removeVideo = function(type, data, type_edit) {
                if(type_edit){ng.imgOutEditShow = true;}
                else{ng.imgOutEditShow = false;}
                var inputVideo = $('#inputVideo');
                inputVideo.val('');
                var msjVideoLoad = angular.element('#msjVideoLoad');
                msjVideoLoad.addClass('ng-hide');
                var videoPlayer = document.getElementById('videoPlayer');
                var videoOptions = document.getElementById('videoOptions');
                videoPlayer.src = '';
                videoPlayer.poster = '';
                /*
                [
                    '.video_capture',
                    '.video_done',
                    '.video_remove',
                    '.video_upload_capture',
                    '.video_upload_capture_edit'
                ]
                */
                if(type === 'ajax'){
                    var DATA = data;
                    onlyBtnRemove(videoOptions, [{
                        classCSS : arrClassBtns[0],
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[1],
                        //displayCSS: (type_edit)?false:true
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[2],
                        displayCSS: true
                    },{
                        classCSS : arrClassBtns[3],
                        //displayCSS: (type_edit)?false:true
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[4],
                        displayCSS: (type_edit)?true:false
                    }]);
                    videoPlayer.poster = DATA.url_cover;
                    videoPlayer.src = DATA.url;
                    videoPlayer.pause();
                    angular.element(elm).find('.output').hide();
                }else{
                    onlyBtnRemove(videoOptions, [{
                        classCSS : arrClassBtns[0],
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[1],
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[2],
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[3],
                        displayCSS: false
                    },{
                        classCSS : arrClassBtns[4],
                        displayCSS: false
                    }]);
                    videoPlayer.style.display = 'none';

                    $('#output').html('');
                    $('#outputBig').html('');
                    angular.element(elm).find('.output').show();
                }
            };
            ng.changeVideo = function(element, event){
                var file = element.files[0];
                var size = file.size;
                var videoGMG = ($bytesToSize.convert(size)).split(' ');
                var isVideoGood = parseFloat(videoGMG[0]);
                var typeVideoLoad = videoGMG[1];
                var msjVideoLoad = angular.element('#msjVideoLoad');
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
                val = element.value;
                angular.element(elm).find('.output').show();
                if(val != ''){

                    var videoPlayer = document.getElementById('videoPlayer');
                    videoPlayer.style.display = 'block';

                    var videoOptions = document.getElementById('videoOptions');
                    onlyBtnRemove(videoOptions, [{
                        classCSS : arrClassBtns[0],
                        displayCSS : true
                    },{
                        classCSS : arrClassBtns[1],
                        displayCSS : true
                    },{
                        classCSS : arrClassBtns[2],
                        displayCSS : true
                    },{
                        classCSS : arrClassBtns[3],
                        displayCSS : true
                    },{
                        classCSS : arrClassBtns[4],
                        displayCSS : false
                    }]);

                    var file = element.files[0];
                    objFileVideo = file;

                    var type = file.type;
                    var URL = window.URL || window.webkitURL;
                    var fileURL = URL.createObjectURL(file);

                    videoPlayer.src = fileURL;
                    videoPlayer.play();
                    $('#videoOptions').find('.video_done').attr('disabled', 'disabled');
                    ng.getSetData('', '', videoPlayer.duration);
                }
            };
            ng.getSetData = function(urlVideo, urlCover, duracion, hash, isAjax, edit){
                var urlVideo = urlVideo, urlCover = urlCover,
                duracion = duracion, hash = hash, isAjax = isAjax, edit = edit;
                var videoPlayer = $('#videoPlayer');
                ng.json.url_video = urlVideo;
                ng.json.url_video_cover = urlCover;
                ng.json.duracion = (duracion)?duracion:'';
                ng.json.hash = (hash)?hash:'';
                if(edit === 'edit'){ ng.json.flag = true; }else{ ng.json.flag = false; }
                videoPlayer.parent().find('.thumbData').data('json', ng.json);
                var _video = document.getElementById('videoPlayer');
                _video.addEventListener('loadeddata', function() {
                    ng.json.duracion = _video.duration;
                   scope.$emit('objvideo', ng.json);
                   if(isAjax){
                       $preload.hide();
                       $msj.show(CMSDATA.MSJ.MSJ15, positionMSj);
                   }
                }, false);
                scope.$emit('objvideo', ng.json);
            };
            ng.uploadVideo = function(){
                var formdata = new FormData();
                formdata.append('file', objFileVideo);
                formdata.append('file_cover', $('#videoPlayer').siblings('.output').find('.outputBig img').attr('src'));
                var DATA = formdata;
                var videoPlayer = document.getElementById('videoPlayer');
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
                        urlCover = data.response.url_cover,
                        hash = data.response.name;
                        var duration = videoPlayer.duration
                        ng.getSetData(urlVideo, urlCover, duration, hash, true);
                        //Insert Datos Video

                        $('#output').html('');
                        $('#outputBig').html('');

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

            ng.refresh = function(){
                ng.removeVideo('', '');
            };
            //Observe
            scope.$watch('reset', function(newValue, oldValue) {
                if(newValue != oldValue){
                    ng.refresh();
                }
            });

            //Data Refresh
            ng.refreshWidthVideo = function(data){
                ng.json.hash = (data.hash)?angular.copy(data.hash):'';
                ng.imgOutEdit = (data.url_cover)?data.url_cover:undefined;
                ng.removeVideo('ajax', data, 'edit');
                angular.element(elm).find('.output').hide();
                angular.element(elm) .find('video').show();
            };
            scope.$watch('jsonRefresh', function(newValue, oldValue) {
                if(newValue != false){
                    ng.refreshWidthVideo(newValue);
                }
            });

        }
    };
});

//Render video
app.directive('rendervideo', function($sce, $timeout) {
    return {
        restrict: 'EA',
        scope: { widthVideo:'@', heightVideo:'@', source:'@', poster:'@' },
        replace: true,
        template: '<video src="{{videoSrc}}" poster="{{posterSrc}}" style="width:{{wVideo}}px; height:{{hVideo}}px;" controls></video>',
        link: function (scope, element, attrs) {
            var ng = scope, elm = element;
            //Render video
            ng.wVideo = attrs.widthVideo;
            ng.hVideo = attrs.heightVideo;
            var urlVideo = attrs.source;
            var urlCover = attrs.poster;
            ng.trustResource = function trustResource(resourceUrl) {
                return $sce.trustAsResourceUrl(resourceUrl);
            };
            ng.getSetData = function(elm, urlVideo, urlCover){
                $timeout(function() {
                    var elm = elm, urlVideo = urlVideo, urlCover = urlCover;
                    var videoPlayer = elm;
                    //ng.posterSrc = '';
                    ng.posterSrc = urlCover;
                    //ng.videoSrc = '';
                    ng.videoSrc = ng.trustResource(urlVideo);
                 }, 0);
            };
            ng.getSetData(elm, urlVideo, urlCover);
        }
    };
});

//Render audio
app.directive('renderaudio', function($sce, $timeout) {
    return {
        restrict: 'EA',
        scope: { widthVideo:'@', heightVideo:'@', source:'@', poster:'@' },
        replace: true,
        template: '<audio src="{{audioSrc}}" style="width:{{wAudio}}px; height:{{hAudio}}px;" controls></audio>',
        link: function (scope, element, attrs) {
            var ng = scope, elm = element;
            //Render video
            ng.wAudio = attrs.widthAudio;
            ng.hAudio = attrs.heightAudio;
            var urlVideo = attrs.source;
            var urlCover = attrs.poster;
            ng.trustResource = function trustResource(resourceUrl) {
                return $sce.trustAsResourceUrl(resourceUrl);
            };
            ng.getSetData = function(elm, urlVideo, urlCover){
                $timeout(function() {
                    var elm = elm, urlVideo = urlVideo, urlCover = urlCover;
                    var videoPlayer = elm;
                    ng.posterSrc = '';
                    ng.posterSrc = urlCover;
                    ng.audioSrc = '';
                    ng.audioSrc = ng.trustResource(urlVideo);
                }, 0);
            };
            ng.getSetData(elm, urlVideo, urlCover);
        }
    };
});

//Upload miltuple images
app.directive('uploadmultiplephotos', function($preload,$http,$msj, $timeout, $rootScope) {
    return {
        restrict: 'EA',
        scope: { jsonRefresh:'=' },
        replace: true,
        template: '<div class="content-dropzone">'+
            '<div style="position:relative;overflow:scroll;overflow-x:hidden;max-height:350px;">'+
            '<ul id="showListDropZoneAjax" style="display:none;">'+
                '<li ng-repeat="file in objFilesMultipleAjax" class="content-drag-img">'+
                    '<div class="content-dropimg" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessMultiple($index, file, $event)">'+
                        '<img width="160px" ng-src="{{file.foto.url}}" alt="{{file.foto.name}}" />'+
                        '<md-button type="button" ng-click="removeItemPhoto($event,$index)" class="md-fab md-raised md-mini button-delete" aria-label="Remove">'+
                          '<md-tooltip>Eliminar</md-tooltip>'+
                          '<ng-md-icon icon="delete"></ng-md-icon>'+
                        '</md-button>'+
                    '</div>'+
                '</li>'+
            '</ul>'+
            '</div>'+
            '<div id="showDropZone" class="dropzonemultiple" style="width:100%; display:block; height:120px">' +
                '<input class="input-multiples-images" id="input-multiples-images" accept="image/x-png, image/jpeg, image/jpg" type="file" multiple name="thumbInputMultipleImages" />'+
                '<input class="thumb-images-multiple" type="hidden" data-json="" />'+
            '</div>'+
        '</div>',
        link: function (scope, element, attrs) {
            var ng = scope;

            //UPLOAD MULTIPLE PHOTOS
            ng.video = '';
            var elm = element;
            var elmFile = elm.find('input[type="file"]');
            var wVideo = attrs.widthVideo;
            var hVideo = attrs.heightVideo;
            var positionMSj = 'top right';
            ng.json = {
                url_video: '',
                url_video_cover: ''
            };

            var showDropZone = document.getElementById('showDropZone');
            var showListDropZone = document.getElementById('showListDropZone');
            var showListDropZoneAjax = document.getElementById('showListDropZoneAjax');

            var hideOptions = function(){
                showDropZone.style.display = 'block';
                showListDropZoneAjax.style.display = 'none';
                elm.val('');
            };
            var showOptions = function(){
                showDropZone.style.display = 'none';
                showListDropZoneAjax.style.display = 'none';
            };
            hideOptions();

            ng.objFilesMultipleAjax = [];

            ng.removeItemPhoto = function($event,index){
                var index = index;
                ng.objFilesMultipleAjax.splice(index,1);
                if(ng.objFilesMultipleAjax<1){
                    hideOptions();
                }
            };

            //CALL CONTROLLER
            ng.$on('triggerGallery', function(e, msg){
                if(msg){
                    //CLICK INPUT FILE
                    elmFile.click();
                }
            });

            //CHANGE INPUT FILE
            elmFile.bind('change', function(){
                ng.$apply(function(){
                    var files = elmFile[0].files; //FILES UPLOAD
                    var fileSize = files.length;

                    clickUploadMultipleImages(files);
                });
            });

            //CLICK REMOVE
            var clickUploadMultipleImages = function(files){
                var files = files;
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
                        showOptions();
                        showListDropZoneAjax.style.display = 'block';
                        var arrPrev = [];
                        angular.forEach(data.response, function(v,i){
                            data.response[i].drag = 'photo';
                            arrPrev.push(data.response[i]);
                        });
                        ng.objFilesMultipleAjax = arrPrev;
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

            ng.onDragSuccessMultiple = function($index, file, $event){
                var _file = file, _event = $event, _index = $index;
                $timeout(function () {
                    ng.objFilesMultipleAjax.splice(_index,1);
                    if(ng.objFilesMultipleAjax<1){
                        hideOptions();
                    }
                }, 100);

            };

        }
    };
});

/* SEARCHS */
app.directive('searchsocial', function($preload, $http, $msj, $timeout, $filter, $mdIcon) {
    return {
        restrict: 'EA',
        scope: { type:'@' },
        replace: true,
        template: '<div class="content-search-panel">'+
        '   <md-input-container>'+
        '       <label>Buscar en {{type}}</label>'+
        '       <input type="text" ng-readonly="readonlySearch" ng-model="inputSeachSocial">'+
        '   </md-input-container>'+
        '   <div class="content-result">'+
        '       <md-progress-circular ng-show="searchLoad" md-mode="indeterminate"></md-progress-circular>'+
        '       <div ng-show="listArrSocialNoResult" class="alert-warn md-body-1">No se encontraron resultados en la búsqueda.</div>'+

        '       <div style="position:relative;overflow:scroll;overflow-x:hidden;max-height:350px;">'+
        '       <ul ng-show="!searchLoad">'+
        '           <li ng-repeat="file in listArrSocial">'+
        '               <div ng-if="file.tipo != \'text\'" class="div-result" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessSearch($index, file, $event)">'+
        '                   <div class="div-author"><a target="_blank" href="{{file.data.autor_link}}"><img style="width:32px;height:32px; margin:0;padding:0" ng-if="file.data.avatar" ng-src="{{file.data.avatar}}" alt="Avatar" /></a></div>'+
        '                   <div class="div-text">'+
        '                       <div><a target="_blank" href="{{file.data.autor_link}}">{{file.data.autor}}</a></div>'+
        '                       <div>{{file.texto}}</div>'+
        '                       <div ng-if="file.data"><a target="_blank" href="{{file.data.autor_link}}"><img style="max-width:200px;height:auto;margin:0;padding:0" ng-if="file.data.foto" ng-src="{{file.data.foto}}" alt="Imagen" /></a></div>'+
        '                       <div style="font-size:0.9em; color:gray; margin:0.5em 0 0;">{{file.data.post_date}}'+
        '                           <span ng-if="file.data.retweet_count >= 0">| <ng-md-icon icon="repeat" size="14"></ng-md-icon> {{file.data.retweet_count}} <md-tooltip>ReTweet</md-tooltip></span>'+
        '                           <span ng-if="file.data.favorite_count >= 0">| <ng-md-icon icon="star" size="14"></ng-md-icon> {{file.data.favorite_count}} <md-tooltip>Favoritos</md-tooltip></span>'+
        '                           <span ng-if="file.data.comments_count >= 0">| <md-icon md-svg-src="svg/social-comment-fb.svg" style="width:14px; height:14px;"></md-icon> {{file.data.comments_count}} <md-tooltip>Comentarios</md-tooltip></span>'+
        '                           <span ng-if="file.data.like_count >= 0">| <md-icon md-svg-src="svg/social-like.svg" style="width:14px; height:14px;"></md-icon> {{file.data.like_count}} <md-tooltip>Me gusta</md-tooltip></span>'+
        '                           <span ng-if="file.data.share_count >= 0">| <md-icon md-svg-src="svg/social-shared.svg" style="width:14px; height:14px;"></md-icon> {{file.data.share_count}} <md-tooltip>Compartidos</md-tooltip></span>'+
        '                           <span ng-if="file.data.view_count >= 0">| <ng-md-icon icon="visibility" size="14"></ng-md-icon> {{file.data.view_count}} <md-tooltip>ReTweet</md-tooltip></span>'+
        '                           <span ng-if="file.data.comment_count >= 0">| <ng-md-icon icon="comment" size="14"></ng-md-icon> {{file.data.comment_count}} <md-tooltip>Favoritos</md-tooltip></span>'+
        '                           <span ng-if="file.data.repin_count >= 0">| <ng-md-icon icon="shuffle" size="14"></ng-md-icon> {{file.data.repin_count}} <md-tooltip>Favoritos</md-tooltip></span>'+
        '                       </div>'+
        '                   </div>'+
        '               </div>'+

        '               <div ng-if="file.tipo == \'text\'" class="div-result div-related" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessSearch($index, file, $event)">'+
        '                   <div ng-if="file.relacionado.items[0].foto" class="div-author">'+
        '                       <a target="_blank" href="{{file.relacionado.items[0].url}}"><img style="width:82px;height:auto; margin:0;padding:0" ng-src="{{file.relacionado.items[0].foto}}" alt="{{file.relacionado.items[0].titulo}}" /></a>'+
        '                   </div>'+
        '                   <div class="div-text">'+
        '                       <div><a target="_blank" href="{{file.data.autor_link}}">{{file.data.autor}}</a></div>'+
        '                       <div><a target="_blank" href="{{file.relacionado.items[0].url}}">{{file.relacionado.items[0].titulo}}</a></div>'+
        '                       <div style="font-size:0.9em; color:gray; margin:0.5em 0 0;">{{file.data.post_date}}</div>'+
        '                   </div>'+
        '               </div>'+
        '           </li>'+
        '       </ul>'+
        '       </div>'+
        '   </div>'+
        '</div>',
        link: function (scope, element, attrs) {
            var ng = scope;
            var positionMSj = 'top right';
            ng.type = scope.type;
            ng.searchLoad = false;
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.listArrSocial = [];
            var elem = element;
            elem.bind('keydown keypress', function(event) {
                var event = event;
                if(event.which === 13) {
                    ng.searchLoad = true;
                    ng.readonlySearch = true;
                    ng.listArrSocialNoResult = false;
                    var type = ng.type;
                    getData(type);
                    event.preventDefault();
                }
            });
            ng.inputSeachSocial = undefined;
            var getData = function(type){
                var type = type;
                ng.listArrSocial = [];
                $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            var arrPrev = [];
                            if(ng.type === 'web'){
                                angular.forEach(response, function(v,i){
                                    //WEB
                                    arrPrev.push({
                                        tipo : 'text',
                                        drag : 'text',
                                        relacionado : {
                                            alineacion: 'arriba',
                                            items : (response[i])?[response[i]]:[]
                                        }
                                    });
                                });
                            }else{
                                angular.forEach(response, function(v,i){
                                    //EMBED
                                    if(response[i].tipo === 'youtube'){
                                        response[i].drag = 'youtube';
                                    }else{
                                        response[i].drag = 'embed';
                                    }
                                    arrPrev.push(response[i]);
                                });
                            }
                            ng.listArrSocial = (arrPrev)?arrPrev:[];

                            ng.searchLoad = false;
                            ng.readonlySearch = false;
                            $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                            if(response.length<=0){
                                ng.listArrSocialNoResult = true;
                            }else{
                                ng.listArrSocialNoResult = false;
                            }
                        }else{
                            ng.readonlySearch = false;
                            ng.listArrSocialNoResult = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        ng.searchLoad = false;
                        ng.readonlySearch = false;
                        ng.listArrSocialNoResult = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    }
                }).error(function(data) {
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                });
            };
            ng.onDragSuccessSearch = function($index, file, $event){
                var _file = file, _event = $event, _index = $index;
                $timeout(function () {
                    ng.listArrSocial.splice(_index,1);
                }, 100);
            };
            //FIX TABS OVERFLOW
            var $elmTab = angular.element('#tabs-search-social');
            ng.$on('draggable:start', function(){
                $elmTab.addClass('tab-fixed-drag');
            });
            ng.$on('draggable:end', function(){
                $elmTab.removeClass('tab-fixed-drag');
            });
        }
    };
});

/* SEARCH PORTADAS */
app.directive('searchnews', function($preload, $http, $msj, $timeout, $filter, $mdIcon) {
    return {
        restrict: 'EA',
        scope: { type:'@' },
        replace: true,
        template: '<div class="content-search-panel">'+
        '<div layout layout-sm="column">'+
        '    <md-input-container flex>'+
        '        <label>Desde</label>'+
        '        <input type="date" ng-model="filterFrom">'+
        '    </md-input-container>'+
        '    <md-input-container flex>'+
        '        <label>Hasta</label>'+
        '        <input type="date" ng-model="filterTo">'+
        '    </md-input-container>'+
        '</div>'+
        '   <md-checkbox ng-model="checkBuscar" aria-label="Marcar" class="md-primary md-align-top-left">'+
        '       <span class="label">Buscar en todos los sitios</span>'+
        '   </md-checkbox>'+
        '<div style="position:relative">'+
        '   <md-input-container>'+
        '       <label>Ingresa palabra a buscar</label>'+
        '       <input type="text" ng-readonly="readonlySearch" ng-model="inputSeachSocial">'+
        '   </md-input-container>'+
        '   <span style="display:inline-block;position:absolute;cursor:pointer;right:0;top:1.25em"><ng-md-icon ng-click="clickLoadSearch($event);" icon="search" size="20" style=""></ng-md-icon><md-tooltip>Buscar</md-tooltip></span>'+
        '</div>'+
        '   <div class="content-result" style="padding-top:1em">'+
        '       <div style="position:relative;overflow:scroll;overflow-x:hidden;max-height:500px;">'+
        '       <ul ng-show="!searchLoad" class="ul-result-news">'+
        '           <li ng-repeat="file in listArrSocial">'+
        '               <div class="div-result-news" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessSearch($index, file, $event)">'+
        '                   <div class="tema">{{file.categoria.nombre}}</div>'+
        '                   <div><h4><a href="{{file.url}}" target="_blank">{{file.titulo}}</a></h4></div>'+
        '                   <div><img err-src="img/img-fallback.png" ng-src="{{file.imagen_portada.url}}" alt="{{file.imagen_portada.alt}}" /></div>'+
        '                   <div>'+
        '                     <div class="fecha left">{{file.post_date}}</div>'+
        '                     <div class="contador-visitas right"><ng-md-icon icon="visibility" size="12"></ng-md-icon> {{file.visitas_total}}</div>'+
        '                     <div style="clear: both;"></div>'+
        '                   </div>'+
        '               </div>'+
        '           </li>'+
        '       </ul>'+
        '       <md-progress-circular ng-show="searchLoad" md-mode="indeterminate"></md-progress-circular>'+
        '       <div ng-show="listArrSocialNoResult" class="alert-warn md-body-1">No se encontraron resultados en la búsqueda.</div>'+
        '       </div>'+
        '       <md-progress-circular ng-show="searchLoadMore" md-mode="indeterminate"></md-progress-circular>'+
        '       <div ng-show="listArrSocial.length>0" layout="row"><button ng-click="viewMore($event)" flex type="button" class="md-primary md-raised md-button md-default-theme">Mostrar más</button></div>'+
        '   </div>'+
        '</div>',
        //md-tab-content
        //md-tabs
        link: function (scope, element, attrs) {
            var ng = scope;
            var positionMSj = 'top right';
            ng.type = scope.type;
            ng.searchLoad = false;
            ng.searchLoadMore = false;
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.listArrSocial = [];
            ng.cursorMore = '';//CURSOR
            var elem = element;
            ng.filterFrom = CMSDATA.FILTER.desde; //-1 DAYs
            ng.filterTo = CMSDATA.FILTER.hasta;
            ng.checkBuscar = false;
            var fncLoadSearch = function(){
                ng.searchLoad = true;
                ng.readonlySearch = true;
                ng.listArrSocialNoResult = false;
                var type = ng.type;
                ng.cursorMore = '';//CURSOR
                getData(type);
            };
            elem.bind('keydown keypress', function(event) {
                var event = event;
                if(event.which === 13) {
                    fncLoadSearch();
                    event.preventDefault();
                }
            });
            ng.clickLoadSearch = function($event){
                var event = $event;
                fncLoadSearch();
                event.preventDefault();
            };
            ng.$on('triggerBuscarPortadas', function($event, arg){
                if(arg){
                    var event = $event;
                    fncLoadSearch();
                    event.preventDefault();
                }
            });

            ng.inputSeachSocial = undefined;
            var getData = function(type, more){
                var type = type, more = more;
                var DATA = {
                    sitio: ng.$parent.sitio,
                    portada: ng.$parent.seccion,
                    alcance : ng.checkBuscar,
                    desde : ng.filterFrom.getTime(),
                    hasta: ng.filterTo.getTime()
                };
                /*
                var time = (new Date()).getTime();
                var date = new Date(time);
                alert(date.toString()); // Wed Jan 12 2011 12:42:46 GMT-0800 (PST)
                */
                if(more != 'more'){ng.listArrSocial = [];}
                //$http.get(CMSDATA.URLSDESTACADOS + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type).
                $http.post(CMSDATA.URLSDESTACADOS + '/' + encodeURIComponent(ng.inputSeachSocial) + '?cursor=' + ng.cursorMore, DATA).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            var cursor = response.cursor;
                            var items = response.items;
                            var arrPrev = [];
                            angular.forEach(items, function(v,i){
                                arrPrev.push(v);
                                arrPrev[i].drag = 'text';
                            });
                            if(more === 'more'){
                                //BUSQUEDA DE MAS
                                var letArrMore = (arrPrev)?arrPrev:[];
                                if(letArrMore.length>0){
                                    angular.forEach(letArrMore, function(v,i){
                                        ng.listArrSocial.push(v);
                                    });
                                }else{
                                    //NO Hay mas data
                                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                                }
                            }else{
                                //BUSQUEDA INICIAL
                                ng.listArrSocial = (arrPrev)?arrPrev:[];
                            }
                            ng.cursorMore = cursor;
                            ng.searchLoad = false;
                            ng.searchLoadMore = false;
                            ng.readonlySearch = false;
                            $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                            if(items.length<=0){
                                ng.listArrSocialNoResult = true;
                            }else{
                                ng.listArrSocialNoResult = false;
                            }
                        }else{
                            ng.readonlySearch = false;
                            ng.listArrSocialNoResult = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        ng.searchLoad = false;
                        ng.ng.searchLoadMore = false;
                        ng.readonlySearch = false;
                        ng.listArrSocialNoResult = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    }
                }).error(function(data) {
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    ng.searchLoad = false;
                    ng.searchLoadMore = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                });
            };
            ng.viewMore = function($event){
                ng.searchLoadMore = true;
                var type = '';
                getData(type, 'more');
            };
            ng.onDragSuccessSearch = function($index, file, $event){
                var _file = file, _event = $event, _index = $index;
                $timeout(function () {
                    ng.listArrSocial.splice(_index,1);
                }, 100);
            };
            //FIX TABS OVERFLOW
            var $elmTab = angular.element('#tabs-search-social');
            ng.$on('draggable:start', function(){
                $elmTab.addClass('tab-fixed-drag');
            });
            ng.$on('draggable:end', function(){
                $elmTab.removeClass('tab-fixed-drag');
            });
        }
    };
});

/* SEARCH PORTADAS */
app.directive('searchtickets', function($preload, $http, $msj, $timeout, $filter, $mdIcon, $cacheService) {
    return {
        restrict: 'EA',
        scope: { type:'@' },
        replace: true,
        template: '<div class="content-search-panel">'+
        '<div layout layout-sm="column">'+
        '    <md-input-container flex>'+
        '        <label>Desde</label>'+
        '        <input type="date" ng-model="filterFrom">'+
        '    </md-input-container>'+
        '    <md-input-container flex>'+
        '        <label>Hasta</label>'+
        '        <input type="date" ng-model="filterTo">'+
        '    </md-input-container>'+
        '</div>'+
        '<div style="position:relative">'+
        '   <md-input-container>'+
        '       <label>Ingresa palabra a buscar</label>'+
        '       <input type="text" ng-readonly="readonlySearch" ng-model="inputSeachSocial">'+
        '   </md-input-container>'+
        '   <span style="display:inline-block;position:absolute;cursor:pointer;right:0;top:1.25em"><ng-md-icon ng-click="clickLoadSearch($event);" icon="search" size="20" style=""></ng-md-icon><md-tooltip>Buscar</md-tooltip></span>'+
        '</div>'+
        '   <div class="content-result" style="padding-top:1em">'+
        '       <div style="position:relative;overflow:scroll;overflow-x:hidden;max-height:600px;">'+
        '       <ul ng-show="!searchLoad" class="ul-result-block">'+
        '           <li ng-repeat="file in listArrSocial">'+
        '               <div class="div-result-news" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessSearch($index, file, $event)">'+
        '                   <div layout>'+
        '                       <div class="ticker-table">'+
        '                           <div class="titulo-ticker">'+
        '                               <span ng-switch="file.tipo">'+
        '                                   <span ng-switch-when="noticia">'+
        '                                       <ng-md-icon icon="reorder" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Noticia</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="galeria">'+
        '                                       <ng-md-icon icon="image" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Galeria</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="slider">'+
        '                                       <ng-md-icon icon="collections" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Slider</md-tooltip>'+
        '                                   </span>'+
        '                                    <span ng-switch-when="video">'+
        '                                       <ng-md-icon icon="video_collection" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Video</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="audio">'+
        '                                       <ng-md-icon icon="volume_up" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Audio</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="url">'+
        '                                       <ng-md-icon icon="link" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">URL Externo</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="mam">'+
        '                                       <ng-md-icon icon="alarm_add" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Minuto a minuto</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="blog">'+
        '                                       <ng-md-icon icon="perm_contact_cal" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Autores</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="infografia">'+
        '                                       <ng-md-icon icon="photo_album" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">Infografia</md-tooltip>'+
        '                                   </span>'+
        '                                   <span ng-switch-when="brandcontent">'+
        '                                       <ng-md-icon icon="picture_in_picture" size="16" style="fill:#424242"></ng-md-icon>'+
        '                                       <md-tooltip md-direction="top">BrandContent</md-tooltip>'+
        '                                   </span>'+
        '                               </span>'+
        '                               {{file.titulo}}'+
        '                               <a ng-if="file.url" href="{{file.url}}" target="_blank">'+
        '                                    <ng-md-icon icon="link" style="fill:rgb(33,150,243)"></ng-md-icon>'+
        '                                    <md-tooltip md-direction="top">Ir a URL</md-tooltip>'+
        '                                </a>'+
        '                           </div>'+
        '                           <div class="ticker-text">{{file.ticker}}</div>'+
        '                           <div class="ticker-fecha"  >{{file.fecha}} | Código: {{file.codigo}} | {{file.sitio.nombre}}</div>'+
        '                       </div>'+
        '                   </div>'+
        '               </div>'+
        '           </li>'+
        '       </ul>'+
        '       <md-progress-circular ng-show="searchLoad" md-mode="indeterminate"></md-progress-circular>'+
        '       <div ng-show="listArrSocialNoResult" class="alert-warn md-body-1">No se encontraron resultados en la búsqueda.</div>'+
        '       </div>'+
        '       <md-progress-circular ng-show="searchLoadMore" md-mode="indeterminate"></md-progress-circular>'+
        '       <div ng-show="listArrSocial.length>0" layout="row"><button ng-click="viewMore($event)" flex type="button" class="md-primary md-raised md-button md-default-theme">Mostrar más</button></div>'+
        '   </div>'+
        '</div>',
        //md-tab-content
        //md-tabs
        link: function (scope, element, attrs) {
            var ng = scope;
            var positionMSj = 'top right';
            ng.type = scope.type;
            ng.searchLoad = false;
            ng.searchLoadMore = false;
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.listArrSocial = [];
            ng.cursorMore = '';//CURSOR
            var elem = element;
            ng.filterFrom = CMSDATA.FILTER.desde; //-1 DAYs
            ng.filterTo = CMSDATA.FILTER.hasta;

            var fncLoadSearch = function(){
                ng.searchLoad = true;
                ng.readonlySearch = true;
                ng.listArrSocialNoResult = false;
                var type = ng.type;
                ng.cursorMore = '';//CURSOR
                getData(type);
            };
            elem.bind('keydown keypress', function(event) {
                var event = event;
                if(event.which === 13) {
                    fncLoadSearch();
                    event.preventDefault();
                }
            });
            ng.clickLoadSearch = function($event){
                var event = $event;
                fncLoadSearch();
                event.preventDefault();
            };
            ng.$on('triggerBuscarPortadas', function($event, arg){
                if(arg){
                    var event = $event;
                    fncLoadSearch();
                    event.preventDefault();
                }
            });
            ng.$on('msgTickerDeleted', function($event, arg){
                if(arg){
                    var event = $event;
                    var arg = arg;
                    ng.listArrSocial.push(arg);
                }
            });

            ng.inputSeachSocial = '';
            /*ng.listArrSocial = [
                { tipo: 'noticia', titulo: 'Titulo de noicia 1', url: 'http://www.rpp.com.pe/2_840038.html' , codigo: '840038' , fecha: '2015/09/29 16:25' , ticker : 'TCIKER NUMERO 1 TCIKER NUMERO 1 TCIKER NUMERO 1 TCIKER NUMERO 1', drag : 'ticker' },
            ];*/
            var getData = function(type, more){
                var type = type, more = more;
                var DATA = {
                    //sitio : ng.sitio,
                    sitio : ng.$parent.sitio,
                    texto : (ng.inputSeachSocial)?ng.inputSeachSocial:null,
                    desde : ng.filterFrom.getTime(),
                    hasta: ng.filterTo.getTime()
                };
                /*
                var time = (new Date()).getTime();
                var date = new Date(time);
                alert(date.toString()); // Wed Jan 12 2011 12:42:46 GMT-0800 (PST)
                */
                if(more != 'more'){ng.listArrSocial = [];}
                //http://dev.api.cms.webrpp.com/ticker/buscar_noticias
                $http.post(CMSDATA.URLSTICKERS + '?cursor=' + ng.cursorMore, DATA).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            var cursor = response.cursor;
                            var items = response.items;
                            var arrPrev = [];
                            angular.forEach(items, function(v,i){
                                arrPrev.push(v);
                                arrPrev[i].drag = 'ticker';
                            });
                            if(more === 'more'){
                                //BUSQUEDA DE MAS
                                var letArrMore = (arrPrev)?arrPrev:[];
                                if(letArrMore.length>0){
                                    angular.forEach(letArrMore, function(v,i){
                                        ng.listArrSocial.push(v);
                                    });
                                }else{
                                    //NO Hay mas data
                                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                                }
                            }else{
                                //BUSQUEDA INICIAL
                                ng.listArrSocial = (arrPrev)?arrPrev:[];
                            }
                            ng.cursorMore = cursor;
                            ng.searchLoad = false;
                            ng.searchLoadMore = false;
                            ng.readonlySearch = false;
                            $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                            if(items.length<=0){
                                ng.listArrSocialNoResult = true;
                            }else{
                                ng.listArrSocialNoResult = false;
                            }
                        }else{
                            ng.readonlySearch = false;
                            ng.listArrSocialNoResult = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        ng.searchLoad = false;
                        ng.ng.searchLoadMore = false;
                        ng.readonlySearch = false;
                        ng.listArrSocialNoResult = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    }
                }).error(function(data) {
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    ng.searchLoad = false;
                    ng.searchLoadMore = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                });
            };
            ng.viewMore = function($event){
                ng.searchLoadMore = true;
                var type = '';
                getData(type, 'more');
            };
            ng.onDragSuccessSearch = function($index, file, $event){
                var _file = file, _event = $event, _index = $index;
                $timeout(function () {
                    ng.listArrSocial.splice(_index,1);
                }, 100);
            };
            //FIX TABS OVERFLOW
            var $elmTab = angular.element('#tabs-search-social');
            ng.$on('draggable:start', function(){
                $elmTab.addClass('tab-fixed-drag');
            });
            ng.$on('draggable:end', function(){
                $elmTab.removeClass('tab-fixed-drag');
            });
        }
    };
});

/* SEARCHS */
app.directive('searchcomments', function($preload, $http, $msj, $timeout, $filter, $mdIcon, $parse) {
    return {
        restrict: 'EA',
        scope: { type:'@', indexSelected:'=' },
        replace: true,
        template: '<div class="content-search-panel">'+
        '   <md-input-container>'+
        '       <label>Buscar en {{type}}</label>'+
        '       <input type="text" ng-readonly="readonlySearch" ng-model="inputSeachSocial">'+
        '   </md-input-container>'+
        '   <div class="content-result">'+
        '       <md-progress-circular ng-show="searchLoad" md-mode="indeterminate"></md-progress-circular>'+
        '       <div ng-show="listArrSocialNoResult" class="alert-warn md-body-1">No se encontraron resultados en la búsqueda.</div>'+

        '       <div class="result_list" style="position:relative;overflow:scroll;overflow-x:hidden;max-height:460px;">'+
        '       <ul ng-show="!searchLoad">'+
        '           <li ng-repeat="file in listArrSocial">'+
        '               <div ng-class="!hideComments&&$index==currentFileIdx?\'current_file\':\'\'" id="{{file.data.id}}" ng-if="file.tipo != \'text\'" class="div-result" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessSearch($index, file, $event)">'+
        '                   <div class="div-author"><a target="_blank" href="{{file.data.autor_link}}"><img style="width:32px;height:32px; margin:0;padding:0" ng-if="file.data.avatar" ng-src="{{file.data.avatar}}" alt="Avatar" /></a></div>'+
        '                   <div class="div-text">'+
        '                       <div><a target="_blank" href="{{file.data.autor_link}}">{{file.data.autor}}</a></div>'+
        '                       <div>{{file.texto}}</div>'+
        '                       <div ng-if="file.data"><a target="_blank" href="{{file.data.autor_link}}"><img style="max-width:200px;height:auto;margin:0;padding:0" ng-if="file.data.foto" ng-src="{{file.data.foto}}" alt="Imagen" /></a></div>'+
        '                       <div style="font-size:0.9em; color:gray; margin:0.5em 0 0;">{{file.data.post_date}}'+
        '                           <span ng-if="file.data.retweet_count >= 0">| <ng-md-icon icon="repeat" size="14"></ng-md-icon> {{file.data.retweet_count}} <md-tooltip>ReTweet</md-tooltip></span>'+
        '                           <span ng-if="file.data.favorite_count >= 0">| <ng-md-icon icon="star" size="14"></ng-md-icon> {{file.data.favorite_count}} <md-tooltip>Favoritos</md-tooltip></span>'+
        '                           <span ng-if="file.data.favorite_count >=0" ng-click="showComments($index, file.data.id)" style="cursor: pointer;">| <ng-md-icon icon="reply" size="14"></ng-md-icon><md-tooltip>Respuestas</md-tooltip></span>'+
        '                           <span ng-if="file.data.comments_count >= 0" ng-click="showComments($index, file.data.id)" style="cursor: pointer;">| <md-icon md-svg-src="svg/social-comment-fb.svg" style="width:14px; height:14px;"></md-icon> {{file.data.comments_count}} <md-tooltip>Comentarios</md-tooltip></span>'+
        '                           <span ng-if="file.data.like_count >= 0">| <md-icon md-svg-src="svg/social-like.svg" style="width:14px; height:14px;"></md-icon> {{file.data.like_count}} <md-tooltip>Me gusta</md-tooltip></span>'+
        '                           <span ng-if="file.data.share_count >= 0">| <md-icon md-svg-src="svg/social-shared.svg" style="width:14px; height:14px;"></md-icon> {{file.data.share_count}} <md-tooltip>Compartidos</md-tooltip></span>'+
        '                           <span ng-if="file.data.view_count >= 0">| <ng-md-icon icon="visibility" size="14"></ng-md-icon> {{file.data.view_count}} <md-tooltip>ReTweet</md-tooltip></span>'+
        '                           <span ng-if="file.data.comment_count >= 0">| <ng-md-icon icon="comment" size="14"></ng-md-icon> {{file.data.comment_count}} <md-tooltip>Favoritos</md-tooltip></span>'+
        '                           <span ng-if="file.data.repin_count >= 0">| <ng-md-icon icon="shuffle" size="14"></ng-md-icon> {{file.data.repin_count}} <md-tooltip>Favoritos</md-tooltip></span>'+
        '                       </div>'+
        '                   </div>'+
        '               </div>'+

        '               <div ng-if="file.tipo == \'text\'" class="div-result div-related" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessSearch($index, file, $event)">'+
        '                   <div ng-if="file.relacionado.items[0].foto" class="div-author">'+
        '                       <a target="_blank" href="{{file.relacionado.items[0].url}}"><img style="width:82px;height:auto; margin:0;padding:0" ng-src="{{file.relacionado.items[0].foto}}" alt="{{file.relacionado.items[0].titulo}}" /></a>'+
        '                   </div>'+
        '                   <div class="div-text">'+
        '                       <div><a target="_blank" href="{{file.data.autor_link}}">{{file.data.autor}}</a></div>'+
        '                       <div><a target="_blank" href="{{file.relacionado.items[0].url}}">{{file.relacionado.items[0].titulo}}</a></div>'+
        '                       <div style="font-size:0.9em; color:gray; margin:0.5em 0 0;">{{file.data.post_date}}</div>'+
        '                   </div>'+
        '               </div>'+

        '               <div ng-class="!hideComments&&$index==currentFileIdx?\'current_file\':\'\'" ng-show="!hideComments&&$index==currentFileIdx" class="div-comments" style="font-size: 0.90em; text-align: justify; border-left: thick double #BCBCBC">'+
        '                 <div ng-if="loadingComments" id="loading-comments"><md-progress-circular class="md-hue-2" md-mode="indeterminate" md-diameter="5px"></md-progress-circular></div>'+
        '                 <div style="overflow: scroll; overflow-x: hidden; max-height: 175px; margin-right: 5px;">'+
        '                   <ul>'+
        '                     <li style="margin: 1px 5px; padding: 2px; position: relative" ng-repeat="comment in listArrComments">'+
        '                       <div ng-drag="true" ng-drag-data="comment" ng-drag-success="onDragSuccessSearch($index, comment, $event, true)" class="div-result">'+
        '                         <div style="float: left; margin: 0px 5px 5px 0px">'+
        '                           <img ng-if="comment.data.avatar" ng-src="{{ comment.data.avatar }}" alt="Imagen"/>'+
        '                         </div>'+
        '                         <div style="padding-left: 6px">'+
        '                           <div style="padding-right: 6px;">'+
        '                             <div>'+
        '                               <span style="font-weight: bold">{{ comment.data.autor }}</span>'+
        '                               <span style="word-wrap: break-word">{{ comment.texto }}</span>'+
        '                             </div>'+
        '                             <div>'+
        '                               <span style="font-size:0.9em; color:gray; margin:0.5em 0 0;">{{ comment.data.post_date }}</span>'+
        '                             </div>'+
        '                           </div>'+
        '                         </div>'+
        '                       </div><div style="clear: both;"></div>'+
        '                     </li>'+
        '                   </ul>'+
        '                 </div>'+
        '               </div>'+

        '           </li>'+
        '       </ul>'+
        '       <div ng-show="socialBusy">'+
        '         <md-progress-circular class="progressContent" md-mode="indeterminate"></md-progress-circular>'+
        '       </div>'+
        '       <div style="height:20px" id="scroll-bottom"></div>'+
        '       </div>'+
        '       <div ng-show="listArrSocial.length>0" layout="row">'+
        '         <button flex ng-click="socialNextPage()" class="md-primary md-raised md-button md-default-theme">Mostrar más</button>'+
        '       </div>'+
        '   </div>'+
        '</div>',
        //md-tab-content
        //md-tabs
        link: function (scope, element, attrs) {
            var ng = scope;
            var positionMSj = 'top right';
            ng.socialAfter = "";
            ng.type = scope.type;
            ng.searchLoad = false;
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.listArrSocial = [];
            ng.currentFileIdx = null;
            ng.hideComments = true;
            ng.socialBusy = false;
            ng.loadingComments = false;
            var elem = element;
            var arrSocial = ['facebook', 'twitter', 'youtube', 'gif', 'vine', 'gplus', 'instagram', 'tumblr', 'pinterest'];

            elem.bind('keydown keypress', function(event) {
                var event = event;
                if(event.which === 13) {
                    ng.searchLoad = true;
                    ng.readonlySearch = true;
                    ng.listArrSocialNoResult = false;
                    var type = ng.type;
                    ng.hideComments = true;
                    getData(type);
                    event.preventDefault();
                }
            });
            ng.inputSeachSocial = undefined;
            var getData = function(type){
                var type = type;
                ng.listArrSocial = [];
                ng.socialAfter = "";
                $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            var arrPrev = [];
                            if(ng.type === 'web'){
                                angular.forEach(response, function(v,i){
                                    //WEB
                                    arrPrev.push({
                                        tipo : 'text',
                                        drag : 'text',
                                        relacionado : {
                                            alineacion: 'arriba',
                                            items : (response[i])?[response[i]]:[]
                                        }
                                    });
                                });
                            }else{
                                angular.forEach(response, function(v,i){
                                    //EMBED
                                    if(response[i].tipo === 'youtube'){
                                        response[i].drag = 'youtube';
                                    }else{
                                        response[i].drag = 'embed';
                                    }
                                    arrPrev.push(response[i]);
                                });
                            }
                            ng.listArrSocial = (arrPrev)?arrPrev:[];
                            ng.searchLoad = false;
                            ng.readonlySearch = false;
                            $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                            if(response.length<=0){
                                ng.listArrSocialNoResult = true;
                            }else{
                              ng.socialAfter = (ng.listArrSocial[ng.listArrSocial.length-1]).data.timestamp;
                              ng.listArrSocialNoResult = false;
                            }
                        }else{
                            ng.readonlySearch = false;
                            ng.listArrSocialNoResult = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        ng.searchLoad = false;
                        ng.readonlySearch = false;
                        ng.listArrSocialNoResult = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    }
                }).error(function(data) {
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                });
            };

            ng.socialBusy = false;
            var socialNextPage = function(type){
              if (ng.socialBusy) return;
              ng.socialBusy = true;
              $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type + '?cursor=' + ng.socialAfter)
                .success(function(data){
                  var data = data;
                  $timeout(function(){
                    if(data != null){
                      if(data.status){
                        var response = data.response;
                        angular.forEach(response, function(v,i){
                            //EMBED
                            if(v.tipo === 'youtube'){
                                v.drag = 'youtube';
                            }else{
                                v.drag = 'embed';
                            }
                            ng.listArrSocial.push(v);
                        });
                        ng.socialAfter = (ng.listArrSocial[ng.listArrSocial.length-1]).data.timestamp;
                        ng.socialBusy = false;
                        //$msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                        if(response.length<=0){
                            ng.listArrSocialNoResult = true;
                        }else{
                            ng.listArrSocialNoResult = false;
                        }
                      }else{
                        ng.listArrSocialNoResult = false;
                        ng.socialBusy = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                      }
                    }else{
                      ng.listArrSocialNoResult = false;
                      ng.socialBusy = false;
                    }
                  }, 1000/2);
              }).error(function(data) {
                  $timeout(function(){
                      ng.socialBusy = false;
                  },1000/2);
              });
            };

            ng.socialNextPage = function(){
              if(ng.type == arrSocial[scope.indexSelected]){
                if(ng.inputSeachSocial&&ng.socialAfter){
                  socialNextPage(ng.type);
                }
              }
            };

            ng.onDragSuccessSearch = function($index, file, $event, isComment){
                var _file = file, _event = $event, _index = $index;
                isComment = (typeof(isComment)=='undefined'?false:isComment);
                _file.via = ng.type;
                if(isComment){
                  $timeout(function () {
                      ng.listArrComments.splice(_index,1);
                  }, 100);
                }else{
                  $timeout(function () {
                      ng.listArrSocial.splice(_index, 1);
                  }, 100);
                }
            };

            ng.showComments = function($index, id){
              if(ng.currentFileIdx != $index){
                ng.currentFileIdx = $index;
                getComments(id);
                ng.hideComments = false;
              }else{
                ng.hideComments = (ng.hideComments==false)?true:false;
              }
            };

            var getComments = function(id){
              ng.listArrComments = [];
              if (ng.loadingComments) return;
              ng.loadingComments = true;
              //ng.searchLoad = true;
              $http.get(CMSDATA.URLSEARCHCOMMENTS + '/' + id + '/' + ng.type).
              success(function(data){
                  var data = data;
                  if(data != null){
                      if(data.status){
                          var response = data.response;
                          if(response.length>0){
                            $('.result_list').scrollTop($('.result_list').scrollTop() + $("#"+id).position().top);
                            angular.forEach(response, function(v, k) {
                              v.isComment = true;
                              v.drag = true;
                              ng.listArrComments.push(v);
                            });
                            //insert comments in post
                          }else{
                            ng.hideComments = true;
                          }
                          //ng.searchLoad = false;
                          $msj.show(CMSDATA.MSJ.MSJ44, positionMSj);
                      }else{
                          ng.currentFileIdx = null;
                          ng.hideComments = true;
                          $msj.show(CMSDATA.MSJ.MSJ48, positionMSj);
                      }
                  }else{
                      //ng.searchLoad = false;
                      ng.currentFileIdx = null;
                      ng.hideComments = true;
                      $msj.show(CMSDATA.MSJ.MSJ48, positionMSj);
                  }
                  ng.loadingComments = false;
              }).error(function(data) {
                  ng.currentFileIdx = null;
                  ng.hideComments = true;
                  ng.loadingComments = false;
                  $msj.show(CMSDATA.MSJ.MSJ48, positionMSj);
              });
            };

            //FIX TABS OVERFLOW
            var $elmTab = angular.element('#tabs-search-social');
            ng.$on('draggable:start', function(){
                $elmTab.addClass('tab-fixed-drag');
            });
            ng.$on('draggable:end', function(){
                $elmTab.removeClass('tab-fixed-drag');
            });
        }
    };
});

/* SEARCHS */
app.directive('searchevents', function($preload, $http, $msj, $timeout, $filter, $mdIcon, $parse, $interval) {
    return {
        restrict: 'EA',
        scope: { type:'@', indexSelected:'=' },
        replace: true,
        templateUrl: 'template/eventos/searchevents.html',
        link: function (scope, element, attrs) {
            var ng = scope;
            var positionMSj = 'top right';
            ng.socialAfter = "";
            ng.type = scope.type;
            ng.searchLoad = false;
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.listArrSocialError=false;
            ng.msjError=CMSDATA.MSJ.MSJ29;
            ng.listArrSocial = [];
            ng.currentFileIdx = null;
            ng.hideComments = true;
            ng.socialBusy = false;
            ng.loadingComments = false;
            var elem = element;
            var arrSocial = ['facebook', 'twitter', 'youtube', 'gif', 'vine', 'gplus', 'instagram', 'tumblr', 'pinterest'];

            var buscar=function(){
                // console.log('buscarrrr');
                ng.searchLoad = true;
                ng.readonlySearch = true;
                ng.listArrSocialNoResult = false;
                var type = ng.type;
                ng.hideComments = true;
                getData(type);
            };

            elem.bind('keydown keypress', function(event) {
                var event = event;
                if(event.which === 13) {
                    buscar();
                    event.preventDefault();
                }
            });

            var interval;

            ng.blurear=function(){
                // console.log('blureoooo', ng.inputSeachSocial);
                if(ng.inputSeachSocial!==undefined){
                    // buscar();
                    interval=$interval(function(){
                        buscar();
                    },30000);
                }
            };

            ng.focusear=function(){
                // console.log('focuseoooo');
                $interval.cancel(interval);
            };

            ng.$watch('indexSelected', function(current, old){
                // console.log(current,old,'wwwweee');
                if(current!=old){
                    $interval.cancel(interval);
                }
            });

            ng.inputSeachSocial = undefined;
            var getData = function(type){
                var type = type;
                ng.listArrSocial = [];
                ng.socialAfter = "";
                $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            var arrPrev = [];
                            if(ng.type === 'web'){
                                angular.forEach(response, function(v,i){
                                    //WEB
                                    arrPrev.push({
                                        tipo : 'text',
                                        drag : 'text',
                                        relacionado : {
                                            alineacion: 'arriba',
                                            items : (response[i])?[response[i]]:[]
                                        }
                                    });
                                });
                            }else{
                                angular.forEach(response, function(v,i){
                                    //EMBED
                                    if(response[i].tipo === 'youtube'){
                                        response[i].drag = 'youtube';
                                    }else{
                                        response[i].drag = 'embed';
                                    }
                                    arrPrev.push(response[i]);
                                });
                            }
                            ng.listArrSocial = (arrPrev)?arrPrev:[];
                            ng.searchLoad = false;
                            ng.readonlySearch = false;
                            // $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);

                            if(response.length<=0){
                                ng.listArrSocialNoResult = true;
                            }else{
                              ng.socialAfter = (ng.listArrSocial[ng.listArrSocial.length-1]).data.timestamp;
                              ng.listArrSocialNoResult = false;
                            }
                            ng.listArrSocialError=false;
                        }else{
                            ng.searchLoad = false;
                            ng.readonlySearch = false;
                            ng.listArrSocialNoResult = false;
                            // $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                            ng.listArrSocialError = true;
                        }
                    }else{
                        ng.searchLoad = false;
                        ng.readonlySearch = false;
                        ng.listArrSocialNoResult = false;
                        // $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        ng.listArrSocialError = true;
                    }
                }).error(function(data) {
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    // $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    ng.listArrSocialError = true;
                });
            };

            ng.socialBusy = false;
            var socialNextPage = function(type){
              if (ng.socialBusy) return;
              ng.socialBusy = true;
              $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type + '?cursor=' + ng.socialAfter)
                .success(function(data){
                  var data = data;
                  $timeout(function(){
                    if(data != null){
                      if(data.status){
                        var response = data.response;
                        angular.forEach(response, function(v,i){
                            //EMBED
                            if(v.tipo === 'youtube'){
                                v.drag = 'youtube';
                            }else{
                                v.drag = 'embed';
                            }
                            ng.listArrSocial.push(v);
                        });
                        ng.socialAfter = (ng.listArrSocial[ng.listArrSocial.length-1]).data.timestamp;
                        ng.socialBusy = false;
                        //$msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                        if(response.length<=0){
                            ng.listArrSocialNoResult = true;
                        }else{
                            ng.listArrSocialNoResult = false;
                        }
                      }else{
                        ng.listArrSocialNoResult = false;
                        ng.socialBusy = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                      }
                    }else{
                      ng.listArrSocialNoResult = false;
                      ng.socialBusy = false;
                    }
                  }, 1000/2);
              }).error(function(data) {
                  $timeout(function(){
                      ng.socialBusy = false;
                  },1000/2);
              });
            };

            ng.socialNextPage = function(){
              if(ng.type == arrSocial[scope.indexSelected]){
                if(ng.inputSeachSocial&&ng.socialAfter){
                  socialNextPage(ng.type);
                }
              }
            };

            ng.onDragSuccessSearch = function($index, file, $event, isComment){
                var _file = file, _event = $event, _index = $index;
                isComment = (typeof(isComment)=='undefined'?false:isComment);
                _file.via = ng.type;
                if(isComment){
                  $timeout(function () {
                      ng.listArrComments.splice(_index,1);
                  }, 100);
                }else{
                  $timeout(function () {
                      ng.listArrSocial.splice(_index, 1);
                  }, 100);
                }
            };

            ng.showComments = function($index, id){
              if(ng.currentFileIdx != $index){
                ng.currentFileIdx = $index;
                getComments(id);
                ng.hideComments = false;
              }else{
                ng.hideComments = (ng.hideComments==false)?true:false;
              }
            };

            var getComments = function(id){
              ng.listArrComments = [];
              if (ng.loadingComments) return;
              ng.loadingComments = true;
              //ng.searchLoad = true;
              $http.get(CMSDATA.URLSEARCHCOMMENTS + '/' + id + '/' + ng.type).
              success(function(data){
                  var data = data;
                  if(data != null){
                      if(data.status){
                          var response = data.response;
                          if(response.length>0){
                            $('.result_list').scrollTop($('.result_list').scrollTop() + $("#"+id).position().top);
                            angular.forEach(response, function(v, k) {
                              v.isComment = true;
                              v.drag = true;
                              ng.listArrComments.push(v);
                            });
                            //insert comments in post
                          }else{
                            ng.hideComments = true;
                          }
                          //ng.searchLoad = false;
                          $msj.show(CMSDATA.MSJ.MSJ44, positionMSj);
                      }else{
                          ng.currentFileIdx = null;
                          ng.hideComments = true;
                          $msj.show(CMSDATA.MSJ.MSJ48, positionMSj);
                      }
                  }else{
                      //ng.searchLoad = false;
                      ng.currentFileIdx = null;
                      ng.hideComments = true;
                      $msj.show(CMSDATA.MSJ.MSJ48, positionMSj);
                  }
                  ng.loadingComments = false;
              }).error(function(data) {
                  ng.currentFileIdx = null;
                  ng.hideComments = true;
                  ng.loadingComments = false;
                  $msj.show(CMSDATA.MSJ.MSJ48, positionMSj);
              });
            };

            //FIX TABS OVERFLOW
            var $elmTab = angular.element('#tabs-search-social');
            ng.$on('draggable:start', function(){
                $elmTab.addClass('tab-fixed-drag');
            });
            ng.$on('draggable:end', function(){
                $elmTab.removeClass('tab-fixed-drag');
            });

            ng.agregarIncidencia=function(incidencia){
                ng.$emit('incidencia:social', incidencia);
            };


        }
    };
});

/* BUSCAR EN ARCHIVO MULTIMEDIA */
/* SEARCHS */
app.directive('searcharchive', function($preload, $http, $msj, $timeout, $filter, $mdIcon) {
    return {
        restrict: 'EA',
        scope: { type:'@' },
        replace: true,
        template: '<div class="content-search-panel">'+
        '<div layout layout-sm="column">'+
        '    <md-input-container flex>'+
        '        <label>Desde</label>'+
        '        <input type="date" ng-model="filterFrom">'+
        '    </md-input-container>'+
        '    <md-input-container flex>'+
        '        <label>Hasta</label>'+
        '        <input type="date" ng-model="filterTo">'+
        '    </md-input-container>'+
        '</div>'+
        '   <md-input-container>'+
        '       <label>Buscar en archivo de {{type}}</label>'+
        '       <input type="text" ng-readonly="readonlySearch" ng-model="inputSeachSocial">'+
        '   </md-input-container>'+
        '   <div class="content-dropzone">'+
        '       <div ng-show="listArrSocialNoResult" class="alert-warn md-body-1">No se encontraron resultados en la búsqueda.</div>'+
        '       <div id="result-list--archice" style="position:relative;overflow:scroll;overflow-x:hidden;max-height:350px;">'+
        '       <ul ng-show="!searchLoad">'+
        '           <li ng-repeat="file in listArrSocial" class="content-drag-img">'+
        '               <div class="content-dropimg preload" ng-drag="true" ng-drag-data="file" ng-drag-success="onDragSuccessMultiple($index, file, $event)">'+
        '                   <img err-src="img/img-fallback.png" width="160" ng-src="{{file.foto.url}}" alt="Imagen" />'+
        '               </div>'+
        '           </li>'+
        '       </ul>'+
        '       <div scroll-container="#result-list--archice" scroll-trigger scroll-function="socialNextPage()" threshold="50" class="trigger-scroll">&nbsp;</div>'+
        '       <div ng-show="socialBusy">'+
        '         <md-progress-circular class="progressContent" md-mode="indeterminate"></md-progress-circular>'+
        '       </div>'+
        '       <div style="height:20px"></div>'+
        '       </div>'+
        '   </div>'+
        '</div>',
        link: function (scope, element, attrs) {
            var ng = scope;
            var positionMSj = 'top right';
            ng.type = scope.type;
            ng.searchLoad = false;
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.listArrSocial = [];
            var elem = element;
            elem.bind('keydown keypress', function(event) {
                var event = event;
                if(event.which === 13) {
                    ng.searchLoad = true;
                    ng.readonlySearch = true;
                    ng.listArrSocialNoResult = false;
                    var type = ng.type;
                    ng.socialBusy = false;
                    ng.cursorSBox = '';
                    getData(type);
                    event.preventDefault();
                }
            });
            ng.inputSeachSocial = undefined;
            //ng.filterFrom = CMSDATA.FILTER.desde; //-1 DAYs
            ng.filterFrom = (new Date()).adjustDate(-365);
            ng.filterTo = CMSDATA.FILTER.hasta;
            ng.cursorSBox = ''; //CURSOR
            ng.socialBusy = false;
            var getData = function(type){
                var type = type;
                if(type != 'infinite'){
                    ng.listArrSocial = [];
                }
                var _tipo = 'photo';
                if (ng.socialBusy) return;
                ng.socialBusy = true;
                var DATA = {
                    palabra: ng.inputSeachSocial,
                    //desde : '',
                    //hasta: ''
                    desde : ng.filterFrom.getTime(),
                    hasta: ng.filterTo.getTime()
                };
                $http.post(CMSDATA.URLELEMENTSINDEX + '/' + '?type=search_box' + '&cursor=' + ng.cursorSBox, DATA).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            var items = response.items;
                            var cursor = response.cursor;
                            var arrPrev = [];
                            if(type === 'infinite'){
                                angular.forEach(items, function(v,i){
                                    //EMBED
                                    items[i].drag = 'archive';
                                    ng.listArrSocial.push(items[i]);
                                });
                                ng.searchLoad = false;
                                ng.readonlySearch = false;
                                ng.socialBusy = false;
                                ng.cursorSBox = cursor;
                            }else{
                                angular.forEach(items, function(v,i){
                                    //EMBED
                                    items[i].drag = 'archive';
                                    arrPrev.push(items[i]);
                                });
                                ng.listArrSocial = (arrPrev)?arrPrev:[];
                                ng.searchLoad = false;
                                ng.readonlySearch = false;
                                ng.cursorSBox = cursor;
                                $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                                ng.socialBusy = false;
                                if(items.length<=0){
                                    ng.listArrSocialNoResult = true;
                                }else{
                                    ng.listArrSocialNoResult = false;
                                }
                            }
                        }else{
                            ng.readonlySearch = false;
                            ng.listArrSocialNoResult = false;
                            ng.socialBusy = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        ng.searchLoad = false;
                        ng.readonlySearch = false;
                        ng.listArrSocialNoResult = false;
                        ng.socialBusy = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                    }
                }).error(function(data) {
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    ng.socialBusy = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                });
            };
            //getData();
            ng.socialNextPage = function(){
                getData('infinite');
            };
            ng.onDragSuccessMultiple = function($index, file, $event){
                var _file = file, _event = $event, _index = $index;
                $timeout(function () {
                    ng.listArrSocial.splice(_index,1);
                }, 100);
            };
            //FIX TABS OVERFLOW
            var $elmTab = angular.element('#tabs-search--archive');
            ng.$on('draggable:start', function(){
                $elmTab.addClass('tab-fixed-drag');
            });
            ng.$on('draggable:end', function(){
                $elmTab.removeClass('tab-fixed-drag');
            });
        }
    };
});

/* fixed-module */
app.directive('btnFixedModule', function() {
    return {
        restrict: 'EA',
        scope: { type:'@' },
        replace: true,
        template: '<button type="button" ng-click="fixedModule($event);" class="btn-affix btn-in-list" aria-label="Fixed Module" role="button">'+
                    '<md-tooltip md-direction="left">Fijar Módulo</md-tooltip>'+
                    '<md-icon md-svg-src="svg/pin28.svg" style="color:#333; width:20px;height:20px"></md-icon>'+
                '</button>',
        link: function (scope, element, attrs) {
            var ng = scope;
            ng.type = scope.type;
            var elem = element;
            elem.bind('click', function(event) {
                var event = event,
                cls = ['active-fixed','sidenav-fixed-module','fixed-module'],
                mod = elem.parents('.content-module'),
                side = elem.parents('.sidenav-module');
                if(elem.hasClass(cls[0])){
                    side.removeClass(cls[1]);
                    mod.removeClass(cls[2]);
                    elem.removeClass(cls[0]);
                }else{
                    side.addClass(cls[1]);
                    mod.addClass(cls[2]);
                    elem.addClass(cls[0]);
                }
            });
        }
    };
});

//Upload Audio
app.directive('uploadaudio', function($preload, $http, $msj, $timeout, $create, $mdDialog, $bytesToSize) {
    return {
        restrict: 'EA',
        scope: { widthAudio:'@', heightAudio:'@', jsonRefresh:'=' },
        replace: true,
        template: '<div class="content-dropzone-audio">'+
        '<div class="alert-warn ng-hide" id="msjVideoLoad"><ul style="paddgin:0;margin:0">'+
        '<li>El audio excede los '+ CMSDATA.VIDEOLOAD +' megas permitidos.</li>'+
        '</ul></div>'+
        '   <div class="tagzoneaudio" style="display:none">'+
        '       <audio style="width:573px;height:40px" controls>'+
        '           <source src="{{audioSource}}" type="audio/mp3"> '+
        '           Tu navegador no soporta el elemento audio. '+
        '       </audio>'+
        '       <div class="media-options" style="text-align:right;width:auto;left:98%;top:-10px">'+
        '           <md-button type="button" ng-click="deleteOpt()" class="opt-delete md-fab md-mini md-warn" aria-label="Delete">'+
        '               <md-tooltip>Eliminar</md-tooltip>'+
        '               <md-icon md-svg-src="./svg/delete82.svg" style="color:black;"></md-icon>'+
        '           </md-button>'+
        '           <md-button type="button" ng-disabled="disabledOpt" ng-click="uploadOpt()" class="opt-send md-fab md-mini md-cms-green" aria-label="Send">'+
        '               <md-tooltip>Enviar</md-tooltip>'+
        '               <md-icon md-svg-src="./svg/done.svg" style="color:black;"></md-icon>'+
        '           </md-button>'+
        '       </div>'+
        '   </div>'+
        '   <div class="dropzoneaudio" style="display:block; width:573px; height:80px">' +
        '       <input class="inputAudio" id="inputAudio" accept=".mp3,audio/*" ng-model="audio" type="file" name="thumbaudio" />'+
        '   </div>'+
        '</div>',
        link: function (scope, element, attrs) {
            var ng = scope;

            //UPLOAD video
            ng.audio = '';
            ng.audioSource = '';
            ng.wAudio = attrs.widthAudio;
            ng.hAudio = attrs.heightAudio;
            ng.disabledOpt = true;
            wImage = 573;
            hHeight = 322;

            var elm = element;
            var elmDrop = elm.find('.dropzoneaudio');
            var elmFile = elmDrop.find('input[type="file"]');
            var CntElmAudio = elm.find('.tagzoneaudio');
            var elmAudio = elm.find('audio');
            //var imgCover = angular.element('.cnt-imagen-cover img');
            var optDelete = CntElmAudio.find('.opt-delete');
            //var optCover = CntElmAudio.find('.opt-cover');
            var optSend = CntElmAudio.find('.opt-send');
            ng.objFile = {};
            var positionMSj = 'top right';
            ng.json = {
                url: '',
                url_cover: '',
                duracion: '',
                hash: ''
            };

            //init Value
            var initDefault = function(type){
                var type = type;
                if(type === 'show'){
                    elmDrop.css('display','block');
                    CntElmAudio.css('display','none');
                    optDelete.css('display','inline-block');
                    optSend.css('display','inline-block');
                    //optCover.css('display','inline-block');
                }else if(type === 'ajax'){
                    elmDrop.css('display','none');
                    CntElmAudio.css('display','block');
                    optDelete.css('display','inline-block');
                    //optCover.css('display','none');
                    optSend.css('display','none');
                }else{
                    elmDrop.css('display','none');
                    CntElmAudio.css('display','block');
                    optDelete.css('display','inline-block');
                    optSend.css('display','inline-block');
                    //optCover.css('display','inline-block');
                }
                //imgCover.attr('src', '');
                ng.disabledOpt = true;
            };
            initDefault('show');

            //CHANGE INPUT FILE
            var getAudioSrc = function(file){
                var file = file;
                var type = file.type;
                var URL = window.URL || window.webkitURL;
                var fileURL = URL.createObjectURL(file);
                return fileURL;
            };
            elmFile.bind('click', function(e){
                var photoJson = angular.element('[name="thumb_values_edit"]').data('json');
                if(photoJson && photoJson.length>1){
                    //LOAD AUDIO
                }else{
                    var btnDonePhoto = angular.element('#imgUploadThumb .tools .md-cms-green');
                    var btnEditDeletePhoto = angular.element('#imgUploadThumb .preview .md-warn');
                    if(btnDonePhoto.size() === 1){
                        btnDonePhoto.trigger('click');
                    }else if(btnEditDeletePhoto.size() === 1){
                        //EDIT AUDIO IMAGEN
                    }else{
                        //fncLoadEditImg();
                        $msj.show('Debes subir la imagen de cover', positionMSj);
                        e.preventDefault();
                    }
                }
            });
            elmFile.bind('change', function(){
                //Existe FOTO
                ng.$apply(function(){
                    angular.element('#msjVideoLoad').addClass('ng-hide');
                    var files = elmFile[0].files[0]; //FILES UPLOAD
                    var _size = files.size;
                    var __size = $bytesToSize.convert(_size);
                    var arrsize = __size.split(' ');
                    if(arrsize[1] === 'MB' || arrsize[1] === 'GB' || arrsize[1] === 'TB'){
                        if(arrsize[1] === 'MB'){
                            if(Number(arrsize[0]) >= CMSDATA.VIDEOLOAD){
                                angular.element('#msjVideoLoad').removeClass('ng-hide');
                                return false;
                            }
                        }else{
                            angular.element('#msjVideoLoad').removeClass('ng-hide');
                            return false;
                        }
                    }

                    elmAudio.attr('src',getAudioSrc(files));
                    elmAudio.get(0).play();
                    ng.objFile = files;
                    $timeout(function(){
                        initDefault('hide');
                        $timeout(function(){
                            elm.find('.media-options .opt-send').trigger('click');
                        },0);
                        //elmAudio.play();
                    },1000);
                });
            });
            //DELETE AUDIO
            ng.deleteOpt = function(){
                elmFile.val('');
                initDefault('show');

            };
            ng.getSetData = function(url, urlCover, duracion, hash){
                var url = url, urlCover = urlCover, hash = hash;
                ng.json.url = url;
                ng.json.url_cover = urlCover;
                ng.json.duracion = (duracion)?duracion:'';
                ng.json.hash = (hash)?hash:'';
                var _audio = elmAudio.get(0);
                _audio.addEventListener('loadeddata', function() {
                    ng.json.duracion = _audio.duration;
                    scope.$emit('objaudio', ng.json);
                }, false);
                scope.$emit('objaudio', ng.json);
            };
            ng.uploadOpt = function(){
                //COVER IMAGEN AUDIO
                var elm = angular.element('#imgUploadThumb [name="thumb_values"]');
                var jsonData = elm.data('json');
                var imgData = '';
                if(jsonData){
                    imgData = angular.fromJson(jsonData).data;
                    //ng.disabledOpt = false;
                }
                var btnEditDeletePhoto = angular.element('#imgUploadThumb .preview .md-warn');
                if(btnEditDeletePhoto.size() === 1){
                    //EDIT AUDIO IMAGEN
                    imgData = angular.element('#imgUploadThumb img.preview').attr('src');
                }

                var formdata = new FormData();
                formdata.append('file', ng.objFile);
                formdata.append('file_cover', imgData);
                var DATA = formdata;
                var player = elmAudio.get(0);
                player.pause();
                $preload.show();
                $http.post(CMSDATA.URLELEMENTS + '/audio', DATA, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined} /* multipart/form-data */
                }).
                success(function(data) {
                    var data = data;
                    if(data.status){
                        player.src = '';
                        //imgCover.attr('src', '');
                        //player.poster = '';
                        var response = data.response;
                        //ng.removeVideo('ajax', data.response);
                        $timeout(function () {
                            //Insert Datos Video
                            var url = response.url;
                            urlCover = data.response.url_cover;
                            var hash = data.response.name;
                            initDefault('ajax');
                            ng.getSetData(url, urlCover, player.duration, hash);
                            player.src = url;
                            //imgCover.attr('src', urlCover);
                            //Insert Datos Video
                            $preload.hide();
                            $msj.show(CMSDATA.MSJ.MSJ31, positionMSj);
                        }, 1500);
                    }else{
                        ng.getSetData('', '', '', '');
                        $preload.hide();
                        $msj.show(data.error.message, positionMSj);
                    }
                }).error(function(data) {
                    ng.getSetData('', '', '', '');
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ30, positionMSj);
                });
            };

            ng.refresh = function(){
                ng.deleteOpt();
            };

            ng.$on('reset_audio', function(e, msg) {
                var msg = msg;
                if(msg){
                    ng.refresh();
                }
            });

            //Data Refresh
            ng.refreshDimension = function(data){
                var data = data;
                initDefault('ajax');
                elmAudio.get(0).src = data.url;
                //imgCover.attr('src', data.url_cover);
                ng.disabledOpt = false;
            };
            scope.$watch('jsonRefresh', function(newValue, oldValue) {
                if(newValue != false){
                    ng.refreshDimension(newValue);
                }
            });

        }
    };
});

//Upload Audio
app.directive('uploadaudiopodcast', function($preload, $http, $msj, $timeout, $create, $mdDialog) {
    return {
        restrict: 'EA',
        scope: { widthAudio:'@', heightAudio:'@', jsonRefresh:'=' },
        replace: true,
        template: '<div class="content-dropzone-audio">'+
        '   <div class="tagzoneaudio" style="display:none">'+
        '       <audio style="width:573px;height:40px" controls>'+
        '           <source src="{{audioSource}}" type="audio/mp3"> '+
        '           Tu navegador no soporta el elemento audio. '+
        '       </audio>'+
        '       <div class="media-options" style="text-align:right;width:120px;left:105%;top:0px">'+
        '           <md-button type="button" ng-click="uploadOpt()" class="opt-send md-fab md-mini md-cms-green" aria-label="Send">'+
        '               <md-tooltip>Enviar</md-tooltip>'+
        '               <md-icon md-svg-src="./svg/done.svg" style="color:black;"></md-icon>'+
        '           </md-button>'+
        '           <md-button type="button" ng-click="deleteOpt()" class="opt-delete md-fab md-mini md-warn" aria-label="Delete">'+
        '               <md-tooltip>Eliminar</md-tooltip>'+
        '               <md-icon md-svg-src="./svg/delete82.svg" style="color:black;"></md-icon>'+
        '           </md-button>'+
        '       </div>'+
        '   </div>'+
        '   <div class="dropzoneaudio" style="display:block; width:573px; height:80px">' +
        '       <input class="inputAudio" id="inputAudio" accept=".mp3,audio/*" ng-model="audio" type="file" name="thumbaudio" />'+
        '   </div>'+
        '</div>',
        link: function (scope, element, attrs) {
            var ng = scope;

            //UPLOAD video
            ng.audio = '';
            ng.audioSource = '';
            ng.wAudio = attrs.widthAudio;
            ng.hAudio = attrs.heightAudio;
            ng.disabledOpt = false;
            wImage = 573;
            hHeight = 322;

            var elm = element;
            var elmDrop = elm.find('.dropzoneaudio');
            var elmFile = elmDrop.find('input[type="file"]');
            var CntElmAudio = elm.find('.tagzoneaudio');
            var elmAudio = elm.find('audio');
            //var imgCover = angular.element('.cnt-imagen-cover img');
            var optDelete = CntElmAudio.find('.opt-delete');
            //var optCover = CntElmAudio.find('.opt-cover');
            var optSend = CntElmAudio.find('.opt-send');
            ng.objFile = {};
            var positionMSj = 'top right';
            ng.json = {
                url: '',
                url_cover: '',
                duracion: '',
                hash: ''
            };

            //init Value
            var initDefault = function(type){
                var type = type;
                if(type === 'show'){
                    elmDrop.css('display','block');
                    CntElmAudio.css('display','none');
                    optDelete.css('display','inline-block');
                    optSend.css('display','inline-block');
                    //optCover.css('display','inline-block');
                }else if(type === 'ajax'){
                    elmDrop.css('display','none');
                    CntElmAudio.css('display','block');
                    optDelete.css('display','inline-block');
                    //optCover.css('display','none');
                    optSend.css('display','none');
                }else{
                    elmDrop.css('display','none');
                    CntElmAudio.css('display','block');
                    optDelete.css('display','inline-block');
                    optSend.css('display','inline-block');
                    //optCover.css('display','inline-block');
                }
                //imgCover.attr('src', '');
                ng.disabledOpt = false;
            };
            initDefault('show');

            //CHANGE INPUT FILE
            var getAudioSrc = function(file){
                var file = file;
                var type = file.type;
                var URL = window.URL || window.webkitURL;
                var fileURL = URL.createObjectURL(file);
                return fileURL;
            };
            elmFile.bind('change', function(){
                ng.$apply(function(){
                    var files = elmFile[0].files[0]; //FILES UPLOAD
                    elmAudio.attr('src',getAudioSrc(files));
                    elmAudio.get(0).play();
                    ng.objFile = files;
                    $timeout(function(){
                        initDefault('hide');
                        elm.find('.media-options .opt-send').trigger('click');
                        //elmAudio.play();
                    },1000);
                    //var fileSize = files.length;
                    //ng.objFilesMultiple = files;
                    //showOptions();
                });
            });
            //DELETE AUDIO
            ng.deleteOpt = function(){
                elmFile.val('');
                initDefault('show');

            };
            ng.getSetData = function(url, urlCover, duracion, hash){
                var url = url, urlCover = urlCover, hash = hash;
                ng.json.url = url;
                ng.json.url_cover = urlCover;
                ng.json.duracion = (duracion)?duracion:'';
                ng.json.hash = (hash)?hash:'';
                var _audio = elmAudio.get(0);
                _audio.addEventListener('loadeddata', function() {
                    ng.json.duracion = _audio.duration;
                    scope.$emit('objaudio', ng.json);
                }, false);
                //videoPlayer.parent().find('.thumbData').data('json', ng.json);
                scope.$emit('objaudio', ng.json);
            };
            ng.uploadOpt = function(){
                //COVER IMAGEN AUDIO
                var elm = angular.element('#imgUploadThumb [name="thumb_values"]');
                var jsonData = elm.data('json');
                var imgData = '';
                if(jsonData){
                    imgData = angular.fromJson(jsonData).data;
                    //ng.disabledOpt = false;
                }
                var formdata = new FormData();
                formdata.append('file', ng.objFile);
                formdata.append('file_cover', imgData);
                var DATA = formdata;
                var player = elmAudio.get(0);
                player.pause();
                $preload.show();
                $http.post(CMSDATA.URLELEMENTS + '/audio', DATA, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined} /* multipart/form-data */
                }).
                success(function(data) {
                    var data = data;
                    if(data.status){
                        player.src = '';
                        //imgCover.attr('src', '');
                        //player.poster = '';
                        var response = data.response;
                        //ng.removeVideo('ajax', data.response);
                        $timeout(function () {
                            //Insert Datos Video
                            var url = response.url;
                            urlCover = data.response.url_cover;
                            var hash = data.response.name;
                            initDefault('ajax');
                            ng.getSetData(url, urlCover, player.duration, hash);
                            player.src = url;
                            //imgCover.attr('src', urlCover);
                            //Insert Datos Video
                            $preload.hide();
                            $msj.show(CMSDATA.MSJ.MSJ31, positionMSj);
                        }, 1500);
                    }else{
                        ng.getSetData('', '', '', '');
                        $preload.hide();
                        $msj.show(data.error.message, positionMSj);
                    }
                }).error(function(data) {
                    ng.getSetData('', '', '', '');
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ30, positionMSj);
                });
            };

            ng.refresh = function(){
                ng.deleteOpt();
            };

            ng.$on('reset_audio', function(e, msg) {
                var msg = msg;
                if(msg){
                    ng.refresh();
                }
            });

            //Data Refresh
            ng.refreshDimension = function(data){
                var data = data;
                initDefault('ajax');
                elmAudio.get(0).src = data.url;
                //imgCover.attr('src', data.url_cover);
                ng.disabledOpt = false;
            };
            scope.$watch('jsonRefresh', function(newValue, oldValue) {
                if(newValue != false){
                    ng.refreshDimension(newValue);
                }
            });

        }
    };
});

//TARGET BLANK
/*app.directive('targetBlank', function() {
    return {
        compile: function(element) {
            var elems = (element.prop("tagName") === 'A') ? element : element.find('a');
            elems.attr("target", "_blank");
        }
    };
});*/

//IMG FALLBACK
app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
        var errorSrc = 'img/img-fallback.png';
        element.bind('load', function() {
            element.parents('.preload').removeClass('preload');
            element.removeClass('preload-img');
        });
        scope.$watch(function() {
            return attrs['src'];
        }, function (value) {
            if (!value) {
                element.attr('src', errorSrc);
            }
        });
        element.bind('error', function() {
            element.attr('src', errorSrc);
        });
    }
  }
});

//MSJ INIT
app.directive('msjInit', function($window, $templateCache, $localStorage, $timeout) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div ng-show="activo" id="msj-init--change">'+
        'Hemos mejorado el CMS, Haz click para actualizar el sistema.'+
        '<md-button ng-click="refreshCMS()" class="md-raised md-warn">Aceptar</md-button>'+
        '</div>',
        link: function (scope, element, attrs) {
            var ng = scope;
            ng.activo = false;
            if(CMSDATA.MSJREFRESH){
                if($localStorage.msjinit === 2){
                    ng.activo = false;
                }else{
                    ng.activo = true;
                }
            }else{
                ng.activo = false;
                $localStorage.msjinit = 2;
            }
            ng.refreshCMS = function(){
                $localStorage.msjinit = 2;
                $templateCache.removeAll();
                $timeout(function(){$window.location.reload(true);},250);
            };
        }
    };
});

//MENU LATERAL DERECHA
/* SEARCH PORTADAS */
app.directive('menuLateralDerecha', function($menuleft, $menuLeftRS, $location) {
    return {
        restrict: 'EA',
        scope: {
            activo:'@',
            modulo:'@'
        },
        replace: true,
        template: '<md-list>'+
        '  <md-list-item has-permission slug-module="{{itemmenu.slug}}" action-module="{{itemmenu.action}}" ng-click="navegarA(itemmenu, $event)" class="md-item-menu-nav" ng-class="{active:(itemmenu.active === activoItem), submenuespecial : itemmenu.submenu}" ng-disabled="itemmenu.active === activoItem" ng-repeat="itemmenu in menuleft">'+
        '      <div class="inset">'+
        '          <ng-md-icon icon="{{itemmenu.icon}}"></ng-md-icon>'+
        '      </div>'+
        '      <div class="inset">{{itemmenu.title}}</div>'+
        '      <md-divider></md-divider>'+
        '  </md-list-item>'+
        '</md-list>',
        controller: function($scope, $element, $attrs){
            $scope.activo = $attrs.activo;
            // console.log($scope.activo, 'activo');
        },
        link: function (scope, element, attrs) {
            var ng = scope;
            ng.menuleft = (ng.modulo=='redes-sociales') ? $menuLeftRS.get() : $menuleft.get();
            angular.forEach(ng.menuleft, function(v, k){
              v.action = (v.action)?v.action:'index';
            });
            ng.activoItem = ng.activo;
            ng.navegarA = function(item, $event){
                var _link = item.link;
                //if(ng.activoItem != item.active){
                    $location.path(_link);
                //}
            };
        }
    };
});

//SCROLL TRIGGER
app.directive('scrollTrigger', function($window) {
    return {
        restrict: "EA",
        scope: {
          scrollContainer: '@',
          scrollFunction: '&'
        },
        link : function(scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var e = jQuery(element[0]);

            var doc = jQuery(document);
            if(scope.scrollContainer){
              doc.unbind('scroll');
              doc = $(scope.scrollContainer);
            }
            //if (doc.scrollTop() + offset > e.offset().top) {
            doc.unbind('scroll').bind('scroll', function() {
                if (doc.scrollTop() + $window.innerHeight + offset > e.offset().top) {
                    scope.$apply(scope.scrollFunction);
                }
            });
        }
    };
});

//COPY LINK
app.directive('copyLink', function($http, $msj){
    return {
        restric: 'EA',
        scope: { sitio : '=' },
        template: '<div class="content-search">'+
            '<div class="inputBlock" layout>'+
            '    <div flex="80">'+
            '        <md-input-container style="padding-bottom:0.25em" flex="100" flex-sm="100">'+
            '            <label>Buscar noticias</label>'+
            '            <input ng-model="searchRel" ng-readonly="readonlySearchCT" ng-keypress="keySearchRelated($event)">'+
            '        </md-input-container>'+
            '    </div>'+
            '    <div flex="20">'+
            '        <md-button type="button" ng-click="searchRelated()" class="md-icon-button md-primary" aria-label="Buscar">'+
            '            <md-tooltip>Buscar</md-tooltip>'+
            '            <ng-md-icon icon="search" style="" size="24"></ng-md-icon>'+
            '        </md-button>'+
            '    </div>'+
            '</div>'+
            '<div class="inputBlock" layout ng-class="{scrollauto : listArrSocialCT.length>4}">'+
            '    <div class="content-result" style="width:100%">'+
            '        <div style="text-align:center;width:100%">'+
            '            <md-progress-circular style="display:inline-block;margin-top:20px;" ng-show="searchLoadCT" md-mode="indeterminate"></md-progress-circular>'+
            '        </div>'+
            '        <div ng-show="listArrSocialNoResultCT" class="alert-warn md-body-1">No se encontraron resultados en la búsqueda.</div>'+
            '        <ul ng-show="!searchLoadCT">'+
            '            <li ng-repeat="file in listArrSocialCT track by $index">'+
            '                <div class="div-result div-related">'+
            '                    <div class="done-related">'+
            '                        <md-button type="button"  ng-click="clickCheckCT($index, file)" class="md-fab md-cms-green md-mini" aria-label="Copiar">'+
            '                            <md-tooltip>Copiar Link</md-tooltip>'+
            '                            <ng-md-icon icon="content_copy" style="fill:white" size="24"></ng-md-icon>'+
            '                        </md-button>'+
            '                    </div>'+
            '                    <div class="div-author">'+
            '                        <a target="_blank" href="{{file.url}}"><img err-src style="width:82px;height:auto; margin:0;padding:0" ng-src="{{file.foto}}" alt="{{file.titulo}}" /></a>'+
            '                    </div>'+
            '                    <div class="div-text">'+
            '                        <div><a target="_blank" href="{{file.url}}">{{file.titulo}}</a></div>'+
            '                    </div>'+
            '                </div>'+
            '            </li>'+
            '        </ul>'+
            '    </div>'+
            '</div>'+
        '</div>',
        replace : true,
        link : function(scope, element, attrs){
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

                var __url = CMSDATA.URLSEARCHSOCIAL + '/' + scope.searchRel + '/' + type + '?sitio=', _url;
                if(scope.sitio){
                    _url = __url + scope.sitio;
                }else{
                    _url = __url + scope.$parent.objSitio;
                }

                $http.get(_url).
                success(function(data){
                    var data = data;
                    if(data != null){
                        if(data.status){
                            var response = data.response;
                            scope.listArrSocialCT = (response)?response:[];
                            scope.searchLoadCT = false;
                            scope.readonlySearchCT = false;
                            $msj.show(CMSDATA.MSJ.MSJ28, CMSDATA.POSITIONMSJ);
                            if(response.length<=0){
                                scope.listArrSocialNoResultCT = true;
                            }else{
                                scope.listArrSocialNoResultCT = false;
                            }
                        }else{
                            scope.readonlySearchCT = false;
                            scope.searchLoadCT = false;
                            scope.listArrSocialNoResultCT = false;
                            $msj.show(CMSDATA.MSJ.MSJ29, CMSDATA.POSITIONMSJ);
                        }
                    }else{
                        scope.searchLoadCT = false;
                        scope.readonlySearchCT = false;
                        scope.listArrSocialNoResultCT = false;
                        $msj.show(CMSDATA.MSJ.MSJ29, CMSDATA.POSITIONMSJ);
                    }
                }).error(function(data) {
                    scope.searchLoadCT = false;
                    scope.readonlySearchCT = false;
                    scope.listArrSocialNoResultCT = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, CMSDATA.POSITIONMSJ);
                });
            };
            //Copiar
            scope.clickCheckCT = function(index, obj){
                var index = index, obj = obj;
                var url = obj.url;
                //COPY URL
                var copyFrom = document.createElement("textarea");
                copyFrom.textContent = url + '?ns_source=self&ns_mchannel=articulo.body&ns_campaign=content.rel';
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(copyFrom);
                copyFrom.select();
                document.execCommand('copy');
                body.removeChild(copyFrom);
                //END COPY URL
            };


        }
    }
});

//JWPLAYER
app.directive('jwplayer2', function($compile, $interval, $http, $msj, $preload, $timeout){
  return {
        restrict: 'ECA',
        scope: {
            playerId: '@',
            playerPid: '@',
            playerEst: '@',
            setupVars: '=setup',
            configVal: '@',
            onlyPlayer: '@'
        },
        link: function (scope, element, attrs) {
            var positionMSj = 'top right';
            var stop;
            var duration = -1;
            var refreshTime = 10;
            scope.changingOption = false;
            scope.reportingError = false;
            scope.track = false;
            scope.lostConnection = null;
            scope.timeError = 0;
            scope.playerStatus = 'iddle';
            scope.showEmbed = false;
            scope.unTrack = function(){
              scope.track = false;
              if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
                scope.timeError = 0;
                scope.lostConnection = null;
                duration = -1;
              }
            };
            if(!scope.configVal){
              scope.estado = scope.setupVars.estado;
              scope.sitio_url = scope.setupVars.sitio_url;
              scope.tipo = scope.setupVars.tipo;
            }
            scope.onChange = function(){
              if (scope.changingOption) return;
              scope.changingOption = true;

              $preload.show();

              $http.post(CMSDATA.GLOBAL.URLBASE + 'player/status', {'pid': scope.playerPid, 'player': scope.playerId, 'estado': scope.estado}).
                success(function(data, status, headers, config) {
                  var data = data;
                  $msj.show(data.response.op, positionMSj);
                  $preload.hide();
                  scope.changingOption = false;
                }).error(function(data, status, headers, config) {
                  $msj.show(CMSDATA.MSJ.MSJ66, positionMSj);
                  $preload.hide();
                  scope.changingOption = false;
                });
            };
            scope.toogleEmbed = function(){
              scope.showEmbed = !scope.showEmbed;
            };

            scope.$on('$destroy',function(){
              if(stop)
                  $interval.cancel(stop);
            });

            var verify_connection = function(){
              stop = $interval(function() {
                scope.lostConnection = (duration==jwplayer(id).getPosition());
                scope.playerStatus = jwplayer(id).getState();
                if(scope.lostConnection){
                  scope.timeError = scope.timeError+refreshTime;
                  report_error();
                }else{
                  scope.timeError = 0;
                }
                duration = jwplayer(id).getPosition();
              }, refreshTime*1000);
            };

            var report_error = function(){
              if (scope.reportingError) return;
              scope.reportingError = true;

              $http.post(CMSDATA.GLOBAL.URLBASE + 'player/error', {'pid': scope.playerPid, 'id': scope.playerId, 'duracion': scope.timeError}).
                success(function(data, status, headers, config) {
                  var data = data;
                  scope.reportingError = false;
                }).error(function(data, status, headers, config) {
                  scope.reportingError = false;
                });
            };

            var id = scope.playerId,
                estado = scope.playerEst,
                sitio_url = scope.sitio_url,
                tipo = scope.tipo,
                getTemplate = function (playerId,sitio_url, tipo) {
                  return '    <div id="' + playerId + '"></div>'+
                         '    <div ng-show="!onlyPlayer&&showEmbed" class="indicadores embed_url" layout="row" layout-align="space-around center">'+
                         '      <input placeholder="EMBED URL" type="text" value=\'<iframe width="420" height="315" src="' + sitio_url + '/embed/' + tipo + '" frameborder="0" allowfullscreen></iframe>\'>'+
                         '    </div>'+
                         '    <div ng-hide="onlyPlayer" class="indicadores" layout="row" layout-align="space-around center">'+
                         '      <div ng-switch on="playerStatus" class="item">'+
                         '        <ng-md-icon ng-switch-when="iddle" icon="stop" size="28" style="fill:black"><md-tooltip>Detenido</md-tooltip></ng-md-icon>'+
                         '        <ng-md-icon ng-switch-when="playing" icon="play_circle_fill" size="28" style="fill:black"><md-tooltip>Reproduciendo</md-tooltip></ng-md-icon>'+
                         '        <ng-md-icon ng-switch-when="paused" icon="pause_circle_fill" size="28" style="fill:black"><md-tooltip>Pausado</md-tooltip></ng-md-icon>'+
                         '        <ng-md-icon ng-switch-when="buffering" icon="settings_remote" size="28" style="fill:black"><md-tooltip>Buffering</md-tooltip></ng-md-icon>'+
                         '        <ng-md-icon ng-switch-when="error" icon="error" size="28" style="fill:black"><md-tooltip>Error</md-tooltip></ng-md-icon>'+
                         '      </div>'+
                         '      <div class="item">'+
                         '        <ng-md-icon ng-click="toogleEmbed()" icon="video_collection" size="28" style="fill:black"><md-tooltip>{{ showEmbed?"Ocultar":"Mostrar" }} embed</md-tooltip></ng-md-icon>'+
                         '      </div>'+
                         '      <div ng-switch on="lostConnection" class="item animate-connection">'+
                         '        <span ng-switch-when="null"><md-tooltip>Conección no verificada</md-tooltip></span>'+
                         '        <ng-md-icon ng-switch-when="false" icon="sync" size="28" style="fill:green"><md-tooltip>Conección establecida satisfactoriamente</md-tooltip></ng-md-icon>'+
                         '        <ng-md-icon ng-switch-when="true" icon="sync_problem" size="28" style="fill:red"><md-tooltip>Conección interrumpida</md-tooltip></ng-md-icon>'+
                         '      </div>'+
                         '      <div ng-switch on="track" class="item">'+
                         '        <ng-md-icon ng-switch-when="true" icon="visibility" size="28" style="fill:black"><md-tooltip>En seguimiento</md-tooltip></ng-md-icon>'+
                         '        <ng-md-icon ng-switch-when="false" icon="visibility_off" size="28" style="fill:black"><md-tooltip>Sin seguimiento</md-tooltip></ng-md-icon>'+
                         '      </div>'+
                         '      <div class="item">'+
                         '        <md-tooltip>Activar / Desactivar</md-tooltip>'+
                         '        <md-switch class="md-primary no-margin" ng-model="estado" aria-label="Estado"'+
                         '                   ng-true-value="1" ng-false-value="0"  '+
                         '                   ng-change="onChange()">'+
                         '        </md-switch>'
                         '      </div>'+
                         '    </div>'
                };

            element.html(getTemplate(id,sitio_url, tipo));
            $compile(element.contents())(scope);
             $timeout(function(){
                 if(scope.configVal){
                    var obj = {
                        autostart: false,
                        id: id,
                        file: '',
                        width: CMSDATA.DIMENSION16x9.widthLarge,
                        height: CMSDATA.DIMENSION16x9.heightLarge,
                        image: 'http://s3.amazonaws.com/p-gruporpp-media-v/small/2016/02/16/portada_130313.jpg',
                        skin: {
                            name: 'bekle'
                        },
                        plugins: {
                            '/js/lib/jwplayer/spectrumvisualizer.swf': {}
                        },
                    };

                    var _objConfig = eval('(' + scope.configVal + ')');
                    angular.extend(obj, _objConfig);

                      jwplayer(id).setup(obj);
                 }else{
                      jwplayer(id).setup(scope.setupVars);
                 }
                jwplayer(id).on('buffer', function(){
                    if(!scope.onlyPlayer){
                        scope.$apply(function () {
                            scope.track = true;
                            scope.playerStatus = jwplayer(id).getState();
                            verify_connection();
                        });
                    }
                });

                jwplayer(id).on('play', function(){
                    if(!scope.onlyPlayer){
                        if(scope.playerStatus!="paused") return;
                            scope.$apply(function () {
                            scope.track = true;
                            scope.playerStatus = jwplayer(id).getState();
                            verify_connection();
                        });
                    }
                });

                jwplayer(id).on('pause', function(){
                    if(!scope.onlyPlayer){
                        scope.$apply(function () {
                            scope.playerStatus = jwplayer(id).getState();
                            scope.unTrack();
                        });
                    }
                });

            },0);

        }
    };
});

app.directive('stringToTimestamp', function() {
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ngModel) {
            ngModel.$parsers.push(function(value) {
                // var ms=Date.parse(value)
                // return Math.floor(value/1000);
                return Date.parse(value);
            });
        }
    }
});

app.directive('collapseCard', function (){
  return {
      restrict: 'A',
      link: function (scope, element){
        $.fn.paperCollapse = function(options) {
          var settings;
          var body = this;
          var title = $(this).find(".title");
          return settings = $.extend({}, $.fn.paperCollapse.defaults, options),
          title.click(function(){
            $(body).hasClass("active")?(settings.onHide.call(body), $(body).removeClass("active"),
            $(body).find(".body").slideUp(settings.animationDuration, settings.onHideComplete)):(settings.onShow.call(body), $(body).addClass("active"),
            $(body).find(".body").slideDown(settings.animationDuration,settings.onShowComplete))
          }), body
        },
        $.fn.paperCollapse.defaults = {
          animationDuration:400, easing:"swing",
          onShow:function(){}, onHide:function(){}, onShowComplete:function(){},
          onHideComplete:function(){}
        }
        $(element).paperCollapse({});
      }
  };
});

app.directive('validNumber', function() {
      return {
        require: '?ngModel',
        scope: {
            decimalNumber: '@'
        },
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return;
          }
          scope.decimalNumber = angular.isDefined(scope.decimalNumber)?parseInt(scope.decimalNumber):1;
          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }

            var clean = val.replace(/[^-0-9\.]/g, '');
            var negativeCheck = clean.split('-');
            var decimalCheck = clean.split('.');
            if(!angular.isUndefined(negativeCheck[1])) {
                negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                clean =negativeCheck[0] + '-' + negativeCheck[1];
                if(negativeCheck[0].length > 0) {
                    clean =negativeCheck[0];
                }

            }

            if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0, scope.decimalNumber);
                clean =decimalCheck[0] + '.' + decimalCheck[1];
            }

            if (val !== clean) {
              ngModelCtrl.$setViewValue(clean);
              ngModelCtrl.$render();
            }

            // if(clean>=0&&clean<=100)
            return clean;
          });

          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    });

app.directive('hasPermission', function(permissions) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var slug = attrs.slugModule.trim();
      var action = attrs.actionModule.trim();

      var notPermissionFlag = slug[0] === '!';
      if(notPermissionFlag) {
        slug = slug.slice(1).trim();
      }

      function toggleVisibilityBasedOnPermission() {
        var hasPermission = permissions.hasPermission(slug, action);
        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
          element.show();
        }
        else {
          element.hide();
        }
      }

      toggleVisibilityBasedOnPermission();
      scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
    }
  };
});

app.directive('numberMask', function() {
    return function(scope, element, attrs) {
        var min = parseInt(attrs.min, 10) || 0,
            max = parseInt(attrs.max, 10) || 10,
            value = element.val();
        element.on('keyup', function(e) {
            if (!between(element.val(), min, max)) {
               element.val(value);
            } else {
                value = element.val();
            }
        });

        function between(n, min, max) { return n >= min && n <= max; }
    }
});

app.directive('integerPositive', function() {
    return function(scope, element, attrs) {
        var keyCode = [8, 9, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        element.bind("keydown", function(event) {
            if ($.inArray(event.which, keyCode) === -1) {
                scope.$apply(function() {
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }
        });
    };
});

// Directiva para animar numeros - mM
app.directive('numberAnimate', function(){
    return function(scope, element, attrs){
        var end = parseInt(attrs.endAnimate);
        var decimal = (end % 1).toFixed(2);
        var _decimal = (decimal && decimal != 0.00)? decimal : false;
        porcentAnimate(0, end, 1500, _decimal);
        function porcentAnimate(start, end, duration, decimal) {
            var range = end - start;
            var minTimer = 50;
            var stepTime = Math.abs(Math.floor(duration / range));
            stepTime = Math.max(stepTime, minTimer);
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var timer;
            function run() {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = Math.round(end - (remaining * range));
                element[0].innerHTML = value;
                if (value == end) {
                    if(decimal){
                        element.innerHTML = (parseFloat(value)+parseFloat(decimal)).toFixed(2);
                    }
                    clearInterval(timer);
                }
            }
            var timer = setInterval(run, stepTime);
            run();
        };
    };
});
