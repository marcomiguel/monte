<?php
namespace Rpp\Pages\Preview;
class Nota extends \Rpp\Pages\Page
{
    public $titulo;
    public $epl;
    public $comscore;
    public $sugeridas;
    public $tipo;
    public $description;
    public $keywords;
    public function __construct()
    {
      parent::__construct();
     \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'interna.preview';
      $this->sugeridas = array();
      $this->epl = 'Portada';
      $this->comscore = 'Nota_Preview' ;
      $this->description = 'F&uacute;tbol Peruano, F&uacute;tbol Internacional, WWE, UFC, Videojuegos, Estad&iacute;sticas, Rusia 2018, Copa Am&eacute;rica, Descentralizado, Noticias Deportes, Videos, Fotos, Facebook, Twitter, la diez, la10.pe, ladiez.pe, la diez.pe, www.la10.pe. www.ladiez.pe, la 10.pe';
      $this->keywords = 'F&uacute;tbol Peruano, F&uacute;tbol Internacional, WWE, UFC, Videojuegos, Estad&iacute;sticas, Rusia 2018, Copa Am&eacute;rica, Descentralizado, Noticias Deportes, Videos, Fotos, Facebook, Twitter, la diez, la10.pe, ladiez.pe, la diez.pe, www.la10.pe. www.ladiez.pe, la 10.pe';
      $this->titulo_social = 'Noticias y Resultados del Futbol, WWE, UFC y todos los deportes en el Per&uacute; y el Mundo en La10.pe';
      $this->img_social = '{{host}}/img/imglogo.jpg';
      $this->url_social = '';
      $this->js_app = 'slide|fotogaleria';
    }
}