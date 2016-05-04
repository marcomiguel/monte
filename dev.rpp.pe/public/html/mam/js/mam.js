'use strict';
/*
    @nombre : MaM
    @autor : Joan P. C.
    @version : 0.0.1
    @date : 11-2015
    @dependency : api rpp
*/
var rppMaM = window.rppMaM || {};
rppMaM.insertStylesheet = function(head, pathCSS){
    var _link = document.createElement('link');
    _link.type = 'text/css';
    _link.rel = 'stylesheet';
    _link.href = pathCSS;
    head.appendChild(_link);
};
rppMaM.insertJavascript = function(head, pathJS, callback, type){
    var _script = document.createElement('script');
    _script.async = true;
    _script.src = pathJS;
    _script.async = true;
    _script.charset = 'utf-8';
    _script.onload = function(){
        callback();
    }
    head.appendChild(_script);
};
rppMaM.$ = {
    fade : function(element) {
        element.style.opacity = 0;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
    },
    unfade : function(element) {
        element.style.opacity = 1;
        element.style.height = 'auto';
        element.style.overflow = 'visible';
    },
    isEmpty : function(val){
        return (val === false ||
            val === undefined ||
            val === null ||
            //val === 0 ||
            ((String(val)).trim()).length <= 0) ? true : false;
    },
    getTime : function(){
        return String(new Date().getTime());
    },
    global : {},
    globalTitle : '',
    st : 45,
    idMaM : {id: 0, scrollTop: 0, flag : false },
    getParameterByName : function(name, _string, type) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        if(type === 'post'){
            var regex = new RegExp(name + "=\"([^]*)" + " data-width"),
            results = regex.exec(_string);
            return results == null ? "" : results[1].replace('"','');
        }else if(type === 'video'){
            var regex = new RegExp(name + "=\"([^]*)" + " class"),
            results = regex.exec(_string);
            return results == null ? "" : results[1].replace('"><div','');
        }else{
            return "";
        }
    },
    reviewSocial : function(){
        //REVIEWs TWITTER
        setTimeout(function(){

            if (typeof (twttr) != 'undefined') {
                twttr.widgets.load();
            }
            //REVIEWs FACEBOOK
            if (typeof (FB) != 'undefined') {
                FB.XFBML.parse(document.getElementById('mamXYZ'));
            }
            //if (typeof (gapi) != 'undefined') {
            //    var gPosts = document.querySelectorAll('.g-post');
            //    for (var i = 0; i < gPosts.length; i++) {
            //        gapi.post.render(gPosts[i], {'href' : gPosts[i].getAttribute('data-href')});
            //    }
            //}
            //var _postFb = document.querySelectorAll('.fb-post');
            //for (var i = 0; i < _postFb.length; i++) {
            //    _postFb[i].className = 'fb-post_noreload';
            //}
        },10);
    },
    debounce : function(func, wait, immediate) {
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
    scrollToTop : function(scrollDuration, mamTop) {
        var scrollStep = -window.scrollY / (scrollDuration / 15);
        var scrollInterval = setInterval(function(){
            if ( window.scrollY > mamTop ) {
                window.scrollBy( 0, scrollStep );
            }
            else clearInterval(scrollInterval);
        },15);
    },
    getElementOffset : function(element){
        var de = document.documentElement;
        var box = element.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        return { top: top, left: left };
    },
    openSocial : function(type, t){
        var __url = document.location.origin + document.location.pathname;
        var url = encodeURIComponent(__url),
        w = 600,h = 450,
        pos_x, pos_y,
        pos_x=(screen.width/2)-(w/2),
        pos_y=(screen.height/2)-(h/2);
        var pP = t.parentNode.parentNode;
        var __p = pP.querySelector('.rpp-mam-xyz--text p');
        var text = (__p!=null)?encodeURIComponent(__p.innerHTML):'';
        var image = pP.querySelector('.rpp-mam-xyz--media-image');
        var viaTwitter = rppMaM.$.global.social.twitter.via;
        var imageSrc = '';
        if(image){
            imageSrc = '&picture='
            imageSrc += (image)?image.src:'';
        }else{
            if(rppMaM.$.global.hasOwnProperty('imageShare')){
                imageSrc = '&picture='
                imageSrc += rppMaM.$.global.imageShare;
            }
        }
        var __domain = ((document.location.origin).replace('dev.', '')).replace('pre.', '');
        var __pathname = document.location.pathname;
        var urlFacebook = 'https://www.facebook.com/dialog/feed?app_id='+ rppMaM.$.global.social.facebook.app_id +
        '&display=popup&caption='+
        __domain + encodeURIComponent(' | por ') + rppMaM.$.global.social.facebook.via +
        imageSrc+
        '&link='+__domain + __pathname + '&name='+
        encodeURIComponent(rppMaM.$.globalTitle)+'&description='+text+
        '&redirect_uri='+rppMaM.$.global.fbClose + '&cancel_url=&ref=click_share_sb';
        switch(type) {
            case 'facebook':
                window.open(urlFacebook,'rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                break;
            case 'twitter':
                window.open('https://twitter.com/intent/tweet?text='+text+'&url='+url+'&via='+viaTwitter,'rppwindow', 'toolbar=0, status=0, left='+pos_x+', top='+pos_y+', width='+w+', height='+h);
                break;
        }
   }
};
rppMaM.getTransport = function(url, success, error){
    var request = new XMLHttpRequest();
    var _url = url + '?v=' + rppMaM.$.getTime();
    request.open('GET', _url, true);
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var data = JSON.parse(this.responseText);
                success(data);
            } else {
                // Error :(
                error(this.statusText);
            }
        }
    };
    request.send();
    request = null;
};
rppMaM._contruct = function(type, obj, DOM, url5){
    //METHOD PRIVATE
    var compareGoalName = 0, compareGoalName2 = 0;
    var _contructHeader = function(DOM, match, title, type){
        //TITLE
        (title)?(DOM.title.innerHTML = title):'';
        //STATUS
        var status = String(match.estado);
        if(status){
            switch (status) {
                case '0':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-poriniciar">Por iniciar</div>';
                    break;
                case '1':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Primer Tiempo</div>';
                    break;
                case '2':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-finalizado">Finalizado</div>';
                    break;
                case '3':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-finalizado">Suspendido</div>';
                    break;
                case '4':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-finalizado">Postergado</div>';
                    break;
                case '5':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Entretiempo</div>';
                    break;
                case '6':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Segundo Tiempo</div>';
                    break;
                case '7':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Fin de Tiempo Reglamentario</div>';
                    break;
                case '8':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Alargue 1</div>';
                    break;
                case '9':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Fin alargue 1</div>';
                    break;
                case '10':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Alargue 2</div>';
                    break;
                case '11':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Fin alargue 2</div>';
                    break;
                case '11':
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-envivo">Definición por penales</div>';
                    break;
                default:
                    DOM.status.innerHTML = '<div class="rpp-mam-xyz--state-poriniciar">Por iniciar</div>';
                    break;
            }
        }
        //TEAM NAME
        (match.local.nombre_equipo)?(DOM.teamName1.innerHTML = match.local.nombre_equipo):'';
        (match.visitante.nombre_equipo)?(DOM.teamName2.innerHTML = match.visitante.nombre_equipo):'';
        //SCORE
        if(status === '0'){
            DOM.scoreMatch.innerHTML = 'VS';
        }else{
            DOM.scoreMatch.innerHTML = match.local.goles + '-' + match.visitante.goles;
        }
        //SHIELDS

        //var _urlShield = 'http://eventos.old.rpp-noticias.io/services/datafactory/escudos/';
        var _urlShield = rppMaM.$.global.urlShield;
        var _shild1 = _urlShield + match.local.id + '.png';
        if(DOM.shield1.src != _shild1){DOM.shield1.setAttribute('src', _shild1)};
        var _shild2 = _urlShield + match.visitante.id + '.png';
        if(DOM.shield2.src != _shild2){DOM.shield2.setAttribute('src', _shild2)};
        //GOALS NAME LOCAL
        var arrGoalName = (match.local.gol_jugadores)?match.local.gol_jugadores:[];
        if(arrGoalName.length>0){
            if(compareGoalName != arrGoalName.length){
                var _cntGoalName =  DOM.goalsName1;
                _cntGoalName.innerHTML = '';
                for (var j = 0; j < arrGoalName.length; j++) {
                    var posLi = arrGoalName[j];
                    var _liGoalName = document.createElement('li');
                    _liGoalName.className = 'rpp-mam-xyz--goalname-insert';
                    var convertTime2 = (posLi.tiempo === 'ST')?(parseInt(posLi.minuto) + rppMaM.$.st):posLi.minuto;
                    _liGoalName.innerHTML = '<strong>' + convertTime2 + '\'</strong> ' + posLi.jugador;
                    var _liInsertGoalName = _cntGoalName.insertBefore(_liGoalName, _cntGoalName.firstChild);
                    rppMaM.$.unfade(_liInsertGoalName);
                }
                compareGoalName = arrGoalName.length;
            }
        }else{
            DOM.goalsName1.innerHTML = '';
        }
        //GOALS NAME VISITANTE
        var arrGoalName2 = (match.visitante.gol_jugadores)?match.visitante.gol_jugadores:[];
        if(arrGoalName2.length>0){
            if(compareGoalName2 != arrGoalName2.length){
                var _cntGoalName2 =  DOM.goalsName2;
                _cntGoalName2.innerHTML = '';
                for (var k = 0; k < arrGoalName2.length; k++) {
                    var posLi2 = arrGoalName2[k];
                    var _liGoalName2 = document.createElement('li');
                    _liGoalName2.className = 'rpp-mam-xyz--goalname-insert';
                    var convertTime = (posLi2.tiempo === 'ST')?(parseInt(posLi2.minuto) + rppMaM.$.st):posLi2.minuto;
                    _liGoalName2.innerHTML = '<strong>' + convertTime + '\'</strong> ' + posLi2.jugador;
                    var _liInsertGoalName2 = _cntGoalName2.insertBefore(_liGoalName2, _cntGoalName2.firstChild);
                    rppMaM.$.unfade(_liInsertGoalName2);
                }
                compareGoalName2 = arrGoalName2.length;
            }
        }else{
            DOM.goalsName2.innerHTML = '';
        }
    };
    var initList = 0;
    var ss = 0;
    var _contructLi = function(incident, DOM, match, type){
        var pos = incident;
        if(initList === 0){
            //FIRST REQUEST
            DOM.flowContent.innerHTML = '<li class="rpp-mam-xyz--inside"></li>';
            initList++;
        }
        var _li = document.createElement('li');
        _li.className = 'rpp-mam-xyz--inside rpp-mam-xyz--inside-insert';
        var _html = '<div class="rpp-mam-xyz--text">';
        if(!rppMaM.$.isEmpty(pos.texto)){
            _html += '<p>'+ pos.texto + '</p>';
        }
        _html += '</div>';
        if(!rppMaM.$.isEmpty(pos.foto)){
            _html += '<figure class="rpp-mam-xyz--media">'+
                '<img class="rpp-mam-xyz--media-image" src="' + pos.foto + '" alt="Imagen de minuto a minuto" />'+
            '</figure>';
        }
        if(!rppMaM.$.isEmpty(pos.embed)){
            if((pos.embed).indexOf('fb-post')!= -1){
                //Replace for FACEBOOK FB-POST
                var postFB = String(pos.embed);
                var _postFB = rppMaM.$.getParameterByName('data-href', postFB, 'post');
                var __postFB = '<div class="fb-post" data-href="'+_postFB+'" data-width="500"></div>';
                _html += '<div class="rpp-mam-xyz--media">'+ __postFB +'</div>';
            }else if((pos.embed).indexOf('fb-video')!= -1){
                //REPLACE FB-VIDEO
                var postFB = String(pos.embed);
                var _postFB = rppMaM.$.getParameterByName('data-href', postFB, 'video');
                var __postFB = '<div class="fb-video" data-allowfullscreen="1" data-href="' + _postFB + '"></div>';
                _html += '<div class="rpp-mam-xyz--media">'+ __postFB +'</div>';
            }else{
                _html += '<div class="rpp-mam-xyz--media">'+ pos.embed +'</div>';
            }
        }
        if(pos.hasOwnProperty('noticias_relacionadas')){
            if(pos.noticias_relacionadas.length>0){
                _html += '<div class="rpp-mam-xyz--media"><ul class="rpp-mam-xyz--related">';
                if(pos.noticias_relacionadas.length===1){
                    var __pos = pos.noticias_relacionadas[0];
                    _html += '<li><div class="rpp-mam-xyz--block-related">'+
                    '<div class="rpp-mam-xyz--block-left"><a target="_blank" href="'+__pos.url+'"><img src="'+__pos.foto+'" alt="'+__pos.titulo+'" /></a></div>'+
                    '<div class="rpp-mam-xyz--block-right"><a target="_blank" href="'+__pos.url+'">'+__pos.titulo+'</a> <br/><span class="rpp-mam-xyz--block-sitio">'+__pos.sitio.nombre+'</span></div>'+
                    '</div></li>';
                }else{
                    _html += '<li class="rpp-mam-xyz--block-titulorel">Noticias relacioandas</li>';
                    for (var k = 0; k < pos.noticias_relacionadas.length; k++) {
                        var __pos = pos.noticias_relacionadas[k];
                        _html += '<li><a target="_blank" href="'+__pos.url+'">&#8226; '+__pos.titulo+'</a></li>';
                    }
                }
                _html += '</ul></div>';
            }
        }

        _html += '<div class="rpp-mam-xyz--social">'+
            '<span class="rpp-mam-xyz--social-text">Compartir</span>'+
            '<i onclick="rppMaM.$.openSocial(\'facebook\', this)" class="rpp-mam-xyz-icon rpp-mam-xyz-icon-facebook"></i>'+
            '<i onclick="rppMaM.$.openSocial(\'twitter\', this)" class="rpp-mam-xyz-icon rpp-mam-xyz-icon-twitter"></i>'+
        '</div>'+
        '<div class="rpp-mam-xyz--time">';
        if(pos.hasOwnProperty('grupo') && (pos.grupo === 0 || pos.grupo === 1.5 || pos.grupo === 4)){
            if(!rppMaM.$.isEmpty(pos.fecha_publicacion)){
                var _date = new Date(pos.fecha_publicacion);
                var _hour = _date.getHours();
                var _minut = _date.getMinutes();
                if(String(_minut).split('').length === 1){
                    _minut = '0' + _minut;
                }
                _html += '<time class="rpp-mam-xyz--time-nopadding">'+ _hour + ':' + _minut + '</time>';
            }
        }else{
            var _convertHora = (Number(pos.hora) >= 0)?((pos.tiempo === 2)?(Number(pos.hora) + rppMaM.$.st):Number(pos.hora)):'';
            if(!rppMaM.$.isEmpty(pos.mas_tiempo)){
                _html += '<time class="rpp-mam-xyz--time-padding rpp-mam-xyz--time-peligro">'+ _convertHora + '</time>';
            }else{
                if(pos.icono === 'gol'){
                    _html += '<time class="rpp-mam-xyz--time-padding rpp-mam-xyz--time-exito">'+ _convertHora + '</time>';
                }else{
                    _html += '<time class="rpp-mam-xyz--time-padding">'+ _convertHora + '</time>';
                }
            }
            if(!rppMaM.$.isEmpty(pos.icono)){
                _html +='<div class="rpp-mam-xyz--icon">'+
                        '<i class="rpp-mam-xyz-icon rpp-mam-xyz-icon-' + pos.icono + '"></i>'+
                    '</div>';
            }
        }
        _html += '</div>';
        _li.innerHTML = _html;
        //INSERT INCIDENT
        _li.id = ss;
        ss++;
        var _liInsert;
        var _cnt;
        if(type === 'recursive'){
             _cnt =  DOM.flowContentRecrusive;
            _liInsert = _cnt.insertBefore(_li, _cnt.firstChild.nextSibling);
        }else{
             _cnt =  DOM.flowContent;
             _liInsert = _cnt.insertBefore(_li, _cnt.lastChild.nextSibling);
        }
        rppMaM.$.unfade(eval(_liInsert));

    };
    var _recursive;
    var idsRecursive = [];
    //CONDITION
    //INIT
    rppMaM.$.unfade(DOM.loaderFlow);
    rppMaM.getTransport(obj.urlApi, function(data){
        if(data){
            //console.log(data, 'data init');
            //STOP
            if(data.terminado){ rppMaM.$.fade(DOM.loaderFlow); return false; }
            //FUNC
            var incidents = data.incidencias?data.incidencias:{};
            var match = data.match?data.match:{};
            var url5 = data.url5;
            var title = data.titulo;
            var __tipo = data.tipo;
            if(__tipo.id === 2){
                DOM.cntTeam.style.display = 'none';
                DOM.cntGoals.style.display = 'none';
            }
            rppMaM.$.globalTitle = title;
            //CONSTRUCT HEADER
            _contructHeader(DOM, match, title, 'init');
            //CONSTRUCT EVENTS
            //TRAVEL INCIDENTS
            var key, count = 0;
            for(key in incidents) {
                if(incidents.hasOwnProperty(key)) {
                    count++;
                    idsRecursive.push(key);
                    _contructLi(incidents[key], DOM, match, 'init');
                }
            }
            rppMaM.$.reviewSocial();
            setTimeout(function(){
                rppMaM.$.fade(DOM.loaderFlow);
            },(1/2)*1000);
            //RECURSIVE ITEMS
            _recursive = setInterval( function(){
                //CONSULT INTERVAL
                rppMaM.getTransport(url5, function(data){
                    if(data){
                        //console.log(data, 'data recursive');
                        //STOP
                        if(data.terminado){ clearInterval(_recursive); }
                        //FUNC
                        var incidents = data.incidencias?data.incidencias:{};
                        var match = data.match?data.match:{};
                        var key, count = 0;
                        _contructHeader(DOM, match, undefined, 'recursive');
                        var isAccept = true;

                            for(key in incidents) {
                                if(incidents.hasOwnProperty(key)) {
                                    count++;
                                    isAccept = true
                                    for (var l = 0; l < idsRecursive.length; l++) {
                                        if(idsRecursive[l] === key){
                                            isAccept = false;
                                            break;
                                        }else{
                                            isAccept = true;
                                            continue;
                                        }
                                    }
                                    if(isAccept){
                                        idsRecursive.push(key);
                                        _contructLi(incidents[key], DOM, match, 'recursive');
                                        rppMaM.$.idMaM.flag = true;
                                    }
                                }
                            }
                            rppMaM.$.reviewSocial();
                            if(isAccept){
                                rppMaM.$.unfade(DOM.loaderFlow);
                                setTimeout(function(){
                                    rppMaM.$.fade(DOM.loaderFlow);
                                },(1/2)*1000);
                            }

                    }
                },function(err){
                    console.log(err, 'err');
                });

            }, obj.timeSeconds*1000);
        }
    },function(err){
        console.log(err, 'err');
        rppMaM.$.fade(DOM.loaderFlow);
        rppMaM._contruct('init', obj, DOM);
    });
};
rppMaM.recursive = function(obj, _base){
        var obj = obj;
        var head = document.head;
        //ADD STYLESHEET
        if(!obj.status){ return false; };
        //Add Style
        if(obj.pathCSS){ rppMaM.insertStylesheet(head, obj.pathCSS); };
        //Add Script
        //REVIEWs TWITTER
        if (typeof (twttr) === 'undefined') {
            rppMaM.insertJavascript(head, '//platform.twitter.com/widgets.js', function(){}, 'twitter');
        }
        //REVIEWs GOOGLE+
        //if (typeof (gapi) === 'undefined') {
        //    rppMaM.insertJavascript(head, 'https://apis.google.com/js/plusone.js', function(){}, 'gplus');
        //}
        //DOM HTML
        var classCss = document.querySelector(obj.classCss);
        var DOM = {
            title : classCss.querySelector('.rpp-mam-xyz--title'), //TITLE MATCH
            status : classCss.querySelector('.rpp-mam-xyz--state'), //STATUS
            shield1 : classCss.querySelector('.rpp-mam-xyz--team-shield1'), //SHIELD 1
            shield2 : classCss.querySelector('.rpp-mam-xyz--team-shield2'), //SHIELD 2
            cntTeam : classCss.querySelector('.rpp-mam-xyz--team'), //CNT GOALS
            teamName1 : classCss.querySelector('.rpp-mam-xyz--over-team-match-1'), //TEAM NAME 1
            teamName2 : classCss.querySelector('.rpp-mam-xyz--over-team-match-2'), //TEAM NAME 2
            scoreMatch : classCss.querySelector('.rpp-mam-xyz--cell-point'), //SCORE
            cntGoals : classCss.querySelector('.rpp-mam-xyz--goals'), //CNT GOALS
            goalsName1 : classCss.querySelector('.rpp-mam-xyz--goals-1'), //GOALS NAME 1
            goalsName2 : classCss.querySelector('.rpp-mam-xyz--goals-2'), //GOALS NAME 2
            loaderFlow : classCss.querySelector('.rpp-mam-xyz--loading'), //LOADING FLOW
            flowContent : classCss.querySelector('.rpp-mam-xyz--flow-inside'), //FLOW CONTENT
            flowContentRecrusive : classCss.querySelector('.rpp-mam-xyz--flow-inside-recursive'), //FLOW CONTENT RECURSIVE
            flowItem : classCss.querySelectorAll('.rpp-mam-xyz--inside') //LIST FLOW
        };
        //RECURSIVE
        //classCss.id = 'mam' + rppMaM.$.getTime();
        classCss.id = 'mamXYZ';
        rppMaM.$.idMaM.id = classCss.id;
        rppMaM.$.global = obj;
        rppMaM._contruct('init', obj, DOM);
        //BTN UP
        var btn = document.createElement('div');
        btn.className = 'rpp-mam-xyz--anchor';
        btn.id = 'mamBtn' + rppMaM.$.getTime();
        btn.innerHTML = '<i class="rpp-mam-xyz-icon rpp-mam-xyz-icon-up"></i> Nuevas incidencias';
        classCss.appendChild(btn);
        var offMaM = 220;
        btn.onclick = function(){
            var _dS0 = rppMaM.$.getElementOffset(document.querySelector(obj.classCss)).top;
            console.log(_dS0, '_dS0');
            rppMaM.$.scrollToTop(500, _dS0 + offMaM);
            rppMaM.$.fade(btn);
            rppMaM.$.idMaM.flag = false;
        };
        var _Fn = function(){
            var _dS1 = rppMaM.$.getElementOffset(document.querySelector(obj.classCss)).top;
            if(document.body.scrollTop > _dS1 + offMaM + 150){
                if(rppMaM.$.idMaM.flag){
                    rppMaM.$.unfade(btn);
                }else{
                    rppMaM.$.fade(btn);
                    rppMaM.$.idMaM.flag = false;
                }
            }else{
                rppMaM.$.fade(btn);
                rppMaM.$.idMaM.flag = false;
            }
        };
        setInterval(function(){
            _Fn();
        },250);
        var _FnScroll = rppMaM.$.debounce(function(){
            var _dS = rppMaM.$.getElementOffset(document.querySelector(obj.classCss)).top;
            console.log(document.body.scrollTop, 'document.body.scrollTop');
            console.log(_dS + offMaM + 50, '_dS + offMaM + 50');
            if(document.body.scrollTop <= _dS + offMaM + 50){
                rppMaM.$.fade(btn);
                rppMaM.$.idMaM.flag = false;
            }
        },10);
        window.removeEventListener('scroll', _FnScroll);
};
