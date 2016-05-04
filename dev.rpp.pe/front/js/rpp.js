
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
    viewport: function(){
        var e = window,
        a = 'inner';
        if ( !( 'innerWidth' in window ) ){
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
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
        //_wW = $(window).width() + wScroll,
        _wW = rpp.viewport().width,
        isSmartphone = _wW <= minW,
        isInterDesktopAndTablet = _wW >= minWT && _wW <= minWDT;

        function checkViewPort(_childs, isMethod){
            _t.height('auto');
            for ( var i = 0; i < _childs.length; i++ ) {
                $(_childs[i]).addClass('col-full');
            };
        };
        function resetBuildChild(_arrCH){
          _arrCH.removeClass('col-full col-right col-left col-ads-full');
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

            //New
            var hL = 0, hR = 0, adsNum = 0;
            //New

            for ( var i = 0; i < _childs.length; i++ ) {
               var _arrCH = $(_childs[i]);
               resetBuildChild(_arrCH);
               var _in = i+1;


               //New
               var adsCard = _arrCH.children(), isAdsCard = adsCard.hasClass('ads-grid-flex'), adsH = adsCard.height();
               if(i>nxcol-1){
                   if(hL >= hR){
                       /*if(isAdsCard){
                           adsNum++;
                           buildCard(_arrCH, 'col-ads-full', '0px', Math.max(hR,hL)+'px');
                       }else{
                           buildCard(_arrCH, 'col-right', nxcolPorc, (adsNum>1)?hR+adsH:hR+'px');
                       }
                       hR += $(_childs[i]).height();*/
                       buildCard(_arrCH, 'col-right', nxcolPorc, hR+'px');
                       hR += $(_childs[i]).height();
                   }else{
                       /*if(isAdsCard){
                           adsNum++;
                            buildCard(_arrCH, 'col-ads-full', '0px', Math.max(hR,hL)+'px');
                       }else{
                           buildCard(_arrCH, 'col-left', '0px', (adsNum>1)?hR+adsH:hR+'px');
                       }
                       hL += $(_childs[i]).height();*/
                       buildCard(_arrCH, 'col-left', '0px', hL+'px');
                       hL += $(_childs[i]).height();
                   }





               }else{
                   if(i>0){
                       buildCard(_arrCH, 'col-right', nxcolPorc, '0px');
                       hR =  $(_childs[i]).height();
                   }else{
                       buildCard(_arrCH, 'col-left', '0px', '0px');
                       hL =  $(_childs[i]).height();
                   }
               }
               //New

           };
           //Content
           _t.css({
               height: Math.max(hR,hL)
           });

        };
        //Init
        if(isSmartphone || isInterDesktopAndTablet){
            checkViewPort(_childs, 'normal');
        }else{
            flexBuild(_childs,'normal');
        }

        //$(window).on('resize orientationchange', this.debounce(function(e) {
        $(window).on('resize', this.debounce(function(e) {
            //var _wW = $(window).width() + wScroll,
            var _wW = rpp.viewport().width,
            isSmartphone = _wW <= minW,
            isInterDesktopAndTablet = _wW >= minWT && _wW <= minWDT;
            //Init
            resetBuildChild(_childs);
            if(isSmartphone || isInterDesktopAndTablet){
                checkViewPort(_childs,'resize');
            }else{
                setTimeout(function(){
                    flexBuild(_childs,'resize');
                },100);
            }
            return false
        },0));
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
        _body = $('body, html');
        var fncOpen = function(){
            navmovil.show();
            headmovil.show().css({'top':'0px'});
            bodymovil.show().css({'right':'0px'});
            _body.css({'overflow':'hidden'});
            //_body.css({'position':'fixed', 'overflow':'hidden'});
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
        $('#open-nav-movil-fix').click(function(e){
            e.stopPropagation();
            e.preventDefault();
            fncOpen();
        });
        $('#open-nav-movil-fix2').click(function(e){
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
            var isDesktop = rpp.viewport().width >= minW;
            if(!isDesktop){
                fncOpen();
            }
            return false;
        });
        _BB.on('swiperight', function(e){
            var isDesktop = rpp.viewport().width >= minW;
            if(!isDesktop){
                fncClose();
            }
            return false;
        });
        //RESIZE
        var minW = breakpoint,
        wScroll = 15;
        $(window).on('resize orientationchange', this.debounce(function(e) {
            var isDesktop = rpp.viewport().width >= minW;
            if(isDesktop){
                headmovil.hide().css({'top':'-100%'});
                bodymovil.hide().css({'right':'-100%'});
                navmovil.hide('fast');
                _body.removeAttr('style');
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
   },
   menuTopFixed: function(t){
        var _t = $(t),
        _tELN = $('body > .effect-logo-nav'),
        lastScrollTop = 0,
        clsT = 'menu-top-fixed';
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           if (st > lastScrollTop){
               // scroll down
               (_t.hasClass(clsT))?_t.removeClass(clsT):'';
               (_tELN.hasClass(clsT))?_tELN.removeClass(clsT):'';
           } else {
              // scroll top 220 MENU
              if(st <= 150){
                  (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                  (_tELN.hasClass(clsT))?_tELN.removeClass(clsT):'';
              }else{
                  (_t.hasClass(clsT))?'':_t.addClass(clsT);
                  (_tELN.hasClass(clsT))?'':_tELN.addClass(clsT);
              }
           }
           lastScrollTop = st;
        });
   },
   menuBottomFixed: function(t){
        var _t = $(t),
        _tELN = $('body > .effect-logo-nav'),
        lastScrollTop = 0,
        clsT = 'nav-top-fixed';
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           var prueba = $('.content').height();

           if(!(prueba >= st)){
              _t.removeClass(clsT);
           }else{
              _t.addClass(clsT);
              if (st < lastScrollTop){//bajando
               // scroll down
                   (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                   (_tELN.hasClass(clsT))?_tELN.removeClass(clsT):'';
               } else { //subiendo
                  // scroll    top 220 MENU
                  if(st <= 100){
                      (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                      (_tELN.hasClass(clsT))?_tELN.removeClass(clsT):'';
                  }else{
                      (_t.hasClass(clsT))?'':_t.addClass(clsT);
                      (_tELN.hasClass(clsT))?'':_tELN.addClass(clsT);
                  }
               }
           }
          lastScrollTop = st;
        });
   },
   cajaFix: function(t){
        var _t = $(t),
        _tELN = $('body > .effect-logo-nav'),
        lastScrollTop = 150,
        clsT = 'caja-fix',
        mtop = 'mas-top';
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           var prueba = $('.content').height();
           if(!(prueba >= st)){
              _t.removeClass(clsT);
           }else{
              _t.addClass(clsT);
              if (st < lastScrollTop){//subiendo
                  // scroll down
                   // (_t.hasClass(clsT))?_t.removeClass(clsT):'';

                  if(st < 150){
                    (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                    // console.log('subiendo');
                  }
                  // (_t.hasClass(clsT))?_t.addClass(mas-top):'';
               } else { //bajando
                  // scroll    top 220 MENU
                  if(st <= 150){
                      (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                  }else{
                      (_t.hasClass(clsT))?'':_t.addClass(clsT);

                  }
               }
           }
          lastScrollTop = st;
        });
   },
   preload : '<p class="text-center preload_survey"><i class="fa fa-spinner fa-3x fa-pulse"></i></p>',
   surveycookie : function(nid){
       //Exist cookie
       var surveyOpt = $('#survey_' + nid + ' .encuesta-opciones'),
       surveyRes = $('#survey_' + nid + ' .encuesta-resultados');

       if($.cookie('survey_' + nid) != undefined){
           surveyOpt.remove();
           surveyRes.removeClass('display_off');
       }else{
           surveyRes.remove();
           surveyOpt.removeClass('display_off');
       }
   },
   bc_public_key : window.public_key || public_key,
   fncCompleteBC : function(nid, isFnc, val){

       var selec = '',
       activo = 0,
       page = 'votar.php?v=2&alt='+val+'&nid='+nid,
       _preload = this.preload;

       var _frm_bc = $('#frm_bc_'+ nid),
       _div = $('#claseprogreso' + nid),
       _divopt = $('#survey_' + nid + ' .claseinput' + nid),
       _htmlerror = '<div style="color:red;margin-top:1em;" class="alert alert-danger"><p>Error. Vuelve a intentarlo.</p></div>';
       if(!isFnc){
           //Before
           setTimeout(function(){
               _div.find('.preload_survey').remove();
               _frm_bc.removeClass('display_off');
           }, 250);
       }else{
           //After
           _frm_bc.addClass('display_off');
           _div.html(_preload);

           var url_bc = './verify.php';

           var brand_cap_challenge = _frm_bc.find('input[name="brand_cap_challenge"]').val(),
           brand_cap_answer = _frm_bc.find('input[name="brand_cap_answer"]').val();

           _frm_bc.submit(function(event) {
               event.preventDefault();
           });

           var ndata = {
               challenge : brand_cap_challenge,
               response : brand_cap_answer
           };

           $.ajax({
               type: 'POST',
               data: ndata,
               url: url_bc,
               dataType: 'json',
               success: function(data) {

                   if(data == 'true' || data === true){
                       //Validando
                       $.ajax({
                         url: page
                       }).done(function(data) {
                           //create cookie
                           $.cookie('survey_' + nid, nid, { expires: 1, path: '/' });
                           //actions
                           _div.html(data);
                           $('.claseinput' + nid).hide();
                       }).error(function(){
                           _frm_bc.removeClass('display_off');
                           _div.html(_htmlerror);
                       });

                   }else{
                       BrandCaptcha.reload();
                       _frm_bc.removeClass('display_off');
                       _div.html(_htmlerror);

                   }
               },
               error: function(e){
                   BrandCaptcha.reload();
                   _div.html(_htmlerror);
                   _divopt.removeClass('display_off');
               }
           });
       }
   },
   surveychange : function(t,nid){
       var selec = '',
       activo = 0,
       page = 'votar.php?v=2&alt='+t.value+'&nid='+nid;

       var _div = $('#claseprogreso' + nid),
       _preload = this.preload,
       _divopt = $('#survey_' + nid + ' .claseinput' + nid);
       _divopt.addClass('display_off');

       //Precarga
       _div.html(_preload);

       var bsurvey = $('.box_encuesta');
       if(bsurvey.size()>0){

           if(bsurvey.size() == 1){
               //brandcaptcha
               var bc_public_key = this.bc_public_key,
               _bc = '<form class="display_off" id="frm_bc_'+ nid +'" action="" method="post">'+
                   '<h2>Responda la consigna para confirmar su voto:</h2>'+
                   '<div id="layer_bc_'+ nid +'"></div>'+
                   '<button onclick="rpp.fncCompleteBC('+ nid +', true, '+ t.value + ')" class="btn btn_layer_bc btn-primary" type="button">Enviar</button>'+
                   '<script>'+
                       'BrandCaptcha.initAsync("'+ bc_public_key +'", "layer_bc_' + nid +
                       '", { lang: "es", theme: "default", onComplete : rpp.fncCompleteBC('+ nid +', false, '+ t.value + ') });'+
                   '</script>'+
               '</form>';
               _div.before(_bc);
           }else{
               //Survey normal
               setTimeout(function(){
                   $.ajax({
                     url: page
                   }).done(function(data) {
                       //create cookie
                       $.cookie('survey_' + nid, nid, { expires: 1, path: '/' });
                       //actions
                       _div.html(data);
                       $('.claseinput' + nid).hide();
                   }).error(function(){
                       _div.html('<div class="alert alert-danger"><p>Error. Vuelve a intentarlo.</p></div>');
                       _divopt.removeClass('display_off');
                   });
               }, 250);

           }
       }

   },
   shareSocial: function(t, type, url){
        var url = url,
        w = 600,h = 450,
        appID = $('meta[property="fb:app_id"]').attr('content'),
        pos_x, pos_y,
        pos_x=(screen.width/2)-(w/2),
        pos_y=(screen.height/2)-(h/2),
        url = url + '&picture=http%3A%2F%2Fak-hdl.buzzfed.com%2Fstatic%2F2015-08%2F27%2F15%2Fenhanced%2Fwebdr14%2Fenhanced-4520-1440705579-13.jpg&name=1.%20Este%20ordenado%20dispensador%20de%20batido%20%28%2415%29.&description=Ahora%20tienes%20una%20raz%C3%B3n%20para%20empezar%20a%20cocinar.&caption=www.buzzfeed.com%20|%20By%20Christina%20Lan&redirect_uri=http://buzzfeed.com/static/html/timemachine_share.html&ref=click_share_sb'; 
        switch(type) {
            case 'facebook':
                window.open('http://www.facebook.com/sharer.php?u='+url+'','rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                break;
            case 'twitter':
                window.open('https://twitter.com/intent/tweet?text=&url='+url+'&via=La10Pe','rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                break;
            case 'googlemas':
                window.open('https://plus.google.com/share?url='+url+'','rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                break;
        }
   },
   //tabsResult: function(t,item){
   tabsResult: function(t){
       var _t = $(t),
       //_pos = item,
       _pos = parseInt($(_t).val()),
       _cls = 'active',
       _cnt = _t.parents('[data-toggle="tabs-result"]').find('[data-item="item-result"]');
       //_t.parent().children().removeClass(_cls);
       //_t.addClass(_cls);
       _cnt.removeClass(_cls);
       var cntPos = _cnt.eq(_pos);
       cntPos.addClass(_cls)
       if(!cntPos.find('iframe').length>0){
           //cntPos.html('<section class="widget widget-resutl"><iframe src="'+ _t.data('iframe') +'"></iframe></section>');
           var lbl = $('option:selected', t).data('iframe');

           cntPos.html('').html('<section class="widget widget-resutl"><iframe scrolling="no" src="'+ lbl +'"></iframe></section>');
       }
   },
   //carga de comentarios
   comment: function(){
      $('#coment').addClass('fullblock');
      $('.comment h4, .fb-comments').css('visibility', 'hidden');
      setTimeout(function(){
        $('.icon-circle-o-notch').css('display', 'none');
        $('.comment h4, .fb-comments').css('visibility', 'visible');
        $('.comenta').addClass('sino');
      },2000);
    },
    greedy: function(gr){
      var gr = gr;
      var nav = gr, //padre que envuelve todo bloque
      btn = $(nav + ' button'), //boton que al hacer click aparece los
      vlinks = $(nav + ' .visible-links'), //los que se ven
      hlinks = $(nav + ' .hidden-links'), //los que no se ven
      breaks = [];
      function updateNav() 
      {
        var availableSpace = btn.hasClass('hidden') ? $(nav).width() : $(nav).width() - btn.width() - 30;
        // The visible list is overflowing the nav
        if(vlinks.width() > availableSpace) {

          // Record the width of the list
          breaks.push(vlinks.width());

          // Move item to the hidden list
          vlinks.children().last().prependTo(hlinks);

          // Show the dropdown btn
          if(btn.hasClass('hidden')) {
            btn.removeClass('hidden');
          }

        // The visible list is not overflowing
        } else {

          // There is space for another item in the nav
          if(availableSpace > breaks[breaks.length-1]) {

            // Move the item to the visible list
            hlinks.children().first().appendTo(vlinks);
            breaks.pop();
          }

          // Hide the dropdown btn if hidden list is empty
          if(breaks.length < 1) {
            btn.addClass('hidden');
            hlinks.addClass('hidden');
          }
        }

        // Keep counter updated
        btn.attr("count", breaks.length);
      }
      btn.on('click', function() {
        hlinks.toggleClass('hidden');
      });

      updateNav();
      $(window).resize(function(){
          updateNav();
      });
      
    },
    anclaAnitation: function(padrelink, bloque){
      $( padrelink + ' a[href*=#]').click(function() {
        $('.comment').show();
        if(location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')&& location.hostname == this.hostname) {
          var $target = $(this.hash);
          $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
          if ($target.length) {
            var targetOffset = $target.offset().top;
            $('html,body').animate({scrollTop: targetOffset}, 1000);
            return false;
          }
        }
      });
    }
};
$(window).load(function() {
  $(window).resize();$(window).resize();
});
//Init
$(document).ready(function() {
    //MENU FIXED SOCIALES
    if($('.nav-sociales').size()>0){
      rpp.menuBottomFixed('.fix-sociales');
    }

    //MENU FIXED
    if($('.header-logo-nav').size()>0){
      rpp.menuTopFixed('.fix-logo-nav');
    }
    //Resultado fix
    if ($('.fixt').size() > 0) {
      rpp.cajaFix('.fixt');
    }
    //CARDS UI
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
    // if(btnOpenMovil.size()>0){
        rpp.navMovil('#open-nav-movil', '#nav-movil', '#close-nav-movil',1023);
    // }
    //CALENDAR
    if($('.responsive-calendar').size()>0){
        rpp.calendar('.responsive-calendar');
    }
    //MENU GREEDY
    if($('.menu-blocks').size() > 0)
    {
      rpp.greedy('.menu-blocks');
    }
    if($('.menu-mas').size() > 0)
    {
      rpp.greedy('.menu-mas');
    }
    //ANCLA CON ANIMACION
    if($('.ancla').size() > 0)
    {
      rpp.anclaAnitation('.li-comenta-small','.comment');
      rpp.anclaAnitation('.social-comments', '.comment');
    }


    //script para tab
    $('.wrap-tabs .header-tab .item-header-tab').click(function(e){
      var padreTab = $(this).closest('.wrap-tabs');
      // padreTab.find('.header-tab:first .item-header-tab').removeClass('active');
      // $(this).closest('.item-header-tab').addClass('active');
      var buscaidtab = $(this).attr('data-id');
      if(padreTab.parent().hasClass('ca-sidebar-tabla')){
        padreTab.find('.header-tab:first .item-header-tab').removeClass('active');
        $(this).closest('.item-header-tab').addClass('active');
      }
      $(this).closest('.wrap-tabs').find('.content-tab:first .item-tab').removeClass('active');
      padreTab.find('.content-tab .item-tab[id="'+buscaidtab+'"] ').addClass('active');
    });
    //FIN
    $('.li-icon a').click(function(event) {
      event.preventDefault();
      $(this).parent().parent().find('.small-social-top').toggleClass('func-small');
      $(this).parent().parent().find('.large-social-top').toggleClass('func-large');
      $(this).parent().parent().find('.li-icon').toggleClass('func-icon');
    });
    


    $('.comenta').click(function(event) {
      event.preventDefault()
      var idfb = $(this).data("idfb");
      (function fa(d, s, id, idfb) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.3&appId=287920207998918";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk', idfb));

      if(!$(this).hasClass('sino')){
        rpp.comment();
      }
    });

    $('.lazy').lazyload({
      appear:function(){
        var $this = $(this);
        switch($this.data('type')){
          case 'iframe':
            $this.append('<iframe src="'+ $this.data('original') +'" width="'+ $this.data('width') +'" height="'+ $this.data('height') +'" id="'+ $this.data('id') +'"></iframe>');
            break;
          case 'img':
            $this.attr('src', $this.data('original'));
            break;
          case 'script':
            $this.append('<script src="'+ $this.data('original') +'" width="'+ $this.data('width') +'"></script>');
            break;
          case 's-click':
            $this.click();
            break;
        }
      }
    });


    setTimeout(function(){
      $('#crowdynews-iframe').attr('src', '');
    },15000);

    ////SLIDERS
    //GALLERY
    $("#gallery-home").owlCarousel({
        navigation : true,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        autoPlay: true,
        lazyLoad : true
    });
    $("#gallery-gallerys").owlCarousel({
        navigation : true,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        lazyLoad : true
    });
    //FECHAS SLIDER
    $(".slider-fechas").owlCarousel({
        navigation : true,
        items: 15,
        autoPlay: false,
        itemsTablet: [760,10],
        itemsMobile : [480, 5]
    });



    $("#gallery-prueba").owlCarousel({
        items: 2,
        navigation: true,
        lazyLoad : true
    });




    













    var galleryBtns = $('.owl-buttons');
    galleryBtns.children('.owl-prev').html('<i class="icon icon-angle-left"></i>');
    galleryBtns.children('.owl-next').html('<i class="icon icon-angle-right"></i>');

    ///Facebook primera demo
    var urlTotal = window.location;
    var urlTotalStr = urlTotal.toString();
    var arrUrlTotal = urlTotalStr.split('?')[0];
    var urlAjax = 'http://elcomercio.pe/';
    $.ajax({
      url: 'https://graph.facebook.com/fql?q=SELECT%20share_count, commentsbox_count%20FROM%20link_stat%20WHERE%20url=%27' + urlAjax + '%27',
      dataType: 'jsonp',
      success: function(data)
      {
        countFace(data);
      },
        error: function(){
        console.log('ERROR');
      }
    });
    function countFace(obj){
      var data = obj.data[0].share_count,
      commentFacebook = obj.data[0].commentsbox_count;
      $('.social-comments span').text(commentFacebook);
      $('.social-fb span').text(data);
    }
    //END

    //Twitter primera demo
    $.ajax({
      url: 'https://cdn.api.twitter.com/1/urls/count.json?url=' + urlAjax + '',
      dataType: 'jsonp',
      success: function(data)
      {
        countTwitter(data);
      },
      error: function()
      {
        console.log('ERROR');
      }
    });
    function countTwitter(obj)
    {
      // var data = obj.data[0].count;
      var data = obj.count;
      $('.social-tw span').text(data)
    }
    var anchoImgGallery = $('.gallery-list figure').height();
    $('.gallery-list img').css('min-height', anchoImgGallery);

    //Branding movistar
    var body = $('body'),
    arrLi = [],
    listbread = $('.breadcrumb ul'),
    listNav = $('.nav-full ul'),
    listMas = $('.menu-mas .visible-links'),
    listTab = $('#outFixture ul'),
    grid = $('.grid.grid-flex'),
    cuantosNav = $(listNav).children().length,
    cuantosbread = $(listbread).children().length,
    cuantosMas = $(listMas).children().length,
    cuantosGrid = $(grid).children().length,
    cuantosTab = $(listTab).children().length;
    for(var a = 0; a < cuantosTab; a++)
    {
      var aa = $(listTab).children().eq(a),
      aaa = aa.text();
      if(aaa == 'Descentralizado' || aaa == 'Copa Movistar' || aaa == 'Copa Movistar 2015')      
      {
        aa.addClass('mov');
      }
    }
    for(var a = 0; a < cuantosGrid; a++)
    {
      var aa = $(grid).children().eq(a),
      aaa = aa.find('.tag-time').find('a').text();
      if(aaa == 'Descentralizado' || aaa == 'Copa Movistar' || aaa == 'Copa Movistar 2015')
      {
        aa.find('.tag-time').find('a').addClass('mov');
      }
    }
    for(var a = 0;a < cuantosMas; a++)
    {
      var aa = $(listMas).children().eq(a),
      aaa = aa.find('a').text();
      if(aaa == 'Descentralizado' || aaa == 'Copa Movistar' || aaa == 'Copa Movistar 2015')
      {
        aa.find('a').addClass('mov');
      }
    }
    for(var a = 0;a < cuantosNav; a++)
    {
      var aa = $(listNav).children().eq(a),
      aaa = aa.find('a').text();
      if(aaa == 'Descentralizado' || aaa == 'Copa Movistar' || aaa == 'Copa Movistar 2015')
      {
        aa.find('a').addClass('mov');
      }
    }
    for(var a = 0; a < cuantosbread; a++ )
    {
      var aa = $(listbread).children().eq(a),
      aaa = aa.text();
      if(aaa === 'Copa Movistar' || aaa == 'Descentralizado' || aaa == 'Copa Movistar 2015')
      {
        aa.addClass('mov');
      }
    }



});






