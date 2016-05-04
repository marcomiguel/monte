var obj_candidatosjp = [];
var obj_votosjp = {};
var obj_encuestadorasjp = {};
var colorjps = {
    'orange': {a:'#ff6029', m:'#ff7c44', b:'#ff894a'}, //fp
    'yellow': {a:'#e2b013', m:'#e8c02b', b:'#f5cc36'}, //ppk
    'red': {a:'#c90606', m:'#ea2626', b:'#ea2626'}, //accion p
    'blue': {a:'#003f72', m:'#004891', b:'#00569d'}, //alianza p
    'brown': {a:'#683909', m:'#844d11', b:'#965a20'}, //frente a
    'green': {a:'#024c02', m:'#006600', b:'#007600'}, //pp
    'lightblue': {a:'#02748e', m:'#008ab5', b:'#00a0cc'}, //ppo
    'purple': {a:'#6b1972', m:'#86248b', b:'#8f428f'}, //fe
    'mustard': {a:'#6d5103', m:'#937000', b:'#9c7e0b'}, //dd
    'pink': {a:'#e04848', m:'#ee6262', b:'#f07d7d'}, //app
    'turquoise': {a:'#548c61', m:'#56a56c', b:'#7ac48c'} //pperu
};

$(function () {
	var requestjp = $.ajax({
		url: "http://dev-rpp-media.s3-us-west-2.amazonaws.com/elecciones/resultados-congreso.json",
		method: "GET",
		dataType: "json"
	  });
	requestjp.done(function( data ) {
		obj_candidatosjp = data['candidatos'];
		obj_encuestadorasjp = data['obj_encuestadoras'];
		obj_votosjp = data['data']['ONPE'];
		//console.log(obj_candidatosjp);
		//console.log(obj_votosjp['dpt']['general']['candidatos']);
		initjps();
	  });
	
	
});

function initjps(){
	generar_mapa_congreso();
	generar_partido_politico_congreso();
	generar_por_region_congreso();	
}

function generar_mapa_congreso(){ //bloque 1
	$('#mapa-peru').vectorMap({
      map: 'peru',
      zoom: 12,
      backgroundColor: null,
      borderColor: '#fff',
      borderOpacity: 0.8,
      borderWidth: 1,
      color: '#DB9898',
      selectedColor: null,
      enableZoom: false,
      showTooltip: true,
      hoverColor: '#B63030',
      hoverBorderColor: '#fff',
      hoverBorderWidth: 3,
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
			lista_partid+='<div class="fila_parti '+ obj_candidatosjp[c]['color'] +'">'+ obj_candidatosjp[c]['partido'] +'			<span>'+votos_dpt['partidos'][obj_candidatosjp[c]['_id']]['total']+'</span></div>';
		}
		var div ='<div class="cua_flotjp1">'+
					'<div class="dis_rela">'+
						'<div class="flecha_jp1"></div><div class="center_cua_flotjp2">'+
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
}

function generar_partido_politico_congreso(){ //bloque 2
	var mival='';
	for(var c in obj_candidatosjp){
		mival += '<div class="cuadro_partjp '+ obj_candidatosjp[c]['color'] +'">' + 
                	'<h3 class="titujp2" >'+ obj_candidatosjp[c]['partido'] +'</h3>'+
                    '<span class="titujp3">Parlamentarios	<div class="floatrijp" >33 <div class="triangulo_infjp"></div></div>	</span>' +
                '</div>';
	}
	$(".cont_part2jp").html(mival);
}

function generar_por_region_congreso(){ //bloque 3
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
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '50%']
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
		mival1j[cont]={y: obj_votosjp['dpt']['general']['partidos'][c]['total'], name: obj_votosjp['dpt']['general']['partidos'][c]['total'], color: obtener_colorjps(obtener_candidato_por_idjps(c)["color"],35)};
		//name: obtener_candidato_por_idjps(c)["partido"]
		cont=cont+1;	
	}
	//mival2+="'#fff'";
	return mival1j;
	//$(".cont_part2jp").html(mival);
}