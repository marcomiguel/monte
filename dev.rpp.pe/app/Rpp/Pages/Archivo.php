<?php
namespace Rpp\Pages;
class Archivo extends \Rpp\Pages\Page
{
	public $intervalo;
    public $mode;
    public $fecha;
    public $slug;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public function __construct()
    {
     parent::__construct();
     $this->titulo='Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
     \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'archivo';
     $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
      $this->titulo_social = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->epl_sec = 'Home';
     $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
     $this->url_social = '';
    }
    
    public function seccion($slug,$fecha)
    {
      $checkdate = explode('-',$fecha);
      if(checkdate(@$checkdate[1],@$checkdate[2],@$checkdate[0])) $this->fecha = $fecha;
      else $this->fecha = date('Y-m-d');
      $this->mode='seccion';
      $this->slug = $slug;
      $this->comscore = $slug.'.archivo.'.$fecha;
      $this->time = strtotime($fecha);
    }

    public function home($fecha)
    {
      $checkdate = explode('-',$fecha);
      if(checkdate(@$checkdate[1],@$checkdate[2],@$checkdate[0])) $this->fecha = $fecha;
      else $this->fecha = date('Y-m-d');
      $this->mode='home';
      $this->comscore = 'home.archivo.'.$fecha;
      $this->time = strtotime($fecha);
    }

    public function ultimas($intervalo)
    {
      $this->intervalo = $intervalo;
      $this->mode = 'ultimas';
      $this->comscore = 'ultimas.archivo.'.$intervalo;
    }

    public function load_comscore($slug)
    {
       $this->comscore = explode('-',$slug);
       array_walk($this->comscore , function(&$value) { $value = ucwords($value); }); 
       $this->comscore = implode('_', $this->comscore).'_Archivo';
    }
}