function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function setJW7(player_id, video_source, video_img, playlist, hash, rtag, autoplay, section, vtemas, sratio, ancho) {

  var youregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  var videoID = video_source.match(youregexp);

  if (videoID) {
    var autoplay = autoplay ? "?autoplay=1" : "";
    var height = document.getElementById(player_id).parentNode.clientHeight || 357;

    document.getElementById(player_id).innerHTML = '<iframe width="100%" height="' + height + '" src="https://www.youtube.com/embed/' + videoID[1] + autoplay + '" frameborder="0" allowfullscreen></iframe>';
    setTimeout(function(){
      var content = document.getElementById(player_id);
      $(content).parent().removeClass('wait-player');
    }, 1500)
  } else {
    window["t25per_" + player_id] = false;
    window["t50per_" + player_id] = false;
    window["t75per_" + player_id] = false;
    window["t100per_" + player_id] = false;
    window["vplay_" + player_id] = false;

    if (!sratio) {
      sratio = "16:9";
    }

    if (!ancho) {
      ancho = "100%";
    }

    if (!autoplay) {
      autoplay = false;
    }

    if(section!= null || vtemas != null){
        rtag = rtag + "&cust_params=";

        if(section!= null){
            rtag = rtag + "category%3D" + section;
        }

        if(vtemas != null) {
            rtag = rtag + "%26vtemas%3D" + vtemas.replace(/\|/g,'%2C');
        }

    }

    var sup = {
      primary: 'html5',
      controlbar: 'bottom',
      autostart: autoplay,
      skin: {
        name: "bekle"
      },
      width: ancho,
      aspectratio: sratio,
      image: video_img,
      abouttext: "RPP",
      aboutlink: "http://rpp.pe",
      ga: {},
      advertising: {
        client: 'googima',
        skipoffset: 5,
        admessage: "Publicidad finaliza en xx segundos",
        skipmessage: "Saltar Anuncio en xx",
        tag: rtag
      }
    }


    if ("null" === playlist || undefined === playlist || "[]" === playlist) {
      sup['file'] = video_source;
    } else {
      playlist = JSON.parse(playlist);
      source = [];
      for (i in playlist) {
        if (typeof playlist[i] === 'object') {
          source.push({
            'label': 'file',
            'file': playlist[i].file
          });
        } else {
          source.push({
            'label': i,
            'file': playlist[i]
          });
        }
      }
      source.push({
        'label': '420p',
        'file': video_source
      });
      source[1]['default'] = "true";
      sup['sources'] = source;
    }


    var pI = jwplayer(player_id).setup(sup);
    pI.on('ready', function () {
      trackingJW7(pI, hash, player_id);
    });
    return  pI;
  }
}

function trackingJW7(pI, hash, player_id) {
  sendEvents(hash, 'played');
  vplay = false;

  if (xsl.dv.canTouch) {
    pI.on('playlist', function (obje) {
      var content = document.getElementById(player_id);
      $(content).parent().removeClass('wait-player');
    });
  }

  //Play
  pI.on('adPlay play', function (obje) {
    var content = document.getElementById(player_id);
    $(content).parent().removeClass('wait-player');
  });
  pI.on('play', function (obje) {
    if (window["t100per_" + player_id] && !vplay) {
      sendEvents(hash, "replay");
      vplay = true;
    } else if (obje.oldstate === 'paused' && vplay && !window["t100per_" + player_id]) {
      sendEvents(hash, "resume");
    } else if (obje.oldstate === 'buffering' && vplay && !window["t100per_" + player_id]) {
      sendEvents(hash, "lag");
    } else {
      sendEvents(hash, 'play');
      vplay = true;
    }
    setInterval(function () {
      calcProgre(pI, hash, player_id)
    }, 1000);
  }).on('complete', function () {
    sendEvents(hash, '100_repro');
    window["t100per_" + player_id] = true;
    vplay = false;
  }).on('pause', function (obje) {
    sendEvents(hash, "pause");
  }).on('setupError', function (obje) {
    sendEvents(hash, "setuperror");
  }).on('adClick', function (obje) {
    sendEvents(hash, "adclick", utf8_to_b64(obje['tag']));
  }).on('adComplete', function (obje) {
    sendEvents(hash, "adcomplete", utf8_to_b64(obje['tag']));
  }).on('adSkipped', function (obje) {
    sendEvents(hash, "adskipped", utf8_to_b64(obje['tag']));
  }).on('adError', function (otag) {}).on('adRequest', function (tag, adposition) {}).on('adImpression', function (obje) {
    sendEvents(hash, "adimpression", utf8_to_b64(obje['tag']));
  }).on('adPlay', function (obje) {
    sendEvents(hash, "adplay", utf8_to_b64(obje['tag']));
  }).on('levels', function (obje) {
    sendEvents(hash, "levels", obje['levels'][obje['currentQuality']]['label']);
  }).on('levelsChanged', function (obje) {
    sendEvents(hash, "levelsChanged", obje['levels'][obje['currentQuality']]['label']);
  }).on('bufferChange', function (obje) {
    if (obje.bufferPercent === 100) {
      sendEvents(hash, "buffer_completo");
    }
  }).on('error', function (obje) {
    sendEvents(hash, 'error play', obje.message);
  });


}

function calcProgre(pI, hash, player_id) {
  var duration = pI.getDuration();
  var position = pI.getPosition();
  if (duration > 0 && position > 0) {
    var t25 = duration * 0.25;
    var t50 = duration * 0.50;
    var t75 = duration * 0.75;

    if (position > t75 && !window["t75per_" + player_id]) {
      window["t25per_" + player_id] = true;
      window["t50per_" + player_id] = true;
      window["t75per_" + player_id] = true;
      sendEvents(hash, "75_repro");
    } else if (position > t50 && !window["t50per_" + player_id]) {
      window["t25per_" + player_id] = true;
      window["t50per_" + player_id] = true;
      sendEvents(hash, "50_repro");
    } else if (position > t25 && !window["t25per_" + player_id]) {
      window["t25per_" + player_id] = true;
      sendEvents(hash, "25_repro");
    }
  }
}

function sendEvents(hash, even, message) {
  var url = trackJS.src;
  res = url.split("\/?");
  var img = document.createElement("img");
  url = nhost + 'video/?' + res[1] + '&even=' + even + '&hash=' + hash + ((message !== undefined) ? '&message=' + message : '');
  img.src = url;
  document.body.appendChild(img);
}


var script = document.createElement("script");
script.type = "text/javascript";
script.async = true;
script.src = "http://p.jwpcdn.com/player/v/7.0.2/jwplayer.js";
script.addEventListener("load", function () {
  jwplayer.key = "L/ARBHy5b4pG1YAD0ou40gMzoAVHnOcJetOEvw==";
});
document.getElementsByTagName("head")[0].appendChild(script);

$('.x-media').on(xsl.dv.clickTap + '.xmedia', function (event) {
  event.preventDefault();
  var $this = $(this);
  var par = $this.data('x'),
    idPlayer = 'jwplayer-' + Math.random().toString().substring(2);
  var $fig = $this.closest('figure');
  var text = $fig.hasClass('holder') ? $fig.siblings('.cont').text() : $fig.children('figcaption').text() ;
  if (text){
    $this.parent().append('<div class="pre-sumary"><div class="inside"><small>Cargando media...</small> <br/>' + text + '</div></div>');
    $this.parent().find('.pre-sumary').css('color');
  }
  $this.parent().addClass('here-player wait-player');
  $this.before('<div id="' + idPlayer + '" class="jwplayer"></div>');
  setJW7(idPlayer, par.video_source, par.video_img, par.playlist, par.hash, par.rtag, true, par.section, par.vtemas);

  /*
  var player = setJW7(idPlayer, par.video_source, par.video_img, par.playlist, par.hash, par.rtag, true, par.section, par.vtemas);
  var interval = setInterval(function(){
    if ($('#' + idPlayer).data('ready')){
      clearInterval(interval);
      player.play();
    }
  },500)
   */
});
