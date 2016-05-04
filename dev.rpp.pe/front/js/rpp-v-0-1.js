//OBJ RPP
'use strict';
var rpp = window.rpp || {},
rpp = {
    debounce: function(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		var later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		var callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    },
    flexGrid : function(t,breakpoint,nxcol){
        var _t = $(t),
        _childs = _t.children(),
        minW = breakpoint.smartphone,
        minWDT = breakpoint.desktop,
        minWT = breakpoint.tablet,
        nxcol = nxcol,
        nxcolPorc = 100/nxcol + '%',
        wScroll = 15,
        _wW = $(window).width() + wScroll,
        isSmartphone = _wW <= minW,
        isInterDesktopAndTablet = _wW >= minWT && _wW <= minWDT;
        function checkViewPort(_childs, isMethod){
            _t.height('auto');
            for ( var i = 0; i < _childs.length; i++ ) {
                $(_childs[i]).css({
                  'opacity':'1',
                  'visibility':'visible',
                  'position': 'static',
                  'width':'100%',
                  'padding-left':'0',
                  'padding-right':'0'
                });
            };
        };
        function resetBuildChild(_arrCH){
          _arrCH.css({
              'width':'50%',
              'padding-left':'',
              'padding-right':''
          });
        };
        function buildChild(_arrCH, l, w, t){
          _arrCH.css({
              'position':'absolute',
              'visibility': 'visible',
              'opacity': '1',
              'left':l,
              'width':w,
              'top': t
          });
        };
        function flexParent(_t,_childs,arrChildsCache,arrChildsCacheLeft,arrChildsCacheRight){
            var h = 0,count=0, paddingLR = $(_childs[0]).css('padding-right');
            for ( var i = 0; i < arrChildsCache.length; i++ ) {
                var _in = i+1;
                var _arrCH = $(_childs[i]);
                if(_in % nxcol == 0){
                    //i => 3(-3),5(-4),7(-5),9(-6),11(-7)
                    //[cache] =>   0,    1,    2,    3,    4
                    var _arrCH = _arrCH, l=nxcolPorc, w=nxcolPorc, t =(i>2)?arrChildsCacheLeft[i-(count+1)]:'0px';
                    buildChild(_arrCH, l, w,t);
                }else{
                    count++;

                    if(i == (arrChildsCache.length - 1)){ /*Last Item*/
                        var hH = (arrChildsCacheLeft[arrChildsCacheLeft.length-1] > arrChildsCacheRight[arrChildsCacheRight.length-2]);

                        var _arrCH = _arrCH, l=hH?0:nxcolPorc, w=nxcolPorc, t =hH?arrChildsCacheRight[i-count]:arrChildsCacheLeft[i-count];
                        buildChild(_arrCH, l, w,t);

                        if(hH){
                            _arrCH.css({'padding-right':paddingLR});
                        }else{
                            _arrCH.css({'padding-left':paddingLR});
                        }
                    }else{ /* Alls Items*/
                        //i => 2(-2),4(-3),6(-4),8(-5),10(-6)
                        //[cache]  =>   0,     1,    2,    3,   4
                        var _arrCH = _arrCH, l=0, w=nxcolPorc, t =(i>1)?arrChildsCacheRight[i-count]:'0px';
                        buildChild(_arrCH, l, w,t);
                    }
                }
            };
            //Height
            _t.css({
                height: Math.max(arrChildsCacheLeft[arrChildsCacheLeft.length - 1], arrChildsCacheRight[arrChildsCacheRight.length - 1])
            });
        };
        function buildCard(_arrCH, cls, l, t){
            _arrCH.addClass(cls).css({
                'position':'absolute',
                'visibility': 'visible',
                'opacity': '1',
                'left': l,
                'top': t
            });
        };
        function flexBuild(_childs,isMethod){
            var hLeft = 0, hRight = 0;
            var arrChildsCache = [],
            arrChildsCacheLeft = [],
            arrChildsCacheRight = [];

            for ( var i = 0; i < _childs.length; i++ ) {
               var _arrCH = $(_childs[i]);
               resetBuildChild(_arrCH);
               var arrInnerCache = [],
               w = _arrCH.width(),
               h = _arrCH.height();
               arrInnerCache.push(w);
               arrInnerCache.push(h);
               arrChildsCache.push(arrInnerCache);
               var _in = i+1;

               if(_in % nxcol == 0){
                   hLeft += h;
                   arrChildsCacheLeft.push(hLeft);
               }else{
                   hRight += h;
                   arrChildsCacheRight.push(hRight);
               }

           };
           flexParent(_t,_childs,arrChildsCache,arrChildsCacheLeft,arrChildsCacheRight);
        };
        //Init
        if(isSmartphone || isInterDesktopAndTablet){
            checkViewPort(_childs, 'normal');
        }else{
            flexBuild(_childs,'normal');
        }

        $(window).on('resize orientationchange', this.debounce(function(e) {
            var _wW = $(window).width() + wScroll,
            isSmartphone = _wW <= minW,
            isInterDesktopAndTablet = _wW >= minWT && _wW <= minWDT;
            //Init
            if(isSmartphone || isInterDesktopAndTablet){
                checkViewPort(_childs,'resize');
            }else{
              resetBuildChild(_childs);
              setTimeout(function(){
                flexBuild(_childs,'resize');
              },1000);
            }
            return false
        },500));
    },
    collapse: function(t){
        var _t = $(t),
        classM = 'active',
        rotate = 'icon-rotate-180';
        _t.on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            var _T = $(this),
            data = _T.data('target'),
            _child = _T.siblings(data),
            _Tf = _T.siblings('i');
            _T.parent().addClass(classM);
            if(_T.hasClass('open')){
                _T.removeClass('open');
                _child.hide();
                _T.parent().removeClass(classM);
                _Tf.removeClass(rotate);
            }else{
                _T.addClass('open');
                _child.show();
                _Tf.addClass(rotate);
            }
        });
    },
    navMovil: function(t, navmovil,navclose,breakpoint){
        var _t = $(t),
        navmovil = $(navmovil),
        navclose = $(navclose),
        navlayer = navmovil.find('> .layer'),
        headmovil = navmovil.children('.header-nav-movil'),
        bodymovil = navmovil.children('.nav-inner'),
        _b = document.getElementById('pad-swipe-nav'),
        _bB = document.getElementById('nav-movil'),
        _body = $('body'),
        fncOpen = function(){
            navmovil.show();
            headmovil.show().css({'top':'0px'});
            bodymovil.show().css({'right':'0px'});
            _body.css({'overflow':'hidden'});
        },
        fncClose = function(){
            headmovil.css({'top':'-100%'});
            bodymovil.css({'right':'-100%'});
            navmovil.hide('fast');
            _body.removeAttr('style');
        };
        _t.click(function(e){
            e.stopPropagation();
            e.preventDefault();
            fncOpen();
        });
        navclose.click(function(e){
            e.stopPropagation();
            e.preventDefault();
            fncClose();
        });
        navlayer.click(function(e){
            e.stopPropagation();
            e.preventDefault();
            fncClose();
        });
        //SWIPE
        var _B = new Hammer(_b),
        _BB = new Hammer(_bB);
        _B.on('swipeleft', function(e){
            var isDesktop = $(window).width() + wScroll >= minW;
            if(!isDesktop){
                fncOpen();
            }
            return false;
        });
        _BB.on('swiperight', function(e){
            var isDesktop = $(window).width() + wScroll >= minW;
            if(!isDesktop){
                fncClose();
            }
            return false;
        });
        //RESIZE
        var minW = breakpoint,
        wScroll = 15;
        $(window).on('resize orientationchange', this.debounce(function(e) {
            var isDesktop = $(window).width() + wScroll >= minW;
            if(isDesktop){
                headmovil.hide().css({'top':'-100%'});
                bodymovil.hide().css({'right':'-100%'});
                navmovil.hide('fast');
            }
        },1000));

    },
    calendar : function(t){
       var _rc = $(t),
       url_redirect = '/archivo_',
       d = new Date(),
       yd = d.getFullYear(),
       md = d.getMonth() + 1,
       dd = d.getDay() + 1;
       if(_rc.size()>0){
           _rc.responsiveCalendar({
                time: yd + '-' + md,
                onDayClick: function(events) {
                    //Redirect => /archivo_[anio]-[mes]-[dia]
                    document.location = url_redirect +
                        $(this).data('year') + '-' +
                        $(this).data('month') + '-' +
                        $(this).data('day');
                }
           });
       }
   }
};
//Init
$(document).ready(function() {
    if($('.grid-flex').size()>0){
        setTimeout(function(){
            rpp.flexGrid('.grid-flex',{ smartphone:479,tablet:767,desktop:1023},2);
        },2000);
    }
    //Img Load Progress
    var $imgRppLIP = $("img.img-progress");
    if($imgRppLIP.size()>0){
        setTimeout(function(){
            $imgRppLIP.rppLoadImgProgress(400);
        },2500);
    }
    if($('.collapse').size()>0){
        rpp.collapse('.collapse');
    }
    var btnOpenMovil = $('#open-nav-movil');
    if(btnOpenMovil.size()>0){
        rpp.navMovil('#open-nav-movil', '#nav-movil', '#close-nav-movil',1023);
    }
    //CALENDAR
    if($('.responsive-calendar').size()>0){
        rpp.calendar();
    }

});
