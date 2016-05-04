$(function(){
    //a[60-100] m[35-59] b[0-34]
  var region_focused_name = null;

  $('#mapa-peru').vectorMap({
  	map: 'peru',
    zoom: 12,
    backgroundColor: null,
    borderColor: '#fff',
    borderOpacity: 1,
    borderWidth: 1,
    color: '#ffffff',
    selectedColor: null,
    enableZoom: false,
    showTooltip: true,
    hoverColor: null,
    hoverBorderColor: '#000',
    hoverBorderWidth: 4,
    hoverOpacity: null,
    /*values: sample_data,*/
    normalizeFunction: 'linear',
  	onLabelShow : function(event, label, code) {
      var votos = obj_votos['response']['dpt'];
      var votos_region = votos[code];
      region_focused_name = label.html();
      var div = '<div class="infowindow">'+
                  '<h3>'+region_focused_name+'</h3>'+
                  '<table>'+
                    '<thead>'+
                      '<th>Candidato</th>'+
                      '<th>Votos</th>'+
                      '<th>PCT</th>'+
                    '</thead>'+
                    '<tbody>';
              
      for(id in votos_region){
        var obj = votos_region[id];
        var porcentaje_ganador = obj['porcentaje'];
        div +=  '<tr>'+
                  '<td>'+ id +'</td>'+
                  '<td>'+ obj['votos'] +'</td>'+
                  '<td>'+ porcentaje_ganador +'</td>'+
                '</tr>';
        //actualizar info candidatos si es movil
        if(window.screen.availWidth <= 768){
          var article = $('article'+'.'+id);
          article.find("span").css( "width", porcentaje_ganador );
          article.find(".cifra").text(porcentaje_ganador);
          article.find(".votos").text(obj);
        }
      }
      div += '</tbody>'+
          '</table>'+
        '</div>';
      label.html(div);

      if(window.screen.availWidth <= 768){
        ordenar_candidatos();
        $(".referencia h1").text(region_focused_name);
      }

      /*$("#mapa-peru path").each(function (index, value) {
        this.setAttribute('fill', null);
      });*/

    },
    onResize: function(element, width, height) {
      console.log('Map Size: ' +  width + 'x' +  height);
    },
    onRegionClick: function(event, code, region){
      event.preventDefault();
      $('#mapa-peru').vectorMap('select', code);
    },
    onRegionSelect: function(event, code, region){
      if(window.screen.availWidth <= 768){ return false };
      var votos = obj_votos['response']['dpt'];
      var votos_region = votos[code];
      for(id in votos_region){
        var obj = votos_region[id];
        var porcentaje_ganador = obj['porcentaje'];
        var article = $('article'+'.'+id);
        article.find("span").css( "width", porcentaje_ganador );
        article.find(".cifra").text(porcentaje_ganador);
        article.find(".votos").text(numberWithSpaces(obj['votos']));
        article.find(".votos").data('votos', obj['votos']);
      }
      ordenar_candidatos();
      $(".referencia h1").text(region_focused_name);
    }
  });

  $( ".menu-lista" ).on( "click", ".candidato", function() {
    var candidato = $(this);
    var id = candidato.data('candidato');
    var arr = {};
    var votos = obj_votos['response']['dpt'];
    for(var v in votos){
      var obj = votos[v];
      var porcentaje_ganador = obj[id]['porcentaje'];
      var color = obtener_color(id, porcentaje_ganador);
      arr[v] = color;
    }
    $('#mapa-peru').vectorMap('set', 'colors', arr);
  });

  $(".referencia .volver").click(function(){
    total_votos();
    dibujar_candidatos();
    $(".referencia h1").text("Total nacional");
  });

  total_votos();
  dibujar_candidatos();

});

var color = {
    '4': {a:'#f78850', m:'#ff8f39', b:'#ffa764'}, //orange
    '10': {a:'#e9cb47', m:'#ffde71', b:'#ffe89b'}, //yellow
    '5': {a:'#e23c3c', m:'#f29595', b:'#ffc4c4'}, //red
    '12': {a:'#9787b7', m:'#c0b6d6', b:'#e5e0ee'}, //purple
    '6': {a:'#35bcff', m:'#5fcbff', b:'#8dd9fe'}, //blue
    '11': {a:'#64a664', m:'#92c592', b:'#c0dec0'} //green
};

function total_votos(){
  var arr = {};
  var votos = obj_votos['response']['dpt'];

  for(var v in votos){
    var obj = votos[v];
    var candidato_ganador = Object.keys(obj).reduce(function(a, b){ return obj[a]['votos'] > obj[b]['votos'] ? a : b });
    var porcentaje_ganador = obj[candidato_ganador]['porcentaje'];
    var color = obtener_color(candidato_ganador, porcentaje_ganador);
    arr[v] = color;
  }
  $('#mapa-peru').vectorMap('set', 'colors', arr);
};

function sum( obj ) {
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
};

function obtener_color(candidato_id, porcentaje){
  var key = null;
  if(porcentaje < 34)
    key = 'b';
  else if(porcentaje > 34 && porcentaje < 60)
    key = 'm';
  else
    key = 'a';
  return color[candidato_id][key];
};

function dibujar_candidatos(){
  $('.menu-lista').html("");
  var candidatos = obj_candidatos['response'];

  for( var c in candidatos ) {
    var cand = candidatos[c];
    var general = obj_votos['response']['dpt']['general'];

    var article = $('<article>', {'class': 'candidato '+cand['id'], 'data-candidato': cand['id']});
    var div_foto = $('<div>', {'class': 'foto'});
    $('<img>', {'src': cand['foto'], 'alt': cand['id']}).appendTo(div_foto);
    var div_descripcion = $('<div>', {'class': 'descripcion'});
    var div_info_candidato = $('<div>', {'class': 'info-candidato'});
    $('<div>', {'class': 'nombre', 'text': cand['nombre']}).appendTo(div_info_candidato);
    $('<div>', {'class': 'partido', 'text': cand['partido']}).appendTo(div_info_candidato);
    var div_porcentaje = $('<div>', {'class': 'porcentaje'});
    var div_meter = $('<div>', {'class': 'meter nostripes '+cand['color-class']});
    $('<span>', {'style': 'width: 100%' }).appendTo(div_meter);
    div_meter.appendTo(div_porcentaje);
    var div_cifra = $('<div>', {'class': 'cifra', 'text': general[cand['id']]['porcentaje'] });
    div_cifra.appendTo(div_porcentaje);
    var div_votos = $('<div>', {'class': 'votos', 'text': numberWithSpaces( general[cand['id']]['votos'] ), 'data-votos': general[cand['id']]['votos'] });
    div_info_candidato.appendTo(div_descripcion);
    div_porcentaje.appendTo(div_descripcion);
    div_votos.appendTo(div_descripcion);
    div_foto.appendTo(article);
    div_descripcion.appendTo(article);
    article.appendTo($('.menu-lista'));
  }

  var escrutado = obj_votos['response'];
  //blancos, nulos e impugnados
  var blanco = $('.escrutado .item.blanco');
  blanco.find("span").css( "width", "100%");
  blanco.find(".cifra").text(escrutado['blanco']['porcentaje']);
  blanco.find(".votos").text(numberWithSpaces(escrutado['blanco']['votos']));
  blanco.find(".votos").data('votos', escrutado['blanco']['porcentaje']);
  var nulos = $('.escrutado .item.nulos');
  nulos.find("span").css( "width", "100%");
  nulos.find(".cifra").text(escrutado['nulos']['porcentaje']);
  nulos.find(".votos").text(numberWithSpaces(escrutado['nulos']['votos']));
  nulos.find(".votos").data('votos', escrutado['nulos']['porcentaje']);
  var impugnados = $('.escrutado .item.impugnados');
  impugnados.find("span").css( "width", "100%");
  impugnados.find(".cifra").text(escrutado['impugnados']['porcentaje']);
  impugnados.find(".votos").text(numberWithSpaces(escrutado['impugnados']['votos']));
  impugnados.find(".votos").data('votos', escrutado['impugnados']['porcentaje']);

  ordenar_candidatos();

};

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function ordenar_candidatos(){
  $("#menu-lista article").sort(sort_article).appendTo('#menu-lista');
  //porcentajes
  var major_prop = $(".menu article:first").find(".cifra").text();
  $(".menu article").each(function( index ) {
    var elem = $(this);
    var porcentaje = elem.find(".cifra").text();
    var proporcion = Math.round((porcentaje/major_prop)*100*100)/100+'%';
    elem.find("span").css( "width", proporcion);
  });
};

function sort_article(a, b){
  return (parseInt($(b).find(".votos").data("votos"))) > (parseInt($(a).find(".votos").data("votos"))) ? 1 : -1;    
};