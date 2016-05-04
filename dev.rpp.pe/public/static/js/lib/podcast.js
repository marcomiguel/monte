function urlDecode() {
  var e = window.location.href;
  e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", "");
  if(e==""){e="Home"}
  return e
}
function track(e, t) {
  if (t === undefined) {
    t = urlDecode();
  }
  ga('send', 'event', 'Podcast', e, t);
}

$(document).ready(function () {
  var Podcast = function () {
    var data, element, audio, wave, icon, firstTimeupdate = false,
      counter;
    var formatTime = function (time) {
      var seconds = parseInt(time % 60);
      var minutes = parseInt((time / 60) % 60);
      seconds = seconds < 10 ? ('0' + seconds) : seconds;
      minutes = minutes < 10 ? ('0' + minutes) : minutes;
      return minutes + ':' + seconds;
    };
    var binding = function () {
      $(icon).on('click', function (event) {
        event.preventDefault();
        if (this.className == 'icon-play') {
          audio.play();
          wave.start();
          $('.action .text', element).text('Reproduciendo');
          this.className = 'icon-pause';
          track('Play');

        } else {
          audio.pause();
          wave.stop();
          $('.action .text', element).text('Escucha ahora');
          this.className = 'icon-play';
          track('Stop');
        }
      });

      $(audio).on('playing waiting', function (event) {
          if (event.type == 'playing' && firstTimeupdate) {
            $(icon).removeClass('wait');
            wave.start();
          } else {
            icon.className += ' wait';
            wave.stop();
          }
        })
        .one('timeupdate', function (event) {
          firstTimeupdate = true;
          $(icon).removeClass('wait');
          wave.start();
        })
        .on('timeupdate loadedmetadata', function (event) {
          counter.innerHTML = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
        })
        .on('ended', function (event) {
          //icon.className = 'icon-play';
          $(icon).trigger('click');
        });
    }
    var draw = function () {
      var rnd = (new String(Math.random())).substring(2, 8) + (((new Date()).getTime()) & 262143);
      data.adUrl = "http://ads.us.e-planning.net/ei/3/17632/[LANDING]/Podcast?it=i&rnd=" + rnd;
      data.adImage = "http://ads.us.e-planning.net/eb/3/17632/[LANDING]/Podcast?o=i&rnd=" + rnd;
      data.adUrl = data.adUrl.replace("[LANDING]", $(element).data('eplsrc'));
      data.adImage = data.adImage.replace("[LANDING]", $(element).data('eplsrc'));

      if(data.subTitle.trim().length!==0){
        data.subTitle = '<h3>' + data.subTitle + '</h3>';
      }

      //css
      $('head').append('<style>@-webkit-keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-ms-keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes uil-ring-anim{0%{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}.podcast .uil-ring-css{background:none;position:relative;width:200px;height:200px}.podcast .uil-ring-css > div{position:absolute;display:block;width:160px;height:160px;top:20px;left:20px;border-radius:80px;box-shadow:0 6px 0 0 #fff;-ms-animation:uil-ring-anim 1s linear infinite;-moz-animation:uil-ring-anim 1s linear infinite;-webkit-animation:uil-ring-anim 1s linear infinite;-o-animation:uil-ring-anim 1s linear infinite;animation:uil-ring-anim 1s linear infinite}.podcast .icon-play:before{content:"I"}.podcast .icon-play .pc-canvas{opacity:0}.podcast .icon-pause:before{content:" "}.podcast{overflow:hidden;padding:0;border-left:1px solid #DDDCD4;border-right:1px solid #DDDCD4;position:relative}.podcast .pc-counter{font-size:11px;line-height:12px}.podcast:hover .icon-pause:before{content:"H"}.podcast:hover .pc-canvas{opacity:.3}.podcast .pc-control,.podcast .pc-content{float:left;display:inline-block}.podcast .pc-content{padding-top:8px}.podcast .pc-ad{float:right}.podcast .pc-ad a{line-height:74px}.podcast .pc-ad img{vertical-align:middle;display:inline-block;margin-right:6px}.podcast canvas{vertical-align:middle}.podcast .icon-play,.podcast .icon-pause{display:block;overflow:hidden;position:relative}.podcast .icon-play:before,.podcast .icon-pause:before{display:block;width:54px;height:56px;border-radius:50%;background-color:#f7df00;overflow:hidden;font-size:28px;line-height:56px;text-align:center;cursor:pointer;margin:9px 12px}.podcast .icon-play.wait:before,.podcast .icon-pause.wait:before{content:""}.podcast .icon-play.wait:after,.podcast .icon-pause.wait:after{content:"";position:absolute;display:block;width:35px;height:35px;border-radius:80px;box-shadow:0 2px 0 0 #fff;-ms-animation:uil-ring-anim 1s linear infinite;-moz-animation:uil-ring-anim 1s linear infinite;-webkit-animation:uil-ring-anim 1s linear infinite;-o-animation:uil-ring-anim 1s linear infinite;animation:uil-ring-anim 1s linear infinite;top:21px;left:21px}.podcast .pc-inner>*{display:inline-block;font-size:24px;line-height:1; margin-bottom: 0}.podcast a{color:#206baf}.podcast .pc-canvas{position:absolute;top:20px;pointer-events:none}.podcast .action{height:24px}.podcast h3{font-weight:400;color:#919191}.podcast h3:before{content:"|";font-weight:700;font-size:24px;padding:0 6px}.podcast .text{background:#0060ab;color:#fff;text-transform:uppercase;padding:2px 6px;font-size:11px;border-radius:3px}@media screen and (max-width: 768px){.podcast .pc-inner>*{font-size:20px; width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0;}}@media screen and (max-width: 480px){    .podcast h2, .podcast h3 {width: 106px!important; }    .podcast .pc-content .pc-inner>*{font-size:14px}.podcast .pc-ad{position:absolute;top:4px;right:8px}.podcast h3:before{font-size:16px}.podcast .text{font-size:9px}.podcast .pc-ad a{line-height:inherit}.podcast .pc-ad img{max-width:120px}}@media (max-width: 768px){ .podcast .pc-ad{ position:absolute;top:4px;right:8px } .podcast .pc-ad img{ max-width:120px } }</style');


      if (!element)
        return false;
      element.className = element.className + ' podcast';
      element.innerHTML = '' +
        '<div class="pc-control">' +
        '<audio preload="auto" id="pc-audio">' +
        '<source src="' + data.media + '" type="audio/mpeg">' +
        '<!--source src="archivo.ogg" type="audio/ogg" />' +
        '<object type="application/x-shockwave-flash" data="player.swf?soundFile=archivo.mp3">' +
        '<param name="movie" value="player.swf?soundFile=archivo.mp3" />' +
        '</object-->' +
        '</audio>' +
        '<div class="icon-play">' +
        '<span class="pc-canvas" id="pc-canvas"></span>' +
        '</div>' +
        '</div>' +
        '<div class="pc-content">' +
        '<div class="action">' +
        '<span class="text">Escucha ahora</span>' +
        '</div>' +
        '<div class="pc-inner">' +
          //'<h2><a href="' + data.url + '">' + data.title + '</a></h2>' +
        '<h2>' + data.title + '</h2>' +
        data.subTitle +
        '</div>' +
        '<div class="pc-counter" id="pc-counter"></div>' +
        '</div>' +
        '<div class="pc-ad">' +
        (data.adImage ? ('<a href="' + data.adUrl + '" target="_blank"><img src="' + data.adImage + '" alt=""></a>') : '') +
        '</div>';
      audio = document.getElementById('pc-audio');

      window.audio = audio;
      icon = $('.icon-play', element).get(0);
      counter = document.getElementById('pc-counter');


      wave = new SiriWave({
        width: 76,
        height: 36,
        speed: 0.10,
        amplitude: 1,
        container: document.getElementById('pc-canvas'),
        autostart: false,
        color: '#ffffff'
      });

      binding();

    };
    element = document.getElementById('podcast');
    $.getJSON($(element).data('src')).done(function (request) {
      data = request;
      draw();
    }).fail(function () {
      $(element).hide();
    });

  };
  new Podcast();
});

//CaffeinaLab/SiriWaveJS
(function () {
  function SiriWave(opt) {
    opt = opt || {};
    this.phase = 0;
    this.run = false;
    this.ratio = opt.ratio || window.devicePixelRatio || 1;
    this.width = this.ratio * (opt.width || 320);
    this.width_2 = this.width / 2;
    this.width_4 = this.width / 4;
    this.height = this.ratio * (opt.height || 100);
    this.height_2 = this.height / 2;
    this.MAX = (this.height_2) - 4;
    this.amplitude = opt.amplitude || 1;
    this.speed = opt.speed || 0.2;
    this.frequency = opt.frequency || 6;
    this.color = (function hex2rgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? parseInt(result[1], 16).toString() + ',' + parseInt(result[2], 16).toString() + ',' + parseInt(result[3], 16).toString() : null
      })(opt.color || '#fff') || '255,255,255';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (opt.cover) {
      this.canvas.style.width = this.canvas.style.height = '100%'
    } else {
      this.canvas.style.width = (this.width / this.ratio) + 'px';
      this.canvas.style.height = (this.height / this.ratio) + 'px'
    }
    ;
    this.container = opt.container || document.body;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    if (opt.autostart) {
      this.start()
    }
  }
  SiriWave.prototype._GATF_cache = {};
  SiriWave.prototype._globAttFunc = function (x) {
    if (SiriWave.prototype._GATF_cache[x] == null) {
      SiriWave.prototype._GATF_cache[x] = Math.pow(4 / (4 + Math.pow(x, 4)), 4)
    }
    return SiriWave.prototype._GATF_cache[x]
  };
  SiriWave.prototype._xpos = function (i) {
    return this.width_2 + i * this.width_4
  };
  SiriWave.prototype._ypos = function (i, attenuation) {
    var att = (this.MAX * this.amplitude) / attenuation;
    return this.height_2 + this._globAttFunc(i) * att * Math.sin(this.frequency * i - this.phase)
  };
  SiriWave.prototype._drawLine = function (attenuation, color, width) {
    this.ctx.moveTo(0, 0);
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width || 1;
    var i = -2;
    while ((i += 0.01) <= 2) {
      var y = this._ypos(i, attenuation);
      if (Math.abs(i) >= 1.90)
        y = this.height_2;
      this.ctx.lineTo(this._xpos(i), y)
    }
    this.ctx.stroke()
  };
  SiriWave.prototype._clear = function () {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over'
  };
  SiriWave.prototype._draw = function () {
    if (this.run === false)
      return;
    this.phase = (this.phase + Math.PI * this.speed) % (2 * Math.PI);
    this._clear();
    this._drawLine(-2, 'rgba(' + this.color + ',0.1)');
    this._drawLine(-6, 'rgba(' + this.color + ',0.2)');
    this._drawLine(5, 'rgba(' + this.color + ',0.4)');
    this._drawLine(2, 'rgba(' + this.color + ',0.6)');
    this._drawLine(1, 'rgba(' + this.color + ',1)', 1.5);
    if (window.requestAnimationFrame) {
      requestAnimationFrame(this._draw.bind(this));
      return
    }
    ;
    setTimeout(this._draw.bind(this), 20)
  };
  SiriWave.prototype.start = function () {
    this.phase = 0;
    this.run = true;
    this._draw()
  };
  SiriWave.prototype.stop = function () {
    this.phase = 0;
    this.run = false
  };
  SiriWave.prototype.setSpeed = function (v) {
    this.speed = v
  };
  SiriWave.prototype.setNoise = SiriWave.prototype.setAmplitude = function (v) {
    this.amplitude = Math.max(Math.min(v, 1), 0)
  };
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return SiriWave
    });
    return
  }
  ;
  window.SiriWave = SiriWave
})();
