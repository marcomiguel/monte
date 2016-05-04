var rppWR = window.rppWR || {};
window.rppWR = rppWR;
rppWR.version = '0.0.1';
rppWR.name = 'Widget Load Data Results - RPP';
rppWR.empty = '';
rppWR.urlBase = 'http://eventos.rpp.com.pe/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/';
rppWR.urlShields = 'http://cdn.datafactory.la/escudos_ch/';
rppWR.urlShieldsExt = 'http://eventos.rpp.com.pe/services/datafactory/escudos/';
rppWR.shieldsExt = 'png';
rppWR.loadData = function (count, datafile, callback) {
    var opt = { events: '', type: '', matchId: '' };
    opt = $.extend( opt, datafile );
    var data = { };
    if(opt.events != '' && opt.type != ''){
        //http://eventos.rpp.com.pe/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/uefa/agendaMaM/es/agenda.json?_=1429142338156
        //http://eventos.rpp.com.pe/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/uefa/events/211070.mam.json?_=1429142338157
        var optLower = (opt.type).toLowerCase();
        if(optLower === 'agendamam'){
            $.getJSON(rppWR.urlBase + opt.events + '/' + opt.type + '/es/agenda.json', function(data) {
                data = data;
                var _count = count;
                callback(data, _count);
            });
        }else if(optLower === 'mam' && opt.matchId != ''){
            $.getJSON(rppWR.urlBase + opt.events + '/events/' + opt.matchId + '.' + optLower + '.json', function(data) {
                data = data;
                var _count = count;

                callback(data, _count);
            });
        }else{
            var _count = count;
            callback(data, _count);
        }
    }else{
        var _count = count;
        callback(data, _count);
    }
}
rppWR.ifExist = function(val, result){
    var _val = val, _result = result,
    empty = rppWR.empty;
    if(_val != null){
        return _val;
    }else{
        return _result;
    }
}

rppWR.sizeJSON = function(json){
    var obj = json;
    if (!Object.keys) {
      Object.keys = function(obj) {
        var keys = [];
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            keys.push(i);
          }
        }
        return keys;
      };
    }
    return Object.keys(obj).length;
}

rppWR.loader = '<div class="loader_widget"></div>';

rppWR.buildAgendaMaM = function(data, obj, datafile){
    var data = data, obj = obj, events = data.events,
    datafile = datafile, _id = $(obj.id);
    _id.addClass('rppWR-wrap');
    _id.html('');
    if(events){
        var count = 0, arrCountAjax = [],
        sizeEvents = rppWR.sizeJSON(events), _html2 = '';
        for(key in events) {
          var statusId = events[key].statusId,
          keySplit = key.split('.'),
          matchId = (keySplit)[keySplit.length-1];
          //console.log(statusId, 'statusId');
          count++;
          var _count = count;

          _id.append('<div class="rppWR-box_result">'+rppWR.loader+'</div>');

          rppWR.loadData(_count, {events: datafile.events, type: 'MaM', matchId: matchId}, function(data, count){
              var data = data, __count = count;
              if(data){

                  var xDateArr = (data.match.date).split('');
                  if(xDateArr){
                      var xDateYear = xDateArr.slice(0,4).join(''),
                      xDateMonth = xDateArr.slice(4,6).join(''),
                      xDateDay = xDateArr.slice(6,8).join(''),
                      _date = xDateDay + '/' + xDateMonth + '/' + xDateYear;
                  }else{
                      var _date = '';
                  }

                  _html2 = ''+
                      '<div class="rppWR-header_result">'+data.match.week+'</div>'+
                      '<div class="rppWR-time_result">'+data.match.dayName+' '+_date+' &nbsp;Hora: ' + data.match.scheduledStart +'</div>';
                    var statusId = parseInt(data.status.statusId);
                    if(statusId === 0){
                        _html2 += '<div class="rppWR-status_result rppWR-statusid-0">Por Iniciar</div>';
                    }else if(statusId === 1){
                        _html2 += '<div class="rppWR-status_result rppWR-statusid-1">En Vivo</div>';
                    }else if(statusId === 2){
                        _html2 += '<div class="rppWR-status_result rppWR-statusid-2">Finalizado</div>';
                    }
                  _html2 +=  '<table class="rppWR-table"><tbody>'+
                           '<tr>'+
                               '<td class="rppWR-td1">'+
                                       '<img src="'+ rppWR.urlShields +
                                       data.match.homeTeamId +
                                       '.gif" alt="'+ data.match.homeTeamName +'" />'+
                               '</td>'+
                               '<td class="rppWR-td2">'+ data.match.homeTeamName +
                               '</td>'+
                               '<td class="rppWR-td3">'+ rppWR.ifExist(data.scoreStatus[data.match.homeTeamId].score, '-')+'</td>'+
                           '</tr>'+
                           '<tr>'+
                               '<td class="rppWR-td1">'+
                                       '<img src="'+ rppWR.urlShields +
                                       data.match.awayTeamId +
                                       '.gif" alt="'+ data.match.awayTeamName +'" />'+
                               '</td>'+
                               '<td class="rppWR-td2">'+ data.match.awayTeamName +
                               '</td>'+
                               '<td class="rppWR-td3">'+ rppWR.ifExist(data.scoreStatus[data.match.awayTeamId].score, '-')+'</td>'+
                           '</tr>'+
                       '</tbody></table>'+
                  '';
              }

              //Add HTML
              $(obj.id).find('.rppWR-box_result').eq(__count-1).html(_html2);
              //Add Push
              arrCountAjax.push([__count, _html2]);
              //Finsh last AJAX JSON

          });
        }

        //Carousel
        var owl = _id;
        _id.owlCarousel({
            items : 4,
            navigation : true,
            slideSpeed : 300,
            paginationSpeed : 400,
            autoPlay: true
        });
        //Iconos Nav
        owl.find('.owl-prev').html('<i class="icon icon-angle-left"></i>');
        owl.find('.owl-next').html('<i class="icon icon-angle-right"></i>');
    }
}

rppWR.read = function(datafile){
    //Build & Read
    var datafile = datafile;
    //Return functions
    return {
        render : function(obj){
            var obj = obj, count = 0;
            $(obj.id).html(rppWR.loader);
            rppWR.loadData(count, datafile, function(data, count){
                var data = data;
                rppWR.buildAgendaMaM(data, obj, datafile);
            });
        },
        renderInterval : function(obj){
            var obj = obj, count = 0, _id = $(obj.id);
            _id.html(rppWR.loader);
            rppWR.loadData(count, datafile, function(data, count){
                var data = data;
                if(data){
                    var scoreHome = (data.scoreStatus[data.match.homeTeamId].score != null)?data.scoreStatus[data.match.homeTeamId].score:0,
                    scoreAway = (data.scoreStatus[data.match.awayTeamId].score != null)?data.scoreStatus[data.match.awayTeamId].score:0,
                    _url = (obj.url)?obj.url:'';

                    var _html = '<div class="rppWR-cntMatch">'+
                        '<table><tbody>'+
                        '<tr>'+
                            '<td class="rppWR-td1">'+
                                '<div>'+
                                  '<figure><img src="'+ rppWR.urlShieldsExt +
                                  data.match.homeTeamId +
                                  '.'+rppWR.shieldsExt+'" alt="'+ data.match.homeTeamName +'" /></figure>'+
                                '</div>'+
                                '<div>'+data.match.homeTeamName+'</div>'+
                            '</td>'+
                            '<td class="rppWR-td2">'+
                            '<div class="rppWR-center">';
                                var statusId = parseInt(data.status.statusId);
                                if(statusId === 0){
                                    _html += '<div class="rppWR-info-vs rppWR-info-0">'+
                                        '<a href="'+ _url +'"><span class="rppWR-type"> <i class="futbolicon-por-iniciar"></i> POR INICIAR </span>'+
                                        '<span class="rppWR-league">'+ data.match.league + '</span></a>'+
                                    '</div>';
                                }else if(statusId === 2){
                                    _html += '<div class="rppWR-info-vs rppWR-info-2">'+
                                    '<a href="'+ _url +'"><span class="rppWR-type"> <i class="futbolicon-finalizado"></i> FINALIZADO </span>'+
                                        '<span class="rppWR-league">'+ data.match.league + '</span></a>'+
                                    '</div>';
                                }else{
                                    _html += '<div class="rppWR-info-vs">'+
                                    '<a href="'+ _url +'"><span class="rppWR-type"> <i class="futbolicon-en-vivo"></i> EN VIVO </span>'+
                                        '<span class="rppWR-league">'+ data.match.league + '</span></a>'+
                                    '</div>';
                                }
                                _html += '<div class="rppWR-vs-resutls"><a href="'+ _url +'">' +
                                    '<span class="rppWR-vs-goal">'+scoreHome + '</span>' +
                                    '<span class="rppWR-vs-separator">x</span>'+
                                    '<span class="rppWR-vs-goal">'+ scoreAway +'</a></span>'+
                                '</div>'+
                            '</td>'+
                            '<td class="rppWR-td3">'+
                                '<div>'+
                                  '<figure><img src="'+ rppWR.urlShieldsExt +
                                  data.match.awayTeamId +
                                  '.'+rppWR.shieldsExt+'" alt="'+ data.match.awayTeamName +'" /></figure>'+
                                '</div>'+
                                '<div>'+data.match.awayTeamName+'</div>'+
                            '</td>'+
                        '</tr>'+
                        '</tbody></table>'+
                        /*
                        '<div class="time-vs">'+parseInt(data.status.statusId) + ' - ' + data.match.week + ' - ' + data.match.competition + '</div>'+
                        '<div class="shield-vs">'+
                          '<div class="shield">'+
                            '<figure><img src="'+ rppWR.urlShields +
                            data.match.homeTeamId +
                            '.gif" alt="'+ data.match.homeTeamName +'" /></figure>'+
                          '</div>'+
                          '<div class="vs"><span>'+data.scoreStatus[data.match.homeTeamId].score +' </span><span>x </span><span>'+data.scoreStatus[data.match.awayTeamId].score +'</span></div>'+
                          '<div class="shield">'+
                          '<figure><img src="'+ rppWR.urlShields +
                          data.match.awayTeamId +
                          '.gif" alt="'+ data.match.awayTeamName +'" /></figure>'+
                          '</div>'+
                        '</div>'+
                        '<div class="team-vs-name">'+
                          '<div class="team-name team-left">'+
                            '<h2>'+data.match.homeTeamName +'</h2>'+
                          '</div>'+
                          '<div class="team-name team-right">'+
                            '<h2>'+data.match.awayTeamName +'</h2>'+
                          '</div>'+
                        '</div>'+*/
                    '</div>';
                    _id.html(_html);
                }
                //console.log(data, 'data');
                //rppWR.buildAgendaMaM(data, obj, datafile);
            });
        }
    }

}
//Method Load Data
//rppWR.read({events: 'champions', type: 'agendaMaM', matchId: ''}).render({id:'#cntFixture'});


//RPP TABS
rppWR.tabsResult = function(t, type){
  var _t = $(t),
  _type = type;
  if(_type === 'select'){
    var slc = $('option:selected', _t);
    var _id = slc.data('id'),
    __value = _t.val(),
    __tabs = _t.prev(),
    __id = $(_id),
    _events = slc.data('events'),
    _li = $('option', _t),
    _wrap = slc.data('id');
    var _tabLi = __tabs.children('li');
    _tabLi.removeClass('active');
    _tabLi.eq(__value).addClass('active');
  }else{
    var _id = _t.data('id'),
    __id = $(_id),
    _events = _t.data('events'),
    _value = _t.data('value'),
    _select = _t.parent().next(),
    _li = _t.parent().find('li'),
    _wrap = _li.data('id');
    _li.removeClass('active');
    _t.addClass('active');
    _select.val(_value);
  }
  _li.each(function(i,v){
    $($(v).data('id')).css('display','none');
  });
  __id.css('display','block');
  if(__id.children('.owl-wrapper-outer').size()<=0){
    __id.html('<script charset="utf-8">rppWR.read({events: "'+
    _events +'", type: "agendaMaM", matchId: ""}).render({id:"'+
    _id +'"});</script>');
  }
}


/*tabsResult: function(e) {
    var t = $(e), a = parseInt($(t).val()), o = "active", i = t.parents('[data-toggle="tabs-result"]').find('[data-item="item-result"]');
    i.removeClass(o);
    var n = i.eq(a);
    if (n.addClass(o), !n.find("iframe").length > 0) {
        var s = $("option:selected", e).data("iframe");
        n.html("").html('<section class="widget widget-resutl"><iframe scrolling="no" src="' + s + '"></iframe></section>')
    }
}*/

/*window.rppWidget = {};
rppWidget.copainca_fixture = {};
function loadRemoteData(url, id) {
  var script = document.createElement("script");
  script.setAttribute("type","text/javascript");
  script.setAttribute("id",id);
  script.setAttribute("src", url);
  document.getElementsByTagName("head")[0].appendChild(script);
}
rppWidget.copainca_fixture.data = function (jsonResult) {
    console.log(jsonResult, 'jsonResult'); //alert the JSON as a string
}
// make a request for the data using the script tag remoting approach.
loadRemoteData("http://deveventos.rpp.com.pe/services/datafactory/json/copainca/deportes.futbol.copainca.fixture.js?callback=0", "xml-live-0");
*/
