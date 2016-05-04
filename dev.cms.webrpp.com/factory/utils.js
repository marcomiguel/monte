//PRELOAD
app.factory('$preload', ['$document',
  function($document) {
    return {
        show: function(){
            $document.find('body > #loaderFull').remove();
            var _elm = angular.element('<div id="loaderFull" style="padding-top:26%;"><md-progress-circular style="margin:0 auto;" md-mode="indeterminate" aria-valuemin="0" aria-valuemax="100" role="progressbar" class="md-default-theme" style="-webkit-transform: scale(1);"><div class="md-spinner-wrapper"><div class="md-inner"><div class="md-gap"></div><div class="md-left"><div class="md-half-circle"></div></div><div class="md-right"><div class="md-half-circle"></div></div></div></div></md-progress-circular></div>');
            $document.find('body').append(_elm);
        },
        hide: function(){
            $document.find('body > #loaderFull').remove();
        }
    };
 }]);

 //LOGOUT
 app.factory('$logout', ['$preload', '$location', '$http', '$timeout', '$localStorage',
   function($preload, $location, $http, $timeout, $localStorage) {
     return {
         get : function(url){
             var url = url;
             var TIMERESULT = 1000/2;
             $preload.show();
             $http.get(url).
             success(function(data, status, headers, config) {
                 var data = data;
                 $timeout(function(){
                     if(!data.status){
                         delete $localStorage.login;
                         $preload.hide();
                         $location.path('/');
                     }else{
                         $preload.hide();
                     }
                 },TIMERESULT);
             }).error(function(data, status, headers, config) {
                 $timeout(function(){
                     $preload.hide();
                 },TIMERESULT);
             });
         }
     };
  }]);

 //BUILD SEARCH
 app.factory('$datasearch', ['$http', function($http){
     return {
         get: function() {

         }
     };
 }]);

//GUID
app.factory('$create', [
    function() {
       return {
         guid: function () {
             // http://www.ietf.org/rfc/rfc4122.txt
             var s = [];
             var hexDigits = "0123456789abcdef";
             for (var i = 0; i < 36; i++) {
                 s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
             }
             s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
             s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
             s[8] = s[13] = s[18] = s[23] = "-";
             return s.join("");
        },
        getTime: function(){
            var date = new Date();
            return date.getTime();
        }
    }
}]);

//MSJ
app.factory('$msj', ['$mdToast',
    function($mdToast) {
    return {
        show: function(msj, position){
            var msj = msj, position = position;
            $mdToast.show($mdToast.simple({position:position}).content(msj));
        }
    };
}]);

// IS EXIST
app.factory('$isExist',
 function() {
   return {
       obj: function(arr, name){
           return arr.hasOwnProperty(name);
       }
   };
});


//SCROLL TO
app.factory('$scrollGo',
    function() {
        return {
            go: function(elm, callback){
                $('body').animate({scrollTop: angular.element(elm).offset().top - 150}, 'slow', function(){
                    if(callback){
                        callback();
                    }
                });
            }
        };
    }
);

//Bytes to SIZE
app.factory('$bytesToSize',
    function() {
        return {
            convert: function(bytes){
                var bytes = bytes;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return 'n/a';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                if (i == 0) return bytes + ' ' + sizes[i];
                return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
            }
        };
    }
);

//Retorna Extension
app.factory('$isExtension',
    function() {
        return {
            get: function(url){
                if(url){
                    var arrUrl = url.split('.');
                    var ext = arrUrl.pop();
                    return ext.toLowerCase();
                }else{
                    return '';
                }
            }
        };
    }
);

//Insert Javascript
app.factory('$insertJavascript',
    function() {
        return {
            fb : function(version){
                if (typeof (FB) === 'undefined') {
                    var _script = document.createElement('script');
                    _script.async = true;
                    _script.src = '//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v'+version;
                    _script.async = true;
                    _script.charset = 'utf-8';
                    document.head.appendChild(_script);
                }
            }
        };
    }
);

//FACEBOOK
app.factory('$popup', function($q, $window, $preload) {
    return {
        open: function(url, title, w, h, closeCallback) {
            var url = url,
            title = title,
            w = w,
            h = h
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/2);
            var win = $window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
            var interval = $window.setInterval(function() {
                    try {
                        if (win == null || win.closed) {
                            $window.clearInterval(interval);
                            closeCallback(win);
                        }
                    }
                    catch (e) {
                    }
            }, 1000);
            return win;
        }
    }
});

//Load IMG
//FACEBOOK
app.factory('$loadimg', function($preload, $msj, $http) {
    return {
        load: function(success, error) {
            var URL = CMSDATA.GLOBAL.URLBASE, URLOADIMGPHOTO = 'elementos/upload/photo';
            if(angular.element('#inputFileLoadImg').size()<=0){
                angular.element('body').append('<input '+
                'style="visibility:hidden; height:1px; overflow:hidden;"'+
                ' accept="image/x-png, image/png, image/jpeg, image/jpg, image/gif"'+
                ' type="file" id="inputFileLoadImg" />');
            }
            var elmFile = angular.element('#inputFileLoadImg');
            elmFile.val('');
            elmFile.trigger('click');
            elmFile.bind('change', function(){
                //ng.$apply(function(){
                    var files = elmFile[0].files; //FILES UPLOAD
                    loadPhoto(files);
                //});
            });
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
                    (success)?success(data):'';
                    $preload.hide();
                }).error(function(err) {
                    (error)?error(err):'';
                    $preload.hide();
                    $msj.show(CMSDATA.MSJ.MSJ23, CMSDATA.POSITIONMSJ);
                });
            };
        }
    }
});

//DEBOUNCE
// Create an AngularJS service called debounce
app.factory('$debounce', ['$timeout','$q', function($timeout, $q) {
  return function debounce(func, wait, immediate) {
    var timeout;
    var deferred = $q.defer();
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) {
          deferred.resolve(func.apply(context, args));
          deferred = $q.defer();
        }
      };
      var callNow = immediate && !timeout;
      if ( timeout ) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(later, wait);
      if (callNow) {
        deferred.resolve(func.apply(context,args));
        deferred = $q.defer();
      }
      return deferred.promise;
    };
  };
}]);

app.factory('permissions', function ($rootScope) {
  return {
    setPermissions: function(permissions) {
      permissionList = permissions;
      $rootScope.$broadcast('permissionsChanged');
    },
    hasPermission: function (slug, action) {
      if(slug in permissionList){
        if(permissionList[slug].indexOf(action) > -1)
          return true;
      }
      return false;
    },
    listPermission: function(slug){
      return permissionList[slug];
    },
    getPermissions: function() {
      return permissionList;
    }
  };
});
