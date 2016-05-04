
function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function setJW7(player_id, video_source, video_img, playlist, hash, rtag, autoplay, sratio, ancho) {
    var youregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    var videoID = video_source.match(youregexp);

    if (videoID) {
        document.getElementById(player_id).innerHTML = '<iframe width="100%" height="326" src="https://www.youtube.com/embed/' + videoID[1] + '" frameborder="0" allowfullscreen></iframe>';
    } else {
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


        console.log("body -> " + $("body").data("bg"));


        var sup = {primary: 'html5', controlbar: 'bottom', autostart: autoplay, skin: {name: "bekle"}, width: ancho, aspectratio: sratio, image: video_img, abouttext: "RPP",
            aboutlink: "http://rpp.pe", ga: {}, advertising: {client: 'googima', skipoffset: 5, admessage: "Publicidad finaliza en xx segundos",
                skipmessage: "Saltar Anuncio en xx", tag: rtag}}


        if (undefined === playlist || "[]" === playlist) {
            sup['file'] = video_source;
        } else {
            playlist = JSON.parse(playlist);
            source = [];
            for (i in playlist) {
                if (typeof playlist[i] === 'object') {
                    source.push({'label': 'file', 'file': playlist[i].file});
                } else {
                    source.push({'label': i, 'file': playlist[i]});
                }
            }
            source.push({'label': '420p', 'file': video_source});
            source[1]['default'] = "true";
            sup['sources'] = source;
        }

        var pI = jwplayer(player_id).setup(sup);
        pI.on('ready', function () {
            if (player_id === 'radioenvivo' || player_id === 'cabinaenvivo') {
                var el = document.getElementById(player_id);
                el.setAttribute('style', 'height:100% !important');
//                el.style.backgroundImage = 'url(http://s3.amazonaws.com/p-gruporpp-media-v/small/2015/10/05/414941_4335.jpg)'
            }
            trackingJW7(pI, hash, player_id);
        });
    }
}

function trackingJW7(pI, hash, player_id) {
    sendEvents(hash, 'played');
    vplay = false;

    //Play
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
    }).on('adError', function (otag) {
    }).on('adRequest', function (tag, adposition) {
    }).on('adImpression', function (obje) {
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
    //console.log(hash);
    //console.log(even);
    //console.log(message );

    var url = trackJS.src;
    //console.log('url: ' + url);
    res = url.split("\/?");
    var img = document.createElement("img");
    url = nhost + 'video/?' + res[1] + '&even=' + even + '&hash=' + hash + ((message !== undefined) ? '&message=' + message : '');
    //console.log(url);
    img.src = url;
    document.body.appendChild(img);
}
