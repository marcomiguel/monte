//data default
var JSrpp = {
  fuente : 'ONPE',
  departamento : 'general',
  candidato: null
};
//validar departamento
var departamentos = [
  {'nombre': 'General', 'slug': 'general'},
  {'nombre': 'Amazonas', 'slug': 'ama'}, {'nombre': 'Ancash', 'slug': 'anc'}, {'nombre': 'Apurimac', 'slug': 'apu'}, {'nombre': 'Arequipa', 'slug': 'are'}, {'nombre': 'Ayacucho', 'slug': 'aya'},
  {'nombre': 'Cajamarca', 'slug': 'caj'}, {'nombre': 'Callao', 'slug': 'cal'}, {'nombre': 'Cusco', 'slug': 'cus'}, {'nombre': 'Huancavelica', 'slug': 'huc'}, {'nombre': 'Huanuco', 'slug': 'hua'},
  {'nombre': 'Ica', 'slug': 'ica'}, {'nombre': 'Junin', 'slug': 'jun'}, {'nombre': 'La Libertad', 'slug': 'lal'}, {'nombre': 'Lambayeque', 'slug': 'lam'}, {'nombre': 'Lima', 'slug': 'lim'},
  {'nombre': 'Lima Provincia', 'slug': 'lpr'},
  {'nombre': 'Loreto', 'slug': 'lor'}, {'nombre': 'Madre De Dios', 'slug': 'mdd'}, {'nombre': 'Moquegua', 'slug': 'moq'}, {'nombre': 'Pasco', 'slug': 'pas'}, {'nombre': 'Piura', 'slug': 'piu'},
  {'nombre': 'Puno', 'slug': 'pun'}, {'nombre': 'San Martin', 'slug': 'sam'}, {'nombre': 'Tacna', 'slug': 'tac'}, {'nombre': 'Tumbes', 'slug': 'tum'}, {'nombre': 'Ucayali', 'slug': 'uca'}
];

var obj_candidatos = [];
var obj_votos = {};
var obj_encuestadoras = {};
var obj_porcentajes = [];
var url_host = null;
var local_path = null;
try {
  url_host = stage_file;
  //url_host = "http://p-gruporpp-media.s3.amazonaws.com/";
}catch(err){
  url_host = "http://dev-rpp-media.s3-us-west-2.amazonaws.com/";
}

try{
  local_path = url_path;
}catch(err){
  local_path = "http://dev.rpp.pe/elecciones-peru-2016/resultados-presidenciales";
}


JSrpp.renderHistoryLine = function(index){

  setTimeout(function(){
      if(obj_porcentajes.length == 0){ return; }

      var template = $('<div class="line-status"><div class="line-red"></div><div class="porcentaje">%</div></div>'),
          points = '';

      $.each(obj_porcentajes, function(ix){
          var point =  this;
          var $pointHTML = $('<div class="point-porc" data-url="'+ point.url +'" style="left:'+ point.porcentaje +'%"><i class="big"><span>'+ point.porcentaje +'</span></i><i class="globe"></i></div>');
          template.append($pointHTML);
      });

      if(JSrpp.fuente == 'ONPE'){
        template.clone().prependTo(".menu");
        template.clone().prependTo("#mapa");
      }

      //marcar ultimo
      $('#mapa .line-status .point-porc:first').addClass('active');
      $('.menu .line-status .point-porc:first').addClass('active');

      $(".menu, #mapa").on("click touchstart", ".point-porc", function(){
        var punto = $(this);
        $(".point-porc").removeClass('active');
        punto.addClass('active');
        //quitar active y marcar active

        var request = $.ajax({
          url:  $(this).data('url'),
          method: "GET",
          dataType: "json"
        });

        request.done(function( data ) {
          obj_votos = data['data'][JSrpp.fuente]['dpt'];
          JSrpp.actualizar_info_candidato(obj_votos[JSrpp.departamento]);
          if(JSrpp.candidato==null){
            pintar_mapa_general();
          }else{
            pintar_mapa_candidato(JSrpp.candidato);
          }

        });
      });
  },50);

}

JSrpp.render = function(){

   $('#mapa-peru').html('').vectorMap({
      map: 'peru',
      zoom: 12,
      backgroundColor: null,
      borderColor: '#999',
      borderOpacity: 1,
      borderWidth: 1,
      color: '#ffffff',
      selectedColor: null,
      enableZoom: false,
      showTooltip: true,
      hoverColor: null,
      hoverBorderColor: '#666',
      hoverBorderWidth: 2,
      hoverOpacity: null,
      /*values: sample_data,*/
      normalizeFunction: 'linear',
      onLabelShow : function(event, label, code) {
        var votos_region_candidatos = obj_votos[code]['candidatos'];
        var candidatos_ranking = obtener_rankeados_region(code, 3);
        region_focused_name = label.html();
        var div =
          '<div class="cua_flotjp1">'+

            '<div class="dis_rela">'+
            '<div class="flecha_jp1"></div>'+
                  '<div class="center_cua_flotjp">'+
                      '<h3>'+region_focused_name+'</h3>'+
                      '<div class="cont_partijp1">';

        for(var id in candidatos_ranking){
          var candidato_info = obtener_candidato_por_id(candidatos_ranking[id]);
          var candidato_votos = votos_region_candidatos[candidatos_ranking[id]];
          var porcentaje_ganador = candidato_votos['porcentaje'];

          div +=  '<div class="fila_parti '+candidato_info['color']+'">'+ candidato_info['partidocorto'] +
                  '<span>'+ porcentaje_ganador +'%</span></div>';
          //actualizar info candidatos si es movil
          if(window.screen.availWidth <= 768){
            var article = $('article'+'.'+id);
            article.find("span").css( "width", porcentaje_ganador );
            article.find(".cifra").text(porcentaje_ganador);
            article.find(".votos").text(candidato_votos['votos']);
          }
        }
        div += '</div>'+
            '</div>'+
          '</div>'+
          '</div>';

        $(div).find('.ui-close').on('click', function(){
          alert("cerro");
        });
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
        JSrpp.departamento = code;
      },
      onRegionSelect: function(event, code, region){
        if(window.screen.availWidth <= 768){ return false };
        window.location.href = local_path +'/'+ JSrpp.fuente.toLowerCase() +'/'+ code;
        //$("#departamentos-lista").val(code);
        //var votos_region = obj_votos[code];
        //act. candidatos
        //JSrpp.actualizar_info_candidato(votos_region);
      }

    });

    pintar_mapa_general();
    dibujar_candidatos();
};

JSrpp.actualizar_info_candidato = function(votos_region){
  for(id in votos_region['candidatos']){
    var obj = votos_region['candidatos'][id];
    var porcentaje_ganador = obj['porcentaje'];
    var article = $('article'+'.'+id);
    article.find("span").css( "width", porcentaje_ganador );
    article.find(".cifra").text(porcentaje_ganador);
    article.find(".cifra").data('cifra', obj['porcentaje']);
    article.find(".votos").text(numberWithSpaces(obj['votos']));
  }
  ordenar_candidatos();

  //act. blanco nulos impug
  var blanco = $('.escrutado .item.blanco');
  blanco.find("span").css( "width", votos_region['blanco']['porcentaje']);
  blanco.find(".cifra").text(votos_region['blanco']['porcentaje']);
  blanco.find(".votos").text(numberWithSpaces(votos_region['blanco']['votos']));
  blanco.find(".votos").data('votos', votos_region['blanco']['porcentaje']);
  var nulos = $('.escrutado .item.nulos');
  nulos.find("span").css( "width", votos_region['nulos']['porcentaje']);
  nulos.find(".cifra").text(votos_region['nulos']['porcentaje']);
  nulos.find(".votos").text(numberWithSpaces(votos_region['nulos']['votos']));
  nulos.find(".votos").data('votos', votos_region['nulos']['porcentaje']);
  var impugnados = $('.escrutado .item.impugnados');
  impugnados.find("span").css( "width", votos_region['impugnados']['porcentaje']);
  impugnados.find(".cifra").text(votos_region['impugnados']['porcentaje']);
  impugnados.find(".votos").text(numberWithSpaces(votos_region['impugnados']['votos']));
  impugnados.find(".votos").data('votos', votos_region['impugnados']['porcentaje']);

  //total escrutadas
  $("#mesas-escrutadas").text(votos_region['escrutadas']['porcentaje']);

};


function init(){
    //a[60-100] m[35-59] b[0-34]
    var region_focused_name = null;

    $.each(obj_encuestadoras, function(key, value) {
     $('#fuentes-lista')
         .append($("<option></option>")
         .attr("value", key)
         .text(key));
    });
    $('#fuentes-lista').val(JSrpp.fuente);

    $.each(departamentos, function(key, value) { /*%8%*/
     $('#departamentos-lista')
         .append($("<option></option>")
         .attr("value", value.slug)
         .text(value.nombre));
    });
    $('#departamentos-lista').val(JSrpp.departamento);

    $('#fuentes-lista').on('change', function(e){
        var fuente = $(this).val();
        window.location.href = local_path +'/'+ fuente.toLowerCase() +'/'+ JSrpp.departamento;
    });

    $('#departamentos-lista').on('change', function(e){
        var departamento = $(this).val();
        window.location.href = local_path +'/'+ JSrpp.fuente.toLowerCase() +'/'+ departamento;
        //JSrpp.departamento = departamento;
        //var votos_region = obj_votos[departamento];
        //act. candidatos
        //JSrpp.actualizar_info_candidato(votos_region);
    });

    $( ".menu-lista" ).on( "click", ".candidato", function() {
      var candidato = $(this);
      var id = candidato.data('candidato');
      var arr = {};

      if(candidato.hasClass('active')){
        pintar_mapa_general();
        candidato.removeClass('active');
        $("#menu-lista .candidato").removeClass("off");
        JSrpp.candidato = null;
      }else{
        pintar_mapa_candidato(id);
        $("#menu-lista .candidato").removeClass("active");
        candidato.addClass('active');
        JSrpp.candidato = id;
        focus_candidato(id);
      }
    });
    JSrpp.render();
    JSrpp.renderHistoryLine();
  };



var color = {
    'orange': {a:'#fc6e4c', m:'#fc8a63', b:'#ffc5ab'}, //fp
    'yellow': {a:'#e2b844', m:'#eac359', b:'#f9de87'}, //ppk
    'red': {a:'#e23d3d', m:'#e56363', b:'#ffa4a4'}, //accion p
    'blue': {a:'#0c5384', m:'#3477ad', b:'#98bed3'}, //alianza p
    'brown': {a:'#7c4d29', m:'#8e6642', b:'#bf9475'}, //frente a
    'green': {a:'#1d6d1d', m:'#539953', b:'#99b599'}, //pp
    'lightblue': {a:'#2497aa', m:'#5ab1ba', b:'#a2e3ed'}, //ppo
    'purple': {a:'#75357c', m:'#8c6091', b:'#caaecc'}, //fe
    'mustard': {a:'#775c1b', m:'#9e8641', b:'#c1b078'}, //dd
    'pink': {a:'#c15959', m:'#c17070', b:'#c9a3a3'}, //app
    'turquoise': {a:'#45a376', m:'#70c498', b:'#afddc3'} //pperu
};

function pintar_mapa_general(){
  var arr = {};

  for(var v in obj_votos){
    var obj = obj_votos[v]['candidatos'];
    var candidato_ganador = Object.keys(obj).reduce(function(a, b){ return parseFloat(obj[a]['porcentaje'],10) > parseFloat(obj[b]['porcentaje'],10) ? a : b });
    var porcentaje_ganador = obj[candidato_ganador]['porcentaje'];
    var color_class = obtener_candidato_por_id(candidato_ganador)['color'];
    var color = obtener_color(color_class, porcentaje_ganador);
    arr[v] = color;
  }
  $('#mapa-peru').vectorMap('set', 'colors', arr);
};

function pintar_mapa_candidato(id){
  var arr = {};

  for(var v in obj_votos){
    var obj = obj_votos[v];
    var porcentaje_candidato = (obj['candidatos'][id])?obj['candidatos'][id]['porcentaje']:0;
    var color_class = obtener_candidato_por_id(id)['color'];
    var color = obtener_color(color_class, porcentaje_candidato);
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

function obtener_color(color_class, porcentaje){
  if(porcentaje==0){return "#F7F7F7";};
  var key = null;
  if(porcentaje < 35)
    key = 'b';
  else if(porcentaje > 34 && porcentaje < 60)
    key = 'm';
  else
    key = 'a';
  return color[color_class][key];
};

function dibujar_candidatos(){
  $('.menu-lista').html("");
  $('.escrutado').html("");

  for( var c in obj_candidatos ) {
    var cand = obj_candidatos[c];

    var votos_region = obj_votos[JSrpp.departamento];

    if(obtener_candidato_por_id(cand['id']).slug != 'acuna'){

    var article = $('<article >', {'class': 'candidato '+cand['id']+' '+cand['color'], 'data-candidato': cand['id']});
    var div_foto = $('<div>', {'class': 'foto'});
    $('<img>', {'src': cand['foto'], 'alt': cand['id']}).appendTo(div_foto);
    var div_descripcion = $('<div>', {'class': 'descripcion'});
    var div_info_candidato = $('<div>', {'class': 'info-candidato'});
    $('<div>', {'class': 'nombre', 'text': cand['nombre']}).appendTo(div_info_candidato);
    $('<div>', {'class': 'partido', 'text': cand['partido']}).appendTo(div_info_candidato);
    var div_porcentaje = $('<div>', {'class': 'porcentaje'});
    var div_meter = $('<div>', {'class': 'meter nostripes '+ cand['color'] });
    $('<span>', {'style': 'width: 100%' }).appendTo(div_meter);
    div_meter.appendTo(div_porcentaje);

    var pct = (votos_region['candidatos'][cand['id']])?(votos_region['candidatos'][cand['id']]['porcentaje']?votos_region['candidatos'][cand['id']]['porcentaje']:0):0;
    var div_cifra = $('<div>', {'class': 'cifra', 'text': pct,
                                'data-cifra': (votos_region['candidatos'][cand['id']])?votos_region['candidatos'][cand['id']]['porcentaje']:0 });
    div_cifra.appendTo(div_porcentaje);
    var div_votos = $('<div>', {'class': 'votos', 'text': (votos_region['candidatos'][cand['id']])?numberWithSpaces( votos_region['candidatos'][cand['id']]['votos'] ):0 });
    div_info_candidato.appendTo(div_descripcion);

    div_porcentaje.appendTo(div_descripcion);
    div_votos.appendTo(div_descripcion);
    div_foto.appendTo(article);
    div_descripcion.appendTo(article);
    article.appendTo($('.menu-lista'));

    }


  }

  //blancos, nulos e impugnados
  var article_blanco = $('<article>', {'class': 'item blanco'});
  var div_tipo = $('<div>', {'class': 'tipo', 'text': 'Votos en blanco'});
  var div_detalle = $('<div>', {'class': 'detalle'});
  var div_porcentaje = $('<div>', {'class': 'porcentaje'});
  var div_meter = $('<div>', {'class': 'meter nostripes red' });
  $('<span>', {'style': 'width: 100%' }).appendTo(div_meter);
  div_meter.appendTo(div_porcentaje);
  var div_cifra = $('<div>', {'class': 'cifra', 'text': votos_region['blanco']['porcentaje']?votos_region['blanco']['porcentaje']:0 });
  div_cifra.appendTo(div_porcentaje);
  var div_votos = $('<div>', {'class': 'votos', 'text': numberWithSpaces(votos_region['blanco']['votos']) });
  div_porcentaje.appendTo(div_detalle);
  div_votos.appendTo(div_detalle);
  div_tipo.appendTo(article_blanco);
  div_detalle.appendTo(article_blanco);
  article_blanco.appendTo($('.escrutado'));

  var article_nulo = $('<article>', {'class': 'item nulos'});
  var div_tipo = $('<div>', {'class': 'tipo', 'text': 'Votos nulos'});
  var div_detalle = $('<div>', {'class': 'detalle'});
  var div_porcentaje = $('<div>', {'class': 'porcentaje'});
  var div_meter = $('<div>', {'class': 'meter nostripes red' });
  $('<span>', {'style': 'width: 100%' }).appendTo(div_meter);
  div_meter.appendTo(div_porcentaje);
  var div_cifra = $('<div>', {'class': 'cifra', 'text': votos_region['nulos']['porcentaje']?votos_region['nulos']['porcentaje']:0 });
  div_cifra.appendTo(div_porcentaje);
  var div_votos = $('<div>', {'class': 'votos', 'text': numberWithSpaces(votos_region['nulos']['votos']) });
  div_porcentaje.appendTo(div_detalle);
  div_votos.appendTo(div_detalle);
  div_tipo.appendTo(article_nulo);
  div_detalle.appendTo(article_nulo);
  article_nulo.appendTo($('.escrutado'));

  var article_impugnado = $('<article>', {'class': 'item impugnados hide-impugnados'});
  var div_tipo = $('<div>', {'class': 'tipo', 'text': 'Votos impugnados'});
  var div_detalle = $('<div>', {'class': 'detalle'});
  var div_porcentaje = $('<div>', {'class': 'porcentaje'});
  var div_meter = $('<div>', {'class': 'meter nostripes red' });
  $('<span>', {'style': 'width: 100%' }).appendTo(div_meter);
  div_meter.appendTo(div_porcentaje);
  var div_cifra = $('<div>', {'class': 'cifra', 'text': votos_region['impugnados']['porcentaje']?votos_region['impugnados']['porcentaje']:0 });
  div_cifra.appendTo(div_porcentaje);
  var div_votos = $('<div>', {'class': 'votos', 'text': numberWithSpaces(votos_region['impugnados']['votos']) });
  div_porcentaje.appendTo(div_detalle);
  div_votos.appendTo(div_detalle);
  div_tipo.appendTo(article_impugnado);
  div_detalle.appendTo(article_impugnado);
  article_impugnado.appendTo($('.escrutado'));

  //total escrutadas
  $("#mesas-escrutadas").text(votos_region['escrutadas']['porcentaje']);

  ordenar_candidatos();
};

function numberWithSpaces(x) {
  if(x>0){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }else{
    return 0;
  }
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
  return (parseFloat($(b).find(".cifra").data("cifra"), 10)) > (parseFloat($(a).find(".cifra").data("cifra"), 10)) ? 1 : -1;
};

function focus_candidato(id){
  $("#menu-lista .candidato").removeClass("off");
  $("#menu-lista .candidato").not("."+id).addClass("off");
};

function obtener_candidato_por_id(id){
  var result = null;
  for(var oc in obj_candidatos){
    if(obj_candidatos[oc].id == id){
      result = obj_candidatos[oc];
    }
  }
  return result;
};

function obtener_rankeados_region(region_id, cantidad){
  var votos_region = obj_votos[region_id]['candidatos'];
  var ordenar = {};
  for(var c in votos_region){
    ordenar[c] = votos_region[c]['porcentaje'];
  }
  //act. candidatos
  var minorSorted = Object.keys(ordenar).sort(function(a,b){return parseFloat(ordenar[a],10)-parseFloat(ordenar[b],10)});
  var reverse = minorSorted.reverse();
  return reverse.slice(0, cantidad);
};



$(function(){
  var total_url = window.location.pathname.split('/');
  //debe leer los slash y obtener los 2 ultimos, el ultimo indica departamento (cod 3 letras y el penultimo la fuente...)
  var valid_url = true;
  var par_dep = total_url[total_url.length - 1].toLowerCase();
  var par_fuente = total_url[total_url.length - 2 ].toLowerCase();

  //validar departamento existente
  var dep_keys = $.map(departamentos, function(e){ return e.slug });
  if(dep_keys.indexOf(par_dep) == -1){
    JSrpp.departamento = 'general';
    valid_url = false;
  }else{
    JSrpp.departamento = par_dep;
  }

  var request = $.ajax({
    url: url_host+"elecciones/resultados.json",
    method: "GET",
    dataType: "json"
  });

  request.done(function( data ) {
    obj_candidatos = data['candidatos'];
    obj_encuestadoras = data['encuestadoras'];

    //si no existen encuestadoras redirect al home
    if(obj_encuestadoras.length == 0){
      console.log('DIBUJAME!!!');
      return;
    }

    //validar fuente existente
    var fuente_valida = false;
    for(var i in obj_encuestadoras){
      if(i.toLowerCase() == par_fuente){
        JSrpp.fuente = i;
        fuente_valida = true;
        break;
      }
    }

    if(!fuente_valida){
      if('ONPE' in obj_encuestadoras){
        JSrpp.fuente = 'ONPE';
      }else{
        JSrpp.fuente = Object.keys(obj_encuestadoras)[0];
      }
      valid_url = false;
    }

    //verificar si cargan datos o redirect
    //if(!valid_url){
    //  window.location.href = local_path +'/'+ JSrpp.fuente.toLowerCase() +'/'+ JSrpp.departamento.toLowerCase();
    //}

    obj_porcentajes = data['encuestadoras'][JSrpp.fuente]['porcentajes'];
    obj_votos = data['data'][JSrpp.fuente]['dpt'];
    init();
  });

  request.fail(function( jqXHR, textStatus ) {
    alert( "Request failed: " + textStatus );
  });
});
