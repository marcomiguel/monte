<?php
namespace Rpp\Pages;
class Home extends \Rpp\Pages\Page
{
    public $titulo;
    public $portada;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public function __construct()
    {
      parent::__construct();
      $this->titulo= @\Rpp\Services\Get\Destacados::metadata('home')->titulo /*'Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS'*/;
      $this->portada = 'home' ;
      $this->cabecera = 'home' ;
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'portada.home';
      $this->description = @\Rpp\Services\Get\Destacados::metadata('home')->descripcion  /*'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru'*/;
      $this->keywords = implode(",", @\Rpp\Services\Get\Destacados::metadata('home')->tags);
      $this->titulo_social = @\Rpp\Services\Get\Destacados::metadata('home')->titulo /*'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru'*/;
      $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3", "Auspiciado1","Auspiciado2","Auspiciado3","Intersticial" , "Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9", "Interna10"';
      $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
      $this->url_social = 'http://rpp.pe';
      $this->js_app = 'slide|home';
      $this->fecha_hp = date("YmdHi");
      
      if($fecha >= 201603192030 && $fecha < 201603192130) $this->hora_planeta = 'body-hp';
    }

}