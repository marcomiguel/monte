var obj_candidatosjp = [];
var obj_votosjp = {};
var obj_encuestadorasjp = {};
var obj_menujp_bl ={};
var mob = $(window).width() < 665 ? true: false;
var colorjps = {
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


$(document).ready(function() { 
  $(".fondoblajp").click(function(){
    $(".fondoblajp, .popparpolijp").fadeOut(400); 
  })
  $(".menuprinjp a").click(function(){ alert('d');
    $(".menuprinjp a").removeClass("activemjp");
    $(this).addClass("activemjp");
  })
  /*$( ".cerrpopparpolijp" ).on("click", "div", function() {
 $(".fondoblajp, .popparpolijp").fadeOut(400);  
});*/
  var requestjp = $.ajax({
    url: stage_file+"elecciones/resultados-congreso.json",
    method: "GET",
    dataType: "json"
    });
  requestjp.done(function( data ) {
    obj_candidatosjp = data['candidatos'];
    obj_encuestadorasjp = data['obj_encuestadoras'];
    //obj_votosjp = data['data']['ONPE'];
    obj_menujp_bl =data['data'];
    //console.log(obj_candidatosjp);
    //console.log(obj_votosjp['dpt']['general']['candidatos']);
    var menujch="";count=0;actmenujs='';var datapriejch='';
      $.each(obj_menujp_bl, function(key, value){ 
        if(count==0){ actmenujs='class="activemjp"'; datapriejch=key; }else{ actmenujs=''; } count=count+1;
      menujch+='<a href="javascript:;" onclick="initjps2('+ "'" +key+ "'"+');" '+actmenujs+'>'+key+'</a>';
      $(".menuprinjp nav").html(menujch);
       });
      obj_votosjp = data['data'][datapriejch];

    initjps();
    });
  
  
  
});

function initjps(){
  var lista_partid='';
  for(var c in obj_candidatosjp){
    if(obj_votosjp['dpt']['general']['partidos'][obj_candidatosjp[c]['_id']]['total'] > 1){
      lista_partid+='<div class="fila_partihj '+ obj_candidatosjp[c]['color'] +'">'+ obj_candidatosjp[c]['partido'] +'</div>';
    }
  }
  $("#leyendjp").html(lista_partid);

  generar_por_bancada_congreso();
  generar_partido_politico_congreso();
  generar_por_region_congreso();  
  generar_texto_superior();
}

function initjps2(sucursa){
  

  /*var requestjp = $.ajax({
    url: stage_file+"elecciones/resultados-congreso.json",
    method: "GET",
    dataType: "json"
    });
  requestjp.done(function( data ) {*/
  //  obj_candidatosjp = data['candidatos'];
  //  obj_encuestadorasjp = data['obj_encuestadoras'];
    obj_votosjp = obj_menujp_bl[sucursa];

    var menujch="";count=0;actmenujs='';
      $.each(obj_menujp_bl, function(key, value){ 
        if(sucursa==key){ actmenujs='class="activemjp"'; }else{ actmenujs=''; } count=count+1;
      menujch+='<a href="javascript:;" onclick="initjps2('+ "'" +key+ "'"+');" '+actmenujs+'>'+key+'</a>';
      $(".menuprinjp nav").html(menujch);
       });

      var lista_partid='';
    for(var c in obj_candidatosjp){
      if(obj_votosjp['dpt']['general']['partidos'][obj_candidatosjp[c]['_id']]['total'] > 1){
        lista_partid+='<div class="fila_partihj '+ obj_candidatosjp[c]['color'] +'">'+ obj_candidatosjp[c]['partido'] +'</div>';
      }
    }
    $("#leyendjp").html(lista_partid);
      
    generar_por_bancada_congreso();
    generar_partido_politico_congreso();
    generar_por_region_congreso();  
    generar_texto_superior();
  /*  });*/
  

}

function generar_texto_superior(){



  if(obj_votosjp['dpt']['general']['escrutadas']['porcentaje']==0 || obj_votosjp.fuente.nombre != 'ONPE'){

    $(".florrcabejp").hide();
  }else{
    $(".florrcabejp").show(); 
  }

  $(".florrcabejp_a").text(obj_votosjp['dpt']['general']['escrutadas']['porcentaje']);

}

function generar_por_region_congreso(){ //bloque 1
   var showed = false;
  if (typeof jQuery.fn.vectorMap == 'function') {

    // valida si existen parlamentarios
  for(var ct in obj_votosjp['dpt']){
    for(var c in obj_candidatosjp){

        if(obj_votosjp['dpt'][ct]['partidos'][obj_candidatosjp[c]['_id']].parlamentarios.length>0) showed = true;
    }
  }
// fin valida


/*
  for(var ct in obj_votosjp['dpt']){
    for(var c in obj_candidatosjp){
        if(obj_votosjp['dpt'][ct]['partidos'][obj_candidatosjp[c]['_id']]['total']>0) showed = true;
    }
  }*/


setTimeout(function(){
  $('#mapa-peru').html('').vectorMap({
      map: 'peru',
      zoom: 12,
      backgroundColor: null,
      borderColor: '#999',
      borderOpacity: 0.8,
      borderWidth: 1,
      color: '#DB9898',
      selectedColor: null,
      enableZoom: false,
      showTooltip: true,
      hoverColor: '#B63030',
      hoverBorderColor: '#666',
      hoverBorderWidth: 2,
      hoverOpacity: null,
      /*values: sample_data,*/
      normalizeFunction: 'linear',
     onLabelShow : function(event, label, code) { 
        var votos_dpt = obj_votosjp['dpt'][code];
        //var votos_region_candidatos = votos_dpt[code]['candidatos'];
        //var candidatos_ranking = obtener_rankeados_region(code, 3);
    var lista_partid='';
        region_focused_name = label.html();

      for(var c in obj_candidatosjp){
        if(votos_dpt['partidos'][obj_candidatosjp[c]['_id']]['total']>0){
        lista_partid+='<div class="fila_parti '+ obj_candidatosjp[c]['color'] +'">'+ obj_candidatosjp[c]['partido'] +'      <span>'+votos_dpt['partidos'][obj_candidatosjp[c]['_id']]['total']+'</span></div>';
      }
    }


    //<div class="flecha_jp1"></div>

    var div ='<div style="visibility:'+ (votos_dpt.curules == 0 ?'hidden':'visible') +'" class="cua_flotjp1">'+
          '<div class="dis_rela">'+
            '<div class="center_cua_flotjp2">'+
              '<div class="center_cua_flotjp">'+
                    '<h3>'+region_focused_name+'</h3>'+
              '<div class="cont_partijp1">'+
                lista_partid+
              '</div>'+
            '</div></div>'+
          '</div>'+
        '</div>';
        label.html(div);

      }
    });

},10);

    if(!showed) $('.parte3jp').hide()
    else $('.parte3jp').show()
  }
}



function generar_partido_politico_congreso(){ //bloque 2
  var mival='';cant_parjch=0, showed = 0;
  //cant_parjch




  for(var c in obj_candidatosjp){

    //cant_parjch= total_partidopolitico(obj_candidatosjp[c]['_id']);
    cant_parjch= obj_votosjp['dpt']['general']['partidos'][obj_candidatosjp[c]['_id']]['total'];



    mival += '<div onclick="popup_partidopolitico('+ obj_candidatosjp[c]['_id'] +')" class="cuadro_partjp cant_parjch'+cant_parjch+ ' '+ obj_candidatosjp[c]['color'] +'">' + 
                  '<h3 class="titujp2" >'+ obj_candidatosjp[c]['partido'] +'</h3>'+
                    '<span class="titujp3">Parlamentarios <div class="floatrijp" >'+ cant_parjch +' <div class="triangulo_infjp"></div></div> </span>' +
                '</div>';

    if(total_partidopolitico(obj_candidatosjp[c]['_id']) > 0) showed = true;
  }

  
  $(".cont_part2jp").html(mival);
  if(!showed) $('.parte2jp').hide();
  else $('.parte2jp').show()
}

function generar_por_bancada_congreso(){ //bloque 3
  if (typeof jQuery.fn.highcharts == 'function') {
  var colorrgbjps=flujocoloresjps();

  $('#containerjp').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
    /*colors: colorrgb,*/
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 40
        },
        tooltip: {
            //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    useHTML: true,
                    padding: 0,
                    headerFormat: '',
                    pointFormat: '<div class="tooltip">'+
                    '<div class="nombre-partido" style="color:{point.color}">{point.nomparcon} </div>'+
          /*'<div class="list-partidojp" style="color:{point.color}">{point.list}</div>'+*/
                    '</div>'
                   
        },
        plotOptions: {
            pie: {
                size:(mob ? 280 : 490),
                dataLabels: {
                    enabled: true,
                    distance: (mob ? -30 : -50),
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black',
                        fontSize: (mob ? '12px' : '19px'),
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '100%'],

            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: colorrgbjps
        }]
    });
  }
}

/** generar popup partido plitico */
function popup_partidopolitico(idpart){
  var text='';
  var text2='';


    

  /*  $.each(obj_votosjp['dpt'], function(key, value) { 
        if(key!='general'){

             if(obj_votosjp['dpt'][key]['partidos'][idpart]['total'] >1){
              console.log(key);

             }

        }

    });*/


  $.each(obj_votosjp['dpt'], function(key, value) { 
    if(key!='general'){
      if(obj_votosjp['dpt'][key]['partidos'][idpart]['total'] >= 1){
      
        for(var c in obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios']){
          //if(parseInt(obj_votosjp['dpt'][key]['partidos'][idpart]['total']) > 0){
          //if(obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'] ){
            if (obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle'] &&
            obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle']['datos'] && obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle'] != null) {
              text += '<tr>'+
      '<td>'+obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle']['datos']+'</td>'+
      '<td style="text-align:center" >'+key+'</td>'+
      '<td style="text-align:center">'+obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['porcentaje']+'%</td>'+
      '</tr>';    
            }

          
        }
      }
    }
    });
  
  var $popup = $('<div class="borpopparpolijp" style="border: 1px solid '+obtener_colorjps(obtener_candidato_por_idjps(idpart)["color"],35)+'">'+
  '<div class="cerrpopparpolijp" style="border: 1px solid '+obtener_colorjps(obtener_candidato_por_idjps(idpart)["color"],35)+';color:'+obtener_colorjps(obtener_candidato_por_idjps(idpart)["color"],35)+'"><div>X</div></div>'+
  '<div class="cont_scrolljch" ><table width="100%" border="0" cellspacing="0" class="tablepopparpolijp" cellpadding="0">'+
      '<thead><tr>'+
    '<td style="width:60%">PARLAMENTARIO</td>'+
    '<td style="width:20%;text-align:center">REGIÓN</td>'+
    '<td style="width:20%;text-align:center">PORCENTAJE</td>'+
    '</tr></thead>'+
    text+
  '</table></div>'+
    '</div>');
    
    $popup.find('.cerrpopparpolijp').on('click', function(e){
      
      
      $(".fondoblajp, .popparpolijp").fadeOut("normal", function(){
        $popup.remove();
        });
      
      });
  
  
  $(".popparpolijp").html($popup);
    
  $(".fondoblajp, .popparpolijp").fadeIn(400);    
}
/** fin generar popup partido plitico */  
function total_partidopolitico(idpart){
  text=0;
  var text2='';


  $.each(obj_votosjp['dpt'], function(key, value) { 

    if(key!='general'){
    
      for(var c in obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios']){
        text = parseInt(obj_votosjp['dpt'][key]['partidos'][idpart]['total']) + text;      
      }
    }
    });


  return text;
}


function popup_porbancada(idpart){
  var text='';
  var text2='';
  $.each(obj_votosjp['dpt'], function(key, value) { 
    if(key!='general'){   /*console.log(idpart);*/
      if(obj_votosjp['dpt'][key]['partidos'][idpart]['total'] >1){
        count=0;
        var texjp='';
        for(var c in obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios']){
          
          //if(obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'] ){
            if (obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle'] &&
            obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle']['datos'] && obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle'] != null) { count=count+1;
              if(count<10){ texjp= '0' + count; }else{ texjp=count; }
              text += texjp +' ' + obj_votosjp['dpt'][key]['partidos'][idpart]['parlamentarios'][c]['detalle']['datos'] + "<br>";      
            }
        }
        
      }
    }
    });
  return text;
}


function obtener_candidato_por_idjps(id){
  var result = null;
  for(var oc in obj_candidatosjp){
    if(obj_candidatosjp[oc].id == id){
      result = obj_candidatosjp[oc];
    break;
    }
  }
  return result;
};

function obtener_colorjps(color_class, porcentaje){
  if(porcentaje==0){return "#F7F7F7";};
  var key = null;
  if(porcentaje < 34)
    key = 'b';
  else if(porcentaje > 34 && porcentaje < 60)
    key = 'm';
  else
    key = 'a';
  return colorjps[color_class][key];
};

function flujocoloresjps(){
  var mival1j=[];
  var mival2={};
  cont=0;
  for(var c in obj_votosjp['dpt']['general']['partidos']){
    if(obj_votosjp['dpt']['general']['partidos'][c]['total'] >0){

    mival1j[cont]={y: obj_votosjp['dpt']['general']['partidos'][c]['total'], name: obj_votosjp['dpt']['general']['partidos'][c]['total'], color: obtener_colorjps(obtener_candidato_por_idjps(c)["color"],35), idparcon:obtener_candidato_por_idjps(c)["_id"], nomparcon:obtener_candidato_por_idjps(c)["partido"], list: popup_porbancada(obtener_candidato_por_idjps(c)["_id"])};
    //name: obtener_candidato_por_idjps(c)["partido"]

    cont=cont+1;
    }  

  }
  //mival2+="'#fff'";
  return mival1j;
  //$(".cont_part2jp").html(mival);
}