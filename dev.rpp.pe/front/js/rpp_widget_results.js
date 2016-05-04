var rppWR = window.rppWR || {};
window.rppWR = rppWR, rppWR.version = "0.0.1", rppWR.name = "Widget Load Data Results - RPP", rppWR.empty = "", rppWR.urlBase = "http://eventos.rpp.com.pe/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/", rppWR.urlShields = "http://cdn.datafactory.la/escudos_ch/", rppWR.urlShieldsExt = "http://eventos.rpp.com.pe/services/datafactory/escudos/", rppWR.shieldsExt = "png", rppWR.isIEVersion = function() {
    var a = navigator.userAgent.toLowerCase();
    return -1 != a.indexOf("msie") ? parseInt(a.split("msie")[1]) : !1
}, rppWR.isIEVersion() <= 9 && ! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
    if (!a.support.cors && a.ajaxTransport && window.XDomainRequest) {
        var e = /^https?:\/\//i,
            t = /^get|post$/i,
            s = new RegExp("^" + location.protocol, "i");
        a.ajaxTransport("* text html xml json", function(r, p) {
            if (r.crossDomain && r.async && t.test(r.type) && e.test(r.url) && s.test(r.url)) {
                var i = null;
                return {
                    send: function(e, t) {
                        var s = "",
                            n = (p.dataType || "").toLowerCase();
                        i = new XDomainRequest, /^\d+$/.test(p.timeout) && (i.timeout = p.timeout), i.ontimeout = function() {
                            t(500, "timeout")
                        }, i.onload = function() {
                            var e = "Content-Length: " + i.responseText.length + "\r\nContent-Type: " + i.contentType,
                                s = {
                                    code: 200,
                                    message: "success"
                                },
                                r = {
                                    text: i.responseText
                                };
                            try {
                                if ("html" === n || /text\/html/i.test(i.contentType)) r.html = i.responseText;
                                else if ("json" === n || "text" !== n && /\/json/i.test(i.contentType)) try {
                                    r.json = a.parseJSON(i.responseText)
                                } catch (p) {
                                    s.code = 500, s.message = "parseerror"
                                } else if ("xml" === n || "text" !== n && /\/xml/i.test(i.contentType)) {
                                    var l = new ActiveXObject("Microsoft.XMLDOM");
                                    l.async = !1;
                                    try {
                                        l.loadXML(i.responseText)
                                    } catch (p) {
                                        l = void 0
                                    }
                                    if (!l || !l.documentElement || l.getElementsByTagName("parsererror").length) throw s.code = 500, s.message = "parseerror", "Invalid XML: " + i.responseText;
                                    r.xml = l
                                }
                            } catch (o) {
                                throw o
                            } finally {
                                t(s.code, s.message, r, e)
                            }
                        }, i.onprogress = function() {}, i.onerror = function() {
                            t(500, "error", {
                                text: i.responseText
                            })
                        }, p.data && (s = "string" === a.type(p.data) ? p.data : a.param(p.data)), i.open(r.type, r.url), i.send(s)
                    },
                    abort: function() {
                        i && i.abort()
                    }
                }
            }
        })
    }
}), rppWR.loadData = function(a, e, t) {
    var s = {
        events: "",
        type: "",
        matchId: ""
    };
    s = $.extend(s, e);
    var r = {},
        p = (new Date).getTime();
    if ("" != s.events && "" != s.type) {
        var i = s.type.toLowerCase();
        if ($.support.cors = !0, "agendamam" === i) $.getJSON(rppWR.urlBase + s.events + "/" + s.type + "/es/agenda.json?v=" + p, function(e) {
            e = e;
            var s = a;
            t(e, s)
        });
        else if ("mam" === i && "" != s.matchId) $.getJSON(rppWR.urlBase + s.events + "/events/" + s.matchId + "." + i + ".json?v=" + p, function(e) {
            e = e;
            var s = a;
            t(e, s)
        });
        else {
            var n = a;
            t(r, n)
        }
    } else {
        var n = a;
        t(r, n)
    }
}, rppWR.ifExist = function(a, e) {
    var t = a,
        s = e;
    return rppWR.empty, null != t ? t : s
}, rppWR.sizeJSON = function(a) {
    var e = a;
    return Object.keys || (Object.keys = function(a) {
        var e = [];
        for (var t in a) a.hasOwnProperty(t) && e.push(t);
        return e
    }), Object.keys(e).length
}, rppWR.loader = '<div class="loader_widget"></div>', rppWR.buildAgendaMaM = function(a, e, t) {
    var a = a,
        e = e,
        s = a.events,
        t = t,
        r = $(e.id);
    if (r.addClass("rppWR-wrap"), r.html(""), s) {
        var p = 0,
            i = [],
            n = (rppWR.sizeJSON(s), ""),
            l = rppWR.sizeJSON(s);
        for (key in s) {
            var o = (s[key].statusId, key.split(".")),
                c = o[o.length - 1];
            p++;
            var d = p;
            r.append('<div class="rppWR-box_result">' + rppWR.loader + "</div>"), rppWR.loadData(d, {
                events: t.events,
                type: "MaM",
                matchId: c
            }, function(a, t) {
                var a = a,
                    s = t;
                if (a) {
                    console.log("alerta");
                    var r = a.match.date.split("");
                    if (r) var p = (r.slice(0, 4).join(""), r.slice(4, 6).join("")),
                        o = r.slice(6, 8).join(""),
                        c = o + "/" + p;
                    else var c = "";
                    var d = a.match.scheduledStart;
                    if (d && ":" != d) {
                        var m = d.split(":"),
                            v = m[0],
                            u = m[1],
                            h = "Hora:";
                        h + "&nbsp;" + (parseInt(v) - 2) + ":" + u
                    } else;
                    n = '<div data-status="' + a.status.statusId + '" class="rppWR-header_result"><span>' + a.match.week.split("-")[0] + "</span>" + '</span></div><div class="rppWR-time_result">' + a.match.dayName + " " + c + "</div>";
                    /*n backup*/
                    // n = '<div data-status="' + a.status.statusId + '" class="rppWR-header_result"><span>' + a.match.week.split("-")[0] + "</span><span>" + a.match.week.split("-")[1] + '</span></div><div class="rppWR-time_result">' + a.match.dayName + " " + c + "</div>";
                    var f = parseInt(a.status.statusId);
                    0 === f ? n += '<div class="rppWR-status_result rppWR-statusid-0">Por Iniciar</div>' : 1 === f || 5 === f || 6 === f ? n += '<div class="rppWR-status_result rppWR-statusid-1">En Vivo</div>' : 2 === f && (n += '<div class="rppWR-status_result rppWR-statusid-2">Finalizado</div>'), n += '<table class="rppWR-table"><tbody><tr><td class="rppWR-td1"><img src="' + rppWR.urlShields + a.match.homeTeamId + '.gif" alt="' + a.match.homeTeamName + '" /></td><td class="rppWR-td2">' + a.match.homeTeamName + '</td><td class="rppWR-td3">' + rppWR.ifExist(a.scoreStatus[a.match.homeTeamId].score, "-") + '</td></tr><tr><td class="rppWR-td1"><img src="' + rppWR.urlShields + a.match.awayTeamId + '.gif" alt="' + a.match.awayTeamName + '" /></td><td class="rppWR-td2">' + a.match.awayTeamName + '</td><td class="rppWR-td3">' + rppWR.ifExist(a.scoreStatus[a.match.awayTeamId].score, "-") + "</td></tr></tbody></table>"
                }
                if ($(e.id).find(".rppWR-box_result").eq(s - 1).html(n), i.push([s, n]), i.length === l) {
                    var R = $(e.id).find(".rppWR-header_result");
                    R.each(function(a, t) {
                        var s = $(t).data("status");
                        if ("2" != s) {
                            var r = R.index($(t)),
                                p = $(e.id).data("owlCarousel");
                            return p.goTo(parseInt(r)), !1
                        }
                    })
                }
            })
        }
        var m = r;
        r.owlCarousel({
            items: 4,
            navigation: !0,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: !0
        }), m.find(".owl-prev").html('<i class="icon icon-angle-left"></i>'), m.find(".owl-next").html('<i class="icon icon-angle-right"></i>')
    }
}, rppWR.read = function(a) {
    var a = a;
    return {
        render: function(e) {
            var e = e,
                t = 0;
            $(e.id).html(rppWR.loader), rppWR.loadData(t, a, function(t) {
                var t = t;
                rppWR.buildAgendaMaM(t, e, a)
            })
        },
        renderInterval: function(e) {
            var e = e,
                t = 0,
                s = $(e.id);
            s.html(rppWR.loader), rppWR.loadData(t, a, function(a) {
                var a = a;
                if (a) {
                    var t = null != a.scoreStatus[a.match.homeTeamId].score ? a.scoreStatus[a.match.homeTeamId].score : rppWR.empty,
                        r = null != a.scoreStatus[a.match.awayTeamId].score ? a.scoreStatus[a.match.awayTeamId].score : rppWR.empty,
                        p = e.url ? e.url : "",
                        i = "copainca" === a.match.channel ? "Torneo del Inca" : a.match.competition,
                        n = t === rppWR.empty && r === rppWR.empty ? "vs" : "x",
                        l = '<div class="rppWR-cntMatch"><table><tbody><tr><td class="rppWR-td1"><div><figure><img src="' + rppWR.urlShieldsExt + a.match.homeTeamId + "." + rppWR.shieldsExt + '" alt="' + a.match.homeTeamName + '" /></figure></div><div>' + a.match.homeTeamName + '</div></td><td class="rppWR-td2"><div class="rppWR-center">',
                        o = parseInt(a.status.statusId);
                    l += 0 === o ? '<div class="rppWR-info-vs rppWR-info-0"><a href="' + p + '"><span class="rppWR-type"> <i class="futbolicon-por-iniciar"></i> POR INICIAR </span><span class="rppWR-league">' + i + "</span></a></div>" : 2 === o ? '<div class="rppWR-info-vs rppWR-info-2"><a href="' + p + '"><span class="rppWR-type"> <i class="futbolicon-finalizado"></i> FINALIZADO </span><span class="rppWR-league">' + i + "</span></a></div>" : '<div class="rppWR-info-vs"><a href="' + p + '"><span class="rppWR-type"> <i class="futbolicon-en-vivo"></i> EN VIVO </span><span class="rppWR-league">' + i + "</span></a></div>", l += '<div class="rppWR-vs-resutls"><a href="' + p + '"><span class="rppWR-vs-goal">' + t + '</span><span class="rppWR-vs-separator">' + n + '</span><span class="rppWR-vs-goal">' + r + '</a></span></div></td><td class="rppWR-td3"><div><figure><img src="' + rppWR.urlShieldsExt + a.match.awayTeamId + "." + rppWR.shieldsExt + '" alt="' + a.match.awayTeamName + '" /></figure></div><div>' + a.match.awayTeamName + "</div></td></tr></tbody></table></div>", s.html(l)
                }
            })
        },
        renderMaM: function(e) {
            var e = e,
                t = e.url,
                s = 0,
                r = $(e.id);
            empty = "", r.html(rppWR.loader), rppWR.loadData(s, a, function(a) {
                var a = a;
                if (a) {
                    var e = a.match;
                    if (e) {
                        var s = e.date.split("");
                        if (s) var p = s.slice(0, 4).join(""),
                            i = s.slice(4, 6).join(""),
                            n = s.slice(6, 8).join(""),
                            l = n + "/" + i + "/" + p;
                        else var l = "";
                        var o = e.scheduledStart;
                        if (o && ":" != o) var c = o.split(":"),
                            d = c[0],
                            m = c[1],
                            v = "",
                            u = v + "&nbsp;" + (parseInt(d) - 2) + ":" + m;
                        else var u = "";
                        var h = "",
                            f = [];
                        $.each(a.officials, function(a, e) {
                            f.push(e.name.first + " " + e.name.last)
                        }), h = f.length > 0 ? f.join("<br />") : "";
                        var R = "",
                            W = "",
                            g = [],
                            y = [];
                        $.each(a.incidences.goals, function(a, t) {
                            t.team === e.awayTeamId ? y.push(t.plyrName + " (" + t.t.m + '")') : t.team === e.homeTeamId && g.push(t.plyrName + " (" + t.t.m + '")')
                        }), R = g.length > 0 ? g.join("<br />") : "", W = y.length > 0 ? y.join("<br />") : "", golEq1 = null === a.scoreStatus[e.homeTeamId].score ? "-" : a.scoreStatus[e.homeTeamId].score, golEq2 = null === a.scoreStatus[e.awayTeamId].score ? "-" : a.scoreStatus[e.awayTeamId].score;
                        var w = a.scoreStatus;
                        n = parseInt(a.status.statusId), 0 == n ? n = '<div class="rppWR-info-vs rppWR-info-0"><a href="' + t + '"><span class="rppWR-type"> <i class="futbolicon-por-iniciar"></i> POR INICIAR </span></a></div>': 1 == n ? n = '<div class="rppWR-info-vs"><a href="' + t + '"><span class="rppWR-type"> <i class="futbolicon-en-vivo"></i> EN VIVO </span></a></div>' : 2 == n && (n = '<div class="rppWR-info-vs rppWR-info-2"><a href="' + t + '"><span class="rppWR-type"> <i class="futbolicon-finalizado"></i> FINALIZADO </span></a></div>');
                        var est = parseInt(a.status.statusId);
                        if(est == 0){
                            est = '<span class="rppWR-vs-goal">' + '-' + '</span><span class="rppWR-vs-separator">x</span><span class="rppWR-vs-goal">' + '-' + '</span>';
                        }else{
                            est = '<span class="rppWR-vs-goal">' + golEq1 + '</span><span class="rppWR-vs-separator">x</span><span class="rppWR-vs-goal">' + golEq2 + '</span>';
                        }


                        // var est = '<span class="rppWR-vs-goal">' + golEq1 + '</span><span class="rppWR-vs-separator">x</span><span class="rppWR-vs-goal">' + golEq2 + '</span>';
                        var I = '<div class="rppWR-cntMatch"><table><thead><tr><td class="rppWR-tdh1" colspan="3"><span>' + e.week + "</span><time> " + e.dayName + " " + l + " " + u + '</time></td></tr></thead><tbody><tr><td class="rppWR-td1"><div><figure><img src="' + rppWR.urlShieldsExt + e.homeTeamId + '.svg" alt="' + e.homeTeamName + '" width="42" height="42"/></figure></div><div>' + e.homeTeamName + '</div></td><td class="rppWR-td2"><div class="rppWR-center">' + n + '<div class="rppWR-vs-resutls"><a href="">' + est +'</a></div></div></td><td class="rppWR-td3"><div><figure><img src="' + rppWR.urlShieldsExt + e.awayTeamId + '.svg" alt="' + e.awayTeamName + '" width="42" height="42"/></figure></div><div>' + e.awayTeamName + "</div></td></tr></tbody></table></div>";
                        r.html(I)
                    }
                }
            })
        }
    }
}, rppWR.tabsResult = function(a, e) {
    var t = $(a),
        s = e;
    if ("select" === s) {
        var r = $("option:selected", t),
            p = r.data("id"),
            i = t.val(),
            n = t.prev(),
            l = $(p),
            o = r.data("events"),
            c = $("option", t),
            d = (r.data("id"), n.children("li"));
        d.removeClass("active"), d.eq(i).addClass("active")
    } else {
        var p = t.data("id"),
            l = $(p),
            o = t.data("events"),
            m = t.data("value"),
            v = t.parent().next(),
            c = t.parent().find("li");
        c.data("id"), c.removeClass("active"), t.addClass("active"), v.val(m)
    }
    c.each(function(a, e) {
        $($(e).data("id")).css("display", "none")
    }), l.css("display", "block"), l.children(".owl-wrapper-outer").size() <= 0 && l.html('<script charset="utf-8">rppWR.read({events: "' + o + '", type: "agendaMaM", matchId: ""}).render({id:"' + p + '"});</script>');
    var u = $(p).find(".rppWR-header_result");
    u && u.each(function(a, e) {
        var t = $(e).data("status");
        if ("2" != t) {
            var s = u.index($(e)),
                r = $(p).data("owlCarousel");
            return r.goTo(parseInt(s)), !1
        }
    })
}, rppWR.rppGallery = function(a) {///PUSH STATE
    var site = a.comscore.site,
    name = a.comscore.name,
    epl_tag = (a.epl_tag)?a.epl_tag:[],
    posItem = a.posicion;
    posItem0 = a.posicion_slider;
    // var c = 1,
    //     d = document.URL,
    //     m = document.title,
    //     v = d.split("?"),
    //     u = v[0],
    //     h = v[1],
    //     f = "RightGal",
    //     R = ($("#gallery1"), $("#gallery1 .owl-wrapper")),
    //     W = ($("#gallery1 .owl-item"), R.children().length),
    //     g = posItem;
    //     gg = $('#gallery1 section').data('pos');
    //     y = parseInt(gg);

    //     // SCRIPT PARA VALIDAR NEXT PREV DESDE UN ENLACE COMPARTIDO
    //     var arrayUrl1 = u.split('/'),
    //     ultimoItem = arrayUrl1[arrayUrl1.length-1],
    //     tamanioItem = ultimoItem.length;
    //     // FIN SCRIPT




    function e(a) {
        // console.log(tamanioItem);
        var longitudParams = h.length;
        if(longitudParams < 1)
        {
            t(c + a), history.pushState(c, m, u + "/" + c + " " );       
        }
        else
        {
            t(c + a), history.pushState(c, m, u + "/" + c + "?" + h);   
        }

        // console.log(ultimoItem);
        
        if(epl_tag.length>0){
            for (var i = 0; i < epl_tag.length; i++) {
                try {
                    
                    eplDoc.epl.reloadSpace(epl_tag[i]);
                } catch (e) {
                    // console.log('No existe la posición: ' + epl_tag[i]);
                }
            }
        }
        try {
            udm_('http'+(document.location.href.charAt(4)=='s'?'s://sb':'://b')+'.scorecardresearch.com/b?c1=2&c2=6906613&ns_site=' + site +  '&name='+ name +'');
            // udm_("http" + ("s" == document.location.href.charAt(4) ? "s://sb" : "://b") + ".scorecardresearch.com/b?c1=2&c2=6906613&ns_site=" + site +  "&name=" + name + "");
        } catch (e) {
            // console.log("No se actualizo UDM")
        }
    }


    function t(a) {
        c = a
    }

    function s(a, e) {

        1 === e ? $(".gallery-list .owl-prev").addClass("desc") : e === a ? $(".gallery-list .owl-next").click(function(e){e.preventDefault();window.location = "http://la10.pe/galerias"}) : ($(".gallery-list .owl-prev").removeClass("desc"), $(".gallery-list .owl-next").removeClass("desc"))
        var dt = $('.gallery-list');
        $(dt).attr('data-pos',e);
    }
    
    var anchoPantalla = $(window).width();
    if(anchoPantalla > 1024)
    {
        $('#gallery1 .gallery-list').owlCarousel({
            singleItem: true,
            navigation: true,
            lazyLoad:true,
            addClassActive: true,
            mouseDrag: false
        });
    }
    else 
    {
        $('#gallery1 .gallery-list').owlCarousel({
            singleItem: true,
            navigation: true,
            lazyLoad: true,
            addClassActive: true,
            mouseDrag: true,
            afterMove: function(){
                var touch = this.dragDirection;
                if(touch == 'left'){
                    return e(1), g++, s(W, g), !1

                }else{
                    return e(-1), g--, s(W, g), !1
                }
            }
        });
    }

    var c = posItem,
        d = document.URL,
        m = document.title,
        v = d.split("?"),
        u = a.url,
        h = a.params,
        f = "RightGal",
        R = ($("#gallery1"), $("#gallery1 .owl-wrapper")),
        W = ($("#gallery1 .owl-item"), R.children().length),
        g = posItem;
        gg = $('#gallery1 section').data('pos');
        y = parseInt(gg);

        // SCRIPT PARA VALIDAR NEXT PREV DESDE UN ENLACE COMPARTIDO
        // FIN SCRIPT



    s(W, y), $(".gallery-list .owl-next").click(function() {
        return e(1), g++, s(W, g), !1

    }), $(".gallery-list .owl-prev").click(function() {
        return e(-1), g--, s(W, g), !1

    });
    var owl = $(".owl-carousel").data('owlCarousel');
    owl.goTo(posItem0);
};



















