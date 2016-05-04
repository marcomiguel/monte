var currentProgram = [];
var txttatu = "";
var keyidf = "sinval";
var dateCurent;
var dayswek = new Array();
dayswek[0] = "Domingo";
dayswek[1] = "Lunes";
dayswek[2] = "Martes";
dayswek[3] = "Miércoles";
dayswek[4] = "Jueves";
dayswek[5] = "Viernes";

dayswek[6] = "Sábado";
var device = navigator.userAgent.toLowerCase();
window.mobilecheck = function(){ return device.search(/iphone|ipod|ipad|android|blackberry/) > -1; };
//Debounce
function debounce(func, wait, immediate) {
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
};
//JWPlayer
function setJW6(player_id, video_source, video_img, sratio, ancho)
{
    if (!sratio) {
        sratio = "16:9"
    }
    if (!ancho) {
        ancho = "100%"
    }
    jwplayer(player_id).setup({primary: 'flash',controlbar: 'bottom',autostart: false,skin: 'five',width: ancho,aspectratio: sratio,file: video_source,image: video_img,abouttext: "LA10",aboutlink: "http://www.la10.pe",ga: {trackingobject: "_gaq",},advertising: {client: 'googima',skipoffset: 5,admessage: "Publicidad finaliza en xx segundos",skipmessage: "Saltar Anuncio en xx",}});
}
var jsongaleriaArg = new Array();
var jsongaleriaIndex = 0;
var jsongaleria = new Array();
var Progress = function($this) {
    this.$element = $this;
};
var allowPlaying = true;
var positionGaleria = 0;
var isLightboxOpen = false;
var bLazy;
var dirHidden;
var dirShown;
var generateNewUrl = true;
Progress.prototype = {clear: function() {
        this.$element.stop(false, true).css({width: 0});
        return this;
    },start: function(intWidth, success) {
        this.$element.animate({width: intWidth}, 7000, "linear", success);
        return this;
    },pause: function() {
        this.$element.stop(true);
        this.clear();
        return this;
    }};
function requestFullScreen(id) {
    var element = document.getElementById(id);
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
function playPhoto() {
    $("a#grpp_play").hide();
    $("a#grpp_stop").show();
    requestFullScreen("grppfade")
    var progress = new Progress($("span.progress"));
    progress.start($("div.box_album").width(), function() {
        progress.clear();
        playPhoto();
        nextP();
    });
}
function stopPhoto() {
    $("a#grpp_play").show();
    $("a#grpp_stop").hide();
    var progress = new Progress($("span.progress"));
    progress.pause();
    allowPlaying = false;
    exitFullscreen();
}
function getTotalFotos() {
    return $("ul.bxslider li").length;
}
function movePhoto(ele, dir) {
    dirHidden = "left";
    dirShown = "right";
    if (dir == "before") {
        dirHidden = "right";
        dirShown = "left";
    }
    var selement = "ul.bxslider li";
    positionGaleria = parseInt($(ele).index(selement), 10);
    if (dir == "before") {
        positionGaleria = (positionGaleria < 1) ? getTotalFotos() - 1 : positionGaleria - 1;
    } else {
        positionGaleria = (positionGaleria >= getTotalFotos() - 1) ? 0 : positionGaleria + 1;
    }
    if (dir != "before" && positionGaleria < 1) {
        $("#grppg_sugeridas").toggleClass("display_off");
        stopPhoto();
    } else {
        changePhoto(positionGaleria);
    }
}
function changePhoto(position) {
    //$("#grppg_todas").addClass("display_off");
	$("#grppg_todas").remove("display_off");
    positionGaleria = position;
    var selement = "ul.bxslider li";
    var divNextPhoto = $(selement)[positionGaleria];
    $(selement).hide("drop", {direction: dirHidden}, 500, function() {
    });
    if (generateNewUrl) {
        changeUrlAddress();
    }
    generateNewUrl = true;
    //changeAdvertising();
    setTimeout(function() {
        $(divNextPhoto).show("drop", {direction: dirShown}, 500, function() {
            jsonFoto = jsongaleria[positionGaleria];
            page_img = jsonFoto.linkimg;
            page_title = jsonFoto.leyenda + " - " + " | La10";
        });
        changeAdvertising();
    }, 500);
}
function changeUrlAddress() {
    $("#grpp-gallery-position").html(positionGaleria + 1);
    if (window.history && window.history.pushState) {
        jsonFoto = jsongaleria[positionGaleria];
        var newUrl = "#fotos_" + jsongaleriaIndex + "_" + replaceAll(jsonFoto.leyenda, " ", "-") + "_" + positionGaleria;
        window.history.pushState("change", "", newUrl);
        document.title = jsonFoto.leyenda + " - " + " | La10";
    }
}






function changeAdvertising() {
    if(eplDoc.epl != undefined){
        eplDoc.epl.reloadSpace('Right');
    }
}






function nextP() {
    var e = $("ul.bxslider li").filter(function() {
        return $(this).css("display") != "none"
    });
    return movePhoto(e, "next");
}
function beforeP() {
    var e = $("ul.bxslider li").filter(function() {
        return $(this).css("display") != "none"
    });
    return movePhoto(e, "before");
}
function showTodas() {
    $("#grppg_todas").toggleClass("display_off");
}
function toggleLightbox(flag) {
    var _bd = $('body'),
    fncClose = function(){
        $("ul.bxslider").html("");
        isLightboxOpen = false;
        positionGaleria = 0;
        stopPhoto();
        exitFullscreen();
        var boxleft = $("#grppfade").outerWidth() / 2;
        var boxtop = $("#grppfade").outerHeight() / 2;
        //$("#grppfade").animate({"opacity": 0,"width": 0,"height": 0,"left": boxleft + "px","top": boxtop + "px"});
		$("#grppfade").css({"width": "100%","height": "100%","left": "0px" + "px","top": "0px" + "px"});
		$("#grppfade").animate({"opacity": 0});

		$("#grppfade").hide();

        //remove scroll
        _bd.removeClass('overflow-y');
    };
    if (flag == "open") {
        $("#grppg_todas").addClass("display_off");
        $("#grppg_sugeridas").addClass("display_off");
        $(".title_image-nd").removeClass("display_off");
        $(".box_lmm-buttons").removeClass("display_off");
        setTimeout(function() {
            if (window.mobilecheck()) {
                $(".title_image-nd").addClass("display_off");
                $(".box_lmm-buttons").addClass("display_off");
            }
        }, 3000)
        isLightboxOpen = true;
        var boxleft = $("body").outerWidth() / 2;
        var boxtop = $("body").outerHeight() / 2;
        $("#grppfade").css("left", boxleft + "px");
        $("#grppfade").css("top", boxtop + "px");
        $("#grppfade").show();
        //$("#grppfade").animate({"opacity": 1,"width": "100%","height": "100%","left": "0px","top": "0px"});
		$("#grppfade").css({"width": "100%","left": "0px","top": "0px"});
		$("#grppfade").animate({"opacity": 1,"height": "100%"});

        $("ul.bxslider li").hide();
        changePhoto(positionGaleria);
        //remove scroll
        _bd.addClass('overflow-y');

    } else {
        fncClose();
    }

    $(document).keyup(function(e){
        //close scape
        e.stopPropagation();
        var code = e.keyCode ? e.keyCode : e.which;
        if(code == 27 && $('#grppfade').is(':visible')){
            fncClose();
        }
    });
    /* Close modal click */
    $(".box_album").click(function(e){e.stopPropagation();});
    $("#grppfade").click(function(){
        /*$("#grppfade").hide();
        remove scroll*/
        _bd.removeClass('overflow-y');
    });
}

function replaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
    return text;
}
function onloadurl() {
    var url = window.location.href;
    if (url.indexOf("#") > 0) {
        var hash = url.substring(url.indexOf("#") + 1);
        hash = hash.split("_");
        var fotoIndex = hash[3];
        if (hash[0] == "fotos") {
            jsongaleriaIndex = hash[1];
            jsongaleria = jsongaleriaArg[jsongaleriaIndex];
            if (isLightboxOpen) {
                generateNewUrl = false;
                if (positionGaleria > parseInt(fotoIndex, 10)) {
                    beforeP();
                } else if (positionGaleria < parseInt(fotoIndex, 10)) {
                    nextP();
                }
                jsonFoto = jsongaleria[fotoIndex];
                document.title = jsonFoto.leyenda + " - " + " | La10";
            } else {
                var grppGallery = new GrppGallery(jsongaleria);
                positionGaleria = parseInt(fotoIndex, 10);
                toggleLightbox("open");
            }
        }
    }
}
function GrppGallery(jsong) {
    this.jsong = jsong;
    this.eachFoto();
    $("#grpp-gallery-total").html(jsong.length);
}
GrppGallery.prototype.eachFoto = function() {
    $("ul.bxslider").html("");
    //var tmpLi_todas = "<li><a href=\"[LINK01]\" ><img class=\"img_size02\" src=\"[FOTO01]\" /></a></li>";
	var tmpLi_todas = "<li><span style=\"cursor:pointer;\" onclick=\"[LINK01]\" ><img class=\"img_size02\" src=\"[FOTO01]\" /></span></li>";
    $("#grppg_todas ul").html("");
    $(this.jsong).each(function(key, value) {
        var txtLi = $("#tmp_gallery_li").html();
        var txtLi_todas = tmpLi_todas;

        this.linkimg = this.linkimg.replace('&g=8','&g=-1');

        txtLi = replaceAll(txtLi, "[ELEMENTO01]", "<img class=\"img_size100\" src=\"" + this.linkimg + "\" />");
        txtLi = replaceAll(txtLi, "[ELEMENTO_ID]", key);
        txtLi = replaceAll(txtLi, "[TITULO01]", this.leyenda);
        txtLi = replaceAll(txtLi, "[FOTO01]", this.linkimg);
        txtLi = replaceAll(txtLi, "[IMGCLASS]", "b-lazy");
        txtLi = replaceAll(txtLi, "[GORRO01]", this.gorro);
        txtLi = replaceAll(txtLi, "[FUENTE01]", this.fuente);
        txtLi = replaceAll(txtLi, "[CREDITOS01]", this.creditos);
		//txtLi_todas = replaceAll(txtLi_todas, "[LINK01]", "javascript:changePhoto(" + key + ");");
		txtLi_todas = replaceAll(txtLi_todas, "[LINK01]", "changePhoto(" + key + ");");
        txtLi_todas = replaceAll(txtLi_todas, "[FOTO01]", this.linkimg);
        $("ul.bxslider").append(txtLi);
        $("#grppg_todas ul").append(txtLi_todas);
        if (this.linkvideo.length > 10) {https://www.google.com/search?biw=1285&bih=725&q=json+api+de+google%2B+account&spell=1&sa=X&ved=0CBkQBSgAahUKEwibp8T5tLPHAhVCHh4KHSSABhw
            var bgplayer = this.linkimg;
            var skinplayer = "swf/rpp.zip";
            var w = 986;
            var h = 555;
            var file = this.linkvideo;
            var fileyt = file.replace("v/", "watch?v=");
            setJW6("grppg_element" + key, fileyt, bgplayer);
        }
        $("ul.bxslider li").on("swiperight", function() {
            alert(1);
        });
    });
}
var next_data_url;
var prev_data_url;
var next_data_cache;
var prev_data_cache;
var last_scroll = 0;
var is_loading = 0;
var hide_on_load = false;
var num_page = 0;
var error_load = false,
time_preload = 3000;

function loadFollowing() {
    var artLast = $('.box_ndetalle > article:last');
        if (next_data_url == "") {
        } else {

            is_loading = 1;

            setTimeout(function(){
				num_page++;
                function showFollowing(data) {
                    /* Aqui terminar precarga */
                    $('article:last').after(data.response);
                    next_data_url = data.next_data_url;
                    next_data_cache = false;

                    $.getJSON(next_data_url, function(preview_data) {
                        next_data_cache = preview_data;
                    }).fail(function() {
						error_load = true;
					});
                    //Remove preload
					artLast.find('.div_spinner').remove();
                }

                if (next_data_cache) {
                    showFollowing(next_data_cache);
                    is_loading = 0;
                } else {
                    $.getJSON(next_data_url, function(data) {
                        showFollowing(data);
                        is_loading = 0;
                    });
                }

            }, time_preload);

        }
}

function loadPrevious() {
    if (prev_data_url == "") {
    } else {
        is_loading = 1;

        function showPrevious(data) {
            $('article:first').before(data.response);
            item_height = $("article:first").height();
            window.scrollTo(0, $(window).scrollTop() + item_height);
            prev_data_url = data.prev_data_url;
            prev_data_cache = false;
            $.getJSON(prev_data_url, function(preview_data) {
                prev_data_cache = preview_data;
            });
            if (hide_on_load) {
                $(hide_on_load).hide();
                hide_on_load = false;
            }
        }
        if (prev_data_cache) {
            showPrevious(prev_data_cache);
            is_loading = 0;
        } else {
            $.getJSON(prev_data_url, function(data) {
                showPrevious(data);
                is_loading = 0;
            });
        }
    }
}

function mostlyVisible(element) {
    var scroll_pos = $(window).scrollTop();
    var window_height = $(window).height();
    var el_top = $(element).offset().top;
    var el_height = $(element).height();
    var el_bottom = el_top + el_height;
    return ((el_bottom - el_height * 0.25 > scroll_pos) && (el_top < (scroll_pos + 0.5 * window_height)));
}
function initPaginator() {
    $(window).on('scroll', debounce(function() {
	//$(window).scroll(function() {

		var scroll_pos = $(window).scrollTop();

        //if (scroll_pos >= 0.9 * ($(document).height() - $(window).height())) {
        if (scroll_pos >= ($(document).height() - $(window).height() - $('body > footer').height() - 400)) {

            /*Aqui mandar precarga*/
			var artLast = $('.box_ndetalle > article:last');
			artLast.find('.div_spinner').remove();
            if (is_loading == 0)
                loadFollowing();
				if(!error_load)
					artLast.append('<div class="div_spinner"><span><i class="fa fa-spinner fa-3x fa-pulse"></i></span></div>');
        }
        if (scroll_pos <= 0.9 * $("header").height()) {
            if (is_loading == 0)
                loadPrevious();
        }
        if (Math.abs(scroll_pos - last_scroll) > $(window).height() * 0.1)
        {
            /*Entra a carga 2*/
            last_scroll = scroll_pos;
            $("article").each(function(index) {
                if (mostlyVisible(this)) {
                    history.replaceState(null, null, $(this).attr("data-url"));
                    document.title = $(this).attr("data-title");
                    _gaq.push(['_trackPageview', '/' + $(this).attr("data-url")]);
                    return (false);
                }
            });
        }

	//});
	},250));
}
function openRequestedPopup(url_share)
{
    var left = (screen.width / 3);
    var top = (screen.height / 4);
    var w = left;
    var h = screen.height / 3;
    var targetWin = window.open(url_share, "LA10", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
}

var id_container_ndetalle = '#container_ndetalle';

function primeCache()
{
    $.getJSON(prev_data_url, function(data) {
        prev_data_cache = data;
    });
    $.getJSON(next_data_url, function(data) {
        next_data_cache = data;
    });
}
function govideo(id, image, file, tipo, titulo, creditos) {
    $('#mrelacionado' + id).addClass('news_media_b');
    if (tipo == 'video' || tipo == 'audio') {
        var ret = chkdevice();
        var bgplayer = image;
        var skinplayer = 'swf/capital-video_nd.zip';
        var h = 413;
        if (tipo == 'audio') {
            h = 123;
            bgplayer = "tmp/img/player_audio-dummy_mm.jpg";
            skinplayer = 'swf/capital-audio.zip';
        }
        if (ret == 1 || ret == 2) {
            if (file.indexOf('llnw') >= 0) {
                file = file.replace('llnw', 'http://media.rpp.com.pe');
                file = file.replace('&streamer=rtmp://media.rpp.com.pe/rppvod', '');
            }
            $('#mrelacionado' + id).html('<a onclick=\'javascript:closeall("' + id + '","' + image + '","' + file + '","' + tipo + '","' + titulo + '","' + creditos + '");\' class="close_embed">X</a><video poster="' + bgplayer + '" height="413px" id="container' + id + '" width="550px" controls onclick="this.play();"><source src="' + file + '"></video>');
        } else {
            setJW6('mrelacionado' + id, file, bgplayer);
            $('#mrelacionado' + id).prepend('<a onclick=\'javascript:closeall("' + id + '","' + image + '","' + file + '","' + tipo + '","' + titulo + '","' + creditos + '");\' class="close_embed">X</a>');
        }
    } else if (tipo == 'galeria') {
        $('#mrelacionado' + id).html('<a onclick=\'javascript:closeall("' + id + '","' + image + '","' + file + '","' + tipo + '","' + titulo + '","' + creditos + '");\' class="close_embed">X</a><img src="' + image + '">');
    }
}
function closeall(id, image, file, tipo, titulo, creditos)
{
    $('#mrelacionado' + id).setClass('news_media_s');
    $('#mrelacionado' + id).html('<a onclick=govideo("' + id + '","' + image + '","' + file + '","' + tipo + '")><img src="' + image + '" /><span class="' + tipo + '150"></span></a><h4>' + titulo + '|' + creditos + '</h4>');
}
function chkdevice() {
    var uagent = navigator.userAgent.toLowerCase();
    mobiledevices = new Array("series60", "symbian", "series60", "series70", "series80", "series90", "wap", "blackberry", "android", "brew", "midp", "wml", "sonyericsson", "ericsson", "sec-sgh", "docomo", "kddi", "vodafone");
    appledevices = new Array("iphone", "ipod", "ipad");
    pdadevices = new Array("playstation", "windows ce", "wm5 pie", "iemobile", "palm", "xiino", "blazer", "pda", "nitro", "webkit", "netfront");
    id = 0;
    pathArray = window.location.pathname.split('/');
    last = pathArray.length - 1;
    idhtml = pathArray[last].split('_');
    if (idhtml.length >= 2)
    {
        ids = idhtml[1].split('.');
        id = ids[0];
    }
    for (key in mobiledevices) {
        if (uagent.search(mobiledevices[key]) > -1) {
            document.getElementById('top_header_movil').className = 'display_on';
            return 1;
        }
    }
    for (key in appledevices) {
        if (uagent.search(appledevices[key]) > -1) {
            document.getElementById('top_header_movil').className = 'display_on';
            return 2;
        }
    }
    return 0;
}
function sendvotes(valor, nid) {
    document.getElementById('carga_encuesta' + nid).className = 'msgcarga-2';
    var selec = '';
    var activo = 0;
    if (valor != 3)
    {
        elem = document.getElementsByName('alternativa' + nid);
        for (i = 0; i < elem.length; i++) {
            if (elem[i].checked)
                selec = elem[i].value;
        }
        if (selec == '') {
            alert('Seleccione una alternativa');
        } else {
            activo = 1;
        }
    } else
        activo = 1;
    if (activo == 1)
    {
        $.cookie('encuesta-cookie', nid, {expire: 30});
        page = 'votar.php?v=' + valor + '&alt=' + selec + '&nid=' + nid;
        try {
            xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
        }
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                document.getElementById('carga_encuesta' + nid).className = 'display_off';
                document.getElementById('box_all_resultado' + nid).innerHTML = xmlhttp.responseText;
            }
        };
        xmlhttp.open('GET', page);
        xmlhttp.send(null);
    }
}
function searching(d)
{
    cadena = d.replace(' ', '-');
    window.location.href = 'http://' + document.location.host+'/'+cadena+'_busqueda';
}
function checkDate(month, day, year) {
    var monthLength = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if (!day || !month || !year) {
        return false;
    }
    if (year / 4 == parseInt(year / 4)) {
        monthLength[1] = 29;
    }
    if (month < 1 || month > 12) {
        return false;
    }
    if (day > monthLength[month - 1]) {
        return false;
    }
    return true;
}
var total = 0;
var aciertos = 0;
var answers = '';
function processanswers() {
    var activo = 1;
    aopcion = answers.split('|');
    for (i = 0; i < total; i++) {
        selec = '';
        r = i + 1;
        elem = document.getElementsByName('alternativa' + i);
        for (j = 0; j < elem.length; j++)
            if (elem[j].checked)
                selec = elem[j].value;
        if (selec == '') {
            alert('Seleccione una alternativa para la pregunta ' + r);
            activo = 0;
            break;
        }
        else
        {
            arpta = aopcion[i];
            if (selec == arpta)
                aciertos = aciertos + 1;
        }
    }
    if (activo == 1) {
        document.getElementById('bloquetrivia').innerHTML = '<div><div class="nd_trivia_msg"><h2>Acertaste ' + aciertos + ' de ' + total + '</h2></div><div class="nd_trivia_msg"><input type="button" value="Intenta de nuevo" id="refrescar" name="refrescar" onclick="window.location.reload();"><input type="button" value="Ver respuestas" id="rptas" name="rptas" onclick="showanswers();"></div></div>';
    }
}
function showanswers() {
    document.getElementById('bloquetrivia').className = 'display_off';
    document.getElementById('msg2').className = 'display_on';
    document.getElementById('msgaciertos').className = '<h2>Acertaste ' + aciertos + ' de ' + total + '</h2>';
}
