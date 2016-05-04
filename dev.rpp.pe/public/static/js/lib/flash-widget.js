/* marco M 4 Lafer */

$(function(){

	// var stage_file = 'http://dev-rpp-media.s3-us-west-2.amazonaws.com/'; // only local
	var url_path = stage_file;
	var url_especial = '/resultadoselectorales/presidenciales';

	var json = url_path + 'elecciones/flash_electoral.json';

	$('#widget-flash').prepend("<div class='loader_widget'></div><div class='wf-top'><h1 class='wf-title'></h1><nav class='wf-menu'><ul></ul></nav></div><div class='results'></div>");

	$.getJSON(json, function( data ) {

		var data = data;
		$('.loader_widget').hide();

		// construir tabs
		var items_menu = [];
		for (var i = 0; i < data.encuestadoras.length; i++) {
			items_menu.push("<li id='item-menu-" + data.encuestadoras[i].nombre + "' class='item-menu'><a href='#' data-item='"+i+"'>" + data.encuestadoras[i].nombre + "</a></li>");
		};
		items_menu.push("<li class='special'><a href='" + url_especial + "'>Más resultados</a></li>");
		$('<ul/>', {
			'class': 'my-new-list',
		    html: items_menu.join('')
		}).appendTo('.wf-menu');
		// setear tabs
		$('.wf-menu ul li.item-menu a').on('click', function(e){
			e.preventDefault();
			$('.wf-menu ul li').removeClass('this');
			var idx = $(this).data('item');
			var idx_1 = idx + 1;
			$('.wf-menu ul li:nth-child('+idx_1+')').addClass('this');
			// candidatos
			$( ".results" ).empty();
			setearCandidatos(idx);
			// mesas
			setearMesas(idx);
		});

		// candidatos
		var setearCandidatos = function(idx){
			var items_candidatos = [];
			for (var i = 0; i < data.encuestadoras[idx].candidatos.length; i++) {
				$('.wf-title').html(data.encuestadoras[idx].texto_inf);
				var clase_sv = data.encuestadoras[idx].candidatos[i].segunda ? 'segunda' : 'no-segunda';
				var clase_candidato = data.encuestadoras[idx].candidatos[i].slug.toLowerCase();
				var clase_color = data.encuestadoras[idx].candidatos[i].color.toLowerCase();
				items_candidatos.push("<div class='candidato " + clase_sv + " "+ clase_candidato+ " " + clase_color + "' id='item-candidato-" + data.encuestadoras[idx].nombre.toLowerCase() + "-" + data.encuestadoras[idx].candidatos[i].slug.toLowerCase() + "'><div class='img-c img-c-" + data.encuestadoras[idx].candidatos[i].slug.toLowerCase() + "'>" + "</div><div class='datos-c'><span class='nombre-c'>" + data.encuestadoras[idx].candidatos[i].nombre_corto + "</span><span class='partido-c'> " + data.encuestadoras[idx].candidatos[i].partido_corto + "</span></div><div class='porcentaje-c'><span class='numero' data-count='"+data.encuestadoras[idx].candidatos[i].porcentaje+"'>"+ data.encuestadoras[idx].candidatos[i].porcentaje + "</span><span>%</span>" +"<div class='barra-total'>"+ "<div class='barra-c' data-width='" + data.encuestadoras[idx].candidatos[i].porcentaje + "'></div>"+"</div>" +"</div></div>");
			};
			$('<div/>', {
				'id': 'resultados-'+ data.encuestadoras[idx].nombre.toLowerCase(),
				'class': 'resultados-encuestadora',
			    html: items_candidatos.join('')
			}).appendTo('.results');

			var _widthR = 0;

			$('.candidato').each(function(){
				_widthR = _widthR + $(this).outerWidth();
			});

			var _widthT = _widthR + 192;

			$('.resultados-encuestadora').width(_widthT);

			$('.barra-c').each(function() {
			 	var _width = $(this).data('width') + '%'
			 	$(this).animate({width: _width}, 1500);
			});

			//EFFECT COUNT
			// porcentAnimate(_obj, 0, endInteger, 1500, _decimal);
			function porcentAnimate(id, start, end, duration, decimal) {
			    var obj = id;
			    var range = end - start;
			    var minTimer = 50;
			    var stepTime = Math.abs(Math.floor(duration / range));
			    stepTime = Math.max(stepTime, minTimer);
			    var startTime = new Date().getTime();
			    var endTime = startTime + duration;
			    var timer;
			    function run() {
			        var now = new Date().getTime();
			        var remaining = Math.max((endTime - now) / duration, 0);
			        var value = Math.round(end - (remaining * range));
			        obj.innerHTML = value;
			        if (value == end) {
			            if(decimal){ 
			            	// obj.innerHTML = Number(value) + (Number(decimal)).toFixed(2);
			            	obj.innerHTML = (parseFloat(value)+parseFloat(decimal)).toFixed(2);
			            }
			            clearInterval(timer);
			        }
			    }
			    var timer = setInterval(run, stepTime);
			    run();
			};

			var query = '.numero';
			var attr = 'data-count';
			var obj = document.querySelectorAll(query);
			for (var i = 0; i < obj.length; i++) {
			    var _obj = obj[i];
			    var end = _obj.getAttribute(attr);
			    var endInteger = parseInt(end, 10);
			    var decimal = (end % 1).toFixed(2);
			    var _decimal = (decimal && decimal != 0.00)?decimal:false;
			    porcentAnimate(_obj, 0, endInteger, 1500, _decimal);
			}
		};

		var validar_onpe = 'ONPE';

		// mesas
		var setearMesas = function(idx){
			$("#widget-flash .mesas").remove();
			// if(data.encuestadoras[idx].votos!=0) $('#widget-flash').append("<div class='mesas'><p>Mesas escrutadas: <span id='wf-mesas'>- </span><span>% (</span><span id='wf-votos'>-</span><span> votos)</span></p></div>");
			// console.log(data.encuestadoras[idx], 'oooooo');
			if(data.encuestadoras[idx].nombre.toLowerCase() == validar_onpe.toLowerCase()){
				if(parseFloat(data.encuestadoras[idx].mesas_escrutadas)>0) {
					$('#widget-flash').append("<div class='mesas'><p>Al <span id='wf-mesas'>- </span><span>% </span></p></div>");
					$('#wf-mesas').text(data.encuestadoras[idx].mesas_escrutadas);
					if(data.encuestadoras[idx].votos>0){
						$('.mesas p').append("(<span id='wf-votos'>-</span><span> votos)</span>");
						$('#wf-votos').text(data.encuestadoras[idx].votos);
					}
				}
			}
		};

		// setear el primer tab
		$('.wf-menu ul li:first-child').addClass('this');
		setearCandidatos(0);
		setearMesas(0);

	});

});
