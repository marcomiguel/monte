
/*! *********************************************
  *                                             *
  *   X Simple Library - JS                     *
  *   http://cromasystem.com                    *
  *   03/2016                                   *
  *                                             *
  ********************************************* */

(function (global, document) {
  'use strict';

  var xsl = {
    dv: {
      canTouch: ('ontouchstart' in global),
      canCSSTransition: null,
      clickTap: 'click',
      windowWidth: $(window, document).width(),
      mem: {js:[]},
      jsPath: document.getElementById('js-main').src,
      jsName: 'rpp-app.js',
      device: (navigator.userAgent.match(/tablet|iPad|playbook/i) ? 'tablet' : ( navigator.userAgent.match(/iPhone|android|iPod/i) ? 'mobile' : 'desktop')),
      ios : navigator.userAgent.match(/iPhone|iPad|iPod/i) || false
    },
    fn: {
      detectCSSFeature: function (featurename) {
        //http://stackoverflow.com/a/14763909
        var feature = false,
        domPrefixes = 'Webkit Moz ms O'.split(' '),
        elm = document.createElement('div'),
        featurenameCapital = null;

        featurename = featurename.toLowerCase();

        if( elm.style[featurename] !== undefined ) { feature = true; }

        if( feature === false ) {
            featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
            for( var i = 0; i < domPrefixes.length; i++ ) {
                if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
                  feature = true;
                  break;
                }
            }
        }
        return feature;
      },
      wopen: function (element, event, jsn) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        window.open(element.getAttribute('href'), 'social-popup', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=500,height=450,left=' + ((screen.width / 2) - (500 / 2)) + ',top=' + ((screen.height / 2) - (450 / 2)));
      },
      render: function (str) {
        if (!str) return;
        var args = str.split(/\,/g),
          i, fn;
        for (i in args) {
          if (args[i]) {
            fn = args[i].replace(/[\-\s]/gm, '');
            if (typeof this.ui[fn] == 'function') {
              this.ui[fn].call(this);
            }
          }
        }
      },
      headerBinds: function (){
        //abrir menu
        $('#btn-menu').on('click', function(event, called){
          event.preventDefault();
          $('body').toggleClass('open-menu');

          $('#content').off('click.xmenutop').on('click.xmenutop', function (event) {
            event.preventDefault();
            $('#btn-menu').trigger('click', true)
          });

          if (!called && $('#header').hasClass('open')) {
            $('#btn-search').trigger('click', true)
          }
          if(!$('body').hasClass('open-menu')) {
            $('#content').off('click.xmenutop');
          }
          //document.getElementById('search-input-menu').focus();
        });

        //abrir ediciones
        $('#btn-edition').on('click', function(event) {
          event.preventDefault();
          $(this).closest('.account').toggleClass('open');
        });

        //abrir form de busqueda
        $('#btn-search').on('click', function(event, called) {
          event.preventDefault();
          $('#header').toggleClass('open');
          if (!called && $('body').hasClass('open-menu')) {
            $('#btn-menu').trigger('click', true)
          }

          document.getElementById('search-input-main').focus();
        });
      },
      search: function(element, event, jsn){
        if ($.trim(element.texto.value) === "")
          event.preventDefault();
      },
      loadJs: function (url) {
        if (xsl.dv.mem.js.indexOf(url)<0) {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.src = url;
          document.getElementsByTagName("head")[0].appendChild(script);
        } else {
          xsl.dv.mem.js.push(url);
        }
      },
      toggleClass: function (element, event, jsn) {
        jsn.class = jsn.class || 'toggle-on';
        $(jsn.to).toggleClass(jsn.class);
      },
      fullView: function(element, event, jsn){
        event.preventDefault();
        var elem = document.getElementById(jsn.to), $elem = $(elem);

        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement) {
          if(document.exitFullscreen) document.exitFullscreen();
          else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
          else if (document.msExitFullscreen)   document.msExitFullscreen();

        }else{
          if (elem.requestFullscreen) elem.requestFullscreen();
          else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
          else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen()
          else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();

        }
        


       /* if(!$elem.data('fullscreen')){
          if (elem.requestFullscreen) elem.requestFullscreen();
          else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
          else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen()
          else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
          $elem.data('fullscreen', 1);
        }else{
          if(document.exitFullscreen) document.exitFullscreen();
          else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
          $elem.data('fullscreen', 0);
        }*/
        //$elem.trigger('changeScreen');
      }
    },
    ui: {
      slide: function (elements) {
        elements = elements ? $(elements) : $('.x-slide');
        elements.slide();
      },
      columnsfit: function (elements) {
        elements = elements ? $(elements) : $('.x-columns-fit');
        elements.columnsfit();
      },
      calendar: function (elements) {
        elements = elements ? $(elements) : $('.x-calendar');
        elements.calendar();
      },
      lazy: function (elements) {
        elements = elements ? $(elements) : $('.x-lazy');
        elements.lazy();
      },
      gallery: function (elements) {
        elements = elements ? $(elements) : $('.x-gallery');
        elements.gallery();
      },
      sticky: function (elements) {
        var $social;
        if (this.dv.windowWidth >= 768 ) {
          elements = elements ? $(elements) : $('.x-sticky');
          if (this.dv.windowWidth == 768) {
            $social = elements.filter('.col-share');
          }
          elements.not($social).stickit({top: 40, screenMinWidth: 768});
        }
        if (this.dv.windowWidth < 768 || ($social && $social.length)) {
          $social = $social ||  $('.x-sticky.col-share');
          if ($social.length) {
            new this.ui.fixed($social, 'socialmenu');
          }
        }
      },
      socialnative: function (elements) {
        elements = elements ? $(elements) : $('.x-social-native');
        elements.social();
      },
      widget: function (elements) {
        if (!this.dv.mem.isLoadedJSWidget){
          this.dv.mem.isLoadedJSWidget = true;
          //this.fn.loadJs("http://dev.rpp.pe/static/js/lib/rpp-widget.js?v=cx23");
          //this.fn.loadJs("http://s.rpp-noticias.io/static/js/lib/rpp-widget.js?v=z28102016");
          this.fn.loadJs(xsl.dv.jsPath.replace(xsl.dv.jsName, 'lib/rpp-widget.js'));
        }
        elements = elements ? $(elements) : $('.x-widget');
        elements.widget();
      },
      media: function(){
        if (!this.dv.mem.isLoadedJSMedia){
          this.dv.mem.isLoadedJSMedia = true;
          this.fn.loadJs(xsl.dv.jsPath.replace(xsl.dv.jsName, 'lib/media.js'));
          //this.fn.loadJs("http://s.rpp-noticias.io/static/js/lib/media.js?v=z28102016");
        }
      },
      fixedmenutop: function () {
        var element = document.getElementById('x-fixed-menutop');
        if (element) {
          new this.ui.fixed(element, 'menutop');
        }
      },
      ago: function (elements) {
        elements = elements ? $(elements) : $('.x-ago');
        elements.ago();
      },
      onlive: function () {
        var now = new Date();
        var jurl = 'http://s3.amazonaws.com/rpp-static/json/envivo_' + now.getDay() + '.json';
        $.getJSON(jurl,function(res){
          var now = now = new Date();
          var m = now.getMinutes();
          var h  = now.getHours();
          if( m < 30 ){
            m  = 1;
          }else{
            m  = 2;
          }
          var message  = res[h][m];
          message = message.split('%8%');
          document.getElementById('online').innerHTML = message[0];
        })
      },
      adsbody: function () {
        if(xsl.dv.device == 'desktop') return false; 
        var param = {
          filter : "#article-body",
          length: 900,
          positions : ['Interna2' ,'Interna3' , 'Interna4' , 'Interna5' , 'Interna6' , 'Interna7' , 'Interna8']
        }, $content, $paragraphs, length = 0, position = 0;
        $content = $(param.filter);
        $paragraphs = $content.children('p');
        //$paragraphs.eq(0).before('<div class="ads" data-x=\'{"type":"ads","position":"Interna1"}\'></div>');
        for(var i = 0; i < $paragraphs.length; i++) {
          length += $paragraphs.eq(i).text().length;
          if (length > param.length) {
            $paragraphs.eq(i).after('<div class="ads" data-x=\'{"type":"ads","position":"' + param.positions[position] + '"}\'></div>');
            length = 0;
            position++;
          }
        }
        if (position>0) {
          $content.children('.ads').lazy();
        }
      }
    },
    init: function(){
      var that = this;
      var str = $('body').data('x');
      this.dv.canCSSTransition = xsl.fn.detectCSSFeature('transition');
      this.fn.headerBinds();
      setTimeout(function(){
        that.fn.render.call(that, str);

        //por default ejecutar lo siguiente.
        that.fn.render.call(that, 'fixedmenutop, onlive');
      }, 100);

      // ejecutamos scripts del array afterReady
      if (typeof afterReady === "object") {
        for (var i = 0; i < afterReady.length; i++){
          afterReady[i]();
        }
      }


    }
  };

  $(document).on('ready', xsl.init.bind(xsl));
  global.fn = function (element, event, jsn) {
    if (xsl.fn[jsn.method]) xsl.fn[jsn.method].call(xsl, element, event, jsn);
  }


  window.xsl = xsl; //temporal

})(this, document);


/*
 XResize JS for "X Simple Library"
 v1.1.0
 by ...
 10/2015  */

(function (global) {
  $(window).on('resize.xresize', function (event) {
    var newWidth = $(window).width();
    if (newWidth != xsl.dv.windowWidth) {
      $(window).trigger('xresize');
      xsl.dv.windowWidth = newWidth;
    }
  });
})(this);

/*
  gallery JS for "X Simple Library"
  v1.1.0
  by ...
  10/2015 */


(function (global, document) {
  'use strict';

  var gallery = function(element) {

    this.$element = $(element);
    if (this.$element.hasClass('x-done')) return;
    this.settings = $.extend({
            pages: 0,
            itemsPage: 0, // items por pagina
            page: 1,
            $items: null,
            interval: 0,
            timer: null,
            variableWidth: false,
            redirect: false,
            lazy: false,
            urlState: false,
            sources: this.$element.data('sources'),
            add:{
              slides:0
            }
          }, this.$element.data('x'));
 

    this.render();
    this.binding();

    /* si tiene estado, lo activamos */
    if (this.settings.urlState.length) {
      this.state();
      //this.ads(true);
    }
    var that = this;

    /*$(window).on('xresize.xgallery', function (event) {
      that.render();
    });*/

    this.$element.addClass('x-done').removeAttr('data-sources');
  }
  gallery.prototype.binding = function () {
    var that = this,
        par = this.settings;


    /* lazy images*/
    if (par.lazy){
      var $first = $('figure>img', this.settings.$items.eq(0));
      $first.attr('src', $first.data('src'));
    }

    /* aplicamos eventos de paginacion */
    this.$element.find('.x-next, .x-prev, .x-page').on(xsl.dv.clickTap + '.xgallery', function (event) {
      var $this = $(this);
      event.preventDefault();
      event.stopPropagation();
      if ($this.hasClass('x-next'))
        that.move('next');
      else if ($this.hasClass('x-prev'))
        that.move('prev');
      else {
        that.move($this.data('page'));
      }
    });

   
    that.$element.on('mouseenter.xgallery', function(){
       $(window).on('keydown.xgallery',function(e){
          if(par.add.waiting) return;
          if(e.keyCode == 37 )   that.move('prev');
          else if(e.keyCode == 39 )   that.move('next');
      });
     }).on('mouseleave.xgallery', function(){
         $(window).off('keydown.xgallery');
     });




    //that.$element.on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e){
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e){
      setTimeout(function(){
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          //alert("xpamd");
          par.fullscreen = true;
          that.$element.addClass('x-gallery-expanded');
          that.buildSocial(par.urlVisor);
        }else{
          par.fullscreen = false;
          that.$element.removeClass('x-gallery-expanded');
          that.buildSocial();
        } 
        
      },1);

    })



   /* si es autoplay, play */
    if (par.interval > 0) {
      this.$element.on('mouseenter.xgallery', function () {
        that.stop();
      }).on('mouseleave.xgallery', function () {
        that.play();
      });
    }

    // states
    this.$element.bind('setPage', function (event, page) {
      that.move(page, true);
    });

    // touch
    if (xsl.dv.canTouch) this.touch();

  }

  gallery.prototype.buildItem = function(i){

    if(xsl.dv.device == 'mobile') i.src = i.src.replace(RegExp('/large/', "g"), '/medium/');

    var $item = $(['<div class="x-item">',
          '<figure itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject" class="cover">',
            '<img  src="http://s.rpp-noticias.io/static/img/placeholder.gif" data-src="'+ i.src +'" alt="'+ i.caption +'">',
          '</figure>',
        '</div>'].join(''));
    return $item;
  }

  gallery.prototype.buildSocial = function(u){
    var par = this.settings, urlPage = (u ? u : (par.urlState || par.urlVisor)) +'/'+ par.page;
 
    var $socials = $(['<ul>',
        '<li class="fb"><a  href="https://www.facebook.com/sharer/sharer.php?u='+ urlPage +'" onclick="fn(this, event, {\'method\':\'wopen\'})" target="_blank"><span class="icon-facebook"></span></a></li>',
        '<li class="tw"><a href="https://twitter.com/intent/tweet?original_referer='+ urlPage +'&text='+ par.title +'&url='+ urlPage +'&via=RPPNoticias" onclick="fn(this, event, {\'method\':\'wopen\'})" target="_blank"><span class="icon-twitter"></span></a></li>',
      '</ul>'].join(''));

    par.$boxSocials.html($socials);
    par.$socials = this.$element.find('.social a'); 
  }

  gallery.prototype.render = function (){
    var $items,
        hybrid,
        length,
        that = this,
        par = this.settings,
        id = 'gallery-'+ Math.random().toString().substring(2),
        template= ['<div class="x-wrapper"><a href="#" class="x-close" onclick=\'fn(this, event, {"method":"fullView", "to": "'+ id +'"})\'><i class="icon-cancel"></i></a>',
          '<div class="x-zone-gallery"><div class="x-container"></div></div>',
          '<div class="x-options">'+ ( !xsl.dv.ios ? '<a href="#" title="Pantalla completa" class="opt x-change-view" onclick=\'fn(this, event, {"method":"fullView", "to": "'+ id +'"})\'><i class="icon-resize-expand"></i></a>' : ''),
          '<span class="opt x-pager-text"><span class="x-n-foto">Foto</span> <span class="n">0</span> de '+ par.sources.length +'</span></div>',
          '<div class="x-arrows"><a href="#prev" class="x-prev"><span class="icon-chevron-left icon-prev"></span></a><a href="#next" class="x-next"><span class="icon-chevron-right icon-next"></span></a></div>',
        '</div>',          
        '<div class="x-caption clearfix"><span class="text-caption" itemprop="caption description"></span><div class="social"></div></div>'].join('');


    that.$element.attr('id', id).append(template);

    par.$container = this.$element.find('.x-container');
    par.$wrapper = this.$element.find('.x-wrapper');
    par.$caption = this.$element.find('.x-caption');
    par.$boxSocials = this.$element.find('.social');

    par.mainState = par.urlState;
    
    $.each(par.sources, function(ix, ec){ par.$container.append(that.buildItem(par.sources[ix])) });

    that.buildSocial();

    

    if (1 != par.itemsPage) {

      par.$items = this.$element.find('.x-item');
      length = par.$items.length;

      if(length == 1) this.$element.find('.x-arrows').hide();

      if (par.variableWidth) {
        hybrid = 0;
        par.pages = 0;
        par.$items.each(function (i) {
          hybrid += $(this).width();
        });
        par.pages = length;
        par.$container.css('width', hybrid + 1);
      } else {
        par.pages =  Math.ceil(length / 1);


        par.itemsPage = 1;
        hybrid = (100 / 1);
        par.$items.css('width', (100 / length) + '%');
        par.$container.css('width', (hybrid * length) + '%');


        // avanzar si es que debe :|

      //if (par.page > 1) {
          this.move(par.page);
        //}

        /* si es autoplay, play */
        if (par.interval > 0) {
          this.play();
        }
      }
    }


    par.mainWidth = this.$element.width();

  }
  gallery.prototype.move = function (dir, skipState) {
    var par = this.settings,
        oldPage = par.page,
        containerWidth,
        wrapperWidth,
        moveIn,
        hybrid;

    this.ads();
    if(par.waiting) return;

    /* redireccionamos a una url si esta al final y si existe el parametro "redirect" */
    if (par.page >= par.pages && par.redirect && dir == 'next') {
      document.location.href = par.redirect;
      return
    };


    switch (dir) {
      case 'next':
    
        par.page = (par.page >= par.pages) ? 1 : par.page + 1;
        break;
      case 'prev':
        par.page = (par.page <= 1) ? par.pages : par.page - 1;
        break;
      default: // 'to':
        par.page = (dir >= 1 && dir <= par.pages) ? dir : 1;
        break;
    };
    

    //precarmos imagen
    //if (par.lazy){
      $('figure>img', this.settings.$items.eq(par.page-1)).add($('figure>img', this.settings.$items.eq(par.page))).each(function(){
        var $t = $(this);
        if(!$t.data('loaded')){
          $t.attr('src', $t.data('src')).data('loaded');
        }
      });
      /*hybrids.attr('src', hybrids.data('src'));

      nextHybrid = ;
      nextHybrid.attr('src', nextHybrid.data('src'));*/

      
   // }


    containerWidth = par.$container.get(0).style.width;
    if (containerWidth.indexOf('px') > -1) { //variablewidth

      wrapperWidth = this.$element.find('.x-wrapper').width();
      moveIn = 0;


      for(var i = 0; i < (par.page-1); i++){
        moveIn += hybrid = par.$items.eq(i).width();
      }

   
 

      if (((wrapperWidth + moveIn) - parseFloat(containerWidth)) > hybrid ) {
        par.page = 1;
        moveIn = 0;        
      }
      moveIn = -(moveIn)+'px';

    }else {

      moveIn = (par.page - 1) * 100;

      if (moveIn > parseFloat(containerWidth)) {

        moveIn -= moveIn - parseFloat(par.$container.get(0).style.width);
      }

      hybrid = (par.page * 100) - parseFloat(containerWidth);
      if (hybrid > 0) {
        moveIn -= hybrid;
      }
      moveIn = -(moveIn)+'%';
    }
 

    if (xsl.dv.canCSSTransition) par.$container.css('margin-left', moveIn);
    else par.$container.animate({
      'margin-left': moveIn
    });
  



    par.$caption.children('.text-caption').text(par.sources[par.page - 1].caption);

    /* actualizamos pager-text */
      this.$element.find('.x-pager-text .n').text(par.page);
   

    /* guardamos estado */
    if (!skipState) {
      //this.$element.trigger('changePage', par.page);
       this.$element.trigger('changePage', {new: par.page, old: oldPage}); // verificar cambio oldpage
    }



    /* actualizamos sociales */      

    var currentURL = this.settings[(this.settings.fullscreen  ? 'urlVisor' :  (!this.settings.urlState ? 'urlVisor' : 'urlState') )] + '/'+ oldPage;
    var toUrl = this.settings[(this.settings.fullscreen ? 'urlVisor' : (!this.settings.urlState ? 'urlVisor' : 'urlState'))] + '/'+ par.page;
       
    this.settings.$socials.each(function() {
      this.href = this.href.replace(RegExp(currentURL, "g"), toUrl);
    });

  
    

  }
  gallery.prototype.play = function () {
    var that = this;
    if (this.settings.interval > 0) {
      clearInterval(this.settings.timer);
      this.settings.timer = setInterval(function () {
        that.move('next');
      }, this.settings.interval * 1000);
    };
  }
  gallery.prototype.stop = function () {
    clearInterval(this.settings.timer);
  }
  gallery.prototype.state = function () {
    var that = this,
        initPage = this.settings.page,
        pageStr = this.settings.urlState.match( (/\/\d{1,2}\?/g)) ||
                  this.settings.urlState.match( (/\?/g)) ||
                  this.settings.urlState.match( (/\/\d{1,2}/g)) || "",
        page = parseFloat( pageStr.length>0 ? pageStr[0].replace(/[^\w]/ig, '') : 1);

    if (page > 1) this.$element.trigger('setPage', page);

    this.$element.on('changePage', function (event, pages) {
     
      var to = (pageStr == "") ?
          (that.settings.urlState + '/' + pages.new) :
          that.settings.urlState.replace(pageStr[0],'/' + pages.new + (pageStr[0].indexOf('?')>=0 ? '?' : ''));


    


        /* push state history */
        history.pushState({ page: pages.new}, "page " + pages.new, to);

    });


    window.onpopstate = function (event) {

      var page = event.state && event.state.page || initPage;
      that.$element.trigger('setPage', page);
    };
  }
  gallery.prototype.touch = function () {

    var pageXIni = 0,
        pageXMove = 0,
        par = this.settings,
        $container = this.settings.$container,
        percent,
        that = this;

    $container[0].addEventListener('touchstart', function (event) {
      pageXIni = event.touches[0].pageX, $container.addClass('no-transition')
    });
    $container[0].addEventListener('touchmove', function (event) {
      var pageXMove;
      if (par.pages < 1) return false;

      pageXMove = event.touches[0].pageX - pageXIni;
      percent = (pageXMove * 100) / par.mainWidth
            $container.css("margin-left", ((((par.page-1)*100) - percent) * -1) + '%');
    });
    $container[0].addEventListener('touchend', function (event) {

      if (par.pages < 1) return false;
      //var percent = (100 / par.mainWidth) * pageXMove;
      //percent = (pageXMove * 100) / par.mainWidth
      if (Math.abs(percent) > 30) {
        if (percent > 0 && par.page > 0) par.page--
        else if (percent < 0 && par.page < par.pages) par.page++
        //else if (percent < 0 && par.page < Math.ceil(par.pages - 1)) par.page++
      }
      $container.removeClass('no-transition');
     
   


      that.move(par.page);
    })
  }



  gallery.prototype.ads = function () {
    var that  = this, par = that.settings, time = 3;

      function timerInit(){
        
        var interval, t = time, $timer =  par.add.$blockAd.find('.ad-close');

         $timer.hide().text('Omitir en '+t);
         par.add.$blockAd.data('skip', false);

         setTimeout(function(){
            $timer.show()
            interval = setInterval(function(){
              t -= 1;
              $timer.text(t != 0 ? ('Omitir en '+t) : 'Omitir' );
              if(t == 0){
                par.add.$blockAd.data('skip', true);
                clearInterval(interval);
              } 
            }, 1000);
         },2000);
      }


    if (par.ads) {
      
        /* BEGIN: precarga de banners */
        !function() {
          var a = document.createElement("script");
          a.setAttribute("id", "trackJS" + Math.random().toString().substring(2)), a.type = "text/javascript", a.async = !0, a.src = urlTrack;
          var e = document.getElementsByTagName("script")[0];
          e.parentNode.insertBefore(a, e)
        }()
        try {
          udm_("http" + ("s" == document.location.href.charAt(4) ? "s://sb" : "://b") + ".scorecardresearch.com/b?c1=2&c2=6906613&ns_site=rpp&name=" + par.comscore)
        } catch(o) {}
        setTimeout(function(){
          if(typeof ga == 'function'){
            ga('send', 'pageview');
          }
          try {


           // par.add.slides += 1;
             if (par.page%3 == 0) {
           
            //if (par.add.slides >= 3) {             

            if(!par.add.adInit){
                par.add.$blockAd  = $('<div class="ep_bloquer" style="display:none;"><div class="middleAd"><div id="eplAdDiv' + par.ads + '"></div><a class="ad-close"></a></div></div>');

                $('.ad-close', par.add.$blockAd).on('click', function(){
                 if(par.add.$blockAd.data('skip')){
                    par.add.waiting = false;
                    par.add.$blockAd.fadeOut(200);
                    that.$element.removeClass('show-add')
                 }  
                });

                par.$wrapper.append(par.add.$blockAd)
                eplSetAdM(par.ads);
                par.add.adInit = 1;

              }else eplDoc.epl.reloadSpace(par.ads);

          // router eplaning
          var timer,n;
            if(timer&&clearTimeout(timer),window.eplDoc&&eplDoc.epl){
                var a=eplDoc.epl;
                return n=a.rH,void(a.rH=function(e){
                    var l,t=e.sp;

                    for(l in t){

                      if(t[l].k === par.ads && t[l].a && t[l].a.length > 0){
                          par.add.waiting = true;
                          par.add.$blockAd.show();
                          that.$element.addClass('show-add')
                          timerInit();
                         // par.add.slides = 0;

                      }
                    }
                    return a.rH=n,n.call(a,e)
                 })
            }timer=setTimeout(arguments.callee,1)


            


            }
          } catch(o) {}
        },100)
        /* END: precarga de banners */
      
    }
  }

  $.fn.gallery = function () {
    this.each(function () {
      new gallery(this);
    });
  };
})(this, document);


/*
  Slide JS for "X Simple Library"
  v1.1.0
  by ...
  10/2015 */


(function (global, document) {
  'use strict';

  var Slide = function(element) {

    this.$element = $(element);
    if (this.$element.hasClass('x-done')) return;
    this.settings = $.extend({
            pages: 0,
            itemsPage: 0, // items por pagina
            page: 1,
            $pagerText: this.$element.find('.x-pager-text'),
            $pagerNumber: this.$element.find('.x-pager-number'),
            $pagerThumb: this.$element.find('.x-pager-thumb'),
            $items: null,
            interval: 0,
            timer: null,
            variableWidth: false,
            redirect: false,
            breakpoints: false,
            lazy: false,
            urlState: false,
            slideOne: false,
            ads: false
          }, this.$element.data('x'));
    //if (!this.settings.variableWidth) {
      this.settings.breakpoints = JSON.parse('[' + (this.settings.breakpoints ? this.settings.breakpoints.replace(/(\w*)/g, '[$1]').replace(/\[\]/g,'').replace(/x/g,',') : '[3020,1]') + ']');
    //}
    this.render();
    this.binding();
    /* si tiene estado, lo activamos */
    if (this.settings.urlState.length) {
      this.state();
      this.ads(true);
    }
    var that = this;
    $(window).on('xresize.xslide', function (event) {
      that.render();
    });

    this.$element.addClass('x-done');
  }
  Slide.prototype.binding = function () {
    var that = this,
        par = this.settings;


    /* lazy images*/
    if (par.lazy){
      var $first = $('figure>img', this.settings.$items.eq(0));
      $first.attr('src', $first.data('src'));
    }

    /* aplicamos eventos de paginacion */
    this.$element.find('.x-next, .x-prev, .x-page').on(xsl.dv.clickTap + '.xslide', function (event) {
      var $this = $(this);
      event.preventDefault();
      event.stopPropagation();
      if ($this.hasClass('x-next'))
        that.move('next');
      else if ($this.hasClass('x-prev'))
        that.move('prev');
      else {
        that.move($this.data('page'));
      }
    });

    /* si es autoplay, play */
    if (par.interval > 0) {
      this.$element.on('mouseenter.xslide', function () {
        that.stop();
      }).on('mouseleave.xslide', function () {
        that.play();
      });
    }

    // states
    this.$element.bind('setPage', function (event, page) {
      that.move(page, true);
    });

    // touch
    if (xsl.dv.canTouch) this.touch();

  }

  Slide.prototype.getBreakPoint = function (){
    var width = xsl.dv.windowWidth/* $(window, document).width()*/,
      i,
      old = 0;
    for (i in this.settings.breakpoints) {
      if (width > old && width <= this.settings.breakpoints[i][0]) {
        return this.settings.breakpoints[i];
      }
      old = i;
    }
    return this.settings.breakpoints[old]; //cojemos el ultimo
  }
  Slide.prototype.render = function (){

    var breakpoint = this.getBreakPoint(),
        $items,
        hybrid,
        length,
        that = this,
        par = this.settings;
    if (breakpoint[1] != par.itemsPage) {

      par.$items = this.$element.find('.x-item');
      length = par.$items.length;
      par.$container = this.$element.find('.x-container');
      par.$wrapper = this.$element.find('.x-wrapper');

      if (par.variableWidth) {
        hybrid = 0;
        par.pages = 0;
        par.$items.each(function (i) {
          hybrid += $(this).width();
        });
        par.pages = length;
        par.$container.css('width', hybrid + 1);
      } else {
        par.pages = (par.slideOne ? length  : Math.ceil(length / breakpoint[1]));


        par.itemsPage = breakpoint[1];
        hybrid = (100 / breakpoint[1]);
        par.$items.css('width', (100 / length) + '%');
        par.$container.css('width', (hybrid * length) + '%');

        //generamos pager number
        if (par.$pagerNumber.length) {

          hybrid = '';
          for (var i = 1; i <= par.pages; i++) {
            hybrid += '<li data-page="' + i + '" class="x-page' + (hybrid ? '' : ' active') + '">&nbsp;</li>';
          }
          par.$pagerNumber.empty().append(hybrid);
        }


        /* si hay pager-text */
        if (par.$pagerText.length) {
          par.$pagerText.html('<span class="icon-gallery"></span> Foto ' + '<strong>' + par.page + '</strong> de ' + par.pages);
        }


        // avanzar si es que debe :|
        //setTimeout(function(){


        if(par.slideOne){
          // ocultando en mobil
           if(this.getBreakPoint()[1] == 1 ) par.interval = 0;

          /* if((par.pages - par.page) < this.getBreakPoint()[1] &&  par.page - this.getBreakPoint()[1] != par.pages){ 
            this.move(((par.pages) - (par.pages - par.page)) - 1);
            }
           else  this.move(par.page);*/
           
          // if(this.move(par.page);)
         
          /*if(this.getBreakPoint()[1] > 1 && ((par.pages - par.page) + 1) < 2){
            this.move(par.page - 1);

          } else*/ this.move(par.page);
          
        }
        else if (par.page > 1) {
          this.move(par.page);
        }

       // },10);



        /* si es autoplay, play */
        if (par.interval > 0) {
          this.play();
        }
      }
    }

    par.mainWidth = this.$element.width();

  }
  Slide.prototype.move = function (dir, skipState) {
    var par = this.settings,
        oldPage = par.page,
        containerWidth,
        wrapperWidth,
        moveIn,
        hybrid;

    /* redireccionamos a una url si esta al final y si existe el parametro "redirect" */
    if (par.page >= par.pages && par.redirect && dir == 'next') {
      document.location.href = par.redirect;
      return
    };




    switch (dir) {
      case 'next':
    
        par.page = (par.page >= par.pages) ? 1 : par.page + 1;
        break;
      case 'prev':
 
        par.page = (par.page <= 1) ? par.pages : par.page - 1;
        break;
      default: // 'to':
        par.page = (dir >= 1 && dir <= par.pages) ? dir : 1;
        break;
    };
    



    //precarmos imagen
    if (par.lazy){
      hybrid = $('figure>img', this.settings.$items.eq(par.page-1));
      hybrid.attr('src', hybrid.data('src'));
    }


    containerWidth = par.$container.get(0).style.width;
    if (containerWidth.indexOf('px') > -1 ||  par.slideOne) { //variablewidth

      wrapperWidth = this.$element.find('.x-wrapper').width();
      moveIn = 0;


      for(var i = 0; i < (par.page-1); i++){

        moveIn += hybrid = par.$items.eq(i).width();
      }


      ;
      if (((wrapperWidth + moveIn) - parseFloat(containerWidth)) > hybrid && !par.slideOne ) {
        par.page = 1;
        moveIn = 0;
        
      }else if(par.slideOne && this.getBreakPoint()[1] != 1 && dir != 'prev' && (par.pages - par.page) <  (this.getBreakPoint()[1] - 1)){
           moveIn = 0;
          for(var i = 0; i < ((par.pages) - (this.getBreakPoint()[1])); i++){
            moveIn += hybrid = par.$items.eq(i).width();
          }
          par.page = par.pages - (this.getBreakPoint()[1] - 1);

      }
      moveIn = -(moveIn)+'px';

    }else {

      moveIn = (par.page - 1) * 100;

      if (moveIn > parseFloat(containerWidth)) {

        moveIn -= moveIn - parseFloat(par.$container.get(0).style.width);
      }

      hybrid = (par.page * 100) - parseFloat(containerWidth);
      if (hybrid > 0) {
        moveIn -= hybrid;
      }

      moveIn = -(moveIn)+'%';
    }
 

    if (xsl.dv.canCSSTransition) par.$container.css('margin-left', moveIn);
    else par.$container.animate({
      'margin-left': moveIn
    });

    /* actualizamos item page */
    if (par.$pagerThumb.length || par.$pagerNumber.length) {

      this.$element.find('.x-page').removeClass('active').eq(par.page - 1).addClass('active');
    }

    /* actualizamos pager-text */
    if (par.$pagerText.length) {
      this.$element.find('.x-pager-text strong').text(par.page);
    }

    /* guardamos estado */
    if (!skipState) {
      this.$element.trigger('changePage', par.page);
    }

    if(par.slideOne){
      for (var i =  this.getBreakPoint()[1] - 1; i >= 0; i--) {
        
        par.$items.eq((par.page + i) - 1).trigger('showed');
      }
    }

    //
    this.ads(false);
  }
  Slide.prototype.play = function () {
    var that = this;
    if (this.settings.interval > 0) {
      clearInterval(this.settings.timer);
      this.settings.timer = setInterval(function () {
        that.move('next');
      }, this.settings.interval * 1000);
    };
  }
  Slide.prototype.stop = function () {
    clearInterval(this.settings.timer);
  }
  Slide.prototype.state = function () {
    var that = this,
        initPage = this.settings.page,
        pageStr = this.settings.urlState.match( (/\/\d{1,2}\?/g)) ||
                  this.settings.urlState.match( (/\?/g)) ||
                  this.settings.urlState.match( (/\/\d{1,2}/g)) || "",

        page = parseFloat( pageStr.length>0 ? pageStr[0].replace(/[^\w]/ig, '') : 1);

    if (page > 1) this.$element.trigger('setPage', page);

    this.$element.on('changePage', function (event, oldPage) {
      var to = (pageStr == "") ?
          (that.settings.urlState + '/' + oldPage) :
          that.settings.urlState.replace(pageStr[0],'/' + oldPage + (pageStr[0].indexOf('?')>=0 ? '?' : ''));
      history.pushState({ page: oldPage}, "page " + oldPage, to);
    });
    window.onpopstate = function (event) {

      var page = event.state && event.state.page || initPage;
      that.$element.trigger('setPage', page);
    };
  }
  Slide.prototype.touch = function () {

    var pageXIni = 0,
        pageXMove = 0,
        par = this.settings,
        $container = this.settings.$container,
        percent,
        that = this;

    $container[0].addEventListener('touchstart', function (event) {
      pageXIni = event.touches[0].pageX, $container.addClass('no-transition')
    });
    $container[0].addEventListener('touchmove', function (event) {
      var pageXMove;
      if (par.pages < 1) return false;

      pageXMove = event.touches[0].pageX - pageXIni;
      percent = (pageXMove * 100) / par.mainWidth
            $container.css("margin-left", ((((par.page-1)*100) - percent) * -1) + '%');
    });
    $container[0].addEventListener('touchend', function (event) {
      if (par.pages < 1) return false;
      //var percent = (100 / par.mainWidth) * pageXMove;
      //percent = (pageXMove * 100) / par.mainWidth
      if (Math.abs(percent) > 30) {
        if (percent > 0 && par.page > 0) par.page--
        else if (percent < 0 && par.page < par.pages) par.page++
        //else if (percent < 0 && par.page < Math.ceil(par.pages - 1)) par.page++
      }
      $container.removeClass('no-transition');


      that.move(par.page);
    })
  }
  Slide.prototype.ads = function (init) {
    var that  = this;
    if (this.settings.ads) {
      if (init) {
        this.settings.$wrapper.append('<div id="eplAdDiv' + this.settings.ads + '"></div>')
        eplSetAdM(this.settings.ads);
        $('#eplAdDiv' + this.settings.ads).on('click', function () {
          $(this).hide();
        })
      }else {
        /* BEGIN: precarga de banners */
        !function() {
          var a = document.createElement("script");
          a.setAttribute("id", "trackJS" + Math.random().toString().substring(2)), a.type = "text/javascript", a.async = !0, a.src = urlTrack;
          var e = document.getElementsByTagName("script")[0];
          e.parentNode.insertBefore(a, e)
        }()
        try {
          udm_("http" + ("s" == document.location.href.charAt(4) ? "s://sb" : "://b") + ".scorecardresearch.com/b?c1=2&c2=6906613&ns_site=rpp&name=" + that.settings.comscore)
        } catch(o) {}
        setTimeout(function(){
          if(ga){
            ga('send', 'pageview');
          }
          try {
            if (that.settings.page%3 == 0) {
              $('#eplAdDiv' + that.settings.ads).show();
              eplDoc.epl.reloadSpace(that.settings.ads);
            }
          } catch(o) {}
        },100)
        /* END: precarga de banners */
      }
    }
  }
  $.fn.slide = function () {
    this.each(function () {
      new Slide(this);
    });
  };
})(this, document);

/*
  DF Widget Load JS
  v1.0.0
  by Marco Montenegro
  03/2016 */

(function (xsl, $) {
  'use strict';
  var Widget = function (element) {
    this.$element = $(element);
    this.render();
  }
  Widget.prototype.render = function (name) {
    var params;
    if (typeof rppWR == "object") {
      params = this.$element.data('x');
      if (params.method == "render"){
        rppWR.read({events: params.events, type: params.type, id: params.id}).render({id:'#' + params.id });
      }else if (params.method == "renderMaM") {
        rppWR.read({events: params.events, type: params.type, matchId: params.matchId}).renderMaM({id:'#' +  params.id, url: params.url});
      }
    } else {
      setTimeout(this.render.bind(this), 500);
    }

    /*
    setTimeout(function(){
      rppWR.read({events: params.events, type: params.type, matchId: params.matchId}).render({id:'#' + params.id});
      rppWR.read({events: params.events, type: params.type, matchId: params.matchId}).renderMaM({id:'#' +  params.id,url:'http://dev.rpp.pe/politica/actualidad/el-gran-duelo-luis-advincula-vs-james-rodriguez-noticia-900273'});
    }, 2500);
    */
  }

  $.fn.widget = function () {
    this.each(function () {
      new Widget(this);
    });
  }
})(xsl, jQuery);


/*
  Social Load JS for "X Simple Library"
  v1.1.0
  by ...
  10/2015 */

(function (xsl, $) {
  'use strict';

  var Social = function (element) {
    this.$element = $(element);
    this.network = {
      fb: "//connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.5",
      tw: "//platform.twitter.com/widgets.js",
      gp: "https://apis.google.com/js/platform.js"
    }
    this.render();
  }
  Social.prototype.load = function (name) {
    var network = this.network[name];
    xsl.fn.loadJs(network);
  }
  Social.prototype.render = function () {
    var that = this;
    this.$element.children('li').each(function () {
      that.load(this.className);
    })
  }

  $.fn.social = function () {
    this.each(function () {
      new Social(this);
    });
  }

})(xsl, jQuery);


/*
  Lazy Load JS for "X Simple Library"
  v1.1.0
  by ...
  10/2015 */

(function (xsl, $) {
  'use strict';

  var Lazy = function (element) {
    $(element).on('scrollin', { distance: 200 }, this.in);
  }

  Lazy.prototype.in = function () {
    var $element = $(this);
    var par = $element.data('x');
    $element.css({
      opacity: '0',
      '-webkit-transition': 'background-color 500ms ease-out 1s',
      '-moz-transition': 'background-color 500ms ease-out 1s',
      '-o-transition': 'background-color 500ms ease-out 1s',
      'transition': 'background-color 500ms ease-out 1s'
    });
    switch (par.type) {
      case 'html':
        $element.append(par.content);
        break;
      case 'ads':
        if (typeof eplSetAdM == "function" && eplDoc.epl.spaces[par.position]) {
          $element.html('<div id="eplAdDiv' + par.position + '"></div>');
          eplSetAdM(par.position);
        }
        break;
      default:
        $element.attr('src', par.content);
    }
    $element.off("scrollin");
    $element.css({opacity:1});
  }

  $.fn.lazy = function () {
    this.each(function () {
      new Lazy(this);
    });
  };

})(xsl, jQuery);


/*
  Calendar JS for "X Simple Library"
  v1.1.0
  by ...
  10/2015 */


(function (xsl, $) {
  "use strict";
  var Calendar = function (element) {
    var now = new Date();
    this.settings = $.extend({
      monthsName: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
                   "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      weekDaysName: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'],
      endDate: now,
      startDate: new Date((new Date(now)).setFullYear(now.getFullYear() - 5)), // otra forma?
      selected: now,
      firstDay: 1
    }, $(element).data('x'));
    if (typeof this.settings.selected === 'string') {
      this.settings.selected = new Date(this.settings.selected);
    }

    this.settings.current = new Date(this.settings.selected.getTime());
    this.element = element;
    this.$element = $(element);
    this.draw();
  };

  Calendar.prototype.draw = function () {
    var inner = '',
      celdas = '',
      idRow = 1,
      idColumn = 0,

      html = '<div class="x-controls"><i class="icon-prev"></i><i class="icon-next"></i><select class="x-months">[months]</select><select class="x-years">[years]</select></div><table><thead><tr>[dias]</tr></thead><tbody>[celdas]</tbody></table>';


    for (var i = 0; i < this.settings.weekDaysName.length; i++) {
      inner += '<td>' + this.settings.weekDaysName[i] + '</td>';
      if (i < 6) {
        idColumn = this.settings.firstDay;
        celdas += '<tr>';
        for (var c = 0; c < this.settings.weekDaysName.length; c++) {
          celdas += '<td class="x-dayweek-' + (idColumn > 6 ? idColumn - 7 : idColumn) +
            '" id="cell-' + idRow + '-' + (idColumn > 6 ? idColumn - 7 : idColumn) + '">&nbsp;</td>';
          idColumn++;
        }
        celdas += '</tr>';
        idRow++;
      }
    }
    html = html.replace('[dias]', inner);
    html = html.replace('[celdas]', celdas);

    inner = '';
    for (var i = 0; i < this.settings.monthsName.length; i++) {
      inner += '<option value="' + i + '">' + this.settings.monthsName[i] + '</option>';
    };
    html = html.replace('[months]', inner);

    inner = '';
    if (this.settings.startDate.getFullYear() > this.settings.endDate.getFullYear())
      return console.error('x - calendar: error en rango de fechas');
    for (var i = this.settings.startDate.getFullYear(); i <= this.settings.endDate.getFullYear(); i++) {
      inner += '<option value="' + i + '">' + i + '</option>';
    };
    html = html.replace('[years]', inner);

    this.element.innerHTML = html;
    this.setEvents();


    //initialize values to render
    this.$element.find('.x-months').val(this.settings.selected.getMonth());
    this.$element.find('.x-years').val(this.settings.selected.getFullYear()).trigger('change.xcalendar')
  }
  Calendar.prototype.setEvents = function (event) {
    this.$element.find('.icon-prev, .icon-next').on(xsl.dv.clickTap + '.xcalendar', this.refresh.bind(this));
    this.$element.find('select').on('change.xcalendar', this.refresh.bind(this));
  }
  Calendar.prototype.refresh = function (event) {
    event.preventDefault();
    var control = event.target,
      settings = this.settings,
      current = this.settings.current,
      className = control.className,
      dateFirstDay,
      dateLastDay,
      day = 1,
      temp;
    if (className.indexOf('disabled') >= 0) return;

    if (className.indexOf('prev') >= 0) {
      current.setMonth(current.getMonth() - 1)
    } else if (className.indexOf('next') >= 0) {
      current.setMonth(current.getMonth() + 1)
    } else if (className.indexOf('months') >= 0) {
      current.setMonth(control.value * 1)
    } else if (className.indexOf('years') >= 0) {
      current.setYear(control.value * 1)
    }

    this.$element.find('.x-months').val(current.getMonth());
    this.$element.find('.x-years').val(current.getFullYear());

    dateFirstDay = new Date(current.getFullYear(), current.getMonth(), 1);
    dateLastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    this.$element.find('table tbody td').removeClass('x-day-selected').addClass('x-out-time').each(function (index, element) {
      temp = new Date(current.getFullYear(), current.getMonth(), day);
      if ((this.id == 'cell-1-' + dateFirstDay.getDay() || day > 1) && day <= dateLastDay.getDate()) {

        if (settings.selected.getTime() == temp.getTime()) {
          $(this).addClass('x-day-selected');
        }
        if (temp.getTime() >= settings.endDate.getTime() || temp.getTime() <= settings.startDate.getTime()) {
          this.innerHTML = '<span class="x-day">' + day + '</span>';
        } else {
          this.innerHTML = '<a class="x-day" href="' + (settings.link.replace('[date]', current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + day).slice(-2))) + '">' + day + '</a>';
        }
        $(this).removeClass('x-out-time');
        day++
      }
    });

    // enabled or disabled controls
    this.$element.find('.icon-prev, .icon-next').removeClass('x-disabled');
    if (dateFirstDay.getFullYear() <= settings.startDate.getFullYear() && dateFirstDay.getMonth() <= settings.startDate.getMonth()) {
      this.$element.find('.icon-prev').addClass('x-disabled');
    }
    if (dateFirstDay.getFullYear() >= settings.endDate.getFullYear() && dateFirstDay.getMonth() >= settings.endDate.getMonth()) {
      this.$element.find('.icon-next').addClass('x-disabled');
    }

    //complete days out time prev month
    temp = this.$element.find('table tbody tr').slice(0, 2).find('.x-out-time');
    for (var i = temp.length - 1; i >= 0; i--) {
      dateFirstDay.setDate(dateFirstDay.getDate() - 1);
      temp.get(i).innerHTML = '<span class="x-day">' + dateFirstDay.getDate() + '</span>';
    }


    //complete days out time next month
    temp = this.$element.find('table tbody tr').slice(4).find('.x-out-time');
    for (var i = 0; i < temp.length; i++) {
      dateLastDay.setDate(dateLastDay.getDate() + 1);
      temp.get(i).innerHTML = '<span class="x-day">' + dateLastDay.getDate() + '</span>';
    }
  }
  $.fn.calendar = function () {
    this.each(function () {
      new Calendar(this);
    });
  };
})(xsl, jQuery);


/*
  ColumnsFit JS for "X Simple Library"
  v1.1.0
  by Moises Torres http://devtorres.net
  10/2015 */


(function (xsl, $, global) {

  'use strict';

  var ColumnsFit = function (element) {
    this.$element = $(element);
    this.settings = $.extend({
      $childrensClone: false,
      breakpoints: false,
      breakpoint: false
    }, this.$element.data('x'));
    this.settings.breakpoints = JSON.parse('[' + (this.settings.breakpoints ? this.settings.breakpoints.replace(/(\w*)/g, '[$1]').replace(/\[\]/g, '').replace(/x/g, ',') : '[3020,1,10]') + ']');
    this.settings.$childrensClone = this.$element.children().clone();
    this.render();
    var that = this;
    $(window).on('xresize.xcolumnsfit', function (event) {
      that.render();
    });
  };

  ColumnsFit.prototype.getBreakPoint = function () {
    var width = this.$element.parent().outerWidth(true), /*xsl.dv.windowWidth, /* $(window, document).width(),*/
      i = 0,
      old = 0;
    for (i in this.settings.breakpoints) {
      if (this.settings.breakpoints.hasOwnProperty(i)) {
        if (width >= old && width < this.settings.breakpoints[i][0]) {
          return this.settings.breakpoints[i];
        }
        old = i;
      }
    }
    return this.settings.breakpoints[old]; //cojemos el ultimo
  };

  ColumnsFit.prototype.createColumns = function () {
    var html = '', i = 0;
    for (i = 0; i < this.settings.breakpoint[1]; i += 1) {
      html += '<div class="x-column column-' + this.settings.breakpoint[1] + '" style="padding: 0 ' + (this.settings.breakpoint[2] / 2) + 'px"></div>';
    }
    return html;
  };

  ColumnsFit.prototype.createItem = function ($item, $columns, gutter) {
    var $selected = $columns.eq(0), i = 0;
    for (i = 0; i < $columns.length; i += 1) {
      $selected = ($columns.eq(i).height() < $selected.height()) ? $columns.eq(i) : $selected;
    };
    $selected.append($item);
  };

  ColumnsFit.prototype.render = function () {
    if (this.$element.parent().outerWidth(true) < this.settings.breakpoints[0][0] && !this.$element.hasClass('x-done')) {
      this.$element.addClass('x-no-fit');
      xsl.ui.lazy(this.$element.find('.x-fit-lazy'));
      return;
    }

    var par = this.settings,
      breakpoint = this.getBreakPoint(),
      that = this,
      $columns = null;

    if (par.breakpoint[0] === breakpoint[0]) {
      return;
    }

    par.breakpoint = breakpoint;

    this.$element.css({
      'margin': '0 -' + (breakpoint[2] / 2) + 'px'
    }).empty();

    $columns = $(this.createColumns());


    this.$element.append($columns);

    par.$childrensClone.each(function () {
      that.createItem($(this).clone(), $columns, breakpoint[2]);
    });
    this.$element.removeClass('x-no-fit');
    xsl.ui.lazy($columns.find('.x-fit-lazy'));
    this.$element.addClass('x-done');
  };



  $.fn.columnsfit = function () {
    this.each(function () {
      this.x = new ColumnsFit(this);
    });
  };
}(xsl, jQuery, this));


/*
 Fixed JS for "X Simple Library"
 v1.1.0
 by Moises Torres http://devtorres.net
 10/2015 */

(function (xsl, $) {
  var Fixed = function (element, type) {
    this.$element = $(element);
    if (typeof this[type] == "function") {
      this[type]();
    }
  }

  Fixed.prototype.menutop = function () {
    var that = this,
        lastTop = 0,
        elTop = this.$element.offset().top;
    $(window).on('scroll', function (event) {
      var top = $(this).scrollTop();
      if (top > elTop /*&& top < lastTop*/) {
        that.$element.addClass('fixed-on');
      } else {
        that.$element.removeClass('fixed-on');
      };
      lastTop = top;
    }).trigger("scroll");
  }

  Fixed.prototype.socialmenu = function () {
    var that = this, inContentBottom;
      //lastTop = 0;
      /*elTop = this.$element.offset().top; //$(window).height() / 2; // se muestra despues de recorrer la mitad de la pantalla*/
    var contentBottom = (/*this.$element.parent().outerHeight(true) + */this.$element.parent().offset().top) - $(window).height();
    $(window).on('scroll', function (event) {
      inContentBottom = contentBottom + that.$element.parent().outerHeight(true);
      if (!that.$element.is(':visible')) return false;
      var top = $(this).scrollTop();
      //if (top > elTop && top > lastTop && top < contentBottom) {
      if (top < inContentBottom) {
        that.$element.addClass('fixed-on');
      } else {
        that.$element.removeClass('fixed-on');
      };
      //lastTop = top;
    }).trigger("scroll");
  }
  xsl.ui.fixed = Fixed;
})(xsl, jQuery);


/*
 TimeAgo JS for "X Simple Library"
 v1.1.0
 by Moises Torres http://devtorres.net
 10/2015 */
(function (xsl, $) {
  var Ago = function(element){
    //based in http://stackoverflow.com/a/12475270

    this.element = element;
    this.formats = [
      [60, 'segundos', 1], // 60
      [120, 'un minuto', '1 minute from now'], // 60*2
      [3600, 'minutos', 60], // 60*60, 60
      [7200, 'una hora', '1 hour from now'], // 60*60*2
      [86400, 'horas', 3600], // 60*60*24, 60*60
      [172800, 'Hace un día', 'Tomorrow'], // 60*60*24*2
      [604800, 'días', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Hace una semana', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'semanas', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Hace un mes', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'meses', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Hace un año', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'años', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Hace un siglo', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'siglos', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    this.time = element.getAttribute('data-x');
    if (this.time) {
      this.time = +new Date(this.time);
      this.element.innerHTML = this.render();
    }
  }
  Ago.prototype.render = function () {

    var seconds = (+new Date() - this.time) / 1000,
      token = 'Hace', list_choice = 1;

    if (seconds == 0) {
      return 'Ahora'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'En';
      list_choice = 2;
    }
    var i = 0, format;
    while (format = this.formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return token + ' ' + Math.floor(seconds / format[2]) + ' ' + format[1];
      }

  }
  $.fn.ago = function () {
    this.each(function () {
      new Ago(this);
    });
  };
})(xsl, jQuery);



/**
 * [jQuery-stickit]{@link https://github.com/emn178/jquery-stickit}
 *
 * @version 0.2.3
 * @author Yi-Cyuan Chen [emn178@gmail.com]
 * @copyright Yi-Cyuan Chen 2014-2016
 * @license MIT
 */
(function ($, window, document) {
  var KEY = 'jquery-stickit';
  var SPACER_KEY = KEY + '-spacer';
  var SELECTOR = ':' + KEY;
  var IE7 = navigator.userAgent.indexOf('MSIE 7.0') != -1;
  var OFFSET = IE7 ? -2 : 0;
  var MUTATION = window.MutationObserver !== undefined;
  var animationend = 'animationend webkitAnimationEnd oAnimationEnd';
  var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd';

  var Scope = window.StickScope = {
    Parent: 0,
    Document: 1
  };

  var Stick = {
    None: 0,
    Fixed: 1,
    Absolute: 2
  };

  var init = false;

  function throttle(func) {
    var delay = 10;
    var lastTime = 0;
    var timer;
    return function () {
      var self = this, args = arguments;
      var exec = function () {
        lastTime = new Date();
        func.apply(self, args);
      };
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      var diff = new Date() - lastTime;
      if (diff > delay) {
        exec();
      } else {
        timer = setTimeout(exec, delay - diff);
      }
    };
  }

  $.expr[':'][KEY] = function (element) {
    return !!$(element).data(KEY);
  };

  function Sticker(element, options) {
    this.element = $(element);
    this.options = options || {};
    this.options.scope = this.options.scope || Scope.Parent;
    this.options.className = this.options.className || 'stick';
    this.options.top = this.options.top || 0;
    this.options.extraHeight = this.options.extraHeight || 0;
    if (this.options.overflowScrolling === undefined) {
      this.options.overflowScrolling = true;
    }
    var transform = this.element.css('transform');
    if (this.options.zIndex === undefined) {
      this.zIndex = this.element.css('z-index') || 100;
      if (this.zIndex == 'auto') {
        this.zIndex = 100;
      } else if (this.zIndex == '0' && transform != 'none') {
        this.zIndex = 100;
      }
    }
    this.offsetY = 0;
    this.lastY = 0;
    this.stick = Stick.None;
    this.spacer = $('<div />');
    this.spacer[0].id = element.id;
    this.spacer[0].className = element.className;
    this.spacer[0].style.cssText = element.style.cssText;
    this.spacer.addClass(SPACER_KEY);
    this.spacer.css({
      display: 'none',
      visibility: 'hidden'
    });
    this.spacer.insertAfter(this.element);
    if (this.element.parent().css('position') == 'static') {
      this.element.parent().css('position', 'relative');
    }
    if (this.element.css('will-change') == 'auto') {
      this.element.css('will-change', 'transform');
    }
    if (transform == 'none') {
      this.element.css('transform', 'translateZ(0)');
    } else if (transform.indexOf('matrix3d') == -1) {
      this.element.css('transform', this.element.css('transform') + ' translateZ(0)');
    }
    this.bound();
    this.precalculate();
    this.store();
  }

  Sticker.prototype.store = function () {
    var element = this.element[0];
    this.origStyle = {
      width: element.style.width,
      position: element.style.position,
      left: element.style.left,
      top: element.style.top,
      bottom: element.style.bottom,
      zIndex: element.style.zIndex
    };
  };

  Sticker.prototype.restore = function () {
    this.element.css(this.origStyle);
  };

  Sticker.prototype.bound = function () {
    var element = this.element;
    if (!IE7 && element.css('box-sizing') == 'border-box') {
      var bl = parseInt(element.css('border-left-width')) || 0;
      var br = parseInt(element.css('border-right-width')) || 0;
      var pl = parseInt(element.css('padding-left')) || 0;
      var pr = parseInt(element.css('padding-right')) || 0;
      this.extraWidth = bl + br + pl + pr;
    } else {
      this.extraWidth = 0;
    }

    this.margin = {
      top: parseInt(element.css('margin-top')) || 0,
      bottom: parseInt(element.css('margin-bottom')) || 0,
      left: parseInt(element.css('margin-left')) || 0,
      right: parseInt(element.css('margin-right')) || 0
    };
    this.parent = {
      border: {
        bottom: parseInt(element.parent().css('border-bottom-width')) || 0
      }
    };
  };

  Sticker.prototype.precalculate = function () {
    this.baseTop = this.margin.top + this.options.top;
    this.basePadding = this.baseTop + this.margin.bottom;
    this.baseParentOffset = this.options.extraHeight - this.parent.border.bottom;
    this.offsetHeight = Math.max(this.element.height() - screenHeight, 0);
  };

  Sticker.prototype.reset = function () {
    this.stick = Stick.None;
    this.spacer.hide();
    this.spacer.css('width', '');
    this.restore();
    this.element.removeClass(this.options.className);
  };

  Sticker.prototype.setAbsolute = function (left) {
    if (this.stick == Stick.None) {
      this.element.addClass(this.options.className);
    }
    this.stick = Stick.Absolute;
    this.element.css({
      width: this.element.width() + this.extraWidth + 'px',
      position: 'absolute',
      top: this.origStyle.top,
      left: left + 'px',
      bottom: -this.options.extraHeight + 'px',
      'z-index': this.zIndex
    });
  };

  Sticker.prototype.setFixed = function (left, lastY, offsetY) {
    if (this.stick == Stick.None) {
      this.element.addClass(this.options.className);
    }
    this.stick = Stick.Fixed;
    this.lastY = lastY;
    this.offsetY = offsetY;
    this.element.css({
      width: this.element.width() + this.extraWidth  + 'px',
      position: 'fixed',
      top: (this.options.top + offsetY) + 'px',
      left: left + 'px',
      bottom: this.origStyle.bottom,
      'z-index': this.zIndex
    });
  };

  Sticker.prototype.updateScroll = function (newY) {
    if (this.offsetHeight == 0 || !this.options.overflowScrolling) {
      return;
    }
    this.offsetY = Math.max(this.offsetY + newY - this.lastY, -(this.options.top + this.offsetHeight));
    this.offsetY = Math.min(this.offsetY, 0);
    this.lastY = newY;
    this.element.css('top', (this.options.top + this.offsetY) + 'px');
  };

  Sticker.prototype.isActive = function () {
    return (this.options.screenMinWidth === undefined || screenWidth >= this.options.screenMinWidth) &&
      (this.options.screenMaxWidth === undefined || screenWidth <= this.options.screenMaxWidth) &&
      this.element.is(':visible');
  };

  Sticker.prototype.locate = function () {
    var rect, top, left, element = this.element, spacer = this.spacer;
    if (!this.isActive()) {
      if (this.stick != Stick.None) {
        this.reset();
      }
      return;
    }
    switch (this.stick) {
      case Stick.Fixed:
        rect = spacer[0].getBoundingClientRect();
        top = rect.top - this.baseTop;
        if (top >= 0) {
          this.reset();
        } else if (this.options.scope == Scope.Parent) {
          rect = element.parent()[0].getBoundingClientRect();
          if (rect.bottom + this.baseParentOffset + this.offsetHeight <= element.outerHeight(false) + this.basePadding) {
            this.setAbsolute(this.spacer.position().left);
          } else {
            this.updateScroll(rect.bottom);
          }
        } else {
          this.updateScroll(rect.bottom);
        }
        break;
      case Stick.Absolute:
        rect = spacer[0].getBoundingClientRect();
        top = rect.top - this.baseTop;
        left = rect.left - this.margin.left;
        if (top >= 0) {
          this.reset();
        } else {
          rect = element.parent()[0].getBoundingClientRect();
          if (rect.bottom + this.baseParentOffset + this.offsetHeight > element.outerHeight(false) + this.basePadding) {
            this.setFixed(left + OFFSET, rect.bottom, -this.offsetHeight);
          }
        }
        break;
      case Stick.None:
      /* falls through */
      default:
        rect = element[0].getBoundingClientRect();
        top = rect.top - this.baseTop;
        if (top >= 0) {
          return;
        }

        var rect2 = element.parent()[0].getBoundingClientRect();
        spacer.height(element.height());
        spacer.show();
        left = rect.left - this.margin.left;
        if (this.options.scope == Scope.Document) {
          this.setFixed(left, rect.bottom, 0);
        } else {
          if (rect2.bottom + this.baseParentOffset <= element.outerHeight(false) + this.basePadding) {
            this.setAbsolute(this.element.position().left);
          } else {
            this.setFixed(left + OFFSET, rect.bottom, 0);
          }
        }

        if (!spacer.width()) {
          spacer.width(element.width());
        }
        break;
    }
  };

  Sticker.prototype.resize = function () {
    this.bound();
    this.precalculate();
    if (this.stick == Stick.None) {
      this.locate();
      return;
    }
    var element = this.element;
    var spacer = this.spacer;
    element.width(spacer.width());
    spacer.height(element.height());
    if (this.stick == Stick.Fixed) {
      var rect = this.spacer[0].getBoundingClientRect();
      var left = rect.left - this.margin.left;
      element.css('left', left + 'px');
    }
    this.locate();
  };

  Sticker.prototype.destroy = function () {
    this.reset();
    this.spacer.remove();
    this.element.removeData(KEY);
  };

  var screenHeight, screenWidth;
  function resize() {
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
    $(SELECTOR).each(function () {
      $(this).data(KEY).resize();
    });
  }

  var scroll = function () {
    $(SELECTOR).each(function () {
      $(this).data(KEY).locate();
    });
  };

  var PublicMethods = ['destroy'];
  $.fn.stickit = function (method, options) {
    // init
    if (typeof(method) == 'string') {
      if ($.inArray(method, PublicMethods) != -1) {
        this.each(function () {
          var sticker = $(this).data(KEY);
          if (sticker) {
            sticker[method].apply(sticker, options);
          }
        });
      }
    } else {
      if (!init) {
        init = true;
        resize();
        $(document).ready(function () {
          $(window).bind('resize', resize).bind('scroll', scroll);
          $(document.body).on(animationend + ' ' + transitionend, scroll);
        });

        /*
        if (MUTATION) {
          var observer = new MutationObserver(throttle(scroll));
          observer.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
        */
      }

      options = method;
      this.each(function () {
        var sticker = new Sticker(this, options);
        $(this).data(KEY, sticker);
        sticker.locate();
      });
    }
    return this;
  };
})(jQuery, window, document);
