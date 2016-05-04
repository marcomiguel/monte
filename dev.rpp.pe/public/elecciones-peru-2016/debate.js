/* Marco Montenegro */
var URL = {
	base: 'http://dev.rpp.pe',
  votar: {
    like: '/debate/like',
    dislike: '/debate/dislike'
  }
}; 

$(function(){
	// likes en el widget
	$(".x-item.wd-candidato").click(function(){
		var posicion = $(this).position();
		$(".gracias-voto").css("left",posicion.left);
	})
	$('.likes a').click(function(e){
		e.preventDefault();
		var elem = $(this),
				padre = elem.parent(),
				bloque_candidato = elem.parents('.debate-box'),
				candidato_id = bloque_candidato.prop('id');

		if(padre.hasClass( "is-like" )){
			realizar_votacion('like', candidato_id, elem, 'perfil');
		}else{
			realizar_votacion('dislike', candidato_id, elem, 'perfil');
		}
		//console.log($(this).parent().attr('id'), 'hhh');
		//done
		$('.debate-datos').hide();
		$('.debate-gracias').show();
	});

	$('#widget-debate #results .wd-candidato .likes-mini-small').click(function(e){
		e.preventDefault();
		var elem = $(this),
			bloque_candidato = elem.parents('.wd-candidato'),
			candidato_id = bloque_candidato.prop('id')|| null;

		if(elem.hasClass( "is-like-mini" )){
			realizar_votacion('like', candidato_id, elem, 'widget');
		}else{
			realizar_votacion('dislike', candidato_id, elem, 'widget');
		}
	});

	/* CAMBIO: VOTAR DESDE LISTA RESULTADOS - POR SI JOSE DICE QUE SI.
	$('#debate-resultados .likes-mini').click(function(e){
		var elem = $(this);
		if(elem.hasClass( "disabled" )){ return false; }
		var candidato = elem.parents('.debate-candidato');
		var candidato_id = candidato.data('id')|| null;
		var user_id = candidato.data('user')|| null;
		if(elem.hasClass( "is-like-mini" )){
			realizar_votacion('like', candidato_id, user_id, elem);
		}else{
			realizar_votacion('dislike', candidato_id, user_id, elem);
		}
	});*/
});

function realizar_votacion(accion, candidato_id, elem, tipo){
	var url = (accion=='like')?URL.votar.like:URL.votar.dislike;
	var user = user_id;
	$('.gracias-voto').hide();
	$('.gracias-voto').removeClass('hideme');
	
	var request = $.ajax({
			url: url,
			type: 'POST',
			data: {'id': candidato_id, 'user': user},
			dataType: 'json'
	});
	request.done(function(data) {
		elem.addClass('disabled');
		if(tipo=='widget'){
			$('.gracias-voto').show();
			$('.gracias-voto').addClass('hideme');
		}
	});
	request.fail(function( jqXHR, textStatus ) {
	  console.log( "Request failed: " + textStatus );
		if(tipo=='widget'){
			$('.gracias-voto').show();
			$('.gracias-voto').addClass('hideme');
		}
	});
};
