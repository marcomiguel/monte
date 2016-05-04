(function (global) {
  'use strict';
  var x = {
    runPage: {
      always: 'slide|sticky',
      home: 'columns-fit|lazy',
      archivo: 'tab',
      nota: 'socialmeter',
      envivo: 'tab',
      fotogaleria: 'slidestate|columns-fit',
      galeria: 'slidestate',
      programacion: 'tab',
      /*
      error404: '',
      estatica: '',
      rss: '',
      */
      seccion: 'columns-fit|lazy',
      tags: 'columns-fit|lazy'
    },
    params: false,
    init: function () {
      //this.exec($('body').data('app'));
      this.exec(this.runPage.always + '|' + (this.runPage[$('body').data('type')] || ''));
    },
    exec: function (str) {

      var args = str.split(/\|/g),
        i, fn;
      for (i in args) {
        if (args[i]) {
          fn = args[i].replace(/\-/gm, '');
          if (typeof this.ui[fn] == 'function') {
            this.ui[fn]();
          }
        }
      }
    },
    ui: {
      slide: function () {

        var getSize = function (sizes) {
            var width = $(window, document).width(),
              i,
              old = 0;
            for (i in sizes) {
              if (width >= old && width < i) {
                return sizes[i];
              }
              old = i;
            }
            return sizes[old]; //cojemos el ultimo
          },
          move = function (dir, $slide, skipState) {
            var data = $slide.data('params'),
              oldPage = data.page,
              $inner = $slide.find('.inner'),
              margin, innerWidth;

            /* redireccionamos si esta al final y si existe parametro */
            if (data.page >= data.pages && data.redirect && dir == 'next') {
              document.location.href = data.redirect;
              return
            };
            switch (dir) {
              case 'next':
                data.page = (data.page >= data.pages) ? 1 : data.page + 1;
                break;
              case 'prev':
                data.page = (data.page <= 1) ? data.pages : data.page - 1;
                break;
              default: // 'to':
                data.page = (dir >= 1 && dir <= data.pages) ? dir : 1;
                break;
            };

            $slide.data('params', data);
            margin = (data.page - 1) * 100;
            innerWidth = $inner.get(0).style.width;
            if (innerWidth.indexOf('px') > -1) {
              if (($inner.parent().width() * data.page) > parseFloat(innerWidth)) {
                margin = parseFloat($inner.get(0).style.width) / $inner.parent().width() * 100 - 100;
              }
            } else {
              if (margin > parseFloat(innerWidth)) {
                margin -= margin - parseFloat($inner.get(0).style.width);
              }
            }

            if (x.supportsTransitions) $inner.css('margin-left', (margin * -1) + '%');
            else $inner.animate({
              'margin-left': (margin * -1) + '%'
            });

            /* actualizamos item page */
            if (data.pagerThumb || data.pagerCircle) {
              $slide.find('.page').removeClass('active').eq(data.page - 1).addClass('active');
            }

            /* actualizamos pager-text */
            if (data.pagerText) {
              $slide.find('.pager-text strong').text(data.page);
            }

            /* guardamos estado */
            if (!skipState) {
              $slide.trigger('changePage', data.page);
            }



          },
          stop = function ($slide) {
            var data = $slide.data('params');
            clearInterval(data.timer);
          },
          play = function ($slide) {
            return;
            var data = $slide.data('params');
            if (data.interval > 0) {
              clearInterval(data.timer);
              data.timer = setInterval(function () {
                move('next', $slide);
              }, data.interval * 1000);
            };
            $slide.data('params', data);
          },
          render = function ($slide) {

            var data = $slide.data('params'),
              currentSize = getSize(data.responsive),
              $items, width, html;
            if (currentSize[0] != data.items) {

              /* renderizamos anchos de items y container */
              $items = $slide.find('.item');
              if (data.variableWidth) {
                width = 0;
                $items.each(function () {
                  width += $(this).width()
                });
                data.pages = Math.ceil(width / $items.closest('.content').outerWidth(true));
                data.items = 0;
                $slide.find('.inner').css('width', width + 10).parent().css('margin', '0 -' + (currentSize[1] / 2) + 'px');
              } else {
                data.pages = Math.ceil($items.length / currentSize[0]);
                data.items = currentSize[0];
                width = (100 / data.items);
                $items.css({
                  width: (100 / $items.length) + '%',
                  padding: "0 " + (currentSize[1] / 2) + 'px'
                });
                $slide.find('.inner').css('width', (width * $items.length) + '%').parent().css('margin', '0 -' + (currentSize[1] / 2) + 'px');
              }


              //generamos pager num si no lo tiene
              if (data.pagerCircle) {
                html = '';
                for (var i = 1; i <= data.pages; i++) {
                  html += '<li data-page="' + i + '" class="page' + (html ? '' : ' active') + '">&nbsp;</li>';
                }
                html = $slide.find('.pager-circle').empty().append(html);

              }

              /* aplicamos eventos */
              $slide.find('.next, .prev, .page').on('click', function (event) {
                var $this = $(this);
                event.preventDefault();
                event.stopPropagation();
                if ($this.hasClass('next', $slide))
                  move('next', $slide);
                else if ($this.hasClass('prev'))
                  move('prev', $slide);
                else {
                  move($(this).data('page'), $slide);
                }
              });

              /* si hay pager-text */
              if (data.pagerText) {
                $slide.find('.pager-text').html('<strong>' + data.page + '</strong> de ' + data.pages);
              }

              /* si es automatico, play*/
              play($slide);

              if (data.interval > 0) {
                $slide.on('mouseenter', function () {
                  stop($slide);
                }).on('mouseleave', function () {
                  play($slide);
                });
              }

              data.mainWidth = $slide.outerWidth(true);

              //renderHammer on hammer.min.js
              if (!$slide.data('doneHammer') && typeof renderHammer == 'function') {
                $slide.data('doneHammer', true);
                var $inner = $slide.find('.inner');
                renderHammer($slide, function (ev) {
                  var percent = (100 / data.mainWidth) * ev.deltaX;
                  /*
                  if (ev.type == 'panleft' || ev.type == 'panright'){
                    $inner.css('margin-left', ((data.page *100 - ((ev.deltaX * 100) / $slide.width()))  * -1) + "%");
                  }
                  */

                  if (ev.type == 'panend' || ev.type == 'pancancel') {
                    if (Math.abs(percent) > 20 && ev.type == 'panend') {
                      return move((percent < 0) ? 'next' : 'prev', $slide);
                    }
                    percent = 0;
                  }
                });
              };

              // avanzar si es que debe :|
              if (data.page > 1) {
                move(data.page, $slide, true);
              }

              // verificar si ¿ es necesario ?
              $slide.data('params', data);
            }
          },
          $elems;

        $elems = $('.slide').each(function () {
          var $this = $(this),
            data = $this.data('params') || {},
            sizes = data && data.responsive ? data.responsive.replace(/:([\w\.]*)/g, ':[$1]').replace(/x/g, ',') : '3020:[1,0]';
          data.responsive = eval('[{' + sizes + '}]')[0];

          $this.data('params', $.extend({
            pages: 0,
            items: 0, // items por pagina
            page: 1,
            pagerText: $this.find('.pager-text').length > 0,
            pagerThumb: $this.find('.pager-thumb').length > 0,
            pagerCircle: $this.find('.pager-circle').length > 0,
            interval: 0,
            timer: null,
            variableWidth: false,
            redirect: false
          }, data));
          //$this.data('params', data);
          $this.bind('setPage', function (event, page) {
            move(page, $this, true);
          });
          render($this);

        });
      },
      slidestate: function () {
        function carga(){

          setTimeout(function(){
            var position = $('.slide.state .page.active').data('page'), src = $('.slide.state .inner').children().eq(position-1).find('img').data('src');
            $('.slide.state .inner').children().eq(position-1).find('img').attr('src', src);
          },500);
          var ww = $(window).width();
          if(ww > 1024){
            if($('.wrap-galeria .galeria').width() == 700){
              $('.wrap-galeria .galeria').width(700);
              setTimeout(function(){
                $('.wrap-galeria .galeria').width('auto');
              },2000)
            }
          }
        }
        function actualizador(){
          !function() {
              var a = document.createElement("script");
              a.setAttribute("id", "trackJS" + c), a.type = "text/javascript", a.async = !0, a.src = urlTrack;
              var e = document.getElementsByTagName("script")[0];
              e.parentNode.insertBefore(a, e), c++
          }()
          $('#takeover_div').html('');
          $('#takeover_div').removeAttr('stlye');
          try {
              udm_("http" + ("s" == document.location.href.charAt(4) ? "s://sb" : "://b") + ".scorecardresearch.com/b?c1=2&c2=6906613&ns_site=" + p + "&name=" + i)
          } catch(o) {}
          setTimeout(function(){
              //Analitics
              // set new url
              if(ga){
                  ga('send', 'pageview');
                  /*ga('set', {
                      page: document.location.pathname,
                      title: document.title
                  });*/
              }
            for(var n = 0; n < l.length; n++) try {
                eplDoc.epl.reloadSpace(l[n])
            } catch(o) {}
          },500)
        }
        function  actualizador2(){
          var position = $('.slide.state .page.active').data('page'), altoSlide = $('.slide.state .inner').children().eq(position-1).outerHeight();
          $('.slide.state .content').height(altoSlide);
          var totalItem = $('.slide.state .inner').children().length,
          itemAct = $('.slide.state .page.active').data('page');
          setTimeout(function(){
            $('.g-total').text(totalItem);
            $('.g-num').text(itemAct);
          },500);
        }
        function  act0(){
          $('.galeria-full').width(710);
          setTimeout(function(){
            $('.galeria-full').width('auto');
          },500);
        }
        var $slideState = $('.slide.state').eq(0),
          c = 1,
          data = $slideState.data('params'),
          data2 = $slideState.data('vars'),
          initPage = data.page,
          l = data2.epl_tag ? data2.epl_tag : [],
          p = data2.comscore.site,
          i = data2.comscore.name,
          position = $('.slide.state .page.active').data('page');
        var page = parseFloat(document.location.href.replace(data.baseurl, '').replace(/[^\w]/ig, '')),
        totalItem = $('.slide.state .inner').children().length,
        itemAct = $('.slide.state .page.active').data('page');
        $('.g-total').text(totalItem);
        $('.g-num').text(itemAct);
        setTimeout(function(){
          var position = $('.slide.state .page.active').data('page'), altoSlide = $('.slide.state .inner').children().eq(position-1).outerHeight();
          $('.slide.state .content').height(altoSlide);
        }, 2000)
        if (page > 1) $slideState.trigger('setPage', page);
        carga();
        actualizador2();
        act0();

        $slideState.on('changePage', function (event, oldPage) {
          actualizador2()
          actualizador();
          carga();
          if(data2.params == ""){
            history.pushState({
              page: oldPage
            }, "page " + oldPage, data.baseurl + '/' + oldPage /*+ '?' + data2.params*/);
          }else{
            history.pushState({
              page: oldPage
            }, "page " + oldPage, data.baseurl + '/' + oldPage + '?' + data2.params);
          }
        });
        window.onpopstate = function (event) {
          var page = event.state && event.state.page || initPage;
          $slideState.trigger('setPage', page);
          actualizador();
          actualizador2()
          carga();
          /* -------------------------- poner aqui recarga de banners etc -------------------------- */
        };
        $(window).resize(function(event) {
          var position = $('.slide.state .page.active').data('page'), altoSlide = $('.slide.state .inner').children().eq(position-1).outerHeight();
          $('.slide.state .content').height(altoSlide);
        });
        //TRIGGER PAGE
        (page)?$slideState.trigger('setPage', page):'';
      },
      columnsfit_old: function () {
        var createCols = function (num) {
            var html = '';
            for (var i = 0; i < num; i++) {
              html += '<div class="fit col-1-' + num + '"></div>';
            }
            return html;
          },
          createItem = function ($item, $cols) {
            var $sel = $cols.eq(0);
            for (var i = 0; i < $cols.length; i++) {
              $sel = ($cols.eq(i).height() < $sel.height()) ? $cols.eq(i) : $sel;
            };
            $sel.append($item);
          },
          render = function ($content) {
            var data = $content.data('params');
            var currentWidth = $content.width();
            var currentColumns;
            if (currentWidth < 560)
              currentColumns = 1
            else
              currentColumns = 2

            if (currentColumns != data.columns) {
              var $cards = $content.data('params').childrens.clone();
              $content.empty();
              var $cols = $(createCols(currentColumns));
              data.columns = currentColumns;
              $content.append($cols);
              $cards.each(function () {
                createItem($(this).clone(), $cols);
              });
              // quitamos los altos
              $cols.find('.box>a').removeAttr('style');
              $cards = null;
              x.ui.lazy($cols.find('.lazy-card'));

            }
          },
          $elems;
        $elems = $('.columns-fit').each(function () {
          var $this = $(this);
          $this.data('params', {
            childrens: $this.children().clone(),
            childWidth: $this.children().eq(0).width(),
            width: $this.width(),
            columns: 0,
          });

          render($this);

          $(window).resize(function () {
            render($this);
          });
        });
      },
      columnsfit: function ($elems, callback) { /* data-params='{"breakpoints":{"400":[2,5],"800":[3,10],"1024":[4,20]}}' */
        var createCols = function (arr) {
            var html = '';
            for (var i = 0; i < arr[0]; i++) {
              html += '<div class="fit col-1-' + arr[0] + '" style="padding: 0 ' + (arr[1] / 2) + 'px"></div>';
            }
            return html;
          },
          createItem = function ($item, $cols, gutter) {
            var $sel = $cols.eq(0);
            for (var i = 0; i < $cols.length; i++) {
              $sel = ($cols.eq(i).height() < $sel.height()) ? $cols.eq(i) : $sel;
            };
            $sel.append($item.css('padding-bottom', gutter));
          },
          getBreakPoint = function (breakpoints, $content) {
            var last = 0;
            //var wWidth = $(window).width();
            var wWidth = $content.width();
            for (var i in breakpoints) {
              if (parseFloat(i) > wWidth) return last || i;
              last = i;
            }
            return last;
          },
          render = function ($content) {
            var data = $content.data('params');
            var posBreakPointNew = getBreakPoint(data.breakpoints, $content);
            if (data.breakpoint === posBreakPointNew) return;
            var $cards = $content.data('params').childrens.clone();
            $content.css({
              'margin': '0 -' + (data.breakpoints[posBreakPointNew][1] / 2) + 'px'
            }).empty();
            var $cols = $(createCols(data.breakpoints[posBreakPointNew]));
            data.breakpoint = posBreakPointNew;
            $content.append($cols);
            $cards.each(function () {
              createItem($(this).clone(), $cols, data.breakpoints[posBreakPointNew][1]);
            });
            $cards = null;
            // quitamos los altos
            $cols.find('.box>a').removeAttr('style');
            //$content.data('params', data);
            x.ui.lazy($cols.find('.lazy-card'));
          };
        $elems = $elems || $('.columns-fit');
        $elems.each(function () {
          var $this = $(this);
          $this.data('params', $.extend({
            childrens: $this.children().clone(),
            breakpoints: {
              281079: [1, 0]
            },
            breakpoint: false
          }, $this.data('params')));
          render($this);
          $(window).resize(function () {
            render($this);
          });
        });
      },
      tab: function () {
        var $el = $('.tab');
        $('>li>a', $el).on('click', function (event) {
          event.preventDefault();
          var $this = $(this),
            $oldActive = $this.parent().addClass('active').siblings('.active').removeClass('active');
          $($oldActive.children('a').attr('href')).fadeOut(100, function () {
            $($oldActive.children('a').attr('href')).removeAttr('style').removeClass('active');
            $($this.attr('href')).addClass('active');
          });
        });
      },
      sticky: function ($el) {
        var predef = {
            menutop: function ($el) {
              var lastTop = 0,
                elTop = $el.offset().top;
              $(window).on('scroll', function (event) {
                var top = $(this).scrollTop();
                if (top > elTop && top < lastTop) {
                  $el.addClass('sticky-on');
                } else {
                  $el.removeClass('sticky-on');
                };
                lastTop = top;
              }).trigger("scroll");
            },
            socialbottom: function ($el) {
              var lastTop = 0,
                elTop = $(window).height() / 2; // se muestra despues de recorrer la mitad de la pantalla
              var contentBottom = ($el.parent().outerHeight(true) + $el.parent().offset().top) - $(window).height();
              $(window).on('scroll', function (event) {
                if (!$el.is(':visible')) return false;
                var top = $(this).scrollTop();
                if (top > elTop && top > lastTop && top < contentBottom) {
                  $el.addClass('sticky-on');
                } else {
                  $el.removeClass('sticky-on');
                };
                lastTop = top;
              }).trigger("scroll");
            },
            auto: function ($el) {
              var elTop = $el.offset().top;
              var $container = $el.parent();
              var elHeight = $el.outerHeight(true); //[0].getClientRects()[0].bottom

              $(window).on("scroll", function (event) {
                if (!$el.is(':visible')) return false;
                var containertHeight = $container.outerHeight(true);
                var top = $(this).scrollTop();
                if (top >= elTop && top < elTop + (containertHeight)) {
                  if (top > elTop + (containertHeight - elHeight))
                    $el.css({
                      position: 'absolute',
                      top: containertHeight - elHeight
                    });
                  else $el.addClass('sticky-on').removeAttr('style');
                } else {
                  $el.removeClass('sticky-on');
                }
              }).trigger("scroll");
            }
          },
          $elems;
        $elems = $('.sticky').each(function () {
          var $this = $(this);
          setTimeout(function () {
            predef[$this.data('type') || 'auto']($this);
          }, 300);
          //predef[$this.data('type') || 'auto']($this);
        });

      },
      lazy: function ($elements) {
        ($elements || $('.lazy')).on("lazyin", function (event) {
          var $this = $(this);
          var data = $this.data('params');
          $this.hide(0);
          switch (data.content) {
            case 'imaginacion!!!':
              break
            default:
              $this.fadeIn('slow').off('lazyin').attr('src', data.src);
          }
        });
      },
      socialmeter: function () {
        var urls = {
          facebook: {
            url: function (url) {
              return 'http://graph.facebook.com/?id=' + url
            },
            data: function (url) {
              return {}
            },
            response: function (data) {
              return data.shares || 0
            }
          },
          twitter: {
            url: function (url) {
              return 'http://urls.api.twitter.com/1/urls/count.json?url=' + url
            },
            data: function (url) {
              return {}
            },
            response: function (data) {
              return data.count || 0
            }
          },
          gplus: {
            url: function (url) {
              return 'https://clients6.google.com/rpc?key=YOUR_API_KEY'
            },
            data: function (url) {
              return {
                "method": "pos.plusones.get",
                "id": "p",
                "params": {
                  "nolog": true,
                  "id": url,
                  "source": "widget",
                  "userId": "@viewer",
                  "groupId": "@self"
                },
                "jsonrpc": "2.0",
                "key": "p",
                "apiVersion": "v1"
              }
            },
            response: function (data) {
              return data.result.metadata.globalCounts.count || 0
            }
          }
        }
        $('.socialmeter').each(function () {
          var $this = $(this),
            data = $this.data('params');
          $.ajax({
            url: urls[data.name].url(data.url),
            data: urls[data.name].data(data.url),
            dataType: 'jsonp',
            success: function (request) {
                console.log(request, 'request');
              $this.children('span').text(urls[data.name].response(request));
            }
          });
        });
      }
    },
    author: '@',
    search: function (element, event) {
      if (event.keyCode == 13) event.preventDefault();
      if ((event.type == 'click' || event.keyCode == 13) && $.trim(element.form.prompt.value) != "") {
        document.location.href = element.form.getAttribute('action') + element.form.prompt.value.replace(/\s+/g, "+")
        return;
      }
      element.form.prompt.focus();
    },
    searchToggle: function (element, event) {
      event.preventDefault();
      var $element = $(element),
        $input = $element.closest('ul').hide().siblings('form').find('input'),
        $form = $input.parent('form').addClass('showing');

      if (!$input.data('done')) {
        $input.on('blur', function () {
          if ($(event.relatedTarget).is('button')) {
            $input[0].focus();
            return false
          };
          $form.removeClass('showing');
          $element.closest('ul').show();
        })
      }
      $input[0].focus();
    },
    menuToggle: function (element, event) {
      event.preventDefault();
      $(element).closest('.nav-social').toggleClass('menu-open');
    },
    wopen: function (element, event) {
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
      window.open(element.getAttribute('href'), 'social-popup', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=500,height=450,left=' + ((screen.width / 2) - (500 / 2)) + ',top=' + ((screen.height / 2) - (450 / 2)));
    },
    supportsTransitions: (function () {
      var s = document.createElement('p').style;
      return 'transition' in s ||
        'WebkitTransition' in s ||
        'MozTransition' in s ||
        'msTransition' in s ||
        'OTransition' in s
    })()
  };
  global.app = x;
})(this);

$(document).on('ready', app.init.bind(app));

$(document).ready(function(){
  if($('.galeria-full').size() > 0){
    $('body').attr('data-type','fotogaleria')
    //$('.wrap-galeria .ads-sidebar').addClass('sticky');
  }
});
var fn = function (event, jsn) {
  if (app[jsn.method]) app[jsn.method].call(app, this, event, jsn);
}
