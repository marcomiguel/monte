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
        function checkViewPort(_childs){
            _t.height('auto');
            for ( var i = 0; i < _childs.length; i++ ) {
                $(_childs[i]).css({'position': 'static', 'width':'100%', 'padding-left':'0', 'padding-right':'0'});
            };
        };
        function flexParent(_t,_childs,arrChildsCache,arrChildsCacheLeft,arrChildsCacheRight){
            var h = 0,count=0, paddingLR = $(_childs[0]).css('padding-right');
            for ( var i = 0; i < arrChildsCache.length; i++ ) {
                var _in = i+1;
                var _arrCH = $(_childs[i]);
                if(_in % nxcol == 0){
                    //i => 3(-3),5(-4),7(-5),9(-6),11(-7)
                //[cache] =>   0,    1,    2,    3,    4
                    //[[],[],[],[]]
                    _arrCH.removeAttr('style').css({
                        position:'absolute',
                        left:nxcolPorc,
                        width:nxcolPorc,
                        top: (i>2)?arrChildsCacheLeft[i-(count+1)]:'0px'
                    });

                }else{
                    count++;

                    if(i == (arrChildsCache.length - 1)){ /*Last Item*/
                        var hH = (arrChildsCacheLeft[arrChildsCacheLeft.length-1] > arrChildsCacheRight[arrChildsCacheRight.length-2]);
                        _arrCH.removeAttr('style').css({
                            position:'absolute',
                            left:hH?0:nxcolPorc,
                            width:nxcolPorc,
                            top: hH?arrChildsCacheRight[i-count]:arrChildsCacheLeft[i-count],

                        });
                        if(hH){
                            _arrCH.css({'padding-right':paddingLR});
                        }else{
                            _arrCH.css({'padding-left':paddingLR});
                        }
                    }else{ /* Alls Items*/
                        //i => 2(-2),4(-3),6(-4),8(-5),10(-6)
                 //[cache]  =>   0,     1,    2,    3,   4
                        _arrCH.removeAttr('style').css({
                            position:'absolute',
                            left:0,
                            width:nxcolPorc,
                            top: (i>1)?arrChildsCacheRight[i-count]:'0px'
                        });
                    }
                }
            };
            //Height
            _t.css({
                height: Math.max(arrChildsCacheLeft[arrChildsCacheLeft.length - 1], arrChildsCacheRight[arrChildsCacheRight.length - 1])
            });
        };
        function flexBuild(_childs){
            var hLeft = 0, hRight = 0;
            var arrChildsCache = [],
            arrChildsCacheLeft = [],
            arrChildsCacheRight = [];
            for ( var i = 0; i < _childs.length; i++ ) {
               var _arrCH = $(_childs[i]),
               arrInnerCache = [],
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
            checkViewPort(_childs);
        }else{
            flexBuild(_childs);
        }

        $(window).on('resize', this.debounce(function(e) {
            var _wW = $(window).width() + wScroll,
            isSmartphone = _wW <= minW,
            isInterDesktopAndTablet = _wW >= minWT && _wW <= minWDT;
            e.stopPropagation();
            //Init
            if(isSmartphone || isInterDesktopAndTablet){
                checkViewPort(_childs);
            }else{
                flexBuild(_childs);
            }
        },1500));
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
            _child = $(data, 'li'),
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
        fncOpen = function(){
            navmovil.show();
            headmovil.show().css({'top':'0px'});
            bodymovil.show().css({'right':'0px'});
        },
        fncClose = function(){
            headmovil.css({'top':'-100%'});
            bodymovil.css({'right':'-100%'});
            navmovil.hide('fast');
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
    gallerySwipe: function(){
        var imgs = document.querySelectorAll('.gallery-flow .img-swipe');
        var _I;
        for (var i = 0; i < imgs.length; i++) {
            var _I = new Hammer(imgs[i]);
            _I.on('swipeleft', function(e){
                //Prev
                var _T = $(e.target).parents('article').siblings('span');
                rpp.galleryMove(_T,'prev');
                return false;
            });
            _I.on('swiperight', function(e){
                //Next
                var _T = $(e.target).parents('article').siblings('span');
                rpp.galleryMove(_T,'next');
                return false;
            });
        }
    },
    galleryMove: function(t,isPrevNext){
        var _t = $(t),
        cls = '.gallery-flow',
        _items = _t.siblings('.gallery-inner'),
        s = _items.length - 1;
        var _itemsActive = _t.siblings('.active'),
        ind = _items.index(_itemsActive);
        _items.removeClass('active');
        if(isPrevNext == 'next'){
            //Next
            (ind < s)?_items.eq(ind+1).addClass('active'):_items.eq(0).addClass('active');
        }else{
            //Prev
            (ind < s + 1)?_items.eq(ind-1).addClass('active'):_items.eq(s).addClass('active');
        }
    }
};
//Init
$(document).ready(function() {
    if($('.grid-flex').size()>0){
        setTimeout(function(){
            rpp.flexGrid('.grid-flex',{ smartphone:479,tablet:767,desktop:1023},2);
        },250);
    }
    //Img Load Progress
    var $imgRppLIP = $("img.img-progress");
    if($imgRppLIP.size()>0){
        setTimeout(function(){
            $imgRppLIP.rppLoadImgProgress(200);
        },500);
    }
    if($('.collapse').size()>0){
        rpp.collapse('.collapse');
    }
    var btnOpenMovil = $('#open-nav-movil');
    if(btnOpenMovil.size()>0){
        rpp.navMovil('#open-nav-movil', '#nav-movil', '#close-nav-movil',1023);
    }
    /*if($('.gallery-flow').size()>0){
        rpp.gallerySwipe();
    }*/
    //GALLERY
    $("#gallery-home").owlCarousel({
        navigation : true,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        autoPlay: true,
        lazyLoad : true
    });
    var galleryBtns = $('.owl-buttons');
    galleryBtns.children('.owl-prev').html('<i class="icon icon-angle-left"></i>');
    galleryBtns.children('.owl-next').html('<i class="icon icon-angle-right"></i>');






});
