<?php
namespace Rpp\Pages\Preview;
class Home extends \Rpp\Pages\Page
{
	public $titulo;
	public $package;
	public $epl;
    public $comscore;
    public $description;
    public $keywords;
	public function __construct()
	{
	  parent::__construct();
	  $this->titulo='Resultados en Vivo y todas las Noticias del Fútbol y el Deporte | La 10.pe';
	  $this->portada = 'home' ; 
	  $this->package = 'preview';
	  \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'portada.home.preview';
	  $this->epl = '404';
      $this->comscore = 'portada.preview.paginaprincipal';
      $this->description = 'F&uacute;tbol Peruano, F&uacute;tbol Internacional, WWE, UFC, Videojuegos, Estad&iacute;sticas, Rusia 2018, Copa Am&eacute;rica, Descentralizado, Noticias Deportes, Videos, Fotos, Facebook, Twitter, la diez, la10.pe, ladiez.pe, la diez.pe, www.la10.pe. www.ladiez.pe, la 10.pe';
      $this->keywords = 'F&uacute;tbol Peruano, F&uacute;tbol Internacional, WWE, UFC, Videojuegos, Estad&iacute;sticas, Rusia 2018, Copa Am&eacute;rica, Descentralizado, Noticias Deportes, Videos, Fotos, Facebook, Twitter, la diez, la10.pe, ladiez.pe, la diez.pe, www.la10.pe. www.ladiez.pe, la 10.pe';
      $this->titulo_social = 'Noticias y Resultados del Futbol, WWE, UFC y todos los deportes en el Per&uacute; y el Mundo en La10.pe';
      $this->img_social = '{{host}}/img/imglogo.jpg';
      $this->url_social = '';
	}

	public function load_destacado($slug,$obj)
	{
        \Rpp\Services\Get\Destacados::set_portada($slug,$obj);
	}
}
?>