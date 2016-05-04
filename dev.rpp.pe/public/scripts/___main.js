$(function(){
  var $nav = $('.nav-rpp');
  var $btn = $('.nav-rpp .clickable');
  var $vlinks = $('.nav-rpp .visible-links');
  var $hlinks = $('.nav-rpp .hidden-links');
  var breaks = [];
  function updateNav() {
    var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;
    if($vlinks.width() > availableSpace) {
      breaks.push($vlinks.width());
      $vlinks.children().last().prependTo($hlinks);
      if($btn.hasClass('hidden')) {
        $btn.removeClass('hidden');
      }
    } else {
      if(availableSpace > breaks[breaks.length-1]) {
        $hlinks.children().first().appendTo($vlinks);
        breaks.pop();
      }
      if(breaks.length < 1) {
        $btn.addClass('hidden');
        $hlinks.addClass('hidden');
      }
    }
  }
  $(window).resize(function() {
    var anchoPantalla = $(window).width();
    if(anchoPantalla > 768){
      updateNav();
    }
  });
  $btn.on('click', function() {
    $hlinks.toggleClass('hidden');
  });
  var anchoPantalla = $(window).width();
  if(anchoPantalla > 768){
      updateNav();
  }
});
