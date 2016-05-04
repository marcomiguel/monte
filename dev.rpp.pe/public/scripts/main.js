/*
    @nombre : ADS ENTRYs RPP
    @autor : JPC
    @version : 0.0.1
    @date : 10-2015
    @dependency : e-planning
*/
var rppAds = window.rppAds || {};
rppAds.render = function(obj){
    if(!document.querySelectorAll) return false;
    var positions = obj.positions;
    var query = obj.query;
    var _class = obj.class;
    var pArticle = document.querySelectorAll(query);
  if(pArticle){
    var minCharByParagraph = obj.minCharByParagraph;
      var countUnit = 0;
      var reviewParagraph = function(pArticleUnit){
      //TEXT WITHOUT HTML
          var pLength = ((pArticleUnit.innerHTML).replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, '')).length;
      pArticleUnit.setAttribute('data-chars', pLength);
          //REVIEWs
      var isReady = (pLength>1)?true:false;
      if(isReady){
        countUnit += pLength;
        if(countUnit >= minCharByParagraph){
          countUnit = 0;
          isReady = true;
        }else{

          isReady = false;
        }
          }else{
        countUnit += pLength;
        isReady = false;
      }
      return isReady;
      };
      /*
      _contruc : CONTRUCTOR ADS
      @positions POSICONTS,
      @_pos ITEM POSITON,
      @_pPos PARAGRAPH POSITION,
      @_class CLASS ASIDE,
      @pArticle PARAGRAPH ARTICLE
      */
      var _contruc = function(positions, _pos, _pPos, _class, pArticle, type){
          var adsAside = document.createElement('aside');
          adsAside.className = _class;
          adsAside.id = 'aside' + positions[_pos];
          if(type === 'primero'){
              adsAside.style.float = 'none';
              adsAside.style.textAlign = 'center';
          }
          var adsDiv = document.createElement('div');
          //adsDiv.id = 'eplAdDiv' + positions[_pos];
      adsDiv.id = 'eplAdDiv' + positions[_pos];
      var _script = document.createElement('script');
          _script.type = 'text/javascript';
          _script.charset = 'utf-8';
          _script.defer = true;
          //_script.text = 'eplAD4M("' + positions[_pos] + '");';
      _script.text = 'eplAD4Sync("eplAdDiv' + positions[_pos] + '","'+ positions[_pos] +'");';
          adsAside.appendChild(adsDiv);
          adsAside.appendChild(_script);
          //INSERT DOM AFTER
          var refElem = pArticle[_pPos];
          var parent = refElem.parentNode;
          var elmNext = (type === 'primero')?refElem:refElem.nextSibling;
          parent.insertBefore(adsAside, elmNext);
      };
      //DOM TRAVEL
    if(pArticle.length>0){
      var count = 1, countNoValid = 0;
        _contruc(positions, 0, 0, _class, pArticle, 'primero');
        for (var i = 0; i < pArticle.length; i++) {
            if(reviewParagraph(pArticle[i])){
                pArticle[i].setAttribute('data-valid', 'true');
            _contruc(positions, count, i, _class, pArticle);
            count++;
            }else{
                pArticle[i].setAttribute('data-valid', 'false');
                countNoValid++;
            }
        };
    }
  }else{
    console.log('No hay coincidencias');
  }
}({
  positions : ['Interna1' , 'Interna2' ,'Interna3' , 'Interna4' , 'Interna5' , 'Interna6' , 'Interna7' , 'Interna8'],
  query : '.single-cont article.hnews .cont > p',
  class : 'asideAds',
  minCharByParagraph : 900
});

/*
    @autor : Lucuma
*/

var rpp = window.rpp || {} ,

rpp = {
  menuTopFixed: function(t){
        var _t = $(t),
        lastScrollTop = 0,
        clsT = 'pinned',
        hTop = $('.header-main').height();
        hTopP = $('#EPL_960X90').height();
        hFinal = hTop + hTopP;
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           if (st > lastScrollTop){
               // scroll down
               (_t.hasClass(clsT))?_t.removeClass(clsT):'';
               $('.header-scroll .w-c').removeClass('block');
               $('.header-scroll .icon-hamburguesa').removeClass('none');
               $('.header-scroll .icon-cancel').removeClass('block');
           } else {
              // scroll top 220 MENU
              if(st <= hFinal){
                  (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                  $('.header-scroll .w-c').removeClass('block');
                 $('.header-scroll .icon-hamburguesa').removeClass('none');
                 $('.header-scroll .icon-cancel').removeClass('block');
              }else{
                  (_t.hasClass(clsT))?'':_t.addClass(clsT);
              }
           }
           lastScrollTop = st;
        });
    },
    menuBottomFixed: function(t){
        var _t = $(t),
        lastScrollTop = 0,
        clsT = 'fix-bottom',
        hTop = $('.header-main').height();
        hTopP = $('#EPL_960X90').height();
        hFinal = hTop + hTopP;
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           var prueba = $('.content header').height(),
           cnt = $('.content.group > .group').height(),
           headerFull = $('header.wrapper').height();
           headerScrollable = prueba + cnt + headerFull;
           if(!(headerScrollable >= st)){
              _t.removeClass(clsT);
           }else{
              _t.addClass(clsT);
              if (st < lastScrollTop){//bajando
               // scroll down
                   (_t.hasClass(clsT))?_t.removeClass(clsT):'';
               } else { //subiendo
                  // scroll    top 220 MENU
                  if(st <= hFinal){
                      (_t.hasClass(clsT))?_t.removeClass(clsT):'';
                  }else{
                      (_t.hasClass(clsT))?'':_t.addClass(clsT);
                  }
               }
           }
          lastScrollTop = st;
        });
   },
   shareSocial: function(t, type, url, inside){
        var url = url,w = 600,h = 450,appID = $('meta[property="fb:app_id"]').attr('content'),pos_x, pos_y,pos_x=(screen.width/2)-(w/2),pos_y=(screen.height/2)-(h/2),txt_tw = $('.single-cont header h1').text(),location = window.location,itemActivoSlider = $('.galeria-full .g-num').text();
        switch(type) {
            case 'facebook':
                if(inside === 'flujo'){
                    //FLOW
                    var pap = $(t).closest('.hnews'),
                    srcImg = $(pap).find('.photo').attr('src'),
                    titleImg = $(pap).find('.entry-title .url').text(),
                    description = $(pap).find('h2 + p').text();
                    url = url + '&picture=' + srcImg + '&name='+  titleImg + '&description=' + description + '&caption=rpp.pe' + ' | POR RPPNOTICIAS' + '&redirect_uri=http://rpp.pe/html/mam/timemachine_share.html&cancel_url=&ref=click_share_sb';
                    window.open('https://www.facebook.com/dialog/feed?display=popup&app_id=185239485185&link='+url,'rppwindo w', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                }else{
                    if($('.single-cont .hnews .slide.state').length > 0){
                        //GALLERY
                        var act = $('.galeria-full .page.active').data('page'),
                        srcImg = $('.slide.state .inner').children().eq(act-1).find('.photo').attr('src');
                        var titleImg = $('meta[property="og:title"]').attr('content');
                        var description = $('meta[property="og:description"]').attr('content');
                        url = url + '/' + act + '&picture=' + srcImg + '&name='+ itemActivoSlider + '. ' + titleImg + '&description=' + description + '&caption=rpp.pe' + ' | POR RPPNOTICIAS' + '&redirect_uri=http://rpp.pe/html/mam/timemachine_share.html&cancel_url=&ref=click_share_sb';
                        window.open('https://www.facebook.com/dialog/feed?display=popup&app_id=185239485185&link='+url,'rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                    }else{
                          //SINGLE PAGE
                          var srcImg = $('meta[property="og:image"]').attr('content'),
                          titleImg = $('.hnews .content header h1.entry-title').text(),
                          description = $('.hnews .content header .entry-summary').text();
                          url = url + '&picture=' + srcImg + '&name='+  titleImg + '&description=' + description + '&caption=rpp.pe' + ' | POR RPPNOTICIAS' + '&redirect_uri=http://rpp.pe/html/mam/timemachine_share.html&cancel_url=&ref=click_share_sb';
                          window.open('https://www.facebook.com/dialog/feed?display=popup&app_id=185239485185&link='+url,'rppwindo w', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                    }
                }
                break;
            case 'twitter':
                var titleShare = '', urlFinal = '';// menor a 110
                if(inside === 'flujo'){
                    urlFinal = $(t).closest('.hnews').find('h2 a').text();
                    window.open('https://twitter.com/intent/tweet?text=' + urlFinal + ' &url='+ url +'&via=RPPNoticias','rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                }else{
                    urlFinal = $('meta[property="og:title"]').attr('content');;
                    window.open('https://twitter.com/intent/tweet?text=' + urlFinal + ' &url='+ url +'&via=RPPNoticias','rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                }
                break;
            case 'googlemas':
                window.open('https://plus.google.com/share?url='+url,'rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                break;
            case 'linkedin':
              window.open('https://www.linkedin.com/shareArticle?url=' + url , 'rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
              break;
        }

   },
   apiSociales: function(){
      var urlAjax = $("meta[property='og:url']").attr('content');
      $.ajax({
        //url: 'https://graph.facebook.com/fql?q=SELECT%20share_count, commentsbox_count%20FROM%20link_stat%20WHERE%20url=%27' + urlAjax + '%27',
        url: 'https://graph.facebook.com/fql?q=SELECT%20total_count, commentsbox_count%20FROM%20link_stat%20WHERE%20url=%27' + urlAjax + '%27',
        dataType: 'jsonp',
        success: function(data){
          countFace(data);
        },
          error: function(){
          console.log('ERROR');
        }
      });
      function countFace(obj){
        //var data = obj.data[0].share_count,
        var data = obj.data[0].total_count,
        commentFacebook = obj.data[0].commentsbox_count;
        $('.social-comments span').text(commentFacebook);
        $('.facebook-share span').text(data);
      }
      //END
      //Twitter primera demo
      $.ajax({
        url: 'https://cdn.api.twitter.com/1/urls/count.json?url=' + urlAjax + '',
        dataType: 'jsonp',
        success: function(data){
          countTwitter(data);
        },
        error: function(){
          console.log('ERROR');
        }
      });
      function countTwitter(obj){
        // var data = obj.data[0].count;
        var data = obj.count;
        $('.twitter-share span').text(data)
      }

      //Linkedin
      $.ajax({
        dataType: "jsonp",
        url: "http://www.linkedin.com/countserv/count/share",
        data: {
            callback: "?",
            format: "jsonp",
            url: urlAjax
      }
      }).done(function(data) {
          $('.linkedin-share span').text(data.count)
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
    },
    menuResponsive: function(t){
      $(t + ' .icon-hamburguesa').click(function(){
        abrir();
      });
      $(t + ' .icon-cancel').click(function(){
        cerrar();
      })
      function abrir(){
        $(t + ' .icon-hamburguesa').addClass('none');
        $(t + ' .icon-cancel').addClass('block');
        $(t + ' .w-c').addClass('block');
      }
      function cerrar(){
        $(t + ' .icon-hamburguesa').removeClass('none');
        $(t + ' .icon-cancel').removeClass('block');
        $(t + ' .w-c').removeClass('block');
      }
    },
    menuDesplegable: function(t){
      var $nav = $('.nav-rpp'), $btn = $(t + ' .more'), $vlinks = $(t + ' .main-menu'), $hlinks = $(t + ' .more-items'), breaks = [];
      function updateNav() {
        var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width();
        if($vlinks.width() > availableSpace) {
          breaks.push($vlinks.width());
          $vlinks.children().last().prependTo($hlinks);
          if($btn.hasClass('hidden')) {
            $btn.removeClass('hidden');
          }
        } else {
          if(availableSpace > breaks[breaks.length-1]) {
            $hlinks.children().first().appendTo($vlinks);
            breaks.pop();
          }
          if(breaks.length < 1) {
            $btn.addClass('hidden');
            $hlinks.addClass('hidden');
          }
        }
      }
      $(window).resize(function() {
        var anchoPantalla = $(window).width();
        if(anchoPantalla > 767){
          updateNav();
        }
      });
      $btn.on('click', function() {
        $hlinks.toggleClass('hidden');
      });
      var anchoPantalla = $(window).width();
      if(anchoPantalla > 767){
          updateNav();
      }
      $(window).load(function(){
        $(window).resize();$(window).resize();$(window).resize();
      });
    }/*,
    altoTotal: function(t, a){
      setTimeout(function(){
        var alto = $(t).outerHeight(),
        altoFix = alto.toFixed();

        $(a).css('bottom', alto);
      },6000)
    }*/
}

function wid(t, th){
  if(t == 0){
    $(th).parent().parent().find('.txt').show();
    $(th).parent().parent().find('.wd').hide();
    $(th + ' .fv').hide();
  }else if(t == 2){
    $(th).parent().parent().find('.txt').show();
    $(th).parent().parent().find('.wd').hide();
    $(th + ' .fv').hide();
  }else{
    $(th).parent().parent().find('.txt').hide();
    $(th).parent().parent().find('.wd').show();
    $(th + ' .fv').show();
  }
}

$(document).ready(function(){


  /*setTimeout(function(){
    var www = $('.galeria-full').outerWidth();
    $('.galeria-full').width(www);
  },4000);*/
  if($('.wrapper-item-cb.wd a').hasClass('finalizado')){
    $(this).parent().parent().parent().find('.txt').hide();
  }



/*  setTimeout(function(){
    $('.widget-cb article:nth-child(0)')
    var w1 = $('#wid-mini-1 time').data('status');
    wid(w1, '#wid-mini-1');

    var w2 = $('#wid-mini-0 time').data('status');
    wid(w2, '#wid-mini-0');

    var w3 = $('#wid-mini-2 time').data('status');
    wid(w3, '#wid-mini-2');

    console.log(w1, 'w1');
    console.log(w2, 'w2');
    console.log(w3, 'w3');




  },1000)*/

  $('.wa a i').removeClass('icon-18');
  $('.wa a i').addClass('icon-whatsapp');
  rpp.menuResponsive('.header-scroll');
  rpp.menuResponsive('.header-main');
  if($('.header-scroll-top').size()>0){
      rpp.menuResponsive('.header-scroll-top');
  }
  //rpp.menuDesplegable('.nav-rpp');

  /*if($('.galeria-full').size() > 0){
    rpp.altoTotal('.galeria-full .galeria figcaption', '.galeria-full .pagers');
  }*/



  $('.txt-center .inner').children().legnth;
  var dos = 0, tres,anchoT = $('.wancho').width();
  for(var a = 0; a < 16; a++){
    var uno = $('.txt-center .inner').children().eq(a).width();
    dos = dos + uno;
    tres = dos;
  }

  if(tres >= anchoT){
    $('.wancho').addClass('slide');
  }
  $('.slide .item').width();
  rpp.menuTopFixed('.header-scroll');
  if($('.social-share').size() > 0){

    rpp.menuBottomFixed('.social-share');
    rpp.apiSociales();
    rpp.anclaAnitation('.comentar','#ancla-comments')
  }
  $('.wrapper.body').append('<span class="bmpm"></span>')
  $('.bmpm').click(function(event){$(this).toggleClass('pmt')});
  $('.slider-mkt').flexslider({
     animation: "slide"
  });

  $('.comment-share a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
       var $target = $(this.hash);
       $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
       if ($target.length) {
         var targetOffset = $target.offset().top;
         $('html,body').animate({scrollTop: targetOffset}, 1000);
         return false;
      }
    }
  });

  setTimeout(function(){
    var cero = $('#eplAdDivRight').html() != "",
    uno = $('#eplAdDivRight1').html() != "",
    dos = $('#eplAdDivRight2').html() != "",
    tres = $('#eplAdDivRight3').html() != "",
    cuatro = $('#eplAdDivRightSmall').html() != "";

    if(cero == true){
      $('#eplAdDivRight').addClass('mb20')
    }
    if(uno == true){
      $('#eplAdDivRight1').addClass('mb20')
    }
    if(dos == true){
      $('#eplAdDivRight2').addClass('mb20')
    }
    if(tres == true){
      $('#eplAdDivRight3').addClass('mb20')
    }
    if(cuatro == true){
      $('#eplAdDivRightSmall').addClass('mb20')
    }
  },4000);

  $('.wrapper-relatedframe-img .icon-play-circle-o').addClass('icon-8');
  $('.wrapper-relatedframe-img .icon-picture-o').addClass('icon-6');

  refes_automatico_header();
  var entra = setInterval('refes_automatico_header()',300000);


  function setupSliders(){

    /* Medida de los thumbs de la galería full */
      var $carouselfull = $('#carouselfull');
    $carouselfull.flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      itemWidth: 140,
      itemMargin: 20,
      prevText: "m",
      nextText: "n"
    });

    /* Medida de los thumbs de la galería normal */
      var $carouselnormal = $('#carouselnormal')
    $carouselnormal.flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      itemWidth: 96,
      itemMargin: 20,
      prevText: "m",
      nextText: "n"
    });
  }
  setupSliders();

});

function refes_automatico_header(){
   /*$.ajax({type:'POST',url:"/envivo/json",cache:false,success: function(html){
    var actu_re = $(html).text().split('%8%');
    $("#envivo strong").text(actu_re[0]);
    $("#envivo-mini strong").text(actu_re[0]);
    }})*/

    var fecha = new Date();
    var d = fecha.getDay();
    var jurl = 'http://s3.amazonaws.com/rpp-static/json/envivo_'+d+'.json';
    $.getJSON(jurl,function(res){
       var fecha = new Date();
       var m = fecha.getMinutes();
       var h  = fecha.getHours();
       if( m < 30 ){
        m  = 1;
       }else{
         m  = 2;
       }
       var message  = res[h][m];
       console.log(message);
       var message = message.split('%8%');

       console.log(message);

       $("#envivo strong").text(message[0]);
       $("#envivo-mini strong").text(message[0]);

     });
}


(function($){
var ACTIVE_CLASS = 'active',HIDDEN_CLASS = 'hidden', $win = $(window), $body = $('body');
$('.more').click(function(event) {
  event.preventDefault();
  $('.more-items').toggleClass('hidden');
});
function moveMenuItemsIn($menu){

    var $moreUl = $menu.next('.more-items');

    $moreUl.empty();
    $menu.children().removeClass(HIDDEN_CLASS);
    var $hiddenItems = getHiddenItems($menu);
    if ($hiddenItems.length){ //10
        $hiddenItems.clone().appendTo($moreUl);
        $moreUl.find('.' + HIDDEN_CLASS).removeClass(HIDDEN_CLASS);
        $menu.find('.more').show();
        $hiddenItems.addClass(HIDDEN_CLASS);
    } else {
        $menu.find('.more').hide();
    }
}
function moveMenuItems(){
  var anchoFull = $(window).width();
  if(anchoFull > 768){
    $('.nav-rpp ul.main-menu').each(function(){
        moveMenuItemsIn($(this));
    });
  }
}
$(window).on('resize', moveMenuItems);
moveMenuItems();
function getHiddenItems($menu){
    var hiddenItems = [], totalWidth = $menu.parent().width(), moreWidth = $menu.children('li.more').width(), usedWidth = moreWidth;
    $menu.children('li').not('li.more').each(function(){
        var width = $(this).width();
        if (usedWidth + width > totalWidth){
            hiddenItems.push(this);
        }
        usedWidth += width;
    });
    if (usedWidth - totalWidth <= moreWidth){
        hiddenItems = [];
    }
    return $(hiddenItems);
}
}(window.jQuery));
