var rppWR = window.rppWR || {};
window.rppWR = rppWR,
    rppWR.version = "0.0.2",
    rppWR.name = "Widget Load Data Results - RPP",
    rppWR.empty = "",
    rppWR.urlBase = "http://deveventos.old.rpp-noticias.io/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/",
    rppWR.urlShields = "http://cdn.datafactory.la/escudos_ch/",
    rppWR.urlShieldsExt = "http://deveventos.old.rpp-noticias.io/services/datafactory/escudos/",
    rppWR.shieldsExt = "png",
    rppWR.isIEVersion = function() {
        var a = navigator.userAgent.toLowerCase();
        return -1 != a.indexOf("msie") ? parseInt(a.split("msie")[1]) : !1
    },
    rppWR.isIEVersion() <= 9 && ! function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
    }(function(a) {
        if(!a.support.cors && a.ajaxTransport && window.XDomainRequest) {
            var e = /^https?:\/\//i,
                t = /^get|post$/i,
                s = new RegExp("^" + location.protocol, "i");
            a.ajaxTransport("* text html xml json", function(r, p) {
                if(r.crossDomain && r.async && t.test(r.type) && e.test(r.url) && s.test(r.url)) {
                    var i = null;
                    return {
                        send: function(e, t) {
                            var s = "",
                                l = (p.dataType || "").toLowerCase();
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
                                    if("html" === l || /text\/html/i.test(i.contentType)) r.html = i.responseText;
                                    else if("json" === l || "text" !== l && /\/json/i.test(i.contentType)) try {
                                        r.json = a.parseJSON(i.responseText)
                                    } catch(p) {
                                        s.code = 500, s.message = "parseerror"
                                    } else if("xml" === l || "text" !== l && /\/xml/i.test(i.contentType)) {
                                        var n = new ActiveXObject("Microsoft.XMLDOM");
                                        n.async = !1;
                                        try {
                                            n.loadXML(i.responseText)
                                        } catch(p) {
                                            n = void 0
                                        }
                                        if(!n || !n.documentElement || n.getElementsByTagName("parsererror").length) throw s.code = 500, s.message = "parseerror", "Invalid XML: " + i.responseText;
                                        r.xml = n
                                    }
                                } catch(o) {
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
    }),
    rppWR.loadData = function(a, e, t) {
        var s = {
            events: "",
            type: "",
            matchId: ""
        };
        s = $.extend(s, e);
        var r = {},
            p = (new Date).getTime();
        if("" != s.events && "" != s.type) {
            var i = s.type.toLowerCase();
            if($.support.cors = !0, "agendamam" === i) $.getJSON(rppWR.urlBase + s.events + "/" + s.type + "/es/agenda.json?v=" + p, function(e) {
                e = e;
                var s = a;
                t(e, s)
            });
            else if("mam" === i && "" != s.matchId) $.getJSON(rppWR.urlBase + s.events + "/events/" + s.matchId + "." + i + ".json?v=" + p, function(e) {
                e = e;
                var s = a;
                t(e, s);
            }).fail(function() {
                e = 'error';
                var s = a;
                t(e, s);
            });
            else {
                var l = a;
                t(r, l)
            }
        } else {
            var l = a;
            t(r, l)
        }
    },
    rppWR.ifExist = function(a, e) {
        var t = a,
            s = e;
        return rppWR.empty, null != t ? t : s
    },
    rppWR.sizeJSON = function(a) {
        var e = a;
        return Object.keys || (Object.keys = function(a) {
            var e = [];
            for(var t in a) a.hasOwnProperty(t) && e.push(t);
            return e
        }), Object.keys(e).length
    },
    rppWR.loader = '<div class="loader_widget"></div>',
    rppWR.buildAgendaMaM = function(a, e, t) {
        var a = a,
            e = e,
            s = a.events,
            t = t,
            r = $(e.id);
            console.log(a);
        if(r.addClass("rppWR-wrap"), r.html(""), s) {
            var p = 0,
                i = [],
                l = (rppWR.sizeJSON(s), ""),
                n = rppWR.sizeJSON(s);
            for(key in s) {
                var o = (s[key].statusId, key.split(".")),
                    c = o[o.length - 1];
                p++;
                var d = p;
                r.append('<div id="rppID_'+(key.split('.')).pop()+'" class="rppWR-box_result">' + rppWR.loader + "</div>");
                rppWR.loadData(d, {
                    events: t.events,
                    type: "MaM",
                    matchId: c
                }, function(a, t) {
                    var a = a,
                        s = t;
                    if(a === 'error'){
                        //OCULTANDO ERRORES
                        $(e.id).find(".rppWR-box_result").eq(s - 1).css('display', 'none');
                    }else{
                        if(a) {
                            var r = a.match.date.split("");
                            if(r) var p = (r.slice(0, 4).join(""), r.slice(4, 6).join("")),
                                q = r.slice(0, 4).join(""),
                                o = r.slice(6, 8).join(""),
                                c = o + "-" + p;
                            else var c = "";
                            var d = a.match.scheduledStart;
                            if(d && ":" != d) {
                                var v = d.split(":"),
                                    u = v[0],
                                    m = v[1],
                                    h = "Hora:";
                                h + "&nbsp;" + (parseInt(u) - 2) + ":" + m
                            }
                            l = '<div data-status="' + a.status.statusId + '" class="rppWR-header_result"><span>' + a.match.week.split("-")[0] + '</span></span></div><div class="rppWR-time_result">' + q + "-" + c + "</div>";
                              var f = parseInt(a.status.statusId);
                            0 === f ? l += '<div class="rppWR-status_result rppWR-statusid-0">Por Iniciar</div>' : 1 === f || 5 === f || 6 === f ? l += '<div class="rppWR-status_result rppWR-statusid-1">En Vivo</div>' : 2 === f && (l += '<div class="rppWR-status_result rppWR-statusid-2">Finalizado</div>'), l += '<table class="rppWR-table"><tbody><tr><td class="rppWR-td1"><img src="' + rppWR.urlShields + a.match.homeTeamId + '.gif" alt="' + a.match.homeTeamName + '" /></td><td class="rppWR-td2">' + a.match.homeTeamName + '</td><td class="rppWR-td3">' + rppWR.ifExist(a.scoreStatus[a.match.homeTeamId].score, "-") + '</td></tr><tr><td class="rppWR-td1"><img src="' + rppWR.urlShields + a.match.awayTeamId + '.gif" alt="' + a.match.awayTeamName + '" /></td><td class="rppWR-td2">' + a.match.awayTeamName + '</td><td class="rppWR-td3">' + rppWR.ifExist(a.scoreStatus[a.match.awayTeamId].score, "-") + "</td></tr></tbody></table>"
                        }
                        if($(e.id).find(".rppWR-box_result").eq(s - 1).html(l),
                        i.push([s, l]),
                        i.length === n) {
                            var g = $(e.id).find(".rppWR-header_result");
                            g.each(function(a, t) {
                                var s = $(t).data("status");
                                if("2" != s) {
                                    var r = g.index($(t)),
                                        p = $(e.id).data("owlCarousel");
                                    return p.goTo(parseInt(r)), !1
                                }
                            })
                        }
                    }
                })
            }
            var v = r;
            r.owlCarousel({
                items: 4,
                navigation: !0,
                slideSpeed: 300,
                paginationSpeed: 400,
                autoPlay: !0
            });
            v.find(".owl-prev").html('<i class="icon-13"></i>');
            v.find(".owl-next").html('<i class="icon-14"></i>');
        }
    },
    rppWR.read = function(a) {
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
                    if(a) {
                        var t = null != a.scoreStatus[a.match.homeTeamId].score ? a.scoreStatus[a.match.homeTeamId].score : rppWR.empty,
                            r = null != a.scoreStatus[a.match.awayTeamId].score ? a.scoreStatus[a.match.awayTeamId].score : rppWR.empty,
                            p = e.url ? e.url : "",
                            i = "copainca" === a.match.channel ? "Torneo del Inca" : a.match.competition,
                            l = t === rppWR.empty && r === rppWR.empty ? "vs" : "x",
                            n = '<div class="rppWR-cntMatch"><table><tbody><tr><td class="rppWR-td1"><div><figure><img src="' + rppWR.urlShieldsExt + a.match.homeTeamId + "." + rppWR.shieldsExt + '" alt="' + a.match.homeTeamName + '" /></figure></div><div>' + a.match.homeTeamName + '</div></td><td class="rppWR-td2"><div class="rppWR-center">',
                            o = parseInt(a.status.statusId);
                        n += 0 === o ? '<div class="rppWR-info-vs rppWR-info-0"><a href="' + p + '"><span class="rppWR-type"> <i class="futbolicon-por-iniciar"></i> POR INICIAR </span><span class="rppWR-league">' + i + "</span></a></div>" : 2 === o ? '<div class="rppWR-info-vs rppWR-info-2"><a href="' + p + '"><span class="rppWR-type"> <i class="futbolicon-finalizado"></i> FINALIZADO </span><span class="rppWR-league">' + i + "</span></a></div>" : '<div class="rppWR-info-vs"><a href="' + p + '"><span class="rppWR-type"> <i class="futbolicon-en-vivo"></i> EN VIVO </span><span class="rppWR-league">' + i + "</span></a></div>", n += '<div class="rppWR-vs-resutls"><a href="' + p + '"><span class="rppWR-vs-goal">' + t + '</span><span class="rppWR-vs-separator">' + l + '</span><span class="rppWR-vs-goal">' + r + '</a></span></div></td><td class="rppWR-td3"><div><figure><img src="' + rppWR.urlShieldsExt + a.match.awayTeamId + "." + rppWR.shieldsExt + '" alt="' + a.match.awayTeamName + '" /></figure></div><div>' + a.match.awayTeamName + "</div></td></tr></tbody></table></div>", s.html(n)
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
                    if(a) {
                        var e = a.match;
                        if(e) {
                            var s = e.date.split("");
                            if(s) var p = s.slice(0, 4).join(""),
                                i = s.slice(4, 6).join(""),
                                l = s.slice(6, 8).join(""),
                                n = l + "/" + i + "/" + p;
                            else var n = "";
                            var o = e.scheduledStart;
                            if(o && ":" != o) var c = o.split(":"),
                                d = c[0],
                                v = c[1],
                                u = "",
                                m = u + "&nbsp;" + (parseInt(d) - 2) + ":" + v;
                            else var m = "";
                            var h = "",
                                f = [];
                            $.each(a.officials, function(a, e) {
                                f.push(e.name.first + " " + e.name.last)
                            }), h = f.length > 0 ? f.join("<br />") : "";
                            var g = "",
                                R = "",
                                W = [],
                                y = [];
                            $.each(a.incidences.goals, function(a, t) {
                                t.team === e.awayTeamId ? y.push(t.plyrName + " (" + t.t.m + '")') : t.team === e.homeTeamId && W.push(t.plyrName + " (" + t.t.m + '")')
                            }), g = W.length > 0 ? W.join("<br />") : "", R = y.length > 0 ? y.join("<br />") : "", golEq1 = null === a.scoreStatus[e.homeTeamId].score ? "-" : a.scoreStatus[e.homeTeamId].score, golEq2 = null === a.scoreStatus[e.awayTeamId].score ? "-" : a.scoreStatus[e.awayTeamId].score;
                            a.scoreStatus;
                            l = parseInt(a.status.statusId)//, 0 == l ? l = 'poriniciar' : 1 == l ? l = 'envivo' : 2 == l && (l = 'finalizado');
                            if(l == 0){
                                l = 'poriniciar';
                            }else if(l == 2){
                                l = 'finalizado';
                            }else{
                                l = 'envivo';
                            }
                            var w = parseInt(a.status.statusId);
                            w = 0 == w ? '<span class="rppWR-vs-goal">-</span><span class="rppWR-vs-separator">x</span><span class="rppWR-vs-goal">-</span>' : '<span class="rppWR-vs-goal">' + golEq1 + '</span><span class="rppWR-vs-separator">x</span><span class="rppWR-vs-goal">' + golEq2 + "</span>";
                            var sts = parseInt(a.status.statusId);
                            var I =
                            '<a href="' + t + '" class="' + l + '">' +
                                '<div class="fv">En vivo</div>' + 
                                '<time class="cb-time" data-status="' + sts + '">'+ " " + n + " " + m + " " + '</time>'+
                                '<div class="team-home">'+
                                    '<img src="'+ rppWR.urlShieldsExt + e.homeTeamId +'.png" alt="'+ rppWR.urlShieldsExt + e.homeTeamId +'" width="42" height="42"/>'+
                                    '<span>'+ golEq1 +'</span>'+
                                    '<div class="nom-cb">'+ e.homeTeamName +'</div>'+
                                '</div>'+
                                '<strong>VS</strong>'+
                                '<div class="team-visitor">'+
                                    '<img src="' + rppWR.urlShieldsExt + e.awayTeamId + '.png" alt="'+ rppWR.urlShieldsExt + e.awayTeamId +'" width="42" height="42"/>'+
                                    '<span>' + golEq2 + '</span>'+
                                    '<div class="nom-cb">'+ e.awayTeamName +'</div>'+
                                '</div>';
                            '</a>'
                              //'<div class="rppWR-cntMatch"><table><thead><tr><td class="rppWR-tdh1" colspan="3"><span>' + "</span><time> " + e.dayName + " " + n + " " + m + '</time></td></tr></thead><tbody><tr><td class="rppWR-td1"><div><figure><img src="' + rppWR.urlShieldsExt + e.homeTeamId + '.svg" alt="' + e.homeTeamName + '" width="42" height="42"/></figure></div><div>' + e.homeTeamName + '</div></td><td class="rppWR-td2"><div class="rppWR-center">' + l + '<div class="rppWR-vs-resutls"><a href="">' + w + '</a></div></div></td><td class="rppWR-td3"><div><figure><img src="' + rppWR.urlShieldsExt + e.awayTeamId + '.svg" alt="' + e.awayTeamName + '" width="42" height="42"/></figure></div><div>' + e.awayTeamName + "</div></td></tr></tbody></table></div>";
                            r.html(I)
                        }
                    }
                })
            }
        }
    }






/*'<div class="rppWR-cntMatch"><table><thead><tr><td class="rppWR-tdh1" colspan="3"><span>' + e.week + "</span><time> " + e.dayName + " " + n + " " + m + '</time></td></tr></thead><tbody><tr><td class="rppWR-td1"><div><figure><img src="' + rppWR.urlShieldsExt + e.homeTeamId + '.svg" alt="' + e.homeTeamName + '" width="42" height="42"/></figure></div><div>' + e.homeTeamName + '</div></td><td class="rppWR-td2"><div class="rppWR-center">' + l + '<div class="rppWR-vs-resutls"><a href="">' + w + '</a></div></div></td><td class="rppWR-td3"><div><figure><img src="' + rppWR.urlShieldsExt + e.awayTeamId + '.svg" alt="' + e.awayTeamName + '" width="42" height="42"/></figure></div><div>' + e.awayTeamName + "</div></td></tr></tbody></table></div>";

    var oHTML =
        '<time class="cb-time">'+ " " + n + " " + m + " " + '</time>'+
        '<div class="team-home">'+
            '<img src="'+ rppWR.urlShieldsExt + e.homeTeamId +'.png" alt="'+ rppWR.urlShieldsExt + e.homeTeamId +'" width="42" height="42"/>'+
            '<span>'+ l +'</span>'+
            '<div class="nom-cb">'+ e.homeTeamName +'</div>'+
        '</div>'+
        '<span>VS</span>'+
        '<div class="team-visitor">'+
            '<img src="' + rppWR.urlShieldsExt + e.awayTeamId + '.png" alt="'+ rppWR.urlShieldsExt + e.awayTeamId +'" width="42" height="42"/>'+
            '<span>' + w + '</span>'+
            '<div class="nom-cb">'+ e.awayTeamName +'</div>'+
        '</div>';
    s.html(oHTML);*/
